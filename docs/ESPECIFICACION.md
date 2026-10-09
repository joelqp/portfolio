# Especificación funcional y técnica

Versión 0.5 · 9 de octubre de 2026

Este documento desarrolla el comportamiento y la implementación del alcance de [PROYECTO.md](PROYECTO.md). No describe trabajo terminado ni contiene planificación de entregas.

**Definido** identifica requisitos o decisiones ya establecidos. **Propuesta** identifica alternativas disponibles que deben adoptarse o ajustarse antes de implementarlas. **Pendiente** identifica cuestiones sin resolver. La reorganización documental no aprueba propuestas anteriores.

## Base aprobada y propuestas de arquitectura

**Base de arranque aprobada:** React + TypeScript estricto + Vite, React Router con HTML generado al compilar y CSS Modules. Permite implementar la estructura de las cuatro páginas en ES/EN, su navegación, la adaptación móvil/escritorio y los espacios para las demos, siguiendo el prototipo elegido. Aprobado no significa implementado.

**Componentes aprobados:** Base UI (`@base-ui/react`) para controles interactivos que requieran comportamiento compuesto. Sus componentes sin estilo se personalizan con CSS Modules y variables CSS. La elección no fija colores, tipografías ni composición visual, y no sustituye los controles nativos cuando cubran la necesidad.

**Estilo aprobado:** relieve mediante bordes definidos y sombras inferiores, con verde Sacramento (`#043927`) como base oscura y tonos verdes derivados para fondos y estados. Esta elección procede de la muestra «Relieve» del experimento de botones, no del prototipo estructural. Se aplica a la navegación y los componentes básicos compartidos; el detalle visual restante se revisa al incorporar contenido.

**Base compartida aprobada:** un único `SiteLayout` envuelve las páginas desde `app/root.tsx`, con `Header` y navegación a Inicio, Perfil profesional, Cómo lo construí y Contacto. El contenido de las cuatro rutas actuales queda vacío al retirar los experimentos. Esto no completa la estructura ni las rutas ES/EN del Sprint 1. La navegación marca la página activa y, al cambiar de ruta con JavaScript, sitúa el foco en el contenido principal mientras no existan encabezados de página.

Los componentes básicos son `Button`, `Card`, `Badge`, `TextField`, `Checkbox` y `Switch`, cada uno con responsabilidades y CSS propios. Las variables compartidas viven en `app/styles/tokens.css`, las reglas globales en `globals.css` y las utilidades usadas por el layout en `utilities.css`. Se conserva `app/`, conforme a React Router, en lugar de introducir otra raíz `src/`. La legibilidad y la mantenibilidad son prioritarias; esta base no incorpora los controles avanzados de la muestra experimental.

**Trabajo por sprint:** concretar y revisar únicamente los detalles necesarios para la entrega que comienza. No se exige aprobar toda esta especificación antes de programar la estructura. Los contratos, datos, algoritmos y herramientas adicionales de las demos siguen como propuestas para sus respectivos sprints. Las recomendaciones siguientes orientan la implementación; las que excedan la base aprobada no se aprueban por asociación.

| Área | Recomendación | Alternativa y motivo de la elección |
| --- | --- | --- |
| Render y navegación | React Router en modo Framework sobre Vite; generar las páginas informativas al compilar y servir archivos estáticos, con `ssr:false` y rutas explícitas de prerenderizado. | Una SPA declarativa necesita menos configuración inicial, pero deja la lectura dependiente de JavaScript. Para un portfolio se propone asumir la configuración adicional y entregar el contenido profesional en HTML. No se necesita un servidor de aplicación en producción. |
| Idiomas | Rutas ES/EN y diccionarios tipados propios para un vocabulario acotado; formatos con `Intl`. | i18next ofrece herramientas adicionales de traducción. Dos idiomas mantenidos por el autor permiten empezar con estructuras tipadas y plantillas sencillas, sin introducir un motor general de traducción. |
| Estilos | CSS Modules por componente y variables CSS para colores, tipografías, espacios e imágenes. | Tailwind también sería viable; CSS Modules permite definir el diseño propio en CSS. Los estilos del prototipo no son una referencia visual. Una biblioteca de componentes visuales impondría convenciones que luego habría que adaptar. |
| Componentes — definido | Base UI para controles interactivos compuestos, con estilos propios mediante CSS Modules. | Elegido expresamente por el autor. No se adopta una apariencia prediseñada ni se incorpora Tailwind. |
| Estado | `useState` para controles simples y `useReducer` para cada demo; funciones de dominio independientes de React. | Un almacén global añade coordinación que estas demos independientes no necesitan. El idioma y la navegación sí son compartidos; los inventarios, reintentos y migraciones no. |
| Recursos de AIA | Red local dibujada con SVG y datos propios. | Una librería cartográfica no aporta valor al mapa ficticio acordado. No hay cartografía geográfica, tiles ni API de mapas. |
| Animación | CSS y APIs del navegador; la simulación determina los datos y la animación solo los representa. | Una librería de animación puede reconsiderarse si las imágenes finales requieren capacidades concretas. No se añade por anticipado. |
| Pruebas | Vitest para reglas y transformaciones; React Testing Library para interacción relevante; Playwright para recorridos de integración. | Probar todo con un navegador encarece el diagnóstico. Separar reglas y recorridos permite comprobar cada riesgo en el nivel adecuado. |
| Entorno | npm, un único lockfile, ESLint y Prettier; versiones compatibles fijadas al inspeccionar/configurar el repositorio. | Se conserva una configuración existente si ya cubre estas necesidades. No se inventa aquí una matriz de versiones no probada. |

La generación de HTML al compilar forma parte de la base aprobada; no implica una mejora de rendimiento ya medida. El prerenderizado requiere que el primer render no dependa de `window`, temporizadores ni datos variables.

### Páginas, URLs y lectura

| Página | Español | Inglés |
| --- | --- | --- |
| Inicio | `/es/` | `/en/` |
| Perfil | `/es/perfil` | `/en/profile` |
| Cómo lo construí | `/es/como-lo-construi` | `/en/how-it-was-built` |
| Contacto | `/es/contacto` | `/en/contact` |

- Generar esas ocho páginas y una entrada `/` con enlaces a ES/EN. En el alojamiento se propone redirigir `/` a `/es/`; el idioma de una URL explícita siempre se respeta. No hace falta detección automática ni almacenamiento de preferencias.
- En Perfil, usar anclas estables `#caixa`, `#altia`, `#aia` y `#education`. Los nodos y Anterior/Siguiente actualizan la dirección y permiten historial atrás/adelante. Un ancla desconocida lleva al comienzo del perfil, sin iniciar demos.
- Acceder mediante enlace o recargar conserva página, idioma y capítulo, pero restablece las demos. Salir de una demo cancela su reproducción y operaciones pendientes; al volver empieza en su estado inicial. No se guarda progreso en disco.
- Cambiar idioma conserva página y capítulo; dentro de la misma visita debe conservar los datos y el estado de la demo. Su componente no debe reiniciarse únicamente por cambiar el idioma. Las etiquetas se traducen; los códigos, identificadores y reglas permanecen iguales.
- Cada página incluye título, descripción e idioma del documento. Los enlaces a la otra traducción se generan desde la misma tabla de rutas, junto con referencias canónicas cuando se conozca el dominio.
- El HTML generado contiene el contenido informativo completo y enlaces utilizables. Sin JavaScript se puede consultar el perfil, la formación, el CV disponible y el contacto; las demos explican que necesitan JavaScript. La selección visual de capítulos no debe ocultar permanentemente experiencias en ese caso.
- Con JavaScript, un cambio de página sitúa el foco en el encabezado principal; un cambio de capítulo, en su encabezado. Un cambio de escenario dentro de una demo conserva el foco del control activado. El historial restaura capítulo y posición de forma predecible.
- Una dirección de página inexistente muestra un 404 con enlaces válidos a Inicio y Perfil. El servidor estático debe entregar el HTML de las rutas existentes y un 404 real para las desconocidas; no se resolverán todos los errores devolviendo Inicio con estado 200. La regla específica se comprobará al elegir hosting.

### Idiomas, contenido y recursos personales

- Separar datos profesionales, texto de interfaz y datos ficticios de las demos. Los identificadores de experiencia, habilidades y recursos son estables; los textos se mantienen en ES/EN con la misma estructura comprobada por TypeScript.
- Traducir etiquetas, ayuda, errores y explicaciones. Los importes usan `es-ES`/`en-GB`, EUR y céntimos enteros en el modelo. Fechas almacenadas como valores estructurados, sin depender de la zona horaria para mostrar meses profesionales.
- Los mensajes con cantidades se construyen mediante funciones tipadas del diccionario. No concatenar frases a partir de fragmentos independientes ni ocultar traducciones faltantes con texto del otro idioma en la publicación final.
- Contacto: enlaces reales con etiquetas; navegación normal en la misma pestaña y `mailto:` para correo. Canales ausentes se indican como pendientes durante el desarrollo. La publicación requiere los destinos aportados por el autor.
- CV: recurso local por idioma cuando exista. Si solo hay uno, ofrecer el PDF real indicando su idioma; publicar la web bilingüe no autoriza a inventar o traducir un CV sin revisión. Proponer nombre `cv-es.pdf`/`cv-en.pdf` y enlace de descarga, admitiendo el comportamiento del visor del navegador.
- Comprobar en la compilación de publicación que el PDF existe y tiene formato válido; no renderizar un enlace operativo a un marcador. Si falla una descarga por red, el visitante conserva la navegación y puede volver a intentarlo desde el enlace.

### Organización y aislamiento

| Ubicación propuesta | Responsabilidad |
| --- | --- |
| `app/root.tsx`, `app/routes.ts`, `app/routes/` | Marco común, rutas, metadatos y páginas. |
| `app/content/` | Perfil, contribuciones, enlaces y referencias a CV; valores reales fuera de esta especificación. |
| `app/i18n/` | Idiomas, diccionarios y formatos. |
| `app/components/` | Navegación, camino/nodos, controles compartidos, contenedor de demo y detalle técnico. Extraer solo lo realmente reutilizado. |
| `app/features/aia/`, `altia/`, `caixa/` | En cada demo: datos de ejemplo, tipos/reglas, estado/controlador, vista y comprobaciones pertinentes. No imponer carpetas vacías para capas que no existan. |
| `app/styles/`, `app/assets/` | Variables visuales, estilos globales mínimos y recursos gráficos del autor. |
| `public/` | CV y archivos que necesiten una ruta pública estable. |
| `tests/e2e/` | Recorridos integrados; las pruebas de dominio/componentes pueden convivir con sus módulos. |

La estructura se adaptará a lo que ya exista en el repositorio; estos nombres son una propuesta de responsabilidad, no evidencia de archivos creados.

- Cada demo se activa por una acción explícita y se carga bajo demanda. Su descripción profesional aparece antes y de forma independiente. Los estados de carga, error y reinicio quedan dentro del espacio de la demo.
- Separar el control de errores de render del de operaciones asíncronas: un límite de error envuelve la vista; las promesas se capturan en el controlador y producen estados tipados. Un error de carga de un módulo ofrece recuperar mediante recarga explícita sin disparar bucles de reintento.
- Toda ejecución tiene un identificador. Reiniciar, cambiar de escenario o abandonar la demo invalida las respuestas antiguas y limpia temporizadores. No registrar esas respuestas en una ejecución nueva.
- Los reducers no ejecutan temporizadores, generan aleatoriedad ni mutan respuestas. Las funciones de dominio aceptan entradas y devuelven resultados o errores tipados; la UI decide cómo mostrarlos.
- Las imágenes del camino y de los nodos se eligen mediante una configuración por experiencia, incluyendo variantes vertical/horizontal si el recurso lo necesita. Son decorativas; los botones/enlaces y sus etiquetas conservan la semántica. Un recurso ausente usa el marcador provisional y no bloquea la navegación.
- Las imágenes y fuentes definitivas quedan a cargo del autor. Esta arquitectura permite incorporarlas después; no supone aprobados los estilos del prototipo ni fija nuevas preferencias estéticas.


## AIA — transporte de materiales

**Definido:** optimizar el orden de visita considerando materiales recibidos y entregados por los puntos; red de caminos ficticia acotada; edición de paradas, cálculo, reproducción, pausa, reinicio y comparación de métodos. La descripción separa el trabajo profesional real de la recreación personal.

### Escenario reducido — acordado

La aprobación cubre el escenario y su interacción general. Los datos concretos, las reglas técnicas pendientes y la aceptación detallada siguen sujetos a revisión antes de implementar.

Objetivo para el visitante: transformar dos lotes de restos en material reutilizable y entregarlos a dos fábricas recorriendo la menor distancia posible. Esta simplificación es propia de la demo; no describe las reglas del proyecto original.

| Elemento | Regla del escenario |
| --- | --- |
| Vehículo | Un camión, capacidad de dos lotes. |
| Materiales | Restos y material reutilizable; dos categorías, con nombres e iconos distintos. |
| Base | Inicio y final del recorrido. El camión sale con dos lotes de restos. |
| Procesadores | Dos centros. Cada uno recibe un lote de restos y entrega inmediatamente uno reutilizable; cada centro procesa una sola vez. |
| Destinos | Dos fábricas. Cada una necesita un lote reutilizable; ambas entregas son obligatorias. |
| Conversión | Un lote por otro, sin tiempos de proceso, pérdidas, precios ni variaciones de rendimiento. |
| Recorrido | Visitar una vez cada centro y fábrica, cumplir los intercambios y regresar a la base. Pasar por un nodo de camino no ejecuta automáticamente una operación. |
| Optimización | Minimizar distancia total entre los recorridos que cumplen todas las entregas. No optimizar beneficio ni porcentaje de aprovechamiento. |

El camión no puede entregar un material que no transporta. Procesar transforma la carga; entregar la reduce. El estado de carga y las entregas pendientes se muestran junto al recorrido. La capacidad es una regla verificable, no un nuevo parámetro que el visitante deba configurar.

**Interacción acordada:** elegir ubicaciones para los cuatro puntos entre nodos predefinidos, sin duplicados ni aumento de su número; elegir método, calcular, reproducir, pausar y reiniciar. Los roles y cantidades permanecen fijos. No se usa cartografía real ni una API externa.

**Comparación acordada:** una regla que elija la siguiente parada válida más cercana frente a una búsqueda de todos los órdenes válidos de las cuatro visitas. Ambos métodos usan las mismas distancias, carga inicial, demanda y condición de regreso. La búsqueda completa puede denominarse óptima únicamente dentro de este modelo acotado, una vez comprobada. La regla local puede empatar con ella; no se fabrica una diferencia.

### Datos y cálculo — propuesta concreta

Red bidireccional con nodos Base, A, B, C y D; las posiciones visuales no determinan la distancia. Usar pesos positivos explícitos en unidades ficticias, no kilómetros:

| Camino | Distancia |
| --- | --- |
| Base–A | 13 |
| A–B | 16 |
| B–C | 14 |
| C–D | 18 |
| D–Base | 17 |
| A–D | 19 |
| B–D | 21 |

Calcular el camino mínimo entre cada par de nodos sobre esta red. Se propone Dijkstra para esos tramos; la comparación visible se realiza entre órdenes de visita, no entre algoritmos distintos de camino mínimo. Para empates en un tramo, escoger el camino con secuencia de nodos lexicográficamente menor en el orden Base, A, B, C, D.

Asignación inicial propuesta: P1=A, P2=D, F1=B, F2=C. La edición permite cambiar cada asignación entre A–D; una duplicación invalida el cálculo y recibe un mensaje. Se permite terminar de editar antes de calcular. Los cuatro puntos son obligatorios, sin altas ni bajas.

En el método cercano, elegir la visita factible de menor distancia desde la ubicación actual; desempatar P1, P2, F1, F2. En el exacto, evaluar las permutaciones factibles y desempatar por ese mismo orden. Con estos datos: el cercano hace Base → P1 → F1 → P2 → F2 → Base, distancia 103; el exacto hace Base → P1 → P2 → F2 → F1 → Base, distancia 93. Ambos tienen que completar las dos entregas. La búsqueda exacta debe contrastarse con todos los órdenes factibles, no solo con este ejemplo.

Caso de empate propuesto: P1=A, P2=B, F1=C, F2=D; ambos métodos producen distancia 78. Los resultados esperados se han contrastado con los pesos explícitos mediante una comprobación independiente de caminos y órdenes; esto valida los ejemplos, no una futura implementación de producción. Las distancias son propias de este escenario, no mediciones geográficas. El tiempo de animación no mide eficiencia del método.

### Controles y estados — propuesta

Estados: edición → resultado → reproducción ↔ pausa → finalizado; una entrada inválida permanece en edición con mensaje. Cálculo local síncrono para cuatro visitas; no requiere worker. Calcular siempre usa una copia validada de la entrada.

Cambiar ubicaciones o método detiene la reproducción e invalida el recorrido. Calcular obtiene el resultado sin iniciar la animación. Reproducir está disponible solo con resultado válido; al finalizar, repetir empieza en la base. Pausar conserva posición, carga y entregas. Avanzar un paso está disponible cuando no se reproduce y quedan pasos. Cada paso alcanza el siguiente nodo del camino; los intercambios solo ocurren al completar la visita programada, no por pasar físicamente por otro centro.

Se propone 750 ms por paso de reproducción y un reloj sustituible en pruebas. Con movimiento reducido, Reproducir muestra el resultado final directamente; Avanzar un paso permite inspeccionar cada intercambio sin desplazamiento animado. Reiniciar restaura asignaciones iniciales, método cercano, inventario y ausencia de resultado. Los anuncios accesibles comunican intercambio, pausa o final, no cada fotograma.

**Aceptación propuesta:** todas las entregas se cumplen sin inventario negativo ni superar capacidad; se registra cada intercambio; ambos métodos resuelven la misma entrada; la distancia coincide con el recorrido; se comprueban escenarios de empate y de resultados distintos; edición y reinicio no reproducen resultados obsoletos. Los casos de datos anteriores completan esta propuesta; la prueba de implementación debe confirmar sus resultados sin reutilizar el solver como oráculo.

## ALTIA — migración con incidencias relacionadas

**Definido:** transferencia ficticia a un destino representativo de Canvas, progreso, estados por archivo, corrección/reintento, reinicio y detalle opcional de validación/transformación. Se requiere más profundidad que una única corrección trivial. No hay conexión real ni carga de archivos del visitante.

### Escenario reducido — acordado

La aprobación cubre el escenario y su interacción general. Los datos concretos, las reglas técnicas pendientes y la aceptación detallada siguen sujetos a revisión antes de implementar.

Migrar seis recursos ficticios de dos módulos de un curso. Transformar sus metadatos de origen en la estructura de destino; no manipular archivos reales ni atribuir este contrato a Canvas.

| Incidencia | Comportamiento y resolución acordados |
| --- | --- |
| Módulo sin destino asignado | Sus recursos requieren revisión. El visitante elige el destino del módulo y se revalidan todos los recursos afectados. |
| Nombre repetido en un mismo destino | La validación detecta el conflicto considerando recursos existentes y el lote pendiente. El visitante renombra el recurso afectado; cambiar su destino también obliga a revalidar. |
| Conflicto después de corregir el destino | Si se asigna el módulo a un destino que ya contiene ese nombre, se muestra la colisión antes de permitir la transferencia. Un destino sin colisión no genera una incidencia artificial. |

Los recursos válidos pueden completarse mientras otros requieren revisión. Reintentar procesa solo recursos corregidos pendientes y conserva los completados, sin duplicarlos. El progreso distingue completados y pendientes de revisión. Reiniciar devuelve datos, asignaciones y estados al inicio y descarta operaciones antiguas.

El detalle técnico presenta metadatos de origen, correspondencia de módulos, validaciones y resultado transformado a partir de la ejecución. El escenario no incluye fallos de red ni gestión de permisos.

### Datos, validación y recuperación — propuesta concreta

| ID | Módulo de origen | Archivo |
| --- | --- | --- |
| r1 | Introducción | guia.pdf |
| r2 | Introducción | agenda.pdf |
| r3 | Introducción | recursos.zip |
| r4 | Prácticas | guia.pdf |
| r5 | Prácticas | ejercicio.pdf |
| r6 | Prácticas | datos.csv |

Entrada por recurso: `{id, moduleId, filename}`. Asignación inicial: Introducción → General; Prácticas sin asignar. Los destinos disponibles son General y Prácticas. Inicialmente el destino está vacío. Salida: `{sourceId, destinationId, filename}`; `sourceId` identifica un recurso ya completado y evita duplicados en reintentos.

La comparación de nombres elimina espacios exteriores, normaliza Unicode a NFC y compara sin distinguir mayúsculas; se conserva la grafía normalizada para mostrar y guardar. Rechazar nombres vacíos, separadores de ruta y caracteres de control. No se cambia el contenido ni el formato del archivo.

Validar primero el lote pendiente en orden r1–r6, considerando archivos ya completados y los nombres reservados por los pendientes válidos. Ante colisión, el primer recurso en ese orden mantiene el nombre; los posteriores requieren revisión. Esto detecta también conflictos dentro de un lote que aún no se ha transferido.

Procesar secuencialmente los recursos válidos, con estado en proceso durante 200 ms por recurso y reloj sustituible en pruebas. No usar aleatoriedad. Durante la ejecución, bloquear edición e inicio/reintento duplicados; Reiniciar permanece disponible. La vista muestra completados/6, recursos en revisión y pendiente/en proceso, sin presentar un lote parcial como terminado.

Asignar destino o aplicar un nombre corregido revalida los pendientes afectados, pero no los transfiere automáticamente. La corrección de nombre se confirma con Aplicar o Enter, no en cada pulsación. Reintentar mueve únicamente pendientes válidos; los completados permanecen inmutables. Si se cambia el destino de un módulo con recursos parcialmente completados, se avisa de que solo afectará a los pendientes. Cuando todos los recursos del módulo están completados se bloquea su asignación.

Ejemplos de aceptación: la primera ejecución completa r1–r3 y deja r4–r6 en revisión. Asignar Prácticas → Prácticas permite completar los seis. En una ejecución nueva, asignar Prácticas → General detecta colisión de r4 con r1; reintentar completa r5/r6 y deja 5/6. Renombrar r4 a guia-practicas.pdf, aplicar y reintentar completa 6/6. Reintentar otra vez no añade salidas. Reiniciar durante un recurso en proceso elimina la ejecución y ninguna finalización antigua vuelve a añadirlo.

**Aceptación propuesta:** una asignación actualiza todos los recursos afectados; no se completa ningún recurso con validación fallida; corregir/reintentar no duplica los completados; el detalle técnico coincide con la transformación; se puede completar el lote y reiniciar de forma repetible.

## CaixaBank — flujo acordado y diseño técnico propuesto

**Definido:** listado de tarjetas → detalle → movimientos, con información ausente, fallo parcial y fallo total, recuperación y detalle técnico opcional sin visor de JSON.

**Definido — recuperación:** en los fallos parciales y totales fallan el intento inicial y tres reintentos automáticos. Solo al agotarlos se muestra el error con el botón de reintento manual; esa nueva consulta funciona en su primer intento. Se conserva el detalle en el fallo parcial y no se solicitan dependencias en el total. Esta decisión no adopta todavía TanStack React Query como dependencia.

**Propuesta técnica pendiente de revisión:** los contratos, datos, cantidades, controles específicos, estados, latencias y las demás reglas que siguen. La aceptación del recorrido no aprueba automáticamente esos detalles.

Se propone consultar dos tarjetas ficticias y abrir detalle/movimientos en un marco de móvil propio. No ejecuta pagos ni fraccionamientos. El adaptador local expone funciones asíncronas; no necesita un servidor HTTP.

### Contratos y datos de ejemplo

Importes en céntimos enteros de EUR. Cálculo simplificado: `availableMinor = limitMinor - spentMinor`, con `0 <= spentMinor <= limitMinor`. Contratos y reglas propios de la demo, sin representar sistemas bancarios reales.

| Operación | Entrada | Salida propuesta |
| --- | --- | --- |
| `getCards()` | Sin parámetros | `{cards:[{id,label,last4,detailRef}]}`. |
| `getCardDetail(detailRef)` | Referencia procedente de una tarjeta | `{cardId,currency,limitMinor,spentMinor,movementsRef}`; `movementsRef` admite `null`. |
| `getMovements(movementsRef)` | Referencia del detalle | `{items:[{id,description,amountMinor}]}`; la lista vacía es una respuesta válida. |

Los esquemas describen campos, no son JSON listo para ejecutar. Tipos propuestos: identificadores/referencias y etiquetas como cadenas no vacías; last4 como cuatro dígitos; currency con valor EUR; importes como enteros seguros no negativos. Un detalle debe corresponder al cardId seleccionado, cumplir spentMinor ≤ limitMinor y contener movementsRef no vacío o null. Validar campos, referencias y unicidad de IDs antes de presentar resultados; no se necesita una biblioteca de esquemas para estos tres contratos locales. Un fallo devuelve `{code, stage, retryable}`; los mensajes de interfaz se traducen aparte.

| Tarjeta | Referencias | Límite / gastado, en céntimos | Resultado disponible |
| --- | --- | --- | --- |
| `c1`, «Tarjeta diaria», últimos dígitos `1111` | `d1` / `m1` | 150000 / 25000 | 125000 céntimos = 1250,00 EUR |
| `c2`, «Tarjeta viajes», últimos dígitos `2222` | `d2` / `m2` | 200000 / 40000 | 160000 céntimos = 1600,00 EUR |

Movimientos de ejemplo: `m1` contiene `t1/Compra de ejemplo/1200` y `t2/Transporte de ejemplo/350`; `m2`, `t3/Alojamiento de ejemplo/8000` y `t4/Compra de ejemplo/2400`. Importes positivos de gasto. Son una muestra; su suma no determina el campo `spentMinor`.

Secuencia: lista → selección → detalle con `detailRef` → movimientos si existe `movementsRef`. El detalle permanece visible mientras se cargan movimientos o si estos fallan. `items:[]` significa «Sin movimientos»; referencia `null`, «Información de movimientos no disponible».

Referencias desconocidas y campos obligatorios inválidos producen error de etapa. Un error de detalle permite volver a la lista y no dispara movimientos. El formateo y cálculo no mutan la respuesta original.

### Escenarios y recuperación

Tres controles principales: «Todo funciona», «Falta información» y «Algo falla». Dentro del último se propone un selector «Fallo parcial»/«Fallo total», con parcial por defecto.

| Escenario | Respuesta simulada | Resultado y recuperación |
| --- | --- | --- |
| Normal | Todas las operaciones correctas. | Lista, detalle y movimientos; volver y elegir otra tarjeta. |
| Información ausente | Detalle correcto con `movementsRef:null`. | Conservar detalle; mostrar ausencia; no pedir movimientos ni ofrecer reintento para esa ausencia. |
| Error parcial | El intento inicial de movimientos y tres reintentos automáticos por referencia fallan con `MOVEMENTS_UNAVAILABLE`. | Conservar detalle y mostrar carga durante los intentos. Tras el cuarto fallo, mostrar error; el botón reintenta solo movimientos y obtiene éxito en el primer intento manual. |
| Error total | El intento inicial de lista y tres reintentos automáticos fallan con `CARDS_UNAVAILABLE`. | No pedir dependencias; mostrar carga hasta agotar los intentos y después error. Permitir reintentar consulta o volver al inicio; el primer intento de la consulta manual obtiene la lista. |

### Estados y consistencia

- Inicio: escenario normal, sin consultas, detalle cerrado y logs vacíos. «Consultar tarjetas» inicia el flujo; el scroll no lo inicia.
- Latencia sintética propuesta: 300 ms por operación, controlada por reloj en tests. Esperas entre reintentos propuestas: 1, 2 y 4 segundos. Sin aleatoriedad en fallos o tiempos.
- Si se adopta React Query, configurar tres reintentos y evitar que recargas por foco, reconexión o montaje recuperen el escenario antes de la acción manual. Aislar la caché por ejecución, escenario y referencia. La elección de herramienta sigue pendiente.
- Deshabilitar acciones que dupliquen una operación pendiente y mostrar carga. Cambio de escenario y reinicio siguen disponibles.
- Cambiar escenario/subtipo descarta peticiones anteriores, datos, selección, logs y contadores; vuelve al inicio del escenario elegido sin consultar automáticamente.
- «Reiniciar demo» restaura el inicio global y escenario normal. «Volver al inicio» tras error total conserva escenario y contadores para permitir recuperación en el siguiente intento.
- «Volver a tarjetas» conserva lista/contadores, cierra detalle y descarta sus operaciones pendientes. Otra selección elimina datos de la tarjeta anterior antes de cargar los nuevos.
- Los contadores se asocian a ejecución y operación/referencia. Reintentar no los borra. Cambiar escenario o reiniciar abre otra ejecución.
- Resultados antiguos no modifican UI ni añaden registros a una ejecución nueva. Recargar la página restaura el inicio; sin persistencia de datos de la demo.

### Registros y datos límite — propuesta

Cada operación añade un registro de inicio y uno de resultado/error, con executionId, operationId, operación, parámetros, instante relativo y payload o código. Se derivan de las operaciones locales y permanecen como instrumentación interna propuesta; no se muestran mediante un visor de JSON. El idioma cambia etiquetas y explicaciones, no los identificadores ni las cantidades del payload.

Añadir a las pruebas, sin nuevos controles públicos, un caso items vacío, una referencia desconocida, un importe inválido y una respuesta cuyo cardId no coincida con la selección. Validación inválida presenta error de etapa y permite volver o reiniciar; no ofrece un reintento que no pueda corregir el dato. Las incidencias controladas de lista/movimientos sí permiten recuperación en el siguiente intento conforme al escenario.

### Casos de aceptación de CaixaBank — propuesta

Estos casos solo serán exigibles si se adopta el diseño anterior:

1. Abrir la página no ejecuta operaciones sintéticas; consultar devuelve las dos tarjetas previstas.
2. La secuencia normal muestra el disponible y los movimientos correctos, y permite volver a la lista.
3. Una referencia nula evita la llamada a movimientos y su reintento; una lista vacía se distingue de información ausente.
4. Reintento, cambio de escenario y reinicio respetan las reglas de contadores y estados; los recorridos son repetibles.
5. Cambiar escenario o tarjeta durante una petición no muestra respuestas antiguas ni mezcla registros.
6. El error parcial conserva detalle durante los cuatro intentos fallidos; después muestra error y reintentar solicita solo movimientos, recuperándolos en el primer intento manual.
7. El error total agota cuatro intentos sin disparar llamadas dependientes; después muestra error y reintentar obtiene la lista en el primer intento manual y permite continuar.
8. La doble activación no duplica operaciones. Referencias desconocidas o campos obligatorios inválidos generan error de etapa.
9. Abrir/cerrar el detalle técnico no reinicia la demo. Explica las dependencias, transformaciones y cálculo del disponible de forma coherente con la ejecución, sin visor de JSON; no presenta operaciones simuladas como llamadas reales.

## Calidad y validación

Los requisitos generales están definidos en PROYECTO.md. Sus concreciones siguientes conservan el estado de propuesta o pendiente; no representan resultados medidos ni garantías de compatibilidad.

| Área | Comprobación propuesta o pendiente |
| --- | --- |
| Adaptación | Revisar 320, 768 y 1440 px CSS y zoom al 200 %; JSON con desplazamiento dentro de su panel. |
| Accesibilidad | Recorrido completo con teclado, foco y semántica; contraste 4,5:1 en texto normal y 3:1 en grande. No equivale a auditoría WCAG integral. |
| Movimiento | Respetar prefers-reduced-motion y sustituir movimiento no esencial por estados/resultados comprensibles. |
| Aislamiento | Probar errores de carga, render y operaciones asíncronas. Lectura sin JavaScript solo si se adopta la propuesta de render. |
| Recursos y fidelidad | Verificar licencias, atribuciones, datos sintéticos y distinción entre experiencia y recreación. |
| Rendimiento | Presupuesto provisional de JavaScript inicial ≤200 KiB gzip, incluidas dependencias previas a abrir una demo. Contrastar con la primera build. Tres mediciones móviles con entorno/configuración registrados; sin objetivo de Lighthouse 100. |
| Coste y servicios | Comprobar alojamiento estático sin backend propio ni API de pago obligatoria y condiciones vigentes del proveedor elegido. |
| Calidad de código | Proponer scripts dev, build, preview, typecheck, lint, format:check, test y test:e2e. Tipos, lint/formato, pruebas relevantes y build deben pasar. Concretar sus comandos y versiones compatibles al configurar el repositorio. |
| Compatibilidad | Funcionales en Chromium; consulta básica en Firefox/WebKit de Playwright y revisión manual disponible. Registrar versiones: WebKit emulado no acredita Safari real. |

Propuesta de aceptación: cero fallos en tipos/lint/formato, compilación, casos de dominio y recorridos acordados; cero enlaces operativos rotos ni errores no controlados en esos recorridos. Comprobar las ocho rutas directamente y mediante recarga, cambio de idioma, teclado, regreso y demos. Revisión automatizada en Chromium, Firefox y WebKit de Playwright, incluida vista de 390 px; revisión visual en 320, 768 y 1440 px y zoom 200 %. Registrar motores, versiones, entorno y las pruebas manuales realmente disponibles. No afirmar Safari/iPhone real a partir de WebKit.

El presupuesto de 200 KiB es una referencia provisional a contrastar con la primera build; no bloquea por sí solo una entrega ni se convierte en umbral aprobado al aparecer aquí. Separar los chunks de las demos y sus recursos del arranque informativo. Para rendimiento, proponer tres mediciones con caché fría en emulación móvil, registrar herramienta/versión, CPU/red y medianas de LCP/CLS/TBT, tamaños transferidos y anomalías. Las correcciones se priorizan sobre problemas reproducibles, no sobre alcanzar una puntuación 100. Las imágenes y tipografías finales requieren nueva medición.

La compilación de publicación requiere contenido ES/EN completo, CV real disponible, enlaces reales, licencias y atribuciones revisadas. El control de publicación se distingue del control de una entrega estructural con marcadores. Una comprobación ausente o no ejecutada no acredita cumplimiento.

Las pruebas deben verificar entradas/salidas, transformaciones y errores sin depender de la animación; reintentos, reinicios, doble activación y respuestas obsoletas cuando afecten al flujo; navegación, recuperación, teclado y adaptación de la interfaz; compilación, enlaces y recursos en producción. No se establece cobertura del 100 % como objetivo.

Antes de publicar, comprobar el alcance completo, las tres demos, el CV/contacto reales y el funcionamiento en destino. Los resultados de ejecución se registran en tareas, PRs o informes de prueba, no aquí.

## Organización documental

La especificación conserva comportamientos, contratos, decisiones vigentes y cuestiones pendientes. El diseño visual se concreta por separado. El README recoge instrucciones de ejecución; el código y la configuración fijan versiones y comandos reales. Las reglas de trabajo corresponden a AGENTS.md y las entregas a PLANIFICACION.md. No se presupone que esos materiales estén creados o completos.

## Referencia estructural y recursos visuales pendientes

Se adopta únicamente como referencia estructural el prototipo aportado por el autor, actualizado en `portfolio-prototipo-base.html`. Conserva portada y navegación mediante camino/nodos; las páginas Cómo lo construí y Contacto se separan del recorrido de experiencias. El orden es CaixaBank → ALTIA → AIA, seguido de formación y tecnologías.

**Definido:** los estilos del prototipo se ignoran cada vez que se consulte o utilice. No se copian ni se toman como guía sus colores, tipografías, bordes, radios, sombras, espaciados o efectos, tampoco en pruebas y experimentos. El diseño visual se concreta por separado con el autor.

La maqueta permite revisar escritorio y móvil. En móvil se propone disponer el camino horizontal sobre el contenido para conservar espacio para las demos. La adaptación concreta queda sujeta a revisión visual del autor.

El camino y sus nodos tendrán recursos gráficos por sección: temática bancaria y tarjeta, flujo de archivos y documento, carretera y vehículo. Los marcadores actuales son provisionales. La base visual adoptada es relieve con verde Sacramento y tonos derivados; las tipografías, imágenes y detalles restantes se concretan con el autor. Los recursos deben poder sustituirse sin cambiar las reglas de navegación. Los nodos conservan etiquetas y controles nativos aunque se utilicen imágenes decorativas.

El prototipo contiene interacciones locales y ejemplos verificables para revisar el alcance; no sustituye la implementación final en React ni aprueba automáticamente contratos, datos, estilos o herramientas pendientes.

## Entorno, alojamiento y límites de esta propuesta

Antes de instalar, inspeccionar package.json, lockfile, configuración y estado del repositorio existente. Si está vacío, configurar la base React Router/Vite ya aprobada. Conservar las convenciones compatibles existentes. Fijar una versión compatible de Node y dependencias, registrar la elección en configuración/README y verificar instalación y compilación reproducibles. Las versiones exactas no se han comprobado aquí.

Si el repositorio está en GitHub, proponer CI para instalar desde lockfile, comprobar tipos/lint/formato, pruebas y build en los cambios. Los recorridos de navegador se ejecutan cuando exista la interfaz correspondiente. Configurar CI o publicar el repositorio requiere su propio encargo; esta propuesta no instala ni activa servicios.

Cloudflare Pages sigue como candidato, sin selección de proveedor ni garantía de condiciones actuales. El hosting elegido debe servir el resultado estático, las ocho rutas, redirección de inicio y página 404. Sus reglas y costes se verifican antes de adoptarlo; esta decisión no bloquea el trabajo local. No se incluye despliegue automático a producción sin autorización.

El Sprint 1 puede comenzar con la base aprobada y el encargo de PLANIFICACION.md; la implementación requiere trabajar en el repositorio y comprobar su configuración real. Recursos visuales, nombre público, textos definitivos, CV, contactos y dominio se completan en el momento de entrega correspondiente y no bloquean la estructura con marcadores explícitos. No se añade un laboratorio ni un backend al alcance.

## Referencias técnicas consultadas

Estas fuentes sustentan capacidades de las herramientas; no convierten las recomendaciones del proyecto en decisiones aprobadas ni garantizan rendimiento:

- [React Router: modos y plugin de Vite](https://reactrouter.com/start/modes).
- [React Router: prerenderizado y alojamiento estático](https://reactrouter.com/how-to/pre-rendering).
- [Vite: compilación y rutas de recursos](https://vite.dev/guide/build).
- [Vite: CSS Modules y recursos](https://vite.dev/guide/features).
- [React: carga diferida](https://react.dev/reference/react/lazy).
- [React: reducers](https://react.dev/reference/react/useReducer).
- [React: límites de error](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary).
- [Vitest: inicio](https://vitest.dev/guide/).
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).
- [Playwright: proyectos de prueba](https://playwright.dev/docs/test-projects).
- [Base UI: instalación y uso con CSS Modules](https://base-ui.com/react/overview/quick-start).


## Registro de cambios

- **09/10/2026 · v0.1:** primera versión identificada de este documento; actualizado el caso CaixaBank para excluir el visor de JSON por decisión expresa. Se conservan los contratos y registros internos como propuesta y el detalle técnico opcional.

- **09/10/2026 · v0.2:** adoptada la recuperación de CaixaBank tras un intento inicial y tres reintentos automáticos fallidos, seguida de éxito en la consulta manual. TanStack React Query continúa pendiente de adopción.

- **09/10/2026 · v0.3:** adoptado Base UI para componentes interactivos sin estilo, conservando CSS Modules y variables CSS para el diseño propio.
- **09/10/2026 · v0.4:** aclarado que el prototipo es exclusivamente estructural y que sus estilos no se utilizan como referencia visual, tampoco en experimentos.
- **09/10/2026 · v0.5:** adoptado relieve con verde Sacramento; definido un layout y navbar compartidos, componentes básicos y estilos centralizados. Retirada de experimentos con páginas vacías, sin dar por completado el Sprint 1 ni las rutas ES/EN.

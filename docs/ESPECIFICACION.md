# Especificación funcional y técnica

Versión 0.26 · 10 de octubre de 2026

Este documento desarrolla el comportamiento y la implementación del alcance de [PROYECTO.md](PROYECTO.md). No describe trabajo terminado ni contiene planificación de entregas.

**Definido** identifica requisitos o decisiones ya establecidos. **Propuesta** identifica alternativas disponibles que deben adoptarse o ajustarse antes de implementarlas. **Pendiente** identifica cuestiones sin resolver. La reorganización documental no aprueba propuestas anteriores.

## Base aprobada y propuestas de arquitectura

**Base de arranque aprobada:** React + TypeScript estricto + Vite, React Router con HTML generado al compilar y CSS Modules. Permite implementar la estructura de las cuatro páginas en ES/EN, su navegación, la adaptación móvil/escritorio y los espacios para las demos, siguiendo el prototipo elegido. Aprobado no significa implementado.

**Componentes aprobados:** Base UI (`@base-ui/react`) para controles interactivos que requieran comportamiento compuesto. Sus componentes sin estilo se personalizan con CSS Modules y variables CSS. La elección no fija colores, tipografías ni composición visual, y no sustituye los controles nativos cuando cubran la necesidad.

**Estilo aprobado:** relieve mediante bordes definidos y sombras inferiores, con verde Sacramento (`#043927`) como base oscura y tonos verdes derivados para fondos y estados. Esta elección procede de la muestra «Relieve» del experimento de botones, no del prototipo estructural. Se aplica a la navegación y los componentes básicos compartidos; el detalle visual restante se revisa al incorporar contenido.

**Definido — esquinas rectas y continuidad del marco:** los radios compartidos de controles, tarjetas y etiquetas son cero. Header y panel principal se presentan unidos, sin separación entre las columnas en escritorio ni entre las filas en tablet/móvil. Los componentes reutilizables y los nodos de navegación utilizan esquinas rectas; Checkbox consume el radio común de controles. Los márgenes exteriores y los espacios internos conservan su definición vigente.

**Definido — marco sin líneas de delimitación:** Header y panel principal no utilizan sombras exteriores; el panel no tiene borde exterior y su encabezado no incorpora una línea divisoria. La regla se limita al marco compartido: los indicadores de foco y los estilos propios de controles, tarjetas y navegación mantienen su definición.

**Definido — navegación persistente:** cuando el layout dispone Header encima del panel (hasta 60 rem), Header usa posicionamiento sticky con desplazamiento superior cero y se muestra por encima del contenido durante el scroll. Conserva su espacio en el documento y su fondo opaco. En la disposición vertical de escritorio, el contenedor interno de navegación usa sticky con separación superior de `--space-5`; el fondo de Header sigue extendiéndose hasta el final del panel. El contenedor interno recupera su posición normal cuando Header está horizontal. El enlace Inicio es el único acceso a la portada dentro de Header; no se incluye un enlace de marca duplicado.

**Base compartida aprobada:** un único `SiteLayout` envuelve las páginas desde `app/root.tsx`, con `Header` y navegación a Inicio, Perfil profesional, Cómo lo construí y Contacto. Se adopta un mapa de destinos conectados junto a un panel de lectura: navegación lateral en escritorio y encima del panel en tablet/móvil. Los cuatro destinos se mantienen en una única fila horizontal incluso en pantallas estrechas; sus nombres completos pueden ocupar varias líneas debajo de los nodos. La página activa se distingue mediante nodo relleno, estilo activo y `aria-current="page"`. Los enlaces de Header muestran solo el nodo y el nombre, sin numeración ni texto «Estás aquí». El panel muestra directamente el contenido de la ruta, sin bloque pageHeader, número ni título compartido de página; las cuatro rutas muestran contenido provisional identificado. Los destinos y nombres de navegación se definen en `app/navigation.ts`. Esto no completa la estructura ni las rutas ES/EN del Sprint 1. Al cambiar de ruta con JavaScript, el foco se sitúa en el contenido principal. Los enlaces siguen siendo utilizables sin JavaScript.

Los componentes básicos son `Button`, `Card`, `Badge`, `TextField`, `Checkbox` y `Switch`, cada uno con responsabilidades y CSS propios. Las variables compartidas viven en `app/styles/tokens.css`, las reglas globales en `globals.css` y las utilidades usadas por el layout en `utilities.css`. Se conserva `app/`, conforme a React Router, en lugar de introducir otra raíz `src/`. La legibilidad y la mantenibilidad son prioritarias; esta base no incorpora los controles avanzados de la muestra experimental.

**Definido — independencia de estilos y navegación adaptable:** `tokens.css` contiene valores genéricos compartidos, agrupados por paleta, tipografía, espacios y formas/interacciones. El ancho de la columna de navegación pertenece al CSS Module de `SiteLayout`; el tamaño de nodos y los tamaños de texto específicos pertenecen al de `Header`. En escritorio, el header se extiende hasta el final del panel de lectura. Las etiquetas de navegación usan 1 rem en escritorio/tablet y 0,875 rem en móvil. Los ajustes tipográficos se limitan a la navegación. En móvil se reducen los espacios internos, manteniendo cuatro columnas y una línea de conexión continua. El texto se ajusta dentro de cada columna; una palabra que no cabe puede dividirse para evitar desbordamiento. Los nodos quedan alineados aunque las etiquetas tengan distintas alturas. No se abrevia contenido ni se incorpora desplazamiento horizontal.

**Trabajo por sprint:** concretar y revisar únicamente los detalles necesarios para la entrega que comienza. No se exige aprobar toda esta especificación antes de programar la estructura. Los contratos, datos, algoritmos y herramientas adicionales de las demos siguen como propuestas para sus respectivos sprints. Las recomendaciones siguientes orientan la implementación; las que excedan la base aprobada no se aprueban por asociación.

**Definido — contenido provisional y reservas de demos:** las cuatro páginas incorporan texto de relleno identificado como provisional, sin inventar datos profesionales. `PageContent` agrupa la introducción y las secciones; `ContentSection` proporciona título y ancla; `DemoPlaceholder` reserva espacio con `Card` y marca su estado mediante `Badge`. Los datos de relleno se mantienen en `app/content/placeholderContent.ts`. Perfil presenta CaixaBank Tech, ALTIA y AIA, cada una con su reserva de demo, seguidas de Formación y Tecnologías. Inicio incluye presentación, CV pendiente y accesos a las otras páginas; Cómo lo construí incluye base técnica, proceso y recursos pendientes; Contacto incluye canales pendientes, sin formulario ni enlaces ficticios. Las reservas explican que las demos no están implementadas y serán recreaciones con datos ficticios.

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

**Definido — foco al activar la navegación:** activar un destino principal con JavaScript sitúa el foco en main también cuando la página ya está abierta. Activar una subsección de Perfil mantiene el foco de destino en su título. main y los títulos usan `tabIndex=-1` para permitir foco programático sin añadir paradas al recorrido de Tab. Tab continúa hacia el siguiente enlace o control disponible; cuando no existe ninguno después del destino, puede volver a la navegación tras recorrer el navegador. Enfocar contenido informativo no convierte sus párrafos ni títulos en controles tabulables.

**Definido — posición y eventos de navegación:** React Router restaura la posición guardada de cada entrada al usar Atrás/Adelante y muestra el comienzo al navegar mediante enlaces sin ancla. La navegación por gestos conserva su posición de destino explícita: comienzo al avanzar y final al retroceder. Las teclas de desplazamiento cancelan su acción nativa únicamente cuando producen un cambio de página. Los controles editables se reconocen mediante el estado efectivo `isContentEditable`, incluidos atributos vacíos, `plaintext-only` y contenido editable heredado; un descendiente explícitamente no editable conserva su comportamiento normal. Un evento con desplazamiento vertical cero no añade distancia ni cancela el gesto si permanece en el límite. Una ancla desconocida de Perfil lleva al comienzo y sitúa el foco en main; al recorrer el historial prevalece la posición guardada sobre repetir el salto al ancla.

**Definido — cambio directo entre páginas:** los cambios por desplazamiento conservan las rutas y componentes independientes y se ejecutan sin transición visual. Se retira la continuidad visual adoptada en v0.22 por decisión del usuario; no se mantiene bloqueo asociado a animaciones ni se concatenan las páginas.

**Definido — navegación por desplazamiento:** en las rutas actuales, un nuevo gesto hacia abajo iniciado al final de la página avanza en el orden Inicio → Perfil → Cómo lo construí → Contacto; un nuevo gesto hacia arriba iniciado al principio retrocede en ese orden. Llegar al límite durante el mismo gesto no provoca el salto. Contacto no tiene siguiente página e Inicio no tiene anterior; no hay recorrido circular. El cambio conserva una entrada de historial: al avanzar muestra el comienzo de la página siguiente y al retroceder muestra el final de la anterior. La navegación principal sigue disponible y sin JavaScript no hay cambio automático. La integración usa `usePageScrollNavigation` desde `SiteLayout`, con la regla de intención separada en `PageScrollIntent`. Para rueda/trackpad, una pausa de más de 200 ms delimita un nuevo gesto y se acumulan 80 px en la dirección correspondiente; un nuevo gesto táctil requiere 80 px de recorrido vertical. PageDown, Flecha abajo o Espacio pueden avanzar si una nueva pulsación comienza al final; PageUp, Flecha arriba o Mayús+Espacio pueden retroceder si comienza al principio. No se utiliza la repetición de una tecla mantenida. Las entradas de zoom, controles editables y contenedores con scroll propio no activan el cambio; tampoco se encadenan saltos durante un mismo gesto.

**Definido para prueba — subnavegación de Perfil:** únicamente en Perfil y en la disposición vertical de escritorio, mostrar enlaces a CaixaBank Tech, ALTIA, AIA, Formación y Tecnologías mediante las anclas existentes. La sublista está visible e indentada bajo Perfil profesional; en la disposición horizontal de tablet/móvil no se muestra subnavegación ni desplegable. Las secciones de contenido permanecen en la página. Los enlaces directos a sus anclas siguen admitidos: con JavaScript, el salto descuenta la altura real del Header horizontal cuando corresponde y sitúa el foco en el título de sección. Las URLs y el historial conservan el ancla de los clics. La subsección activa utiliza `aria-current="location"` y el estilo de selección existente. Con JavaScript, la marca sigue el scroll: cambia al último título que alcanza el borde superior de lectura, con el margen de ancla existente y descontando el Header horizontal cuando corresponde. Antes del primer título no se marca ninguna subsección; al final de la página se marca la última, aunque su bloque corto no alcance el borde superior. El seguimiento actualiza únicamente la marca, sin modificar URL, historial ni foco. La posición restaurada del historial prevalece sobre el ancla para calcular la marca. Las etiquetas y anclas se obtienen de las secciones de contenido existentes. La navegación lateral admite scroll interno si supera la altura disponible; ese scroll no activa el salto entre páginas. La disposición sigue pendiente de revisión visual del usuario.

Al activar una subsección por clic se conserva su marca hasta que cambie la posición de scroll, también si el final de la página impide alinear su título con el borde superior. Esto no se aplica a la restauración desde el historial, cuya marca se calcula desde la posición recuperada.

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

**Definido — nombres de páginas:** los componentes de las cuatro páginas y sus archivos llevan el sufijo `Page`: `HomePage.tsx`, `ProfilePage.tsx`, `BuildPage.tsx` y `ContactPage.tsx`, en `app/routes/`. `app/routes.ts` relaciona esos archivos con las URLs vigentes. El sufijo identifica componentes de página; no afecta al comando de compilación `build`, sus directorios de salida ni a los componentes compartidos.

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
- **10/10/2026 · v0.6:** adoptada la opción de mapa de navegación y panel de lectura para el layout compartido: destinos conectados, ubicación activa explícita y encabezado de página; navegación lateral en escritorio y superior en móvil, manteniendo el estilo aprobado.
- **10/10/2026 · v0.7:** separadas las variables específicas de navegación/layout de los tokens comunes; header de altura completa en escritorio y tamaños tipográficos de navegación adaptados a móvil. La solución de fila continua en móvil queda pendiente de elección.
- **10/10/2026 · v0.8:** adoptada navegación de cuatro destinos en una única fila horizontal en tablet/móvil, con nombres completos en varias líneas y espacios internos reducidos en móvil; sustituye la disposición móvil de dos filas.
- **10/10/2026 · v0.9:** incorporado el encargo de texto provisional en las cuatro páginas y reservas para las tres demos de Perfil; definidos componentes reutilizables y separación del contenido de relleno.
- **10/10/2026 · v0.10:** adoptadas esquinas rectas mediante radios compartidos a cero y eliminado el espacio entre Header y panel principal; Checkbox utiliza el token de radio de controles.
- **10/10/2026 · v0.11:** eliminados el borde exterior del panel, la línea bajo su encabezado y las sombras exteriores de Header y main.
- **10/10/2026 · v0.12:** adoptado el sufijo Page para los cuatro componentes de página y sus archivos, con referencias de rutas actualizadas.
- **10/10/2026 · v0.13:** adoptado Header sticky en la disposición horizontal de tablet/móvil, pegado al borde superior durante el scroll.
- **10/10/2026 · v0.14:** adoptado contenido interno sticky para el Header vertical de escritorio, conservando su fondo de altura completa y el comportamiento horizontal vigente.
- **10/10/2026 · v0.15:** retirado el enlace de marca Portfolio de Header; Inicio conserva el acceso a la portada y se eliminan los estilos y variables exclusivos de la marca.
- **10/10/2026 · v0.16:** eliminados la numeración y el texto «Estás aquí» de Header, conservando el indicador activo y la numeración del panel de lectura.
- **10/10/2026 · v0.17:** retirado pageHeader del panel principal, con su título, numeración, estilos y datos exclusivos; main conserva el contenido de la ruta.
- **10/10/2026 · v0.18:** adoptado avance entre páginas mediante un gesto adicional hacia abajo al llegar al final, con protección contra inercia y último destino sin salto. Sublista de Perfil conservada como propuesta pendiente.
- **10/10/2026 · v0.19:** autorizada para prueba la sublista visible de Perfil en escritorio y desplegable en tablet/móvil, con anclas, cierre móvil y ajuste de desplazamiento/foco; pendiente de revisión visual del usuario.
- **10/10/2026 · v0.20:** retirado el desplegable de subsecciones en tablet/móvil; la sublista se conserva únicamente en la navegación vertical de escritorio.
- **10/10/2026 · v0.21:** añadido retroceso mediante un nuevo gesto hacia arriba al principio de la página, mostrando el final de la anterior y conservando las protecciones de intención de desplazamiento.
- **10/10/2026 · v0.22:** adoptada transición visual vertical en ambos sentidos para los cambios por scroll, conservando rutas independientes y separando Header de la animación; salto directo con movimiento reducido o sin API compatible.
- **10/10/2026 · v0.23:** retirada la transición visual por decisión del usuario y restaurado el cambio directo por scroll en ambos sentidos, conservando rutas independientes.
- **10/10/2026 · v0.24:** por encargo de corregir los bugs de navegación, definida restauración de posición para enlaces e historial, coordinación con destinos por gestos, cancelación nativa de teclado cuando cambia de página, exclusión de edición efectiva, conservación del gesto ante desplazamiento vertical cero y recuperación de anclas desconocidas.
- **10/10/2026 · v0.25:** corregido el foco al reactivar el destino principal ya abierto; aclarado el foco programático en main y títulos frente al recorrido de Tab por enlaces y controles.
- **10/10/2026 · v0.26:** adoptado seguimiento de la subsección de Perfil durante el scroll, al alcanzar su título el borde superior de lectura, actualizando solo la marca y conservando URL, historial y foco; sustituye la exclusión de seguimiento de v0.19.

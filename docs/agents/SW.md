# SW — Ingeniería de software

Versión 0.2 · 8 de octubre de 2026

## Función y reglas comunes

Implementar las tareas encargadas y comprobar su corrección mediante pruebas unitarias y las verificaciones técnicas pertinentes. Trabajar junto a QA como los dos roles del proyecto; el usuario conserva las decisiones y la aceptación de las entregas.

Aplicar AGENTS.md. Este archivo añade responsabilidades específicas de SW y no amplía sus permisos. No requiere agentes adicionales para diseñar, implementar o revisar el trabajo.

## Antes de implementar

- Leer el encargo, PROYECTO.md y los apartados aplicables de ESPECIFICACION.md y PLANIFICACION.md. Distinguir lo aprobado de las propuestas y pendientes.
- Inspeccionar instrucciones, código, configuración, dependencias y cambios existentes del repositorio antes de editar.
- Identificar el comportamiento esperado y los criterios de aceptación de la tarea. No bloquear el sprint actual por decisiones de entregas posteriores.
- Consultar al usuario las decisiones que condicionen la implementación y sigan abiertas, exponiendo alternativas y una recomendación. No adoptar silenciosamente una propuesta.
- Utilizar la referencia visual aprobada. Si falta y es necesaria, solicitarla; no sustituirla por un diseño propio.

## Implementación

- Implementar únicamente el alcance encargado, con la base técnica aprobada y las convenciones compatibles existentes.
- Escribir todo el código en inglés: nombres de archivos y módulos, componentes, funciones, variables, tipos, interfaces, propiedades, constantes, clases y selectores CSS, claves de traducción, comentarios y documentación dentro del código. Aplicar la misma regla a scripts, configuración y pruebas, incluidos nombres y descripciones de casos, fixtures y mocks. Los textos visibles de la web y los valores de traducción mantienen los idiomas ES/EN definidos para el producto; los tests pueden contener esos textos para comprobarlos. Mantener en español la comunicación y la documentación del proyecto.
- Mantener las reglas y transformaciones del dominio separadas de su representación visual cuando corresponda. Evitar abstracciones y dependencias sin una necesidad concreta del encargo.
- Integrar navegación, adaptación a móvil y escritorio, teclado, estados de error e idiomas dentro de la funcionalidad que se construye.
- Mantener separados el contenido profesional real y los datos ficticios de las demos. Identificar los marcadores pendientes y no inventar datos del autor.
- Revisar el propio cambio antes de entregarlo: errores, regresiones, coherencia con el requisito y modificaciones ajenas al alcance.
- Corregir las incidencias reproducibles que el usuario encargue. Si el resultado esperado contradice un requisito o no está definido, señalarlo antes de cambiar el comportamiento.

## Pruebas unitarias y verificación técnica

SW es responsable de diseñar, escribir, ejecutar y mantener las pruebas unitarias del código que implementa o modifica, con alcance proporcional al riesgo.

- Derivar los resultados esperados de requisitos adoptados y ejemplos comprobados; no copiar como expectativa la salida de la propia función bajo prueba.
- Cubrir reglas de dominio, cálculos, validaciones, transformaciones y transiciones de estado relevantes. Incluir casos normales, límites y errores que puedan afectar al comportamiento.
- Comprobar reinicio, reintentos, doble activación, cancelación y respuestas obsoletas cuando formen parte de la lógica implementada. Usar datos y relojes controlados cuando corresponda.
- Mantener las pruebas deterministas e independientes entre sí. No depender del tiempo real ni de la animación para verificar reglas de dominio.
- Simular dependencias externas cuando sea necesario, sin sustituir por un mock la lógica que se pretende comprobar.
- No exigir cobertura del 100 %, añadir pruebas de relleno ni probar detalles internos sin valor de comportamiento. Un cambio puramente visual no exige una prueba unitaria artificial.
- Ante un defecto de lógica, incorporar una prueba de regresión cuando aporte una comprobación útil del fallo corregido.
- Ejecutar los controles acordados y disponibles: pruebas relevantes, tipos, lint, formato y compilación. Añadir pruebas de componente o integración cuando sean pertinentes y estén dentro del encargo.
- Si falta una herramienta o configuración necesaria, indicarlo. Proponer su incorporación sin tratar una dependencia pendiente como aprobada.
- No modificar los criterios de aceptación ni debilitar una prueba para ocultar un defecto. Corregir una expectativa errónea solo con fundamento en el requisito vigente.

Las pruebas unitarias y la revisión de SW no sustituyen la validación independiente de QA.

## Entrega a QA y al usuario

Entregar una versión identificable y ejecutable, con:

- Resumen de lo implementado y requisitos afectados.
- URL o instrucciones reales para ejecutar la versión, junto con su identificador disponible: commit, build o etiqueta de entrega.
- Alcance que debe poder comprobarse y contenido todavía provisional.
- Comandos ejecutados y resultados: pasado, fallido o no ejecutado. Distinguir las pruebas unitarias de otras verificaciones.
- Limitaciones conocidas y decisiones pendientes.

Mantener en README las instrucciones reales de instalación y ejecución cuando forme parte del cambio. QA obtiene sus expectativas de los requisitos aprobados, no de las decisiones internas de SW ni de que sus pruebas hayan pasado.

## Registro de cambios

- **08/10/2026 · v0.1:** definición del rol SW, con implementación, revisión propia, pruebas unitarias y entrega para validación independiente.
- **08/10/2026 · v0.2:** código, componentes, identificadores, comentarios, scripts, configuración y pruebas en inglés; contenido visible ES/EN y comunicación y documentación del proyecto en español.

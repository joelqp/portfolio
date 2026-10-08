# QA — Validación independiente del comportamiento

Versión 0.1 · 8 de octubre de 2026

## Función y reglas comunes

Comprobar que una versión ejecutable cumple el comportamiento aprobado, mediante pruebas de caja negra: entradas, acciones y resultados observables. Trabajar junto a SW como los dos roles del proyecto; el usuario conserva la aceptación de las entregas.

Aplicar AGENTS.md. Este archivo añade responsabilidades específicas de QA y no amplía sus permisos. QA no revisa ni modifica el código de la aplicación y no asume las pruebas unitarias de SW.

## Independencia respecto al código

- Definir los casos y resultados esperados a partir de PROYECTO.md, los requisitos adoptados de ESPECIFICACION.md, PLANIFICACION.md, los criterios del encargo y la referencia visual aprobada.
- No leer el código fuente de la aplicación, sus diffs, sus pruebas unitarias ni sus módulos internos para diseñar, ejecutar o justificar la aceptación.
- No importar funciones de la aplicación, reutilizar sus cálculos como oráculo ni acceder a su estado interno desde las pruebas de QA.
- No considerar correcto un resultado porque coincida con la implementación, porque SW lo afirme o porque sus pruebas estén en verde.
- Usar la entrega de SW para identificar versión, acceso y limitaciones conocidas. Esa entrega no puede redefinir el resultado esperado.
- Consultar README e instrucciones operativas solo para ejecutar la aplicación o las herramientas de prueba autorizadas. Esto no habilita una revisión del código.
- Se permite observar la interfaz renderizada, el DOM y árbol de accesibilidad, URL e historial, descargas, respuestas públicas, consola y red del navegador. No abrir bundles ni mapas de código fuente para deducir la lógica interna.
- Si un criterio exige inspeccionar la implementación, declararlo fuera de esta validación y pedir a SW evidencia técnica separada. No atribuirse su comprobación independiente.

## Preparación

- Identificar el alcance del sprint y la versión que se va a probar. No exigir funcionalidades previstas para entregas posteriores.
- Preparar los casos antes de recorrer la implementación, siempre que los requisitos disponibles lo permitan. Complementarlos después con exploración del comportamiento observable.
- Para cada caso, indicar requisito, precondiciones, acciones, datos y resultado esperado. Mantener la documentación proporcional al alcance.
- No convertir propuestas o umbrales provisionales en condiciones de aceptación. Cuando falte una decisión que cambie el resultado esperado, pedir aclaración y marcar el caso como bloqueado.
- Solicitar una versión ejecutable o instrucciones de acceso si faltan. No inventar resultados ni sustituir la prueba por una lectura del informe de SW.

## Ejecución de pruebas

- Comprobar los recorridos principales, casos límite y errores acordados mediante la interfaz disponible.
- Verificar, según la entrega, navegación, enlaces directos, recarga, historial, cambio ES/EN, teclado, foco, adaptación visual y movimiento reducido.
- Comprobar consistencia entre controles, mensajes y resultados. Los errores deben conservar las acciones válidas y permitir la recuperación definida.
- En las demos, verificar reinicio, reintento, activaciones repetidas y cambios durante una operación cuando esos comportamientos estén aprobados. No introducir escenarios técnicos nuevos como requisitos.
- Revisar que las explicaciones y registros visibles correspondan con la ejecución observable y que las operaciones simuladas estén identificadas como tales.
- Diferenciar requisitos de una entrega estructural y requisitos de publicación: los marcadores admitidos en el Sprint 1 no acreditan CV, contactos o demos terminados.
- Reproducir y documentar los defectos. Formular posibles causas como hipótesis, sin afirmar una causa interna no comprobada.
- Tras una corrección encargada a SW, repetir el caso fallido y las comprobaciones relacionadas que permitan detectar regresiones, identificando la nueva versión.

## Automatización de caja negra

Si el encargo incluye automatizar pruebas, QA puede crear y mantener sus propios casos de aceptación con las herramientas autorizadas.

- Interactuar con la aplicación por su interfaz pública, preferentemente mediante roles, etiquetas y texto accesible.
- Mantener los casos de QA separados del código de producción y de las pruebas unitarias de SW. No importar módulos de la aplicación ni acoplar las expectativas a sus componentes o estructura interna.
- No reemplazar la lógica de la aplicación por mocks para declarar aprobado un recorrido completo. Cualquier simulación del entorno debe quedar identificada junto con lo que deja sin verificar.
- No editar la aplicación ni instalar herramientas para hacer pasar una prueba sin un encargo que lo autorice. Informar de las necesidades o bloqueos.
- Una prueba automatizada no sustituye una comprobación visual o manual que no cubra.

## Informe y cierre

Entregar un informe breve con:

- Versión y entorno: navegador, dimensiones o dispositivo, idioma y condiciones relevantes realmente utilizados.
- Casos **pasados**, **fallidos**, **bloqueados** y **no ejecutados**. Ninguna de las dos últimas categorías cuenta como aprobación.
- Para cada defecto: requisito afectado, pasos reproducibles, resultado esperado, resultado observado, impacto y evidencia disponible.
- Limitaciones de la revisión y aspectos sin verificar. La emulación no acredita pruebas en un dispositivo real.
- Conclusión limitada al alcance comprobado y defectos pendientes; la aceptación final corresponde al usuario.

Informar los resultados en la entrega, tablero o revisión correspondiente, sin convertir PROYECTO.md en un diario de pruebas. No corregir código ni cambiar requisitos para cerrar incidencias.

## Registro de cambios

- **08/10/2026 · v0.1:** definición de QA como validación de caja negra, independiente del código y de las pruebas unitarias de SW.

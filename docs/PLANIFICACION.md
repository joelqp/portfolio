# Planificación del portfolio

Versión 0.2 · 8 de octubre de 2026

Este documento organiza la construcción del producto definido en [PROYECTO.md](PROYECTO.md). El detalle funcional y técnico se mantiene en [ESPECIFICACION.md](ESPECIFICACION.md). Las entregas no modifican por sí mismas el alcance final ni convierten propuestas técnicas en decisiones aprobadas.

## Forma de entrega

Cada sprint termina con una versión ejecutable y revisable. La configuración, los componentes y las pruebas se integran en el entregable al que sirven; no hay un sprint de fundación independiente.

La definición se completa por sprint: antes de cada entrega se concretan únicamente los comportamientos, datos, errores, aceptación y decisiones que condicionen ese trabajo. No se exige cerrar toda la especificación antes de empezar a programar. Las propuestas de entregas posteriores permanecen pendientes sin bloquear las anteriores. La estructura parte del prototipo elegido y usa recursos provisionales; los colores, tipografías e imágenes definitivos se incorporarán después.

Los escenarios simplificados de AIA y ALTIA están aprobados. La estimación se ajustará por entrega y con el primer incremento ejecutable, sin bloquear el arranque por detalles de demos futuras. El tablero mantiene tareas, responsables cuando proceda y progreso; este documento describe las entregas.

## Entregables

| Sprint | Estado del alcance | Entregable | Condición de cierre |
| --- | --- | --- | --- |
| 1 — Estructura completa | Alcance y base técnica aprobados; listo para implementar en el repositorio | Inicio, Perfil profesional, Cómo lo construí y Contacto en ES/EN, con todas sus secciones, espacios para las tres demos, navegación, adaptación a móvil/escritorio y base técnica integrada. | Versión ejecutable; todas las páginas y secciones alcanzables, también mediante teclado; textos iniciales y recursos pendientes identificados. |
| 2 — CaixaBank interactiva | Orden y flujo acordados; detalle pendiente | Consulta bancaria ficticia con escenarios, recuperación y detalle técnico opcional. | Completar el flujo acordado y explorar ausencia de información, fallo parcial y fallo total. Contratos, datos y reglas concretas siguen como propuesta técnica. |
| 3 — ALTIA interactiva | Orden y escenario acordados; detalle pendiente | Migración ficticia con progreso, incidencia, corrección, reintento y explicación técnica. | Iniciar, detectar la incidencia, corregir, completar y reiniciar conforme al comportamiento acordado. |
| 4 — AIA interactiva | Orden y escenario acordados; detalle pendiente | Red ficticia, puntos de procesamiento, entregas de materiales, cálculo, reproducción y comparación de métodos. | Modificar paradas, calcular, comparar y explorar el recorrido. Concretar los datos y la implementación de los métodos acordados; evaluar si requiere más de un incremento. |
| 5 — Publicación completa | Orden acordado; cierre por concretar | Portfolio publicado con contenido definitivo, recursos reales y verificación conjunta. | Web utilizable en su dirección final; tres demos completas, Cómo lo construí fiel a la implementación, CV/contacto válidos y requisitos del producto comprobados. |

Orden aceptado: estructura → CaixaBank → ALTIA → AIA → publicación. Las experiencias siguen el orden cronológico inverso, de la más reciente a la más antigua. Quedan pendientes el detalle de aceptación y la estimación de los bloques; no son cinco semanas ni duraciones comprometidas. La publicación incluye español e inglés y repositorio/documentación seleccionada públicos.

## Sprint 1: límites de aceptación

- Están presentes las cuatro páginas en ES/EN y todas sus secciones, incluida Cómo lo construí y los espacios de AIA, ALTIA y CaixaBank. El selector de idioma conserva la página equivalente.
- Los textos pueden ser simples o provisionales. No se inventan datos profesionales ni se presentan funciones futuras como realizadas.
- Las interacciones y el detalle técnico de ejecución de las demos se incorporan en sus entregas correspondientes.
- Existen espacios de acceso al CV y contacto. Si faltan el PDF o los destinos reales, se indica su ausencia sin enlaces rotos ni controles que aparenten funcionar.
- El cierre comprueba la versión ejecutable, estructura, navegación mediante teclado, adaptación a móvil/escritorio y controles de calidad pertinentes.
- Este sprint no exige publicación ni demos ejecutables. Su cierre no equivale a completar los requisitos de CV, contacto, contenido o interacciones del producto final.
- La base aprobada es React + TypeScript estricto + Vite, React Router con HTML generado al compilar y CSS Modules. Las herramientas adicionales y los umbrales que siguen como propuesta no quedan aprobados por formar parte de esta entrega.

## Sprint 1: encargo de implementación

1. Leer AGENTS.md, PROYECTO.md, esta planificación y la base aprobada de ESPECIFICACION.md. Inspeccionar el repositorio, sus instrucciones, configuración y cambios existentes antes de editar. Configurar o adaptar la base aprobada conservando el trabajo previo.
2. Implementar Inicio, Perfil profesional, Cómo lo construí y Contacto, con navegación y textos iniciales en ES/EN. Usar el prototipo `portfolio-prototipo-base.html` como referencia estructural. Incorporar solo datos profesionales disponibles; marcar el contenido pendiente.
3. Construir el recorrido CaixaBank → ALTIA → AIA → formación. Preparar caminos y nodos sustituibles por experiencia: banca/tarjeta, archivos/documento y carretera/vehículo. Usar marcadores gráficos provisionales y adaptar el recorrido a escritorio y móvil según la referencia.
4. Incluir espacios identificados para las tres demos, el CV y los contactos pendientes. No implementar todavía los flujos de las demos ni añadir backend, servicios externos o publicación.
5. Comprobar navegación entre páginas, cambio de idioma, enlaces directos, recarga, historial y teclado. Compilar y comprobar que el HTML generado contiene el contenido informativo. Revisar la interfaz renderizada en móvil y escritorio cuando el entorno lo permita; identificar expresamente lo no verificado.
6. Dejar en README los comandos reales para instalar, ejecutar y compilar. Entregar la versión ejecutable con un resumen breve de cambios, verificaciones y pendientes concretos. No abrir otra ronda general de definición antes de esta entrega.

## Revisión de cada entrega

Antes de comenzar, revisar el alcance y los criterios de aceptación aplicables. Si una demo resulta demasiado grande, dividirla en incrementos utilizables antes de comprometer su entrega.

Cada incremento conserva el comportamiento anterior. La adaptación de la interfaz, teclado, errores y pruebas pertinentes se verifican al incorporar cada funcionalidad; la última entrega comprueba la integración y publicación.

Las tareas y resultados de verificación se mantienen en el tablero o en las revisiones de código. Los textos y recursos pendientes deben completarse antes de aceptar el producto final.

## Preparación de los siguientes sprints

- Al terminar la estructura, revisar únicamente el detalle pendiente de CaixaBank para comenzar el Sprint 2; después, aplicar el mismo criterio a ALTIA y AIA.
- Presentar las decisiones relevantes todavía abiertas con su justificación y revisar los datos, errores, recuperación y aceptación de la demo correspondiente. Las propuestas no se aprueban por defecto.
- Incorporar los recursos visuales y el contenido definitivos cuando estén disponibles; comprobar contraste y legibilidad antes de publicar.
- Elegir y verificar el alojamiento al preparar la publicación. Ni esa elección ni los algoritmos o contratos de futuras demos bloquean el Sprint 1.

## Registro de cambios

- **08/10/2026 · v0.1:** eliminación de disponibilidad, dedicación y objetivos temporales personales; referencias laborales sustituidas por descripciones funcionales de las demos.
- **08/10/2026 · v0.2:** restauradas las referencias a CaixaBank, ALTIA y AIA en las demos, los sprints y el recorrido, por indicación expresa de mostrar las empresas en la web.

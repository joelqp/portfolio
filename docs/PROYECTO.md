# Portfolio profesional interactivo

Versión 0.2 · 8 de octubre de 2026

## Propósito

Crear una web profesional que permita presentar experiencia, contribuciones y capacidades, distinguiendo la experiencia laboral de los proyectos personales.

La web ofrece dos recorridos complementarios: una lectura clara para selección y una exploración opcional de las demostraciones para perfiles técnicos. Consultar experiencia, tecnologías, CV y contacto no requiere ejecutar ninguna demo.

Este documento define el producto completo que se quiere publicar. El diseño de detalle se recoge en [ESPECIFICACION.md](ESPECIFICACION.md) y las entregas de trabajo en [PLANIFICACION.md](PLANIFICACION.md).

## Alcance

- Presentación profesional, experiencia, formación y tecnologías vinculadas a contribuciones concretas.
- CV real descargable en PDF y canales de contacto mediante enlaces.
- Tres demostraciones interactivas asociadas a AIA, ALTIA y CaixaBank Tech.
- Explicaciones técnicas opcionales de las demos y una página sobre la construcción del portfolio.
- Publicación en español e inglés, incluidos los textos de las demos y sus explicaciones.
- Uso en escritorio y móvil, con navegación y controles accesibles.
- Publicación web con alojamiento gratuito y demos ejecutadas en el navegador, sin backend propio ni API de pago obligatoria. Las condiciones del proveedor deben comprobarse antes de publicar; no se presupone gratuidad perpetua.

Quedan fuera del alcance: autenticación, operaciones financieras reales, carga de archivos del visitante, conexión a sistemas empresariales, formulario de contacto y laboratorio backend.

## Estructura y contenido

| Página | Contenido y función |
| --- | --- |
| Inicio | Presentación profesional breve y accesos al resto del portfolio. |
| Perfil profesional | Experiencia, formación y tecnologías. Cada experiencia de AIA, ALTIA y CaixaBank Tech incorpora su descripción y la demo correspondiente. |
| Cómo lo construí | Tecnologías, decisiones, proceso y herramientas realmente utilizados, con acceso al repositorio y a la documentación pública pertinente. |
| Contacto | Enlaces identificados y válidos a los canales profesionales, sin formulario propio. |

El CV dispone de un acceso visible desde la navegación principal. Las experiencias se presentan de la más reciente a la más antigua: CaixaBank Tech, ALTIA y AIA. El repositorio y una selección de documentación serán públicos. Los nombres finales de las páginas y su disposición visual se concretan en el diseño, todavía pendiente.

Los datos personales, textos profesionales, CV y destinos de contacto se mantienen como contenido separado de esta definición. La web debe describir contribuciones reales, distinguir tecnologías del empleo y de la recreación, y explicar el uso de IA únicamente en la medida en que se haya realizado. Las demos locales no se presentan como prueba de experiencia backend en producción.

## Demostraciones

Las tres demos son recreaciones personales, identificadas como tales y realizadas con datos ficticios. No reutilizan información privada, código ni interfaces internas de las empresas. Sus explicaciones técnicas son opcionales para el visitante.

### AIA — transporte y aprovechamiento de materiales

El visitante modifica paradas, calcula un recorrido y observa el desplazamiento de un camión. Puede reproducir, pausar y reiniciar, y dispone de una alternativa al arrastre para editar las paradas. Los cambios de entrada invalidan el recorrido anterior y las entradas inválidas reciben una explicación comprensible.

El problema consiste en elegir el orden de las visitas teniendo en cuenta qué materiales recibe y entrega cada punto de procesamiento. El recorrido se representa en una red de caminos ficticia y acotada. Permite seleccionar métodos que resuelvan el mismo problema y consultar sus supuestos y límites. No se promete una ruta óptima sin condiciones que lo justifiquen. La descripción profesional distingue las aportaciones laborales de los algoritmos creados para esta demo.

El escenario acordado utiliza un camión que sale de una base con dos lotes de restos, dos centros que los convierten en material reutilizable y dos fábricas que reciben un lote cada una. El objetivo es completar las entregas y volver a la base con la menor distancia total. El visitante puede cambiar las ubicaciones disponibles y comparar la siguiente parada válida más cercana con la exploración de todos los órdenes válidos. La optimalidad se limita a este escenario acotado.

### ALTIA — migración de archivos

El visitante inicia una transferencia visual de archivos ficticios a un destino representativo de Canvas y consulta su progreso. Distingue los estados pendiente, en proceso, completado y requiere revisión.

Las incidencias explicadas permiten corregir, reintentar y continuar. La interacción debe mostrar una validación y transformación de datos con más profundidad que resolver un único campo ausente. El reinicio devuelve la demo a un estado conocido. Un detalle opcional muestra la validación y transformación de datos. No se conecta a Canvas real ni se aceptan archivos del visitante.

El escenario acordado migra seis recursos ficticios. Un módulo sin destino afecta a varios archivos; asignarle destino puede revelar un conflicto de nombres. El visitante corrige las incidencias y reintenta únicamente los recursos pendientes, conservando los ya completados sin duplicarlos.

### CaixaBank Tech — consulta bancaria y escenarios

Una interfaz ficticia en un marco de móvil permite explorar «Todo funciona», «Falta información» y «Algo falla». Los escenarios son reproducibles; los fallos parciales conservan las acciones válidas y los fallos totales ofrecen recuperación o salida.

El detalle técnico opcional muestra respuestas JSON y registros coherentes con la ejecución, y explica las dependencias y transformaciones de datos. Las operaciones están identificadas como simuladas.

El flujo acordado es listado de tarjetas → detalle → movimientos, con los escenarios de información ausente, fallo parcial y fallo total. Los contratos y reglas concretos permanecen como propuesta técnica para revisión.

## Calidad esperada

- Lectura y uso cómodos en móvil y escritorio, sin desbordamiento de página ni información esencial dependiente de pasar el cursor.
- Navegación y controles utilizables mediante teclado, con foco visible y etiquetas comprensibles. Los estados no dependen únicamente del color.
- Respeto a la preferencia de movimiento reducido, manteniendo comprensibles los resultados de las demos.
- Un fallo de una demo no bloquea el contenido profesional ni la navegación.
- El contenido principal no espera a la carga de recursos pesados de las demos. El rendimiento se comprueba antes de publicar.
- Flujos utilizables en navegadores representativos de escritorio y móvil, con compatibilidad comprobada y sin atribuir pruebas no realizadas.
- Recursos con licencias compatibles y atribuciones cuando correspondan; textos y explicaciones fieles al funcionamiento real.

## Condiciones de finalización

El producto estará completo cuando las cuatro páginas tengan su contenido definitivo, el CV y los enlaces de contacto sean reales y válidos, las tres demos permitan realizar sus recorridos y recuperaciones, y las explicaciones técnicas correspondan con su ejecución.

La publicación debe ser accesible en su dirección final y cumplir los requisitos de calidad, con comprobaciones registradas fuera de este documento. Los marcadores, textos provisionales y espacios reservados para demos no satisfacen el alcance final.

Los escenarios de las tres demos están acordados. Antes de implementar deben concretarse el diseño visual y los comportamientos de detalle pendientes. Los contratos, herramientas, pruebas y tareas necesarios para implementarlos pertenecen a los documentos de detalle.

## Registro de cambios

- **08/10/2026 · v0.1:** eliminación de información y preferencias personales; nombres de demos sustituidos por descripciones funcionales.
- **08/10/2026 · v0.2:** restaurados los nombres de AIA, ALTIA y CaixaBank Tech y su asociación con las demos y el recorrido, por indicación expresa de mostrarlos en la web.

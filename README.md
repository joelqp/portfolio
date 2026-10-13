# Portfolio · 0.1.2

Las rutas `/`, `/profile`, `/build` y `/contact` comparten una barra superior horizontal y un panel de lectura. «Joel / Inicio» en una sola línea forma un único enlace a `/`, a la izquierda de Perfil profesional, Cómo lo construí y Contacto. La página activa se distingue por su estilo y `aria-current`. Solo Perfil dispone de un índice lateral en escritorio; en tablet/móvil ese índice queda fijo en el borde inferior. Las demás páginas no tienen columna lateral. Inicio muestra identidad, About, invitación y un acceso a Perfil en cuatro zonas; las otras páginas mantienen textos provisionales identificados. No hay encabezado compartido ni numeración. Perfil incluye reservas para las demos de CaixaBank Tech, ALTIA y AIA; ninguna está implementada. La estructura completa y las rutas bilingües del Sprint 1 siguen pendientes.

El marco compartido está fijo y deja 24 px de espacio exterior, reducido a 12 px hasta 40 rem, con fuente base de 16 px. El contenido se desplaza dentro del marco y queda recortado en sus límites; el documento no se desplaza. El token `--page-frame-space` controla esa separación; Header y el índice fijo de Perfil respetan el espacio correspondiente.

Base visual: verde Sacramento (`#043927`) y tonos verdes derivados, con esquinas rectas. Header y panel principal se unen sin separación ni bordes exteriores. El layout completo conserva la curvatura de hoja en las esquinas inferiores; el encabezado del panel no tiene línea divisoria. El código de la aplicación y del prototipo no incorpora efectos de sombra; componentes y navegación conservan sus bordes y estados de foco. Los estilos del prototipo no se utilizan como referencia visual.

## Organización

- `app/root.tsx`: documento HTML, estilos globales y conexión del layout a las rutas.
- `app/navigation.ts`: destinos y nombres de la navegación.
- `app/navigation/pageScroll.ts`: acceso al contenedor de scroll compartido. `usePageScrollRestoration.ts`: restauración por entrada de historial y recarga, con memoria y sessionStorage cuando está disponible.
- `app/navigation/`: detección de gestos en los límites (`PageScrollIntent` y `usePageScrollNavigation`), coordinación de destino/cancelación (`ScrollPageTransition`) y adaptación a React Router/View Transition (`useScrollPageTransition`).
- `app/components/SiteLayout/` y `Header/`: marco común y navbar, definido una sola vez.
- `app/components/PageContent/`, `ContentSection/` y `DemoPlaceholder/`: introducción provisional, secciones con anclas y reservas de demos.
- `app/components/ProfileSubnavigation/`: índice específico de las cinco subsecciones de Perfil, lateral en escritorio y fijo abajo en tablet/móvil; seguimiento de sección activa.
- `app/content/homeContent.ts`: textos de Inicio. `app/routes/HomePage.module.css`: áreas y alineaciones editables, con cuadrícula desigual 2×2 y una columna hasta 40 rem. Las proporciones y tamaños propios están en los tokens `--home-*`.
- `app/content/placeholderContent.ts`: textos de relleno y descripciones de las futuras demos, separados de la presentación.
- `app/components/Button/`, `Card/`, `Badge/`, `TextField/`, `Checkbox/` y `Switch/`: componentes básicos reutilizables, con CSS Modules propios. Card y Badge se utilizan en el contenido provisional y las reservas.
- `app/styles/motion.module.css`: efectos reutilizables: `slideIn` con `fromLeft`/`fromBottom`, `expandInPlace`, `reserveBlockSpace` y `fadeAfterExpansion`. Perfil compone apertura y fundido; las variables `--expansion-inline-start/end`, `--expansion-block-start/end` y `--reserved-block-space` definen los tamaños. Duraciones y curva están en tokens; movimiento reducido muestra directamente el resultado.
- `app/styles/pageTransition.module.css`: efecto de hojas grapadas por scroll; captura el marco fijo por nombre (`site-page`) y gira una hoja bajo Header, separado en `site-header`. El fondo raíz permanece inmóvil. El navegador gestiona tamaño y posición de las capturas. El efecto se puede sustituir sin modificar detección ni coordinación.
- `app/styles/tokens.css`: colores, tipografía, espacios y relieve compartidos. `globals.css`: reglas generales. `utilities.css`: contenedor común.
- `app/routes/`: páginas `HomePage.tsx`, `ProfilePage.tsx`, `BuildPage.tsx` y `ContactPage.tsx`; archivos y componentes de página utilizan el sufijo `Page`. Sus URLs son `/`, `/profile`, `/build` y `/contact`.

Button, Checkbox y Switch utilizan Base UI **1.9.0**. Card, Badge y TextField utilizan elementos HTML nativos. Cada página recibe el layout desde la raíz, sin repetir el navbar.

Para cambiar la paleta, editar los valores de `tokens.css`. Para cambiar un componente, editar su archivo y su CSS Module. Los componentes aceptan las propiedades de sus elementos o de Base UI; Button ofrece `primary`, `secondary` y `ghost`, y Card ofrece `raised` y `outlined`.

Las variables específicas están en los CSS Modules: ancho del índice lateral en `SiteLayout`, nodos y conexiones en `ProfileSubnavigation` y disposición horizontal en `Header`. Los tokens globales quedan agrupados por función. Header permanece arriba durante el scroll en todos los tamaños, separado del borde por `--page-frame-space`. La marca usa el tamaño de cuerpo con Inicio en tamaño pequeño, ambos en una sola línea; el padding vertical de Header y enlaces se reduce a `--space-1`, manteniendo la altura mínima de control; los tres enlaces de página aparecen a su derecha sin nodos ni conexiones. Solo el índice de Perfil mantiene cinco destinos conectados, verticales en escritorio y en cinco columnas abajo hasta 60 rem. Las etiquetas completas pueden ocupar varias líneas sin desplazamiento horizontal. `useNavigationDimensions` mide las barras con ResizeObserver para situar el índice bajo Header y reservar espacio inferior en Perfil.

## Ejecución

Node **24.21.0**. Con Node/npm y nvm disponibles:

```sh
nvm use
npm ci
npm run dev
npm run typecheck
npm run build
npm run preview
```

`dev` indica la URL local al arrancar. `preview` requiere ejecutar antes `build`; sirve `build/client` localmente.

Al llegar al final, un nuevo gesto hacia abajo avanza a la página siguiente: Inicio → Perfil → Cómo lo construí → Contacto. Al estar al principio, un nuevo gesto hacia arriba lleva al final de la página anterior. Llegar a cualquiera de esos límites durante el mismo gesto no cambia de página; Inicio no tiene anterior y Contacto no tiene siguiente. Se admiten rueda/trackpad, gesto táctil, PageDown/Flecha abajo/Espacio para avanzar y PageUp/Flecha arriba/Mayús+Espacio para retroceder. La interacción real en navegador sigue pendiente de comprobación.

En Perfil, el índice enlaza a CaixaBank Tech, ALTIA, AIA, Formación y Tecnologías. Solo existe en esta página: aparece a la izquierda bajo Header en escritorio y fijo en el borde inferior en tablet/móvil, con espacio reservado para no tapar el contenido y margen seguro del dispositivo. Las subsecciones permanecen visibles, sin desplegable por foco o hover. Las anclas descuentan la altura real del Header en todos los tamaños y enfocan el título de destino. Esta disposición sigue pendiente de revisión visual.

Al entrar en Perfil, el espacio del índice se abre desde su propia posición durante 450 ms: aumenta el ancho del contenedor lateral en escritorio y la altura de la barra inferior en tablet/móvil. En escritorio, main ocupa inicialmente todo el ancho, sin hueco a la izquierda, y se estrecha mientras el índice lo empuja hacia la derecha. El contenido interior mantiene desde el inicio el ancho final de lectura con el índice abierto, calculado respecto al layout completo, para conservar los saltos de línea durante ese desplazamiento. Ese ancho sigue adaptándose a la pantalla. En tablet/móvil, la reserva inferior crece con la barra. Después aparecen los enlaces con un fundido automático de 150 ms. No depende de hover. Se ejecuta una vez al montar el índice, también en carga directa; no se repite con scroll, anclas o cambios de tamaño. Al salir y volver a Perfil se monta de nuevo. La preferencia de movimiento reducido elimina ambas animaciones. Las anclas esperan al final de la apertura para medir la posición definitiva y el seguimiento de sección vuelve a calcularse al terminar. El efecto no utiliza portal ni comportamiento modal.

La subsección marcada sigue el scroll cuando su título alcanza el borde superior de lectura, considerando el margen de ancla. Antes de la primera sección no hay marca; al final se marca Tecnologías aunque su bloque no pueda llegar hasta ese borde. El seguimiento actualiza solo la marca, sin cambiar URL, historial o foco; los clics conservan sus anclas y el foco en el título. La marca de un clic se conserva hasta cambiar la posición de scroll, incluso en bloques cortos al final de la página. Al restaurar una posición desde el historial, la marca refleja esa posición.

Los cambios por scroll admitido utilizan un efecto de hojas grapadas en la esquina superior izquierda bajo Header. El navegador captura directamente el marco fijo mediante `view-transition-name: site-page`, a su tamaño y posición reales, mientras Header se captura por separado y el fondo permanece inmóvil. Al avanzar, la esquina inferior derecha se levanta en profundidad hacia la superior izquierda y descubre el destino; al retroceder, la anterior vuelve sobre la actual y muestra su final de lectura. El giro dura 900 ms, sin fundido. El eje se calcula con el marco completo y la altura visible bajo Header, sin reutilizar el ancho del contenido de Perfil. Se conservan los recortes superiores independientes de ambas hojas; se han eliminado las coordenadas y conversiones manuales de capturas de viewport. Ángulo y perspectiva siguen en tokens. Todas las rutas utilizan el mismo mecanismo, sin detección por navegador ni excepciones por página. Clics del menú e historial mantienen navegación directa; movimiento reducido, API no disponible o captura fallida conservan el destino sin giro. Durante la transición no se encadenan gestos y una navegación ordinaria puede cancelarla.

Al entrar en Perfil por scroll, su apertura y fundido esperan al final del cambio de página. Al retroceder a Perfil, la reserva inferior móvil adopta su altura final desde el montaje para conservar el final de lectura mientras el índice se abre; las demás entradas conservan su crecimiento habitual. El marcador de entrada de React Router solo decide esa reserva y no activa animación al volver mediante historial. La comprobación visual de capturas y geometría sigue pendiente en navegador.

Los cambios por scroll no enfocan main automáticamente, con o sin animación. Su origen se confirma mediante una clave efímera de navegación, no mediante el estado guardado del historial. Activar un enlace principal enfoca main, incluso al seleccionar de nuevo la página abierta. Las subsecciones de Perfil enfocan su título. Tab recorre enlaces y controles; los textos y títulos no añaden paradas. En las páginas provisionales sin controles dentro de main, Tab puede volver a Inicio al terminar el recorrido.

Los enlaces sin ancla muestran el comienzo del marco; Atrás/Adelante restaura la posición por clave de entrada mediante `usePageScrollRestoration`. Las posiciones se guardan en memoria y sessionStorage si está disponible, también para la recarga. La restauración considera el final de apertura del índice y se cancela al cambiar de entrada o si el visitante se desplaza antes. Los gestos conservan sus destinos al principio o final. El teclado cancela su desplazamiento nativo cuando cambia de página o debe desplazar el marco con el foco fuera de él. Con foco dentro del marco se conserva el scroll nativo. Se excluyen los controles efectivamente editables y los eventos con desplazamiento vertical cero conservan la distancia acumulada. Una ancla desconocida en Perfil vuelve al comienzo y enfoca el contenido principal; al usar el historial prevalece la posición guardada.

Las pruebas de intención de desplazamiento, dimensiones de las barras, restauración del marco y de los hooks de navegación utilizan el ejecutor integrado de Node, sin dependencias adicionales. Las pruebas de hooks usan eventos, DOM y efectos simulados, y TypeScript instalado para cargar los módulos. No verifican la restauración del contenedor en un navegador ni sustituyen la comprobación de interacción real:

```sh
node --test tests/*.test.mjs
```

## Registro de cambios

- **13/10/2026 · base 0.1.2, captura directa del marco:** transición mediante `site-page`, con dimensiones nativas y Header independiente. Eliminada la conversión manual de viewport a hoja; algoritmo común sin condiciones por navegador. ESPECIFICACION.md v0.56.

- **13/10/2026 · base 0.1.2, captura a tamaño de viewport:** recorte mediante clip-path sin reducir la caja de la imagen; giro alrededor de la esquina de la hoja dentro de la captura. ESPECIFICACION.md v0.55.

- **13/10/2026 · base 0.1.2, geometría independiente por captura:** el destino usa sus propias medidas y el giro las de la hoja en movimiento. Corregida la reutilización de recortes de origen, sin excepciones para Inicio ni esperas temporizadas. ESPECIFICACION.md v0.54.

- **13/10/2026 · base 0.1.2, marco fijo:** scroll dentro del marco, con márgenes visibles durante todo el desplazamiento. Gestos, anclas, seguimiento, historial/recarga y giro adaptados al contenedor. ESPECIFICACION.md v0.53.

- **13/10/2026 · base 0.1.2, espacio exterior:** 24 px en escritorio y 12 px hasta 40 rem; layout, navegación fija, Inicio, anclas de Perfil y giro adaptados. ESPECIFICACION.md v0.52.

- **13/10/2026 · base 0.1.2, sin sombras:** retiradas sombras y sombreados decorativos del código de aplicación y prototipo, incluidos sus tokens. Bordes, foco y giro 3D conservados. ESPECIFICACION.md v0.51.

- **13/10/2026 · base 0.1.2, sombra de navegación durante el giro:** la capa independiente de Header reutiliza `--shadow-paper`, con recorte inferior para conservar la unión con el contenido. ESPECIFICACION.md v0.50.

- **13/10/2026 · base 0.1.2, sombra durante el giro:** las capturas reutilizan `--shadow-paper` desde el inicio de la transición; el recorte de imagen conserva la sombra exterior. ESPECIFICACION.md v0.49.

- **13/10/2026 · base 0.1.2, sombra de papel más intensa:** aumentadas extensión y opacidad de la sombra exterior y reforzados laterales y esquinas inferiores. ESPECIFICACION.md v0.48.

- **13/10/2026 · base 0.1.2, giro más lento:** duración de la transición de hojas duplicada a 900 ms. ESPECIFICACION.md v0.47.

- **13/10/2026 · base 0.1.2, elevación diagonal:** esquina inferior derecha levantada en profundidad hacia la superior izquierda, con eje calculado según el tamaño visible y giro inverso al retroceder. ESPECIFICACION.md v0.46.

- **13/10/2026 · base 0.1.2, hojas en 3D:** giro sobre los ejes Z e Y con perspectiva, esquina superior izquierda fija y reverso oculto. Ángulos y perspectiva configurables en tokens. ESPECIFICACION.md v0.45.

- **13/10/2026 · base 0.1.2, giro de hojas grapadas:** sustituido el deslizamiento por giro alrededor de la esquina superior izquierda bajo Header, en ambos sentidos. Restaurado Inicio → Perfil; geometría medida y efecto aislado en CSS. ESPECIFICACION.md v0.44.

- **13/10/2026 · base 0.1.2, Inicio → Perfil sin transición:** navegación directa solo en ese sentido; regreso, demás transiciones y apertura del índice conservados. ESPECIFICACION.md v0.43.

- **13/10/2026 · base 0.1.2, relieve de hoja:** efecto aplicado al layout completo, con sombras suaves y esquinas inferiores curvadas; navegación y márgenes conservados. ESPECIFICACION.md v0.42.

- **13/10/2026 · base 0.1.2, fondo de papel:** main utiliza el blanco cálido `#FAF9F6`, centralizado en `--color-paper`. ESPECIFICACION.md v0.41.

- **13/10/2026 · base 0.1.2, About arriba:** alineado a la parte superior de su contenedor, conservando el centrado horizontal. ESPECIFICACION.md v0.40.

- **13/10/2026 · base 0.1.2, Inicio en cuatro zonas:** identidad, About, invitación y enlace grande a Perfil; composición desigual 2×2 y una columna en móvil. Posiciones configurables en CSS y contenido separado. ESPECIFICACION.md v0.39.

- **12/10/2026 · base 0.1.2, sin margen exterior fijo:** retirados los 24 px exteriores con fuente base de 16 px en todas las páginas. Ancho disponible hasta 85 rem, centrado horizontal y altura mínima de `100svh`. ESPECIFICACION.md v0.38.

- **12/10/2026 · base 0.1.2, marco más ancho:** ancho máximo compartido aumentado de 75 rem a 85 rem, conservando márgenes y navegación. ESPECIFICACION.md v0.37; valoración visual pendiente.

- **12/10/2026 · base 0.1.2, apertura de Perfil sin hueco inicial:** main comienza a ancho completo y se estrecha mientras el índice lateral lo empuja. El contenido interior conserva el ancho final de lectura y sus saltos de línea. ESPECIFICACION.md v0.36.

- **11/10/2026 · base 0.1.2, foco por origen de navegación:** los cambios iniciados por scroll dejan de enfocar main automáticamente; clics, historial, anclas y recorrido de Tab conservan su comportamiento. ESPECIFICACION.md v0.35.

- **11/10/2026 · base 0.1.2, continuidad vertical por scroll:** capturas visibles en ambos sentidos, 450 ms, Header separado, ciclo de vida/cancelación aislados y efecto CSS sustituible. Apertura de Perfil posterior y reserva inferior estable al retroceder. Sin dependencias nuevas. ESPECIFICACION.md v0.34.

- **11/10/2026 · base 0.1.2, lectura estable en Perfil:** reservada la anchura final del índice lateral desde el primer render en escritorio para evitar desplazamientos del contenido y cambios de línea durante la apertura. ESPECIFICACION.md v0.33.

- **11/10/2026 · base 0.1.2, apertura desde la posición del índice:** expansión horizontal/vertical en 450 ms y fundido automático de enlaces en 150 ms. Ajustados espacio de lectura, reserva móvil y medición final de anclas. ESPECIFICACION.md v0.32.

- **11/10/2026 · base 0.1.2, entrada más lenta:** duración compartida aumentada a 450 ms. ESPECIFICACION.md v0.31.

- **11/10/2026 · base 0.1.2, entrada animada de Perfil:** efecto deslizante reutilizable en CSS Modules, desde la izquierda o desde abajo según pantalla, 300 ms y movimiento reducido. Espacio reservado y navegación existentes conservados. ESPECIFICACION.md v0.30.

- **11/10/2026 · base 0.1.2, barra superior más delgada:** «Joel / Inicio» en una línea, nombre en tamaño de cuerpo y menor padding vertical de Header y enlaces. ESPECIFICACION.md v0.29.

- **11/10/2026 · base 0.1.2, navegación común superior e índice exclusivo de Perfil:** Header horizontal con Joel/Inicio y las páginas; índice lateral solo en Perfil, fijo abajo en tablet/móvil. Alturas medidas para reservar contenido y compensar anclas en todos los tamaños. ESPECIFICACION.md v0.28.

- **11/10/2026 · base 0.1.2, Inicio separado de las secciones:** «Joel» e «Inicio» forman un único enlace encima de las tres secciones conectadas, con estado activo y foco existentes; se conserva el orden de las cuatro páginas para los gestos. ESPECIFICACION.md v0.27.
- **10/10/2026 · base 0.1.2, seguimiento de subsecciones:** la marca de Perfil sigue la posición de lectura durante el scroll, conservando el estilo existente, anclas de los clics, historial y foco. ESPECIFICACION.md v0.26.
- **10/10/2026 · base 0.1.2, foco al reactivar una página:** la navegación principal enfoca main también sin cambio de pathname, conservando el foco de las subsecciones en sus títulos. ESPECIFICACION.md v0.25.
- **10/10/2026 · base 0.1.2, correcciones de navegación:** restauración para enlaces e historial, teclado sin desplazamiento nativo al cambiar de página, exclusión de edición efectiva, recuperación de anclas desconocidas y conservación de gestos ante desplazamiento vertical cero. ESPECIFICACION.md v0.24.
- **10/10/2026 · base 0.1.2, retirada de la transición visual:** restaurada la navegación directa por scroll en ambos sentidos; retirados la animación y su bloqueo. ESPECIFICACION.md v0.23.
- **10/10/2026 · base 0.1.2, continuidad visual entre páginas:** transición vertical en ambos sentidos para navegación por scroll, con rutas independientes y movimiento reducido. ESPECIFICACION.md v0.22.
- **10/10/2026 · base 0.1.2, retroceso por scroll:** gesto adicional hacia arriba al principio para volver al final de la página anterior; doce pruebas de intención. ESPECIFICACION.md v0.21.
- **10/10/2026 · base 0.1.2, subsecciones solo en escritorio:** eliminado el desplegable móvil y sus estilos; conservada la sublista en la navegación vertical. ESPECIFICACION.md v0.20.
- **10/10/2026 · base 0.1.2, sublista de Perfil en prueba:** enlaces anclados a las cinco secciones, lista visible en escritorio y desplegable en tablet/móvil, con ajuste de foco y posición. ESPECIFICACION.md v0.19.
- **10/10/2026 · base 0.1.2, avance por scroll:** gesto adicional al final para avanzar entre páginas; lógica aislada y pruebas con Node. ESPECIFICACION.md v0.18.
- **10/10/2026 · base 0.1.2, panel sin encabezado:** eliminado pageHeader, su título, números y estilos exclusivos. ESPECIFICACION.md v0.17.
- **10/10/2026 · base 0.1.2, enlaces simplificados:** eliminados los números y «Estás aquí» del Header; se conserva el indicador de página activa. ESPECIFICACION.md v0.16.
- **10/10/2026 · base 0.1.2, navegación sin enlace duplicado:** eliminado el enlace Portfolio y sus estilos; Inicio conserva el acceso a la portada. ESPECIFICACION.md v0.15.
- **10/10/2026 · base 0.1.2, navegación vertical persistente:** marca y navegación sticky dentro del Header vertical; su fondo conserva la altura completa del panel. ESPECIFICACION.md v0.14.
- **10/10/2026 · base 0.1.2, navegación persistente:** Header horizontal sticky, visible en el borde superior durante el scroll en tablet/móvil. ESPECIFICACION.md v0.13.
- **10/10/2026 · base 0.1.2, nombres de páginas:** archivos y componentes renombrados a HomePage, ProfilePage, BuildPage y ContactPage, con referencias actualizadas en app/routes.ts. ESPECIFICACION.md v0.12.
- **10/10/2026 · base 0.1.2, marco sin líneas:** retirados el borde exterior de main, la línea bajo el título y las sombras del marco compartido. ESPECIFICACION.md v0.11.
- **10/10/2026 · base 0.1.2, esquinas rectas:** radios compartidos a cero, Checkbox conectado al radio común y eliminada la separación entre Header y main. ESPECIFICACION.md v0.10.
- **10/10/2026 · base 0.1.2, contenido provisional:** texto de relleno en las cuatro páginas y tres reservas de demos en Perfil; PageContent, ContentSection y DemoPlaceholder, reutilizando Card y Badge. ESPECIFICACION.md v0.9.
- **10/10/2026 · base 0.1.2, fila móvil continua:** cuatro destinos en una sola fila, texto completo adaptable y espacios reducidos en móvil; ESPECIFICACION.md v0.8. Revisión visual pendiente.
- **10/10/2026 · base 0.1.2, revisión de navegación:** separación de variables locales y comunes, header extendido en escritorio y texto de navegación adaptable; ESPECIFICACION.md v0.7. Fila móvil continua pendiente.
- **10/10/2026 · base 0.1.2, revisión de layout:** mapa de destinos conectados y panel de lectura compartidos, con navegación lateral en escritorio y superior en móvil; decisión registrada en ESPECIFICACION.md v0.6.
- **09/10/2026 · 0.1.2:** retirados los dos experimentos; layout y navbar compartidos en las cuatro rutas, estilo de relieve con verde Sacramento y componentes básicos reutilizables. Documentada la prioridad de legibilidad y mantenimiento.
- **09/10/2026 · 0.1.1:** muestra experimental de 16 estilos de botón Base UI con estados de interacción, foco y deshabilitado.
- **09/10/2026 · 0.1.1:** prueba mínima de Base UI en Inicio mediante un botón que cambia el saludo.
- **09/10/2026 · 0.1.1:** incorporado Base UI 1.9.0 y sus dependencias al lockfile; elección registrada en ESPECIFICACION.md v0.3.
- **09/10/2026 · 0.1.1:** retirada de la implementación anterior; cuatro rutas en inglés, solo Inicio con «Hello world» y README reducido. Dependencias conservadas.
- **08/10/2026 · 0.1.1:** actualización de React Router y Vite para corregir los avisos de seguridad detectados; incorporación de las dependencias de la entrada predeterminada y de instrucciones de instalación con nvm y lockfile.
- **08/10/2026 · 0.1.0:** estructura de Sprint 1 en ES/EN, navegación y espacios provisionales; implementación inicial pendiente de comprobación técnica completa.

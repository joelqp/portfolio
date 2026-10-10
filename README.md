# Portfolio · 0.1.2

Las rutas `/`, `/profile`, `/build` y `/contact` comparten un mapa de navegación y un panel de lectura. Los destinos conectados aparecen a la izquierda en escritorio y encima del panel en móvil, con nodo y nombre; la página activa se distingue por su estilo y `aria-current`. El panel muestra directamente los textos de relleno identificados como provisionales, sin encabezado compartido ni numeración. Perfil incluye reservas para las demos de CaixaBank Tech, ALTIA y AIA; ninguna está implementada. La estructura completa y las rutas bilingües del Sprint 1 siguen pendientes.

Base visual: verde Sacramento (`#043927`) y tonos verdes derivados, con esquinas rectas. Header y panel principal se unen sin separación, bordes exteriores ni sombras; el encabezado del panel no tiene línea divisoria. Los componentes conservan sus estilos de relieve. Los estilos del prototipo no se utilizan como referencia visual.

## Organización

- `app/root.tsx`: documento HTML, estilos globales y conexión del layout a las rutas.
- `app/navigation.ts`: destinos y nombres de la navegación.
- `app/navigation/`: detección de un nuevo gesto al final de la página y avance al siguiente destino; regla independiente e integración con React Router.
- `app/components/SiteLayout/` y `Header/`: marco común y navbar, definido una sola vez.
- `app/components/PageContent/`, `ContentSection/` y `DemoPlaceholder/`: introducción provisional, secciones con anclas y reservas de demos.
- `app/components/ProfileSubnavigation/`: enlaces a las cinco secciones de Perfil, visibles bajo su destino únicamente en escritorio.
- `app/content/placeholderContent.ts`: textos de relleno y descripciones de las futuras demos, separados de la presentación.
- `app/components/Button/`, `Card/`, `Badge/`, `TextField/`, `Checkbox/` y `Switch/`: componentes básicos reutilizables, con CSS Modules propios. Card y Badge se utilizan en el contenido provisional y las reservas.
- `app/styles/tokens.css`: colores, tipografía, espacios y relieve compartidos. `globals.css`: reglas generales. `utilities.css`: contenedor común.
- `app/routes/`: páginas `HomePage.tsx`, `ProfilePage.tsx`, `BuildPage.tsx` y `ContactPage.tsx`; archivos y componentes de página utilizan el sufijo `Page`. Sus URLs son `/`, `/profile`, `/build` y `/contact`.

Button, Checkbox y Switch utilizan Base UI **1.9.0**. Card, Badge y TextField utilizan elementos HTML nativos. Cada página recibe el layout desde la raíz, sin repetir el navbar.

Para cambiar la paleta, editar los valores de `tokens.css`. Para cambiar un componente, editar su archivo y su CSS Module. Los componentes aceptan las propiedades de sus elementos o de Base UI; Button ofrece `primary`, `secondary` y `ghost`, y Card ofrece `raised` y `outlined`.

Las variables específicas están en sus CSS Modules: ancho de navegación en `SiteLayout`, tamaño de nodos, espacios y texto de navegación en `Header`. Los tokens globales quedan agrupados por función. El header ocupa toda la altura del panel en escritorio; las etiquetas de navegación pasan de 1 rem a 0,875 rem en móvil. En tablet/móvil, los cuatro destinos permanecen en una sola fila horizontal conectada; los nombres completos se reparten en varias líneas debajo de cada nodo, sin desplazamiento horizontal.

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

En Perfil, la sublista enlaza a CaixaBank Tech, ALTIA, AIA, Formación y Tecnologías. Está visible bajo Perfil profesional solo en escritorio; en tablet/móvil no se muestra sublista ni desplegable. Las secciones siguen presentes en la página y mantienen sus anclas. Esta disposición sigue pendiente de revisión visual.

La subsección marcada sigue el scroll cuando su título alcanza el borde superior de lectura, considerando el margen de ancla. Antes de la primera sección no hay marca; al final se marca Tecnologías aunque su bloque no pueda llegar hasta ese borde. El seguimiento actualiza solo la marca, sin cambiar URL, historial o foco; los clics conservan sus anclas y el foco en el título. La marca de un clic se conserva hasta cambiar la posición de scroll, incluso en bloques cortos al final de la página. Al restaurar una posición desde el historial, la marca refleja esa posición.

Los cambios por scroll son directos, sin transición visual entre páginas. Las rutas y componentes siguen independientes.

Activar un enlace principal enfoca main, incluso al seleccionar de nuevo la página abierta. Las subsecciones de Perfil enfocan su título. Tab recorre enlaces y controles; los textos y títulos no añaden paradas. En las páginas provisionales sin controles dentro de main, Tab puede volver a Inicio al terminar el recorrido.

Los enlaces sin ancla muestran el comienzo de la página; Atrás/Adelante restaura la posición guardada mediante `ScrollRestoration` de React Router. Los gestos conservan sus destinos al principio o final. El teclado cancela su desplazamiento nativo únicamente cuando cambia de página. Se excluyen los controles efectivamente editables y los eventos con desplazamiento vertical cero conservan la distancia acumulada. Una ancla desconocida en Perfil vuelve al comienzo y enfoca el contenido principal; al usar el historial prevalece la posición guardada.

Las pruebas de intención de desplazamiento y de los hooks de navegación utilizan el ejecutor integrado de Node, sin dependencias adicionales. Las pruebas de hooks usan eventos, DOM y efectos simulados, y TypeScript instalado para cargar los módulos. No verifican la restauración de React Router en un navegador ni sustituyen la comprobación de interacción real:

```sh
node --test tests/*.test.mjs
```

## Registro de cambios

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

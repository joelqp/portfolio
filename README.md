# Portfolio · 0.1.2

Las rutas `/`, `/profile`, `/build` y `/contact` comparten un layout y un navbar. Su contenido está vacío; las dos pantallas experimentales y sus CSS se han retirado. La estructura completa y las rutas bilingües del Sprint 1 siguen pendientes.

Base visual: relieve con verde Sacramento (`#043927`) y tonos verdes derivados. Los estilos del prototipo no se utilizan como referencia visual.

## Organización

- `app/root.tsx`: documento HTML, estilos globales y conexión del layout a las rutas.
- `app/components/SiteLayout/` y `Header/`: marco común y navbar, definido una sola vez.
- `app/components/Button/`, `Card/`, `Badge/`, `TextField/`, `Checkbox/` y `Switch/`: componentes básicos preparados para reutilizar, con CSS Modules propios. Todavía no se muestran en las páginas vacías.
- `app/styles/tokens.css`: colores, tipografía, espacios y relieve compartidos. `globals.css`: reglas generales. `utilities.css`: contenedor común.
- `app/routes/`: contenido de Inicio, Perfil profesional, Cómo lo construí y Contacto.

Button, Checkbox y Switch utilizan Base UI **1.9.0**. Card, Badge y TextField utilizan elementos HTML nativos. Cada página recibe el layout desde la raíz, sin repetir el navbar.

Para cambiar la paleta, editar los valores de `tokens.css`. Para cambiar un componente, editar su archivo y su CSS Module. Los componentes aceptan las propiedades de sus elementos o de Base UI; Button ofrece `primary`, `secondary` y `ghost`, y Card ofrece `raised` y `outlined`.

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

## Registro de cambios

- **09/10/2026 · 0.1.2:** retirados los dos experimentos; layout y navbar compartidos en las cuatro rutas, estilo de relieve con verde Sacramento y componentes básicos reutilizables. Documentada la prioridad de legibilidad y mantenimiento.
- **09/10/2026 · 0.1.1:** muestra experimental de 16 estilos de botón Base UI con estados de interacción, foco y deshabilitado.
- **09/10/2026 · 0.1.1:** prueba mínima de Base UI en Inicio mediante un botón que cambia el saludo.
- **09/10/2026 · 0.1.1:** incorporado Base UI 1.9.0 y sus dependencias al lockfile; elección registrada en ESPECIFICACION.md v0.3.
- **09/10/2026 · 0.1.1:** retirada de la implementación anterior; cuatro rutas en inglés, solo Inicio con «Hello world» y README reducido. Dependencias conservadas.
- **08/10/2026 · 0.1.1:** actualización de React Router y Vite para corregir los avisos de seguridad detectados; incorporación de las dependencias de la entrada predeterminada y de instrucciones de instalación con nvm y lockfile.
- **08/10/2026 · 0.1.0:** estructura de Sprint 1 en ES/EN, navegación y espacios provisionales; implementación inicial pendiente de comprobación técnica completa.

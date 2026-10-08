# Portfolio · 0.1.1

Base mínima: `/` muestra «Hello world». `/profile`, `/build` y `/contact` están vacías. Sin estilos ni contenido del boceto.

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

- **09/10/2026 · 0.1.1:** retirada de la implementación anterior; cuatro rutas en inglés, solo Inicio con «Hello world» y README reducido. Dependencias conservadas.
- **08/10/2026 · 0.1.1:** actualización de React Router y Vite para corregir los avisos de seguridad detectados; incorporación de las dependencias de la entrada predeterminada y de instrucciones de instalación con nvm y lockfile.
- **08/10/2026 · 0.1.0:** estructura de Sprint 1 en ES/EN, navegación y espacios provisionales; implementación inicial pendiente de comprobación técnica completa.

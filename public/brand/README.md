# Assets de marca

Rutas canónicas (Master Prompt v2 §9). El componente `<Logo>` detecta estos archivos automáticamente
y prefiere el SVG cuando existe; mientras tanto sirve el PNG. Reemplazar PNG → SVG es cambiar
archivos, no código ni layout: el tamaño lo fija la altura en CSS.

- `isotipo.svg` / `isotipo.png` — la ficha con la "n" (header, footer, favicon derivado)
- `wordmark.svg` / `wordmark.png` — «novúm INTEGRAL» sin eslogan (header, junto al isotipo)
- `logo.svg` / `logo.png` — imagotipo horizontal completo; si existe, sustituye al par isotipo + wordmark
- `logo-dark.svg` — imagotipo para fondo morado oscuro (aún no existe: sobre oscuro se usa el marcador tipográfico)
- `_ref/` — referencias rasterizadas del logo provisional (no se sirven en el sitio)

Los PNG actuales son recortes sin reinterpretar del logo provisional (transparentes, alta resolución):
`isotipo.png` 939×904 y `wordmark.png` 1119×343. No recrear el logo en código.

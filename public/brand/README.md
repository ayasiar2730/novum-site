# Marca — Brand Master operativo v1

`<Logo>` (src/components/Logo.tsx) es el único punto de entrada de la marca. Detecta los archivos
de esta carpeta y prefiere siempre el **SVG definitivo**; mientras una pieza no exista usa el
**PNG provisional**. Cambiar de uno a otro es cambiar archivos, no código ni layout.

## Qué archivo usar

| Uso | Archivo | Fallback |
|---|---|---|
| Fondo claro (header, 404) | `logo.svg` — imagotipo horizontal completo | `isotipo.png` + `wordmark.png` compuestos en layout |
| Fondo morado oscuro (`purple-900`) | `logo-dark.svg` — wordmark en blanco | marcador tipográfico (`novum` / `INTEGRAL`) |
| Isotipo solo (footer, derivados) | `isotipo.svg` — la ficha con la «n» | `isotipo.png` |
| Wordmark solo | `wordmark.svg` — «novúm INTEGRAL», sin eslogan | `wordmark.png` |

Derivados (se generan **solo desde `isotipo.svg`**, nunca desde otro símbolo):
`src/app/icon.svg`, `src/app/favicon.ico` (16/32/48), `src/app/apple-icon.png` (180, fondo `neutral-50`),
`public/icon-192.png` y `public/icon-512.png` (los declara `src/app/manifest.ts` solo si existen).
La imagen Open Graph (`src/app/opengraph-image.tsx`) usa `logo-dark.svg`; el JSON-LD declara
`Organization.logo` = `https://novumintegral.com/brand/logo.svg` solo cuando ese archivo existe.

## Reglas de no deformación

- El tamaño lo fija la **altura** en CSS (header: 36 px en móvil, 40 px desde `lg`; footer: 40 px);
  el ancho es automático y sigue el `viewBox`. Nunca fijar ancho y alto a la vez.
- No estirar, no recortar, no añadir fondo, no recolorear, no recrear el logo en código.
- Los SVG deben llevar `viewBox`, sin `width`/`height` fijos, sin `<image>` raster ni texto que dependa
  de fuentes, con fondo transparente y el mismo margen en los cuatro lados del isotipo.
- Sobre fondos oscuros solo `logo-dark.svg`; sobre claros `logo.svg`. Verde reservado a la marca y a DECISIÓN.

`_ref/` guarda referencias rasterizadas del logo provisional; no se sirven en el sitio.

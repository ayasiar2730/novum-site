# Marca — Brand Master operativo v1 (PNG)

Decisión (16 sep 2026): el master operativo es el **PNG aprobado**. Los SVG autotrazados
que se probaron son siluetas negras sin color y **no sirven**; no hay vector con color real.
`<Logo>` (src/components/Logo.tsx) sigue prefiriendo un SVG si algún día existe uno legítimo
(`logo.svg`, `logo-dark.svg`, `isotipo.svg`, `wordmark.svg`): basta con dejarlo en esta carpeta.

## Qué archivo usar

| Uso | Archivo | Notas |
|---|---|---|
| Fondo claro (header, 404) | `logo.png` — imagotipo horizontal 1429×400 | isotipo + «novúm INTEGRAL» yuxtapuestos con las proporciones del header (40 : 28, separación 10); sin eslogan |
| Isotipo solo (footer, iconos) | `isotipo.png` 939×904 | conserva la sombra suave del original |
| Wordmark solo | `wordmark.png` 1119×343 | «novúm INTEGRAL», sin eslogan |
| Fondo morado oscuro | *(no existe)* | no hay wordmark blanco; sobre oscuro `<Logo variant="dark">` cae al marcador tipográfico. El CTA final no lleva logo |

Derivados, generados **solo desde `isotipo.png`** (nunca desde otro símbolo):
`src/app/favicon.ico` (16/32/48), `src/app/icon.png` (256), `src/app/apple-icon.png` (180, fondo `neutral-50`
porque iOS no admite transparencia), `public/icon-192.png` y `public/icon-512.png` (los declara
`src/app/manifest.ts`). La imagen Open Graph (`src/app/opengraph-image.tsx`) usa `logo.png` sobre `neutral-50`
con banda `purple-900`; el JSON-LD declara `Organization.logo` = `https://novumintegral.com/brand/logo.png`.

## Reglas de no deformación

- El tamaño lo fija la **altura** en CSS (header: 36 px en móvil, 40 px desde `lg`; footer: 40 px);
  el ancho es automático y sigue la proporción del archivo. Nunca fijar ancho y alto a la vez.
- No estirar, no recortar, no añadir fondo, no recolorear, no invertir por CSS, no recrear el logo en código.
- Next sirve variantes optimizadas de los PNG (`next/image`); no sustituir por copias reducidas a mano.
- Verde reservado a la marca y a DECISIÓN.

`_ref/` guarda las referencias rasterizadas originales; no se sirven en el sitio.

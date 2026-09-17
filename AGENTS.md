# Reglas del proyecto para agentes

Antes de tocar código, lee `docs/NOVUM-WEB-MASTER-PROMPT-v2.md` (jerarquía de autoridad y prohibiciones), `docs/novum-design-system-v1.md` (tokens y reglas visuales) y `docs/novum-web-fase0.md` (contenido). En caso de contradicción prevalece el de mayor jerarquía; una contradicción relevante se señala, no se resuelve en silencio.

- El contenido visible vive en `src/content/site.ts`; los tokens en `src/app/globals.css`. No hardcodear textos ni colores en componentes.
- Sitio público e indexable: nunca `noindex`; nunca copiar configuración de la aplicación `app.novumintegral.com`.
- Los perfiles del equipo se controlan con `NEXT_PUBLIC_SHOW_TEAM`; la declaración institucional de `#nosotros` es siempre pública.
- No recrear el logo en código: `<Logo>` lee `public/brand/` (SVG > PNG; hoy el master es PNG). El JSON-LD declara `Organization.logo` solo si existe `logo.svg` o `logo.png`; favicon, iconos y OG se derivan únicamente del isotipo (ver `public/brand/README.md`).
- Al publicar un cambio de contenido, actualizar `site.contentUpdatedAt` (alimenta `lastModified` del sitemap; nunca `new Date()`).
- Los estados internos de producto (en desarrollo, en diseño, en pruebas, roadmap) y los perfiles individuales del equipo **no se muestran en la web pública**. `StatusTag` y los perfiles se conservan en código para preview o usos futuros con razón de producto.
- No agregar dependencias sin justificarlo. Sin librerías de animación: el motion es CSS. Sin librerías de gráficas: las visualizaciones de `#inteligencia` son SVG + CSS.
- **Ninguna cifra sectorial se publica sin un snapshot aprobado y trazable.** `src/lib/sector/source.ts` es solo servidor (lee `src/data/sector/snapshot.json`; sin archivo válido → `null` → versión editorial). La fixture `src/lib/sector/fixture.dev.ts` es DEV ONLY (`SECTOR_FIXTURE=true`, nunca `NEXT_PUBLIC_*`, nunca en Vercel); no usar cifras reales ni parecidas a las reales en ella. La UI nunca deriva conclusiones: el `insight` llega escrito en el snapshot.
- Validar antes de reportar: `npm run lint`, `npm run typecheck`, `npm run build`, y la página renderizada en los breakpoints 320 · 390 · 768 · 1024 · 1280 · 1440 · 1920.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

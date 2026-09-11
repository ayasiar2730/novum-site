# Reglas del proyecto para agentes

Antes de tocar código, lee `docs/NOVUM-WEB-MASTER-PROMPT-v2.md` (jerarquía de autoridad y prohibiciones), `docs/novum-design-system-v1.md` (tokens y reglas visuales) y `docs/novum-web-fase0.md` (contenido). En caso de contradicción prevalece el de mayor jerarquía; una contradicción relevante se señala, no se resuelve en silencio.

- El contenido visible vive en `src/content/site.ts`; los tokens en `src/app/globals.css`. No hardcodear textos ni colores en componentes.
- Sitio público e indexable: nunca `noindex`; nunca copiar configuración de la aplicación `app.novumintegral.com`.
- Los perfiles del equipo se controlan con `NEXT_PUBLIC_SHOW_TEAM`; la declaración institucional de `#nosotros` es siempre pública.
- No recrear el logo en código: `<Logo>` lee `public/brand/*.svg`.
- No agregar dependencias sin justificarlo. Sin librerías de animación: el motion es CSS.
- Validar antes de reportar: `npm run lint`, `npm run typecheck`, `npm run build`, y la página renderizada en los breakpoints 320 · 390 · 768 · 1024 · 1280 · 1440 · 1920.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

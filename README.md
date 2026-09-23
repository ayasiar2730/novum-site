# novum-site

Sitio corporativo de **Novum Integral SAS** — software y consultoría para el sector solidario.
Producción: `https://novumintegral.com`. Proyecto independiente de la aplicación (`app.novumintegral.com`).

## Documentos rectores (en `docs/`)

| Archivo                         | Responde a                                                     |
| ------------------------------- | -------------------------------------------------------------- |
| `NOVUM-WEB-MASTER-PROMPT-v2.md` | Cómo se ejecuta el trabajo (jerarquía, alcance, prohibiciones) |
| `novum-design-system-v1.md`     | Cómo se ve y se comporta (tokens, tipografía, hero, motion)    |
| `novum-web-fase0.md`            | Qué dice el sitio y qué es verdad sobre el negocio             |

Todo texto visible sale de `src/content/site.ts`. Todo valor visual sale de `src/app/globals.css` (`@theme`).

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · ESLint 9 · Prettier. Sitio estático, sin base de datos ni autenticación.

## Scripts

```bash
npm run dev          # desarrollo en http://localhost:3000
npm run build        # build de producción
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm run format       # Prettier
```

## Variables de entorno

| Variable                | Preview | Production | Efecto                                                                                                                                                                                                                              |
| ----------------------- | ------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SHOW_TEAM` | `true`  | `false`    | Muestra los perfiles individuales del equipo en `#nosotros`. La declaración institucional siempre es pública.                                                                                                                       |
| `SECTOR_FIXTURE`        | —       | —          | Solo desarrollo local (`SECTOR_FIXTURE=true`): carga la fixture sintética de «Inteligencia del sector» para revisar el layout. Variable privada del servidor; ignorada en producción por construcción. **No configurar en Vercel.** |
| `SECTOR_FIXTURE_MODO`   | —       | —          | Solo con la anterior: `comparacion` o `serie` cargan la fixture de dos o tres cortes para revisar los modos temporales del informe. Por defecto, un corte (fotografía).                                                             |

Copiar `.env.example` a `.env.local` para desarrollo.

### Fixture de «Inteligencia del sector» (solo desarrollo local)

`SECTOR_FIXTURE=true` carga un snapshot **sintético** v2 (`src/lib/sector/fixture.dev.ts`, «DEV ONLY · NO PUBLICAR · NO SOURCE OF TRUTH») para revisar el layout del informe con datos; `SECTOR_FIXTURE=v1` carga la fixture del contrato anterior. Un archivo `snapshot.json` con `origen: "fixture"` se rechaza en cualquier entorno. Es una variable privada del servidor: `src/lib/sector/source.ts` la ignora cuando `NODE_ENV` es `production`, así que **no debe añadirse a Vercel ni a producción**. Se pasa en la línea de comandos, no en `.env.example`:

```bash
SECTOR_FIXTURE=true npm run dev
```

```powershell
$env:SECTOR_FIXTURE = "true"; npm run dev
```

## Informe sectorial en PDF

El informe ejecutivo de un corte se genera desde el mismo `SectorSnapshot v2` que lee el sitio, sin rehacerlo a mano: `node --import ./scripts/_ts.mjs scripts/informe-sectorial.mjs --capturas` (salida en `.informes/`, ignorada por git). Requiere Chrome o Edge instalados. Arquitectura, comprobaciones y decisiones en `docs/informe-sectorial-pdf.md`.

## Assets de marca

Rutas canónicas en `public/brand/` (ver `public/brand/README.md`). El master operativo es el PNG aprobado (`logo.png`, `isotipo.png`, `wordmark.png`); `<Logo>` preferiría un SVG con color real si existiera. Favicon, iconos y OG se derivan solo del isotipo. **No recrear el logo en código.**

## Despliegue

Vercel, proyecto propio conectado a este repositorio. Dominios `novumintegral.com` y `www` con registros en Cloudflare en modo _DNS only_. La rama `main` despliega a producción; cualquier otra rama o PR genera un preview.

## Reglas que no se negocian

- Este sitio **debe ser indexable**: sin `noindex`, sin copiar el `next.config` de la aplicación.
- Una sola banda oscura (la sección de contacto). Sin gradientes de fondo. Sin tarjetas repetidas.
- Verde `--color-green-500` nunca como texto sobre fondo claro.
- No inventar clientes, cifras, certificaciones, testimonios ni URLs.
- **Ninguna cifra sectorial se publica sin un snapshot aprobado y trazable** (`src/data/sector/snapshot.json`, contrato en `src/lib/sector/types.ts`). Sin snapshot, `#inteligencia` publica su versión editorial: sin KPI, gráficas, ceros, «sin datos» ni «próximamente». Bloque 2B.1 = experiencia y contrato v1; 2B.2 = Observatorio Novum sobre el contrato v2 (`docs/sector-snapshot-v2.md`: flujo SIAR → snapshot → web, mapeo, privacidad y regla un corte = fotografía). Falta el job exportador en SIAR.
- **Sin estados internos de desarrollo en la web pública** (en desarrollo, en diseño, en pruebas, roadmap, fechas): son información de gestión, no comunicación comercial. Sin nombres ni perfiles de personas: la sección Nosotros es institucional.

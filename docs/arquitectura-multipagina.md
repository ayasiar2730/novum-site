# Arquitectura multipágina — fase 2

**23-sep-2026.** Novum publica informes sectoriales: la web es el catálogo y la puerta de entrada, y el informe
completo vive en su propia página y en un PDF ejecutivo descargable (`docs/informe-sectorial-pdf.md`). Esta fase pasa
el sitio de una sola página con anclas a un sitio con rutas propias, sin cambiar el recorrido del Home ni el diseño
aprobado de las secciones.

## Mapa del sitio

| Ruta | h1 | Contenido | Superficie |
| --- | --- | --- | --- |
| `/` | Hero | El recorrido completo, en el orden del Master Prompt v2 §4. El acto IV es la portada del último informe publicado (`InformeDestacado`). | la de cada acto |
| `/soluciones` | «Tecnología especializada para el sector solidario.» | `Products` + `Differentiators` + banda de contacto | `surface-sistema`, como el acto III |
| `/informes` | «Informes sectoriales» | Catálogo: ediciones publicadas, «Cómo se elaboran», «Su entidad en contexto» | blanco; «Cómo se elaboran» en neutral-50 |
| `/informes/sector-solidario-<AAAA-MM>` | «Informe sectorial · Corte: …» | El Observatorio completo (`Informe`) con la descarga del PDF en la portada, y «Su entidad en contexto» | blanco |
| `/acompanamiento` | «Cómo acompañamos» | `Services` + banda de contacto | blanco |
| `/nosotros` | «Experiencia que entiende el sector» | `About` + `Convergence` + banda de contacto | blanco |
| `/contacto` | la pregunta de la banda | `FinalCta` como página | banda oscura |

Las secciones del Home conservan sus `id` (`#soluciones`, `#inteligencia`, `#servicios`, `#nosotros`, `#contacto`):
los enlaces antiguos a `/#contacto` y compañía siguen llegando a su lugar.

## Piezas

- **Header y footer en el layout** (`src/app/layout.tsx`): persisten al navegar. El enlace activo sale de la ruta
  (`usePathname`; `/informes/...` activa «Informes») y la píldora morada se desliza detrás de él. Los tres estados de
  superficie del header dependen del hero, que solo existe en el Home; en las páginas internas el header entra ya en su
  estado sólido, con el CTA de demostración visible. En el Home no hay enlace activo.
- **Navegación de cliente**: `Link` en header, menú móvil (se cierra al elegir), footer, migas y `ButtonLink` para
  rutas propias (los enlaces externos y las descargas siguen siendo `<a>`). `MotionRoot` vuelve a registrar los
  `data-reveal` en cada cambio de ruta: el contenido nunca queda invisible tras navegar.
- **`nivel`** en `SectionHeading`, `Products`, `Services`, `About`, `FinalCta`, `Ecosystem`, `Red`, `Informe`,
  `Capitulo` y `Metodologia`: la sección que abre su página pasa su título a h1 y todos sus niveles internos suben uno.
  Sin saltos de h1 a h3 en ninguna página. En `nivel={1}` las secciones reducen su aire superior, porque las preceden
  las migas.
- **Migas** (`src/components/Migas.tsx`): «Inicio / …» con su `BreadcrumbList` de schema.org, en todas las páginas
  internas.
- **Metadatos** (`src/lib/metadatos.ts`): título con la plantilla del layout, descripción, canónica, Open Graph y
  Twitter por página. La imagen OG se declara explícita (`/opengraph-image`, `/twitter-image`) porque una página que
  define su propio `openGraph` pierde la imagen de archivo de la raíz. `src/lib/og.ts` comparte tamaño y texto
  alternativo con `app/opengraph-image.tsx`.
- **Sitemap** (`src/app/sitemap.ts`): todas las rutas y cada edición. `lastModified` son fechas de contenido
  (`site.contentUpdatedAt`; en cada informe, `generadoEl` de su snapshot), nunca la fecha del build.
- **404**: sin logo propio (lo pone el header), con salida al inicio y al catálogo. Next le añade `noindex`.

## Informes: de dónde sale una edición

```
src/data/sector/informes/<AAAA-MM>.json        SectorSnapshot v2 publicable (la interfaz con SIAR)
public/informes/informe-sectorial-<AAAA-MM>.pdf  PDF generado desde ese mismo archivo (--publicar)
        ↓
src/lib/sector/source.ts     cortesPublicados(), getSnapshotDeCorte(): lee y valida cada archivo (solo servidor)
src/lib/informes/catalogo.ts listarInformes(), informePorSlug(): edición = snapshot publicable + PDF si existe
        ↓
/  (InformeDestacado, el más reciente)   /informes (catálogo)   /informes/sector-solidario-<AAAA-MM> (edición)
```

Una edición entra al catálogo solo si su snapshot es v2 de origen `siar`, pasa `validarV2` (estructura +
k-anonimato), trae al menos 3 hallazgos con Lectura Novum y el corte del archivo coincide con el del snapshot. Sin
PDF, la edición se publica sin botón de descarga. `generateStaticParams` + `dynamicParams = false`: todas las
ediciones se construyen en el build y cualquier otro slug es 404. No hay nada que registrar a mano.

Sin ninguna edición publicada, el Home vuelve a la versión editorial de «Inteligencia del sector» y `/informes`
muestra solo su introducción y «Cómo se elaboran»: sin listas vacías ni «próximamente».

### Publicar una edición nueva

1. SIAR genera el snapshot publicable del corte (job `sector-snapshot` + Lectura Novum aprobada).
2. Copiarlo a `src/data/sector/informes/<AAAA-MM>.json` (el nombre es el corte: `2026-12.json`).
3. `node --import ./scripts/_ts.mjs scripts/informe-sectorial.mjs --corte <AAAA-MM> --publicar --capturas` y revisar el
   PDF y sus capturas.
4. Actualizar `site.contentUpdatedAt` si cambia algún texto institucional.
5. Un PR con el snapshot y el PDF; una persona revisa el diff (es la aprobación editorial) y hace el merge.

El Home, el catálogo, la página de la edición y el sitemap se actualizan solos en el build.

## Decisiones

- **El Home sigue siendo el recorrido completo.** Las páginas se añaden; no se reordena ni se recorta el Home
  aprobado. Solo cambia el acto IV: en vez del informe entero, su portada (título, ficha del corte, las cifras de sus
  tres primeros hallazgos tal como llegan en el snapshot, «Leer el informe» y «Descargar PDF»).
- **«Su entidad en contexto» pasa del Home a las páginas de informes**, al cierre del informe y del catálogo, donde
  el visitante ya leyó el sector.
- **Una sola página de Soluciones.** El plan de contenido prevé una por línea (Riesgos, Planeación, Presupuesto) con
  capturas reales del producto; esas capturas no existen todavía.
- **Sin blog, sin formulario, sin captura de correo.** El blog no tiene entradas; un formulario o un campo de correo
  exigen antes la política de tratamiento de datos (Ley 1581). Contacto sigue siendo demostración, WhatsApp y correo
  directos.
- **Sin numeración de edición («Informe 01»).** El corte identifica la edición y ordena el catálogo.
- **Una banda oscura por página**: la de contacto, al final de las páginas institucionales y como contenido de
  `/contacto`. Las páginas de informes cierran con «Su entidad en contexto» (CTA de demostración) en lugar de la banda.

## Contradicciones señaladas

- **Master Prompt v2 §4** describe un sitio de una página con navegación por anclas. Esta fase lo extiende a
  multipágina por instrucción directa (23-09-2026: «la web será el catálogo y la puerta de entrada»). El orden del Home
  del §4 se conserva; el Master Prompt no se editó: la decisión de actualizarlo es del equipo.
- **SIAR-AYA `docs/sector-snapshot-publico.md`** todavía indica copiar el resultado a `src/data/sector/snapshot.json`.
  La ruta nueva es `src/data/sector/informes/<AAAA-MM>.json`; hace falta un PR en SIAR que lo corrija.

## Verificación

- `npm run lint`, `npm run typecheck`, Prettier y `next build` en verde.
- Las siete rutas en 320 · 390 · 768 · 1024 · 1280 · 1440 · 1920: sin desborde horizontal, un h1 por página, sin
  saltos de nivel de título, todos los `data-reveal` visibles tras recorrer la página, sin errores de consola.
- Navegación de cliente (escritorio y menú móvil): Home → Informes → edición → migas → atrás → Nosotros → logo, sin
  recargas, con el enlace activo correcto y el índice del informe fijo a 112 px (`top-28`).
- `/informes/<slug-inexistente>` y cualquier ruta desconocida responden 404 con `noindex`; el PDF responde 200
  `application/pdf`; cada página interna trae su canónica, `og:url` e imagen OG.

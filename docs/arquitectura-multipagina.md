# Arquitectura multipágina — fase 2

**23-sep-2026.** Novum publica informes sectoriales: la web es el catálogo y la puerta de entrada, y el informe
completo vive en su propia página y en un PDF ejecutivo descargable (`docs/informe-sectorial-pdf.md`). Esta fase pasa
el sitio de una sola página con anclas a un sitio con rutas propias.

**24-sep-2026 — portafolio.** Con el «Portafolio de soluciones» (PDF corporativo) cada página tiene contenido propio y
el Home deja de repetirlo: el Home es la puerta de entrada (un resumen de cada tema con su enlace) y cada página tiene
el contenido completo. El contenido del portafolio vive en `src/content/portafolio.ts`.

## Mapa del sitio

| Ruta | h1 | Contenido | Superficie |
| --- | --- | --- | --- |
| `/` | Hero | Puerta de entrada: hero, problema, las siete líneas (una fila por línea, con enlace), Tecnología Novum (los tres productos), el último informe (`InformeDestacado`), «Cómo trabajamos» (los cinco pasos) y la banda de contacto | la de cada acto; líneas y tecnología en `surface-sistema` |
| `/soluciones` | «Siete líneas que se conectan» | Índice de las siete líneas, cada una con su promesa y lo que la entidad recibe | `surface-sistema` |
| `/soluciones/<línea>` (7) | El nombre de la línea | Promesa, capacidades y servicios, valor que recibe la entidad, tecnología de la línea (si la tiene), las otras seis; `Service` en schema.org | blanco; «Valor» en neutral-50 |
| `/tecnologia` | «Software que convierte la metodología en gestión diaria» | Ecosistema de productos (`Products`: Novum Risk, Novum Budget, Novum Strategic Planning) y el criterio (`Differentiators`) | `surface-sistema` |
| `/informes` | «Informes sectoriales» | Catálogo: ediciones publicadas, «Cómo se elaboran», «Su entidad en contexto» | blanco; «Cómo se elaboran» en neutral-50 |
| `/informes/sector-solidario-<AAAA-MM>` | «Informe sectorial · Corte: …» | El Observatorio completo (`Informe`) con la descarga del PDF en la portada, y «Su entidad en contexto» | blanco |
| `/nosotros` | «Experiencia que entiende el sector» | Declaración institucional y capacidades (`About`), propuesta de valor, a quién acompañamos, cómo trabajamos (`#metodologia`), por qué Novum | blanco; «A quién» en neutral-50 |
| `/contacto` | «Podemos acompañar una necesidad puntual o una transformación completa» | Las seis formas de vinculación y la banda de contacto | blanco + banda oscura |
| `/acompanamiento` | — | Redirección permanente (308) a `/soluciones`: sus servicios se repartieron en las líneas | — |

El Home conserva los `id` `#soluciones`, `#inteligencia` y `#contacto`; `#servicios` y `#nosotros` ya no están en el
Home (esos temas tienen su página).

## Piezas

- **Header y footer en el layout** (`src/app/layout.tsx`): persisten al navegar. El enlace activo sale de la ruta
  (`usePathname`; `/informes/...` activa «Informes») y la píldora morada se desliza detrás de él. Los tres estados de
  superficie del header dependen del hero, que solo existe en el Home; en las páginas internas el header entra ya en su
  estado sólido, con el CTA de demostración visible. En el Home no hay enlace activo.
- **Navegación de cliente**: `Link` en header, menú móvil (se cierra al elegir), footer, migas y `ButtonLink` para
  rutas propias (los enlaces externos y las descargas siguen siendo `<a>`). `MotionRoot` vuelve a registrar los
  `data-reveal` en cada cambio de ruta: el contenido nunca queda invisible tras navegar.
- **`nivel`** en `SectionHeading`, `Products`, `About`, `FinalCta`, `Ecosystem`, `ListaLineas`, `Informe`,
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

- **El Home es la puerta de entrada (24-sep, elegido por Adrian).** Cada tema aparece resumido y enlaza a su página;
  nada se repite entero. Pasó de ≈ 8.100 a ≈ 5.500 px a 1440. Conserva hero, problema y las superficies de los actos.
- **El portafolio manda sobre el contenido.** Siete líneas con página propia; los productos se llaman Novum Risk, Novum
  Budget y Novum Strategic Planning (como en la aplicación); los seis diferenciales, la metodología de cinco pasos, los
  segmentos y las formas de vinculación salen del PDF.
- **Novum Risk se describe con lo que el software cubre hoy (SARC, SARLAFT y SARO).** La consultoría de la línea 01 sí
  nombra SARL, porque no depende del software.
- **Oficial de cumplimiento y gestor de riesgos** (no están en el portafolio) se conservan como capacidades de las líneas
  06 y 01. «Acompañamiento» deja de ser página: sus seis servicios quedan dentro de las líneas y redirige a
  `/soluciones`.
- **Eslogan del logotipo:** «Inteligencia que anticipa, análisis que transforman, decisiones que generan valor».
- **Se toma el contenido del portafolio, no su maquetación**: sus tarjetas de colores y el texto verde sobre fondo claro
  chocan con el design system (sin tarjetas repetidas; verde solo como marcador).
- **«Su entidad en contexto» vive en las páginas de informes**, al cierre del informe y del catálogo.
- **Sin blog, sin formulario, sin captura de correo.** El blog no tiene entradas; un formulario o un campo de correo
  exigen antes la política de tratamiento de datos (Ley 1581). Contacto sigue siendo demostración, WhatsApp y correo.
- **Redes sociales pendientes**: el portafolio menciona LinkedIn, YouTube e Instagram; se añadirán al pie y a
  `Organization.sameAs` cuando existan los enlaces.
- **Una banda oscura por página**: la de contacto. Las páginas de informes cierran con «Su entidad en contexto».

## Contradicciones señaladas

- **Master Prompt v2 §4** describe un sitio de una página con navegación por anclas. Esta fase lo extiende a
  multipágina por instrucción directa (23-09-2026: «la web será el catálogo y la puerta de entrada»). El orden del Home
  del §4 se conserva; el Master Prompt no se editó: la decisión de actualizarlo es del equipo.
- **Numeración 01–07 de las líneas.** El Master Prompt pidió evitar la numeración decorativa de secciones; aquí el
  número es el del portafolio y ordena las líneas, como los capítulos del informe.

## Verificación

- `npm run lint`, `npm run typecheck`, Prettier y `next build` en verde.
- Todas las rutas (Home, índice y siete líneas, tecnología, informes, nosotros, contacto) en 320 · 390 · 1024 · 1440 (y
  las de la primera entrega también en 768 · 1280 · 1920): sin desborde horizontal, un h1 por página, sin
  saltos de nivel de título, todos los `data-reveal` visibles tras recorrer la página, sin errores de consola.
- Navegación de cliente (escritorio y menú móvil): Home → Informes → edición → migas → atrás → Nosotros → logo, sin
  recargas, con el enlace activo correcto y el índice del informe fijo a 112 px (`top-28`).
- `/informes/<slug-inexistente>` y cualquier ruta desconocida responden 404 con `noindex`; el PDF responde 200
  `application/pdf`; cada página interna trae su canónica, `og:url` e imagen OG.

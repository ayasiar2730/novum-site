# Informe sectorial en PDF — generado desde `SectorSnapshot v2`

**Fase 1 · 23-sep-2026.** Novum publica informes sectoriales: la web será el catálogo y la puerta de entrada, y el
informe completo, un PDF ejecutivo descargable. Este documento describe cómo se genera ese PDF sin rehacerlo a mano
cada mes.

```
SectorSnapshot v2 (src/data/sector/informes/<AAAA-MM>.json, el mismo que lee el sitio)
  → src/lib/informe/modelo.ts      snapshot → modelo del informe (formatea, NO calcula) + trazabilidad de cada cifra
  → src/lib/informe/documento.ts   modelo → HTML de páginas A4 fijas (encabezado, pie, numeración, índice)
  → src/lib/informe/graficos.ts    barras, composición y distribución en HTML + CSS (sin librería de gráficas)
  → src/lib/informe/informe.css    identidad Novum para impresión (A4 vertical)
  → scripts/informe-sectorial.mjs  Chrome headless por el protocolo DevTools → comprobaciones → PDF
```

## Reglas

- **Fuente única: el snapshot.** No consulta ninguna base, no recalcula indicadores y no escribe cifras propias.
  Las pocas cifras derivadas son restas o cocientes exactos entre cifras publicadas (capital en A = cartera bruta −
  cartera vencida; participación en entidades = entidades de la categoría / entidades del universo) y quedan
  registradas como tales en la trazabilidad.
- **Solo se genera con un snapshot publicable:** v2 de origen `siar`, 3–5 hallazgos con Lectura Novum, k ≥ 5 y el
  validador del sitio (`validarV2`) en verde.
- **Dato ≠ Lectura Novum.** Las cifras del motor van como «Dato del corte»; la lectura aprobada va en recuadro morado
  rotulado «Lectura Novum». El informe no añade conclusiones.
- **Un corte es una fotografía:** sin series ni variaciones mientras el snapshot traiga un solo corte.
- **Sin mínimos ni máximos:** las distribuciones muestran P25, mediana, P75, media y el indicador agregado. Los
  rótulos del eje son de la escala y así se declaran.

## Comprobaciones antes de imprimir

Si alguna falla, el generador no escribe el PDF (sale con 1) y lo dice:

| Comprobación | Cómo |
| --- | --- |
| Snapshot válido | `validarV2` del sitio + `origen: "siar"` + 3–5 hallazgos + k ≥ 5 |
| Tipografía cargada | `document.fonts.check` de Plus Jakarta Sans |
| Ninguna página se desborda | cada `.pagina__cuerpo` tiene alto fijo; se mide el contenido en Chrome |
| Sin datos identificables | el texto del informe no contiene nada con forma de NIT ni de uuid |
| Código interno solo como versión | `v2-2026-09` aparece solo en la línea de versión (alcance y metodología) |
| Cifras trazadas | toda cifra con decimales del texto es una cifra de la trazabilidad o su redondeo exacto |

### Cortes completos (junio y diciembre) — 24-sep-2026

El corte de junio 2026 (1.801 entidades) trajo más contenido que julio y el generador se adapta sin recortar nada:

- **Resumen ejecutivo que se reparte solo.** Tres hallazgos por página y la tabla de cifras clave en la última, por
  defecto. Si Chrome mide que una página del resumen se desborda (lecturas largas), la tabla pasa a una página propia o
  el último hallazgo de esa página pasa a la siguiente, y se vuelve a medir. El desborde que quede lo frena la
  comprobación.
- **Nivel de supervisión.** Cuando el snapshot lo publica (en los cortes mensuales suele omitirse por k), va en la página
  de tipo de organización, con su participación en la cartera y en las entidades, y sus cifras quedan trazadas.
- **Muchas categorías.** Con más de diez departamentos, las filas del territorio se compactan.
- **Nombres del portafolio.** El cierre habla de Novum Risk y la metodología, del motor sectorial de Novum; el cierre ya
  no promete «este mismo universo», porque la plataforma solo tiene los cortes que se pudieron cargar.

## Cómo se genera

Requisitos: `npm install` y Chrome o Edge instalados (o `--chrome <ruta>` / `CHROME_PATH`).

```bash
node --import ./scripts/_ts.mjs scripts/informe-sectorial.mjs --capturas
```

Sin `--corte` ni `--snapshot` usa el corte más reciente de `src/data/sector/informes/`; `--corte AAAA-MM` elige otro
publicado y `--snapshot <ruta>` acepta cualquier SectorSnapshot v2 publicable (p. ej. el que entrega SIAR, para
revisarlo antes de copiarlo al repositorio). Salida en `.informes/` (ignorada por git):

- `informe-sectorial-<AAAA-MM>.pdf`
- `informe-sectorial-<AAAA-MM>.html` — la versión imprimible, útil para revisar en el navegador
- `informe-sectorial-<AAAA-MM>.trazabilidad.json` — cada cifra con su ruta en el snapshot o su derivación
- `informe-sectorial-<AAAA-MM>.manifiesto.json` — páginas, peso, SHA-256 del PDF y del snapshot, comprobaciones
- `informe-sectorial-<AAAA-MM>-paginas/` — una imagen por página (con `--capturas`)

## Publicarlo en la web (fase 2)

```bash
node --import ./scripts/_ts.mjs scripts/informe-sectorial.mjs --corte 2026-07 --publicar --capturas
```

`--publicar` copia el PDF, después de pasar todas las comprobaciones, a `public/informes/informe-sectorial-<AAAA-MM>.pdf`:
la URL fija que enlazan la página del informe, su entrada en el catálogo y la portada del Home
(`src/lib/informes/catalogo.ts`). Solo se acepta con el snapshot **publicado** del corte
(`src/data/sector/informes/<AAAA-MM>.json`): el PDF que se descarga sale del mismo archivo que la web muestra. Si el PDF
no está en `public/informes/`, la edición se publica igual en la web, pero sin botón de descarga (nunca un enlace roto).
El PDF se revisa y se versiona en el mismo PR que el snapshot. Chrome sella la fecha de creación en cada corrida, así
que regenerar produce otro SHA-256 aunque el contenido sea idéntico: solo se vuelve a publicar cuando cambia el
snapshot o el diseño.

## Decisiones técnicas

- **Chrome sin Puppeteer ni Playwright.** El generador abre Chrome headless y lo maneja por el protocolo DevTools con
  el WebSocket nativo de Node: no descarga navegadores ni añade dependencias de código. `Page.printToPDF` con el
  tamaño de página del CSS (`@page { size: A4 }`), fondos impresos, PDF etiquetado (accesible) y esquema de
  documento.
- **Páginas fijas en lugar de paginación automática.** Cada sección decide sus páginas; así el encabezado, el pie, el
  número de página y el índice salen exactos, y el control de desbordes impide que algo se corte en silencio.
- **Tipografía estática.** La fuente variable del sitio (next/font) Chrome la incrusta como fuentes Type 3, glifo por
  glifo: el PDF pesaba ≈ 1 MB y el texto se extraía peor. Con las instancias estáticas de la misma Plus Jakarta Sans
  (`@fontsource/plus-jakarta-sans`, dependencia de desarrollo, solo archivos de fuente, OFL-1.1) se incrusta como
  subconjunto: ≈ 420 KB.
- **Marca a la resolución de impresión.** Los PNG maestros de `public/brand/` se reducen en el propio Chrome a 300 ppp
  del tamaño impreso antes de generar el PDF.
- **TypeScript sin compilar.** `scripts/_ts.mjs` registra `scripts/_ts-hooks.mjs` (alias `@/` e imports sin
  extensión) y Node ≥ 22.18 quita los tipos: el generador usa el mismo código que el sitio (`validarV2`, contenido de
  `src/content/site.ts`).

## Estructura del informe de julio 2026 (13 páginas)

| Pág. | Sección |
| --- | --- |
| 1 | 01 Portada |
| 2 | 02 Alcance del informe — ficha del corte, contenido, cómo leer el informe |
| 3–4 | 03 Resumen ejecutivo — cinco hallazgos (dato y Lectura Novum) y cifras clave |
| 5 | 04 Dimensión del universo — cartera bruta, magnitudes, composición por calificación |
| 6 | 05 Calidad de cartera — ICM agregado y su distribución, ICV |
| 7 | 06 Deterioro y cobertura — cobertura agregada y su distribución, deterioro frente a vencida |
| 8 | 07 Estructura por tipo de organización |
| 9 | 08 Estructura territorial |
| 10 | 09 Otros indicadores — mora por días (grupo 84), libranza, intereses vencidos |
| 11–12 | 10 Metodología y fuentes — fuente, procesamiento, universo, anonimización, definiciones, limitaciones |
| 13 | 11 Cierre |

## Pendiente (fase 2)

Dónde vive el PDF en el sitio (catálogo de informes, arquitectura multipágina) y cómo se enlaza. Hasta entonces el PDF
no se publica: se genera, se revisa y se aprueba.

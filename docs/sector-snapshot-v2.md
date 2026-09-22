# Observatorio Novum — contrato `SectorSnapshot v2` y flujo SIAR → novum-site

**Documento técnico del bloque 2B.2.** Versión 1 — 21 de septiembre de 2026.

Describe cómo llega una cifra del motor sectorial de SIAR a la sección «Inteligencia del sector» de `novumintegral.com`, qué contrato viaja entre los dos sistemas, por qué el contrato v1 no bastaba, y qué reglas de privacidad y de honestidad temporal aplica la web antes de publicar.

---

## 1. Principio: la web no consulta a SIAR

```
Supersolidaria ─▶ SIAR importa (import-sector.mjs) ─▶ SIAR procesa (sector-procesar.mjs, evaluador 1.1.0)
   ─▶ sector_resultado (una fila por corrida × metodología × entidad; PRIVADA)
   ─▶ sector_agregados() / sector_cortes_disponibles()  (agregados, sin filas por entidad)
   ─▶ job `sector-snapshot` (pendiente en SIAR): agrega, aplica k-anonimato, redacta, valida
   ─▶ src/data/sector/snapshot.json  (artefacto público, versionado en este repo)
   ─▶ novum-site lee el archivo en build (source.ts) ─▶ Informe sectorial
```

- `novum-site` **no tiene credenciales de Supabase ni de SIAR** y no las va a tener. El único dato que necesita es un archivo JSON aprobado y versionado en Git.
- El archivo se lee **en build** con `node:fs` (`src/lib/sector/source.ts`). Si no existe, no valida o es una fixture, la sección publica su versión editorial. Nunca ceros, nunca datos viejos, nunca error visible.
- El vocabulario del motor (`cartera_bruta`, `icm`, `v2-2026-09`…) viaja **con etiqueta, definición y unidad** dentro del snapshot. La web no conoce el esquema de SIAR y no se rompe si el motor cambia una clave.

## 2. Auditoría del motor sectorial (SIAR-AYA, 21-09-2026)

| Qué | Estado | Dónde |
| --- | --- | --- |
| Cifras por entidad y corrida | Existe. Tabla `sector_resultado` (`agregados` jsonb, `indicadores` jsonb, `en_universo`, `tipo_entidad`, `nivel_supervision`, `departamento`, `asociados`). | `supabase/migrations/0194_sector_resultado.sql` |
| Cortes disponibles | Existe. `sector_cortes_disponibles()` → corrida, fecha de corte, metodología (id, código, estado), entidades, en universo, `calculado_en`. | `0195_sector_agregados_y_pares.sql` |
| Agregados de un segmento | Existe. `sector_agregados(p_corrida, p_metodologia, p_tipos, p_niveles, p_departamentos, p_solo_universo)` → `{entidades, asociados, sumas{clave: total}, distribucion{clave: {n, mediana, p25, p75, media, min, max}}}`. | `0195` |
| Posiciones por entidad | Existe, **privada** (`sector_posiciones`). No se usa para la web. | `0195` |
| Seguridad | Las tres funciones son `security invoker`, solo `authenticated`, con la RLS de quien pregunta. | `0195` |
| Metodología vigente | `v2-2026-09`: universo = `cartera_bruta > 0`, todos los tipos. Agregados de cartera (`cartera_bruta`, `cartera_vencida`, `capital_A…E`, `mora_*`, `deterioro_*`…). Indicadores `icm`, `icv`, `cobertura`, `deterioro_total_capital`, `participacion_libranza`, `icm_30/90/180`… Indicador del sector = fórmula sobre las **sumas** del universo (`indicadoresDesdeAgregados`), no promedio de indicadores. | `sector-etiquetas.ts`, evaluador |
| Corrida de julio 2026 | Procesada en producción con la v2: 386 entidades evaluadas, reprocesada con evaluador 1.1.0. Es el único corte utilizable hoy. | Job `sector-procesar.yml` (`workflow_dispatch`, service role) |
| Exportación hacia la web | **No existe.** No hay job, tabla ni endpoint que produzca un artefacto agregado público. | — |
| Activos, depósitos, patrimonio | **No están** en los agregados de la v2 (motor centrado en cartera). Solo `cuentas principales` trae tipo, nivel, departamento, municipio, asociados, empleados. | — |

Conclusión: el motor calcula todo lo que el informe necesita para **dimensión, riesgo y estructura**, pero no lo exporta. La v1 del contrato pedía cosas que el motor no tiene (activo, depósitos, patrimonio, series por historia) y no pedía cosas que sí tiene (distribuciones, segmentaciones con k-anonimato, metodología versionada).

## 3. Cómo llega el corte de julio 2026 a la web

1. **SIAR** (pendiente, rama/PR en SIAR-AYA): job `scripts/sector-snapshot.mjs`, lanzado a mano (`workflow_dispatch`) con service role, que:
   1. lee `sector_cortes_disponibles()` y toma las corridas con `metodologia_estado = 'vigente'`;
   2. por cada corte llama `sector_agregados()` para el universo completo y para cada segmento (tipo de organización, departamento, rango de cartera);
   3. descarta toda categoría con menos de `k` entidades (k = 3 por defecto; ver §7) y la funde en «Otros»;
   4. calcula el indicador ponderado del sector con `indicadoresDesdeAgregados` sobre las sumas;
   5. con dos o más cortes, construye `evolucion` sobre las entidades presentes en ambos cortes bajo la misma metodología (criterio declarado, `nBase`, `nActual`, `nComparables`, exclusiones);
   6. mezcla la **Lectura Novum**: un archivo de redacción (`sector-lectura.<corteId>.json`) escrito y aprobado por el equipo, con `hallazgos[].titulo`, `hallazgos[].lectura`, `evolucion.lectura`. El job no inventa texto;
   7. valida el resultado con el mismo esquema que `validarV2` (§6) y lo escribe como `snapshot.json`.
2. **Entrega**: el job abre un PR contra `novum-site` con `src/data/sector/snapshot.json` (un archivo, un commit, un diff legible). Alternativa equivalente: publicar el JSON como artefacto y copiarlo a mano al repo. En ambos casos **una persona revisa el diff antes del merge**: es la aprobación editorial.
3. **Web**: al mergear, Vercel construye; `source.ts` lee el archivo, valida (estructura + k-anonimato + `origen !== "fixture"`), y `SectorIntelligence` publica el `Informe` con un corte → **fotografía del sector** (§5). Sin `evolucion`, no aparece el capítulo 04 ni ninguna variación.

Hasta que exista el paso 1, la web sigue en su versión editorial. No hay estado intermedio.

## 4. Del contrato v1 al v2

La v1 (`SectorSnapshot`, `version: 1`) sigue aceptada por `source.ts` y renderizada por los componentes previos; la v2 se añade sin romperla (`SectorSnapshotAny`, `esV2()`). Cambios, uno por fila:

| Campo actual (v1) | Limitación | Campo propuesto (v2) | Fuente en el motor | Justificación |
| --- | --- | --- | --- | --- |
| `corte: Corte` (uno solo) + `comparacion: {base, nComparables, criterio} \| null` | Un solo corte y una comparación pegada al lado; no hay forma de traer tres cortes ni de que el dato decida el modo. | `cortes: CorteV2[]` (actual primero) + `evolucion?: Evolucion \| null` | `sector_cortes_disponibles()` | La web decide fotografía / comparación / serie **por los datos** (`modoTemporal`), no por bandera. |
| `corte.cobertura: {tipo, descripcion}` + `corte.nEntidades` | No distingue reportantes de entidades en el universo; no trae fecha de procesamiento. | `CorteV2 {estado, cobertura, nReportantes, nUniverso, procesadoEl}` | `entidades`, `en_universo`, `calculado_en` de `sector_cortes_disponibles()` | El informe declara «n de N reportantes» y cuándo se procesó. |
| `fuente: {entidad, url?, procesamiento: string, publicadoEl?}` | Mezcla en un objeto a quien publica los datos con quien los procesa. | `FuenteV2 {datos: {entidad, url?, descripcion?, publicadoEl?}, procesamiento: {entidad, descripcion?}}` | Constantes del job | La UI separa «Fuente de datos» (Supersolidaria) de «Procesamiento y análisis» (Novum). Nuestra lectura no se presenta como de la Superintendencia. |
| `kpis: Kpi[]` con `KpiClave = "entidades" \| "activo" \| "cartera" \| "depositos" \| "patrimonio"` | Claves cerradas que el motor **no tiene** (activo, depósitos, patrimonio); invita a KPI cards. | `dimension: {cifras: Cifra[], principal?}` con `Cifra {clave, etiqueta, valor, unidad, definicion?, nota?}` | `sector_agregados().sumas` (`cartera_bruta`, `cartera_vencida`, `cartera_neta` derivada…) | Claves abiertas y autodescritas; una cifra dominante y secundarias, no una rejilla de tarjetas. |
| `historias: Historia[]` con `visualizacion`, `series`, `insight` | Obliga a tres historias fijas con series temporales que no existen con un corte; el insight va mezclado con el dato. | `hallazgos: Hallazgo[]` (3–5) con `clasificacion`, `capitulo`, `cifra` (dato) y `lectura` (Novum) en campos distintos | Cifra: motor. Lectura: archivo de redacción aprobado | Resumen ejecutivo honesto con un corte; «Dato del corte» y «Lectura Novum» identificados como cosas distintas. |
| — (no existía) | La v1 no tenía forma de mostrar dispersión entre entidades. | `riesgo: {indicadores: IndicadorRiesgo[], principal?}` con `ponderado` y `distribucion {n, media, mediana, p25, p75, min?, max?}` | `sector_agregados().distribucion[clave]` + `indicadoresDesdeAgregados(sumas)` | Un indicador del sector se lee con su banda P25–P75 y su mediana: el sector no es un número. |
| `filtros?: {dimensiones: DimensionFiltro[]}` | Sugería filtros interactivos (dashboard). | `estructura: {segmentaciones: Segmentacion[]}` con categorías **ya agregadas** (`entidades`, `valor`, `participacion`) y `concentracion?` | `sector_agregados(p_tipos / p_departamentos …)` por categoría | Composición publicada, no explorable; cada categoría cumple k-anonimato. |
| `metodologia: {resumen, limitaciones}` | Sin versión, sin universo, sin exclusiones, sin definiciones, sin criterio de comparabilidad. | `MetodologiaV2 {codigo, version, nombre, descripcion, evaluador?, universo{definicion, criterio}, exclusiones, definiciones[], comparabilidad{criterio, descripcion}, limitaciones, minEntidadesPorCategoria}` | `metodologia_codigo`, versión del evaluador, `sector-etiquetas.ts` | Transparencia metodológica visible y verificable; el `k` viaja en el snapshot y la web lo comprueba. |
| `origen: "siar" \| "script" \| "fixture"` | `"script"` era un origen ambiguo. | `origen: "siar" \| "fixture"`; un archivo con `"fixture"` se rechaza | — | La fixture no puede publicarse ni por error de copia. |
| `contexto?: Contexto` (rangos) | — | Se conserva igual | `sector_agregados()` por rango de cartera | Alimenta «Su entidad en contexto» sin dato particular. |

Todo es aditivo: ningún tipo de la v1 cambia y `source.ts` acepta las dos versiones.

## 5. Un corte es una fotografía

`modoTemporal(snapshot)` en `src/lib/sector/selectV2.ts`:

| Datos | Modo | Qué se publica | Qué no se publica |
| --- | --- | --- | --- |
| 1 corte, o `evolucion` ausente/inválida | `foto` | Portada, resumen ejecutivo, capítulos 01–03, metodología; nota «Fotografía del sector» en el índice | Capítulo 04, variaciones, series, flechas, «crecimiento», CAGR |
| 2 cortes y `evolucion` válida (`nComparables > 0`, `variaciones` no vacías, `criterio` no vacío) | `comparacion` | Lo anterior + capítulo 04 con leyenda de comparabilidad, tabla base/actual/variación (signo tipográfico, sin color), n actual / n base / n comparables, criterio y exclusiones | Series, líneas de tendencia |
| 3 o más cortes y `evolucion.series` | `serie` | Lo anterior + serie por corte como barras etiquetadas | Líneas interpoladas, proyecciones |

La comparación se construye **solo sobre entidades presentes en ambos cortes** bajo la misma metodología; el criterio, las exclusiones y los tres n se muestran junto a la tabla. Un cambio de metodología entre cortes no es comparable y el job no debe emitir `evolucion`.

## 6. Validación en la web (`validarV2`, `source.ts`)

Se rechaza el snapshot completo (y se publica la versión editorial) si:

- `version !== 2`, `origen` no es `"siar"` (un `"fixture"` en el archivo se rechaza con aviso);
- falta `fuente.datos.entidad` o `fuente.procesamiento.entidad`;
- `metodologia.minEntidadesPorCategoria < 3` o no es número;
- `cortes` vacío, o algún corte sin `id`, `etiqueta`, `fechaCorte`, `estado`, `nUniverso > 0`, `nReportantes`;
- `hallazgos` vacío o alguno sin `titulo`, `lectura`, `cifra` numérica finita;
- alguna `categoria.entidades < k` en cualquier segmentación (**k-anonimato**);
- cifras o indicadores con valores no finitos.

Mejor la versión editorial que una categoría con dos entidades.

## 7. Privacidad: lo que nunca sale del motor

- **Nunca** NIT, razón social, nombre corto ni código de entidad. El snapshot no tiene un solo campo por entidad.
- **Nunca** un indicador de una entidad identificable: `sector_posiciones` no se usa; solo `sector_agregados` (sumas y percentiles de segmento).
- **k-anonimato**: ninguna categoría publicada tiene menos de `minEntidadesPorCategoria` entidades (3 por defecto; el equipo puede subirlo a 5). Las categorías pequeñas se funden en «Otros» antes de exportar. La web lo verifica de nuevo y rechaza el archivo si falla.
- **Concentración**: «las 10 mayores entidades concentran X %» se publica solo como agregado (n ≥ k), sin nombrar entidades.
- **Comparaciones privadas** (entidad vs sector) viven en SIAR, detrás de autenticación. En la web solo existe «Su entidad en contexto» con rangos agregados y el CTA «Agende una demostración»: sin buscador, sin NIT, sin formulario, sin login.
- Verificación de esta entrega: el HTML renderizado con la fixture no contiene la cadena «NIT» ni patrones `#########-#`; el HTML de producción no contiene el informe (no hay snapshot).

## 8. Fixture de desarrollo (imposible en producción)

- `src/lib/sector/fixture.dev.ts` («DEV ONLY · NO PUBLICAR · NO SOURCE OF TRUTH»): tres snapshots sintéticos v2 con etiquetas de prueba explícitas (`Corte de prueba`, `Indicador de prueba 1`, `Tipo 1`…), fechas del año 2000 y `origen: "fixture"`.
- Entra **solo** si `process.env.NODE_ENV !== "production"` **y** `SECTOR_FIXTURE=true|v2` (`v1` para la fixture antigua). Variable privada del servidor; no existe `NEXT_PUBLIC_*`. En Vercel no se configura.
- `SECTOR_FIXTURE_MODO=comparacion|serie` elige la fixture de 2 o 3 cortes para revisar los modos temporales.
- Si alguien copiara la fixture a `snapshot.json`, `source.ts` la rechaza por `origen: "fixture"`.
- El banner «FIXTURE» (`FixtureBanner`) solo se renderiza cuando `snapshot.origen === "fixture"`, es decir, nunca en producción.

## 9. Anatomía del informe (componentes)

| Pieza | Archivo | Qué hace |
| --- | --- | --- |
| Rama v1 / v2 / editorial | `src/components/sector/SectorIntelligence.tsx` | `esV2()` → `Informe`; v1 → componentes previos; `null` → editorial. |
| Selectores (view-model) | `src/lib/sector/selectV2.ts` | `modoTemporal`, `selectPortada`, `selectHallazgos` (máx. 5), `selectDimension`, `selectRiesgo` (escala 0–100 de la banda), `selectEstructura`, `selectEvolucion`, `selectMetodologia`. Todo el formato numérico ocurre aquí. |
| Informe | `src/components/sector/informe/Informe.tsx` | Portada con metadatos, índice pegajoso, resumen ejecutivo (Dato del corte ≠ Lectura Novum), capítulos 01–04, metodología. Servidor puro. |
| Capítulo / Rótulo | `src/components/sector/informe/Capitulo.tsx` | Numeración editorial grande, título, pregunta; `scroll-mt-28`. |
| Metodología | `src/components/sector/informe/Metodologia.tsx` | «Fuente de datos» vs «Procesamiento y análisis»; disclosures nativos `<details>` para criterio, exclusiones, definiciones, comparabilidad, limitaciones y privacidad. |
| Banda de distribución | `src/components/sector/charts/BandaDistribucion.tsx` | Pista min–max, banda P25–P75, mediana y nodo del indicador ponderado. Sin color «bueno/malo». |
| Barras | `src/components/sector/charts/Bar.tsx` (existente) | Participaciones y series por corte. |
| Textos | `src/content/sector.ts` → `sector.informe` | Rótulos y notas del informe; la Lectura Novum **no** vive aquí, viaja en el snapshot. |

Lenguaje visual heredado de B0–B3: morado para estructura y lectura, verde solo como marcador de hallazgo, `data-reveal` con el bloque `prefers-reduced-motion` global, tabla de variaciones apilada bajo 640 px, sin scroll lateral.

## 10. Pendientes fuera de este repositorio

1. SIAR-AYA: job `sector-snapshot` + archivo de redacción de la Lectura Novum (rama/PR; toca service role y datos).
2. Decidir `k` (3 o 5) y la lista de segmentaciones a publicar (tipo, departamento, rango de cartera).
3. Redactar y aprobar la Lectura Novum del corte de julio 2026.
4. Cuando exista el snapshot real: PR con `src/data/sector/snapshot.json`, revisión del diff, merge.

# Inteligencia sectorial (módulo interactivo)

> **Estado (26-sep-2026).**
> - Hay dos informes nativos en `/inteligencia-sectorial`: **Cartera y riesgo** y **Panorama financiero**.
> - Los dos comparten el mismo shell, filtros y navegación.
> - Los datos son un archivo por corte, que produce el motor sectorial de SIAR.
> - Junio 2026 está publicado y se compara con junio 2025.
> - No hay Power BI ni iframes en tiempo de ejecución.

## Arquitectura

```
archivos oficiales Supersolidaria (cuentas principales + 6 dígitos, corte y mismo mes del año anterior)
  → motor sectorial de SIAR (versiones historico-marzo-2026 y seguimiento-sector-2026-06)
  → exportador (SIAR: src/lib/motor-sectorial/inteligencia-publica.ts)
  → public/datos/inteligencia/<AAAA-MM>.json   (contrato novum.inteligencia-sectorial/1)
  → /inteligencia-sectorial/cartera-riesgo  ·  /inteligencia-sectorial/panorama-financiero
```

- **Contrato:** `src/lib/inteligencia/contrato.ts` es una **copia literal** del de SIAR.
  - Está fuera de Prettier.
  - `npm run verificar:contrato` la compara con el original, si `../SIAR-AYA` existe.
- **Sin fórmulas financieras en la interfaz.**
  - Cada cifra del Panorama llega calculada por entidad y por grupo: sector, tipo, departamento y tipo ×
    departamento.
  - Los filtros **eligen** el grupo (`src/lib/inteligencia/panorama.ts`).
  - Cartera y riesgo recibe ICM, μ, σ y zona por entidad. Las lecturas de grupo (sumas del grupo filtrado,
    mediana, percentil, pares, histograma) son las mismas de la pantalla de SIAR (`src/lib/inteligencia/cartera.ts`).
- **Datos en el servidor:** `src/lib/inteligencia/datos.ts` lee y valida los archivos al construir el sitio. Un
  archivo inválido no se publica.
- **Datos en el navegador:** el shell (`src/components/inteligencia/InformeInteractivo.tsx`) descarga el archivo del
  corte, que pesa unos 400 KB comprimido.
- **Estado en la URL:** `?seccion=…&tipo=…&depto=…&entidad=…&corte=…&ver=…`.
  - Sobrevive al cambio de sección y de informe (conserva departamento y entidad).
  - Se comparte con un enlace.
- **Entidad propia (SIAR autenticado):** la prop `entidadPropia` preselecciona la entidad. Se rotula «Su entidad» y
  no se puede quitar. La web pública no la usa.

## Informes y secciones

- **Cartera y riesgo** (el informe original del sector, regla `historico-marzo-2026`). Seis secciones:
  - Resumen.
  - Vista sector.
  - Posicionamiento.
  - Análisis de mora.
  - Benchmarking (pares ±60 % del mismo segmento; sin entidad, terciles por tamaño).
  - Recomendaciones:
    - Señales del corte: hechos con cifra.
    - Con entidad: fortalezas y áreas de atención, con las reglas del informe original.
    - Sin textos fijos de plan de acción.
- **Panorama financiero** (réplica del Power BI «Seguimiento sector Junio 2026»; auditoría y paridad en SIAR
  `docs/panorama-financiero-auditoria-pbix.md`). Ocho secciones:

| Sección | Páginas del Power BI |
|---|---|
| Resumen | pág. 16 |
| Crecimiento | pág. 1–5 y 14 |
| Calidad de cartera | pág. 6, 7 y 9 |
| Liquidez y estructura | pág. 8 y 10 |
| Rentabilidad | pág. 11, 13 y 15 |
| Intermediación | pág. 17 |
| CAMEL | pág. 12 |
| Saldos | pág. 18 |

- **Supuestos del Power BI:** se muestran con una nota donde aplican.
  - División entre 4 en la intermediación.
  - Activo productivo y cobertura general calculados con el corte del año anterior.
  - Activo total corregido a la cuenta 100000.
  - La ficha de cada cifra, en «Cómo se calcula», dice su definición, unidad, periodo, fuente, universo y nota de
    método.

## Diseño y responsive

- **Color:** morado para el dato y el método; verde para la entidad elegida; neutros para la estructura.
- **Zonas:** Bajo va en verde claro; Moderado, en neutro; Elevado, en morado; Alto, en morado oscuro. Siempre llevan
  su texto.
- **Menú de secciones:**
  - Desde 768 px son pestañas (patrón ARIA, con flechas, Inicio y Fin). Se desplazan dentro de su marco con un
    degradado y la activa queda a la vista.
  - Por debajo de 768 px es un selector nativo con la descripción de la sección.
- **Filtros:** apilados a ancho completo en móvil y en fila desde 768 px. El buscador de entidad es un combobox
  ARIA.
- **Tablas:** primera columna fija, encabezados que ordenan (`aria-sort`), paginación y fila total fija. En móvil se
  desplazan dentro de su marco, con una pista, y las columnas secundarias se ocultan.
- **Gráficas:** SVG y CSS, con etiquetas siempre visibles.
  - En móvil, la etiqueta sube sobre la barra.
  - La dispersión se dibuja al ancho real; los valores extremos van al borde (▲) y se cuentan.

## Verificación

- `npm run lint && npm run typecheck && npm test && npm run build`.
- Pantallas: `herramientas-claude/check-inteligencia.js`. Chrome sin ventana recorre **todas** las secciones con el
  control real y mide:
  - desborde horizontal;
  - `NaN`, `undefined` o `Infinity` en el texto;
  - errores de consola.
  - Uso: `URL=http://localhost:3000/inteligencia-sectorial/panorama-financiero node cdp.mjs check-inteligencia.js 390 844`.
    Se corre a 390, 768, 1024, 1440 y 1920.

## Publicar un corte nuevo

1. **En SIAR:** `scripts/sector-panorama-local.mjs` con los archivos del corte y los del mismo mes del año
   anterior, y `--publicar .sector-snapshot/inteligencia/<AAAA-MM>.json`.
2. **Copiar el archivo** a `public/datos/inteligencia/<AAAA-MM>.json`.
   - El selector de corte, el hub y el sitemap lo toman solos.
   - El corte que se abre por defecto es el completo (junio o diciembre) más reciente.
3. **Abrir un PR.** El usuario mergea.

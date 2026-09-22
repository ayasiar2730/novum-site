import type { CorteV2, Evolucion, SectorSnapshot, SectorSnapshotV2 } from "@/lib/sector/types";

/**
 * ============================================================
 *  DEV ONLY · NO PUBLICAR · NO SOURCE OF TRUTH
 * ============================================================
 * Snapshot SINTÉTICO para diseñar y probar el layout de la sección
 * «Inteligencia del sector». Todos los valores son índices abstractos
 * (base 100), conteos redondos o porcentajes inventados: no representan
 * ninguna cifra del sector solidario ni derivan de ninguna cifra real.
 *
 * Solo se carga fuera de producción y con SECTOR_FIXTURE=true (source.ts).
 * `origen: "fixture"` hace que la sección muestre el banner
 * «FIXTURE DE DESARROLLO».
 */
export const SNAPSHOT_DEV: SectorSnapshot = {
  version: 1,
  generadoEl: "2000-01-01T00:00:00.000Z",
  origen: "fixture",
  corte: {
    id: "0000-00",
    etiqueta: "Corte de prueba",
    fechaCorte: "2000-01-31",
    cobertura: {
      tipo: "completo",
      descripcion: "Cobertura de prueba: universo sintético para validar el diseño.",
    },
    nEntidades: 500,
  },
  comparacion: {
    base: {
      id: "0000-01",
      etiqueta: "Corte de prueba anterior",
      fechaCorte: "1999-01-31",
      cobertura: { tipo: "completo", descripcion: "Cobertura de prueba." },
      nEntidades: 480,
    },
    nComparables: 450,
    criterio: "identificador presente en ambos cortes (prueba)",
  },
  fuente: {
    entidad: "Fuente de prueba (fixture de desarrollo)",
    procesamiento: "Procesamiento de prueba",
  },
  kpis: [
    {
      clave: "entidades",
      etiqueta: "Entidades analizadas",
      valor: 500,
      unidad: "entidades",
      nota: "Conteo sintético",
    },
    {
      clave: "activo",
      etiqueta: "Activos",
      valor: 110,
      unidad: "indice",
      nota: "Índice sintético, base 100",
    },
    {
      clave: "cartera",
      etiqueta: "Cartera",
      valor: 104,
      unidad: "indice",
      nota: "Índice sintético, base 100",
    },
    {
      clave: "depositos",
      etiqueta: "Depósitos",
      valor: 107,
      unidad: "indice",
      nota: "Índice sintético, base 100",
    },
  ],
  historias: [
    {
      id: "crecimiento",
      numero: "01",
      titulo: "Crecimiento y evolución",
      subtitulo: "Índices sintéticos entre dos cortes de prueba",
      visualizacion: "comparacion",
      series: [
        {
          id: "activo",
          etiqueta: "Serie A",
          unidad: "indice",
          puntos: [
            { x: "Anterior", y: 100 },
            { x: "Actual", y: 110, nota: "+10" },
          ],
        },
        {
          id: "cartera",
          etiqueta: "Serie B",
          unidad: "indice",
          puntos: [
            { x: "Anterior", y: 100 },
            { x: "Actual", y: 104, nota: "+4" },
          ],
        },
        {
          id: "depositos",
          etiqueta: "Serie C",
          unidad: "indice",
          puntos: [
            { x: "Anterior", y: 100 },
            { x: "Actual", y: 107, nota: "+7" },
          ],
        },
        {
          id: "patrimonio",
          etiqueta: "Serie D",
          unidad: "indice",
          puntos: [
            { x: "Anterior", y: 100 },
            { x: "Actual", y: 103, nota: "+3" },
          ],
        },
      ],
      insight:
        "Lectura de prueba. Este párrafo existe solo para comprobar el ritmo tipográfico de la lectura ejecutiva junto a la gráfica: dos o tres frases, sin cifras reales.",
      universo: { nEntidades: 450, descripcion: "entidades de prueba comparables entre los dos cortes" },
      fuente: "Fuente de prueba",
      metodologia: "Metodología de prueba: índices base 100 sobre el universo comparable.",
    },
    {
      id: "riesgo",
      numero: "02",
      titulo: "Riesgo y calidad financiera",
      subtitulo: "Distribución sintética por bandas de un indicador de prueba",
      visualizacion: "distribucion",
      series: [
        {
          id: "entidades-por-banda",
          etiqueta: "Entidades por banda",
          unidad: "n",
          puntos: [
            { x: "Banda 1", y: 200, nota: "40 % de la cartera" },
            { x: "Banda 2", y: 150, nota: "35 % de la cartera" },
            { x: "Banda 3", y: 100, nota: "18 % de la cartera" },
            { x: "Banda 4", y: 50, nota: "7 % de la cartera" },
          ],
        },
      ],
      insight:
        "Lectura de prueba. Aquí iría la interpretación de la distribución: cuántas entidades caen en cada banda y qué parte del total representan.",
      universo: { nEntidades: 500, descripcion: "universo sintético de prueba" },
      fuente: "Fuente de prueba",
      metodologia: "Metodología de prueba: bandas por umbrales sintéticos.",
      metrica: {
        clave: "indicador-prueba",
        etiqueta: "Indicador de prueba",
        definicion: "Definición sintética del indicador.",
      },
    },
    {
      id: "distribucion",
      numero: "03",
      titulo: "Estructura y concentración",
      subtitulo: "Composición sintética por tipo y por territorio",
      visualizacion: "composicion",
      series: [
        {
          id: "por-tipo",
          etiqueta: "Por tipo de organización",
          unidad: "pct",
          puntos: [
            { x: "Tipo 1", y: 0.6 },
            { x: "Tipo 2", y: 0.25 },
            { x: "Tipo 3", y: 0.1 },
            { x: "Tipo 4", y: 0.05 },
          ],
        },
        {
          id: "por-territorio",
          etiqueta: "Por territorio",
          unidad: "pct",
          puntos: [
            { x: "Territorio 1", y: 0.35 },
            { x: "Territorio 2", y: 0.25 },
            { x: "Territorio 3", y: 0.2 },
            { x: "Otros", y: 0.2 },
          ],
        },
      ],
      insight:
        "Lectura de prueba. Aquí iría la interpretación de la composición: qué tipos y qué territorios concentran la actividad.",
      universo: { nEntidades: 500, descripcion: "universo sintético de prueba" },
      fuente: "Fuente de prueba",
      metodologia: "Metodología de prueba: participaciones sobre el total sintético.",
    },
  ],
  contexto: {
    rangos: [
      { etiqueta: "Rango 1", participacionEntidades: 0.4, participacionActivo: 0.05 },
      { etiqueta: "Rango 2", participacionEntidades: 0.3, participacionActivo: 0.15 },
      { etiqueta: "Rango 3", participacionEntidades: 0.2, participacionActivo: 0.3 },
      { etiqueta: "Rango 4", participacionEntidades: 0.1, participacionActivo: 0.5 },
    ],
  },
  metodologia: {
    resumen: "Metodología de prueba. Ningún valor de esta fixture representa el sector.",
    limitaciones: ["Fixture de desarrollo: valores sintéticos.", "No publicar."],
  },
};

/**
 * ============================================================
 *  DEV ONLY · NO PUBLICAR · Fixture del contrato v2 (Observatorio)
 * ============================================================
 * Un solo corte (fotografía del sector) con valores SINTÉTICOS y redondos: no
 * representan ninguna cifra del sector solidario. Sirve para diseñar la
 * portada, el resumen ejecutivo, los tres capítulos y la metodología. Los
 * modos de dos cortes (comparación) y tres o más (serie) se cargan con
 * SECTOR_FIXTURE_MODO=comparacion | serie, solo en desarrollo.
 */

const corteActual: CorteV2 = {
  id: "0000-07",
  etiqueta: "Corte de prueba",
  fechaCorte: "2000-07-31",
  estado: "completo",
  cobertura: "Cobertura de prueba: universo sintético para validar el diseño.",
  nReportantes: 380,
  nUniverso: 300,
  procesadoEl: "2000-08-01T00:00:00.000Z",
};

const BASE_V2: SectorSnapshotV2 = {
  version: 2,
  generadoEl: "2000-08-01T00:00:00.000Z",
  origen: "fixture",
  fuente: {
    datos: {
      entidad: "Fuente de prueba (fixture de desarrollo)",
      descripcion: "Archivo sintético de prueba.",
    },
    procesamiento: { entidad: "Procesamiento de prueba", descripcion: "Cálculo y lectura de prueba." },
  },
  metodologia: {
    codigo: "fixture-v2",
    version: "0.0.0",
    nombre: "Metodología de prueba",
    descripcion: "Ningún valor de esta fixture representa el sector. Solo prueba el diseño del informe.",
    evaluador: "0.0.0",
    universo: {
      definicion: "Entidades de prueba con saldo sintético mayor que cero.",
      criterio: "Filtro sintético sobre un agregado de prueba.",
    },
    exclusiones: [
      "Entidades de prueba sin saldo.",
      "Categorías con menos de tres entidades (se agrupan en «Otros»).",
    ],
    definiciones: [
      {
        clave: "cartera_bruta",
        etiqueta: "Cartera bruta",
        definicion: "Suma sintética A (pesos de prueba).",
        unidad: "cop",
      },
      {
        clave: "cartera_vencida",
        etiqueta: "Cartera vencida",
        definicion: "Suma sintética B.",
        unidad: "cop",
        direccion: "menor_es_mejor",
      },
      {
        clave: "icm",
        etiqueta: "Indicador de prueba 1",
        definicion: "Razón sintética B / A.",
        unidad: "pct",
        formula: "B / A",
        direccion: "menor_es_mejor",
      },
      {
        clave: "icv",
        etiqueta: "Indicador de prueba 2",
        definicion: "Razón sintética C / A.",
        unidad: "pct",
        formula: "C / A",
        direccion: "menor_es_mejor",
      },
      {
        clave: "cobertura",
        etiqueta: "Indicador de prueba 3",
        definicion: "Razón sintética D / B.",
        unidad: "pct",
        formula: "D / B",
        direccion: "mayor_es_mejor",
      },
    ],
    comparabilidad: {
      criterio: "identificador presente en ambos cortes (prueba)",
      descripcion: "Solo se comparan entidades presentes en ambos cortes bajo la misma metodología.",
    },
    limitaciones: ["Fixture de desarrollo: valores sintéticos.", "No publicar."],
    minEntidadesPorCategoria: 3,
  },
  cortes: [corteActual],
  hallazgos: [
    {
      id: "h1",
      clasificacion: "dimension",
      capitulo: "dimension",
      titulo: "Hallazgo de prueba sobre la dimensión",
      cifra: { clave: "cartera_bruta", etiqueta: "Cartera bruta", valor: 12_000_000_000_000, unidad: "cop" },
      lectura:
        "Lectura de prueba: dos o tres frases para comprobar el ritmo tipográfico del hallazgo junto a su cifra.",
      universo: { nEntidades: 300, descripcion: "entidades de prueba en el universo" },
    },
    {
      id: "h2",
      clasificacion: "riesgo",
      capitulo: "riesgo",
      titulo: "Hallazgo de prueba sobre el riesgo",
      cifra: { clave: "icm", etiqueta: "Indicador de prueba 1", valor: 0.08, unidad: "pct" },
      lectura:
        "Lectura de prueba sobre la dispersión del indicador entre entidades: la mitad está por debajo de un umbral sintético.",
      universo: { nEntidades: 300, descripcion: "entidades de prueba con denominador" },
    },
    {
      id: "h3",
      clasificacion: "concentracion",
      capitulo: "estructura",
      titulo: "Hallazgo de prueba sobre la concentración",
      cifra: {
        clave: "concentracion_top10",
        etiqueta: "Participación de las 10 mayores",
        valor: 0.42,
        unidad: "pct",
      },
      lectura: "Lectura de prueba: pocas entidades concentran una parte grande de la medida sintética.",
      universo: { nEntidades: 300, descripcion: "entidades de prueba en el universo" },
    },
    {
      id: "h4",
      clasificacion: "estructura",
      capitulo: "estructura",
      titulo: "Hallazgo de prueba sobre el territorio",
      cifra: { clave: "territorio_top3", etiqueta: "Tres territorios de prueba", valor: 0.61, unidad: "pct" },
      lectura: "Lectura de prueba sobre dónde se ubica la actividad sintética.",
      universo: { nEntidades: 300, descripcion: "entidades de prueba en el universo" },
    },
  ],
  dimension: {
    principal: "cartera_bruta",
    cifras: [
      {
        clave: "cartera_bruta",
        etiqueta: "Cartera bruta",
        valor: 12_000_000_000_000,
        unidad: "cop",
        definicion: "Suma sintética A.",
      },
      { clave: "cartera_neta", etiqueta: "Cartera neta", valor: 11_400_000_000_000, unidad: "cop" },
      { clave: "cartera_vencida", etiqueta: "Cartera vencida", valor: 960_000_000_000, unidad: "cop" },
      { clave: "entidades", etiqueta: "Entidades en el universo", valor: 300, unidad: "entidades" },
      { clave: "asociados", etiqueta: "Asociados", valor: 4_200_000, unidad: "n", nota: "Suma de prueba" },
    ],
  },
  riesgo: {
    principal: "icm",
    indicadores: [
      {
        clave: "icm",
        etiqueta: "Indicador de prueba 1",
        definicion: "Razón sintética B / A: qué parte de A está en B.",
        unidad: "pct",
        ponderado: 0.08,
        distribucion: { n: 300, media: 0.095, mediana: 0.071, p25: 0.041, p75: 0.128, min: 0, max: 0.41 },
        direccion: "menor_es_mejor",
      },
      {
        clave: "icv",
        etiqueta: "Indicador de prueba 2",
        definicion: "Razón sintética C / A.",
        unidad: "pct",
        ponderado: 0.045,
        distribucion: { n: 300, media: 0.052, mediana: 0.038, p25: 0.02, p75: 0.07 },
        direccion: "menor_es_mejor",
      },
      {
        clave: "cobertura",
        etiqueta: "Indicador de prueba 3",
        definicion: "Razón sintética D / B.",
        unidad: "pct",
        ponderado: 0.62,
        distribucion: { n: 290, media: 0.7, mediana: 0.58, p25: 0.35, p75: 0.95 },
        direccion: "mayor_es_mejor",
        nota: "Solo entidades con B mayor que cero.",
      },
    ],
  },
  estructura: {
    segmentaciones: [
      {
        clave: "tipo",
        etiqueta: "Por tipo de organización",
        medida: { clave: "cartera_bruta", etiqueta: "Cartera bruta", unidad: "cop" },
        categorias: [
          { etiqueta: "Tipo 1", entidades: 150, valor: 7_200_000_000_000, participacion: 0.6 },
          { etiqueta: "Tipo 2", entidades: 90, valor: 3_000_000_000_000, participacion: 0.25 },
          { etiqueta: "Tipo 3", entidades: 45, valor: 1_200_000_000_000, participacion: 0.1 },
          { etiqueta: "Otros", entidades: 15, valor: 600_000_000_000, participacion: 0.05 },
        ],
        concentracion: {
          descripcion: "Las 10 mayores entidades de prueba",
          entidades: 10,
          participacion: 0.42,
        },
      },
      {
        clave: "departamento",
        etiqueta: "Por territorio",
        medida: { clave: "cartera_bruta", etiqueta: "Cartera bruta", unidad: "cop" },
        categorias: [
          { etiqueta: "Territorio 1", entidades: 80, valor: 4_200_000_000_000, participacion: 0.35 },
          { etiqueta: "Territorio 2", entidades: 60, valor: 3_000_000_000_000, participacion: 0.25 },
          { etiqueta: "Territorio 3", entidades: 50, valor: 2_400_000_000_000, participacion: 0.2 },
          { etiqueta: "Otros", entidades: 110, valor: 2_400_000_000_000, participacion: 0.2 },
        ],
      },
      {
        clave: "tamano",
        etiqueta: "Por tamaño (rangos de cartera)",
        medida: { clave: "cartera_bruta", etiqueta: "Cartera bruta", unidad: "cop" },
        categorias: [
          { etiqueta: "Rango 1 (menor)", entidades: 120, valor: 600_000_000_000, participacion: 0.05 },
          { etiqueta: "Rango 2", entidades: 90, valor: 1_800_000_000_000, participacion: 0.15 },
          { etiqueta: "Rango 3", entidades: 60, valor: 3_600_000_000_000, participacion: 0.3 },
          { etiqueta: "Rango 4 (mayor)", entidades: 30, valor: 6_000_000_000_000, participacion: 0.5 },
        ],
        nota: "Rangos sintéticos.",
      },
    ],
  },
  evolucion: null,
  contexto: {
    rangos: [
      { etiqueta: "Rango 1", participacionEntidades: 0.4, participacionActivo: 0.05 },
      { etiqueta: "Rango 2", participacionEntidades: 0.3, participacionActivo: 0.15 },
      { etiqueta: "Rango 3", participacionEntidades: 0.2, participacionActivo: 0.3 },
      { etiqueta: "Rango 4", participacionEntidades: 0.1, participacionActivo: 0.5 },
    ],
  },
};

const corteBase: CorteV2 = {
  ...corteActual,
  id: "0000-03",
  etiqueta: "Corte de prueba anterior",
  fechaCorte: "2000-03-31",
  nReportantes: 370,
  nUniverso: 290,
  procesadoEl: "2000-04-01T00:00:00.000Z",
};

const evolucionDosCortes: Evolucion = {
  base: { corteId: corteBase.id, etiqueta: corteBase.etiqueta, fechaCorte: corteBase.fechaCorte },
  nActual: 300,
  nBase: 290,
  nComparables: 280,
  criterio: "identificador presente en ambos cortes bajo la misma metodología (prueba)",
  exclusiones: [
    "Entidades presentes en un solo corte.",
    "Entidades fuera del universo en alguno de los dos cortes.",
  ],
  variaciones: [
    {
      clave: "cartera_bruta",
      etiqueta: "Cartera bruta",
      unidad: "cop",
      actual: 11_800_000_000_000,
      base: 11_000_000_000_000,
      variacion: 0.073,
      variacionUnidad: "pct",
    },
    {
      clave: "cartera_vencida",
      etiqueta: "Cartera vencida",
      unidad: "cop",
      actual: 940_000_000_000,
      base: 900_000_000_000,
      variacion: 0.044,
      variacionUnidad: "pct",
    },
    {
      clave: "icm",
      etiqueta: "Indicador de prueba 1",
      unidad: "pct",
      actual: 0.0797,
      base: 0.0818,
      variacion: -0.21,
      variacionUnidad: "pp",
    },
  ],
  lectura: "Lectura de prueba de la comparación entre dos cortes sobre el universo comparable.",
};

/** Dos cortes comparables: la web debe mostrar la comparación (sin series). */
export const SNAPSHOT_DEV_V2_COMPARACION: SectorSnapshotV2 = {
  ...BASE_V2,
  cortes: [corteActual, corteBase],
  evolucion: evolucionDosCortes,
};

/** Tres cortes: la web debe mostrar la serie. */
export const SNAPSHOT_DEV_V2_SERIE: SectorSnapshotV2 = {
  ...BASE_V2,
  cortes: [
    corteActual,
    corteBase,
    {
      ...corteBase,
      id: "9999-12",
      etiqueta: "Corte de prueba inicial",
      fechaCorte: "1999-12-31",
      nUniverso: 285,
    },
  ],
  evolucion: {
    ...evolucionDosCortes,
    nComparables: 270,
    series: [
      {
        clave: "cartera_bruta",
        etiqueta: "Cartera bruta",
        unidad: "cop",
        puntos: [
          { corteId: "9999-12", etiqueta: "Inicial", y: 10_400_000_000_000 },
          { corteId: "0000-03", etiqueta: "Anterior", y: 11_000_000_000_000 },
          { corteId: "0000-07", etiqueta: "Actual", y: 11_800_000_000_000 },
        ],
      },
      {
        clave: "icm",
        etiqueta: "Indicador de prueba 1",
        unidad: "pct",
        puntos: [
          { corteId: "9999-12", etiqueta: "Inicial", y: 0.086 },
          { corteId: "0000-03", etiqueta: "Anterior", y: 0.0818 },
          { corteId: "0000-07", etiqueta: "Actual", y: 0.0797 },
        ],
      },
    ],
  },
};

/** La fixture v2 que carga SECTOR_FIXTURE=true: un corte (fotografía), salvo SECTOR_FIXTURE_MODO. */
export const SNAPSHOT_DEV_V2: SectorSnapshotV2 =
  process.env.SECTOR_FIXTURE_MODO === "serie"
    ? SNAPSHOT_DEV_V2_SERIE
    : process.env.SECTOR_FIXTURE_MODO === "comparacion"
      ? SNAPSHOT_DEV_V2_COMPARACION
      : BASE_V2;

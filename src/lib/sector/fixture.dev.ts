import type { SectorSnapshot } from "@/lib/sector/types";

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

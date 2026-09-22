/**
 * Contrato de datos de la sección «Inteligencia del sector».
 *
 * Lo produce el motor sectorial de SIAR (o un script equivalente) como un JSON
 * aprobado y trazable; la web solo lo lee. Principios:
 *  - agregados, nunca filas por entidad;
 *  - cada cifra viene con su corte, su cobertura y su fuente;
 *  - la lectura ejecutiva (`insight`) llega escrita: la UI no deriva conclusiones;
 *  - la historia de riesgo no está acoplada a ningún indicador concreto (ICM, ICV,
 *    deterioro, cobertura…): el nombre y la definición de la métrica viajan en el snapshot.
 *
 * Regla del proyecto: ninguna cifra sectorial se publica sin un snapshot aprobado y trazable.
 */

/** Unidades que sabe formatear la web. `indice` es un número abstracto (base 100). */
export type Unidad = "cop" | "entidades" | "pct" | "pp" | "n" | "indice";

export interface Fuente {
  /** Quién publica los datos de origen. */
  entidad: string;
  url?: string;
  /** Quién los procesa y analiza. */
  procesamiento: string;
  /** Fecha de publicación del archivo de origen (ISO), si se conoce. */
  publicadoEl?: string;
}

export interface Cobertura {
  tipo: "completo" | "parcial";
  /** Qué significa esa cobertura en este corte, en palabras (p. ej. qué entidades reportan). */
  descripcion: string;
}

export interface Corte {
  /** Identificador estable, p. ej. "2026-06". */
  id: string;
  /** Etiqueta legible, p. ej. "Junio 2026". */
  etiqueta: string;
  /** Fecha de corte del estado financiero (ISO, AAAA-MM-DD). */
  fechaCorte: string;
  cobertura: Cobertura;
  nEntidades: number;
}

/**
 * Comparación entre dos cortes. `nComparables` es el tamaño del universo común
 * (entidades presentes en ambos cortes según `criterio`), no el total de ninguno de los dos.
 */
export interface Comparacion {
  base: Corte;
  nComparables: number;
  /** P. ej. "NIT normalizado presente en ambos cortes". */
  criterio: string;
}

export type KpiClave = "entidades" | "activo" | "cartera" | "depositos" | "patrimonio";

export interface Kpi {
  clave: KpiClave;
  etiqueta: string;
  valor: number;
  unidad: Unidad;
  /** Aclaración breve bajo el número (definición, alcance), opcional. */
  nota?: string;
}

/** Familias visuales que la web sabe dibujar. */
export type Visualizacion = "comparacion" | "distribucion" | "composicion";

export interface Punto {
  /** Categoría, banda, corte o etiqueta del eje. */
  x: string;
  y: number;
  /** Texto adicional ya preparado (p. ej. "+8,2 %"), se muestra tal cual. */
  nota?: string;
}

export interface Serie {
  id: string;
  etiqueta: string;
  unidad: Unidad;
  puntos: Punto[];
}

export type HistoriaId = "crecimiento" | "riesgo" | "distribucion";

export interface Metrica {
  /** Clave técnica de la métrica que ilustra la historia (p. ej. "icm"). La UI no la interpreta. */
  clave: string;
  etiqueta: string;
  definicion: string;
}

export interface Historia {
  id: HistoriaId;
  numero: "01" | "02" | "03";
  titulo: string;
  subtitulo: string;
  visualizacion: Visualizacion;
  series: Serie[];
  /** Lectura ejecutiva ya redactada. La UI la muestra; nunca la calcula. */
  insight: string;
  universo: { nEntidades: number; descripcion: string };
  fuente: string;
  metodologia: string;
  metrica?: Metrica;
}

export interface Contexto {
  rangos: Array<{
    etiqueta: string;
    /** Participación 0–1 en el número de entidades. */
    participacionEntidades: number;
    /** Participación 0–1 en el activo. */
    participacionActivo: number;
  }>;
}

export type DimensionFiltro = "tipo" | "departamento" | "periodo";

export interface SectorSnapshot {
  version: 1;
  /** ISO. */
  generadoEl: string;
  /** "fixture" solo existe en desarrollo (ver source.ts). */
  origen: "siar" | "script" | "fixture";
  corte: Corte;
  comparacion: Comparacion | null;
  fuente: Fuente;
  kpis: Kpi[];
  historias: Historia[];
  contexto?: Contexto;
  metodologia: { resumen: string; limitaciones: string[] };
  /** Dimensiones con datos disponibles para filtrar (2B.2). Sin datos por dimensión, se omite. */
  filtros?: { dimensiones: DimensionFiltro[] };
}

/* =============================================================================
   SectorSnapshot v2 — el artefacto público del Observatorio Novum
   ---------------------------------------------------------------------------
   Lo genera SIAR (job `sector-snapshot`, sobre las funciones agregadas de la
   0195) y novum-site solo lo lee. Es el ÚNICO dato que la web necesita del
   motor sectorial. Principios, además de los de la v1:
   - agregados por segmento con k-anonimato: ninguna categoría publicada tiene
     menos de `metodologia.minEntidadesPorCategoria` entidades; nunca NIT,
     nombre ni cifra de una entidad identificable;
   - las claves de cifras e indicadores son las de la versión de metodología
     (`cartera_bruta`, `icm`…) y viajan con etiqueta, definición y unidad: la
     web no conoce el vocabulario del motor;
   - el DATO (motor) y la LECTURA NOVUM (`lectura`) viajan en campos distintos y
     la UI los identifica como cosas distintas;
   - `cortes` trae todos los cortes con cifras (el actual primero). Con uno, la
     web publica la fotografía del sector; con dos y `evolucion` válida, la
     comparación; con tres o más y `evolucion.series`, la serie. Lo decide el
     dato, no una bandera.
   ==========================================================================*/

export type Direccion = "menor_es_mejor" | "mayor_es_mejor" | "neutro";

export interface FuenteV2 {
  /** Quién publica los datos de origen (Supersolidaria). */
  datos: { entidad: string; url?: string; descripcion?: string; publicadoEl?: string };
  /** Quién procesa, calcula y escribe la lectura (Novum Integral). */
  procesamiento: { entidad: string; descripcion?: string };
}

export interface CorteV2 {
  /** Identificador estable, p. ej. "2026-07". */
  id: string;
  /** "Julio 2026". */
  etiqueta: string;
  /** AAAA-MM-DD. */
  fechaCorte: string;
  estado: "completo" | "parcial";
  /** Qué significa esa cobertura, en palabras. */
  cobertura: string;
  /** Entidades presentes en el archivo oficial del corte. */
  nReportantes: number;
  /** Entidades que entran al universo de la metodología. */
  nUniverso: number;
  /** ISO: cuándo lo procesó el motor. */
  procesadoEl: string;
}

export interface Definicion {
  clave: string;
  etiqueta: string;
  definicion: string;
  unidad: Unidad;
  /** Fórmula legible ("cartera vencida / cartera bruta"), opcional. */
  formula?: string;
  direccion?: Direccion;
}

export interface MetodologiaV2 {
  codigo: string;
  version: string;
  nombre: string;
  descripcion: string;
  /** Versión del evaluador del motor, para trazabilidad. */
  evaluador?: string;
  universo: { definicion: string; criterio: string };
  exclusiones: string[];
  definiciones: Definicion[];
  comparabilidad: { criterio: string; descripcion: string };
  limitaciones: string[];
  /** k-anonimato: mínimo de entidades por categoría publicada (≥ 3). */
  minEntidadesPorCategoria: number;
}

export type Clasificacion = "dimension" | "evolucion" | "riesgo" | "estructura" | "concentracion";
export type CapituloId = "dimension" | "riesgo" | "estructura" | "evolucion";

export interface Cifra {
  clave: string;
  etiqueta: string;
  valor: number;
  unidad: Unidad;
  definicion?: string;
  nota?: string;
}

/** Un hallazgo del resumen ejecutivo: el dato sale del motor; `lectura` es la Lectura Novum. */
export interface Hallazgo {
  id: string;
  clasificacion: Clasificacion;
  capitulo: CapituloId;
  titulo: string;
  cifra: Cifra;
  lectura: string;
  universo: { nEntidades: number; descripcion: string };
}

/** Distribución de un indicador entre entidades, solo sobre valores no nulos. */
export interface Distribucion {
  n: number;
  media: number;
  mediana: number;
  p25: number;
  p75: number;
  min?: number;
  max?: number;
}

export interface IndicadorRiesgo {
  clave: string;
  etiqueta: string;
  definicion: string;
  unidad: Unidad;
  /** El indicador del SECTOR: la fórmula de la versión sobre las sumas. null = sin denominador. */
  ponderado: number | null;
  distribucion?: Distribucion;
  direccion?: Direccion;
  nota?: string;
}

export interface CategoriaSegmento {
  etiqueta: string;
  entidades: number;
  /** Suma de la medida en la categoría. */
  valor: number;
  /** Participación 0–1 de la categoría en la medida. */
  participacion: number;
}

export interface Segmentacion {
  /** "tipo" | "nivel" | "departamento" | "tamano" | otra que el motor defina. */
  clave: string;
  etiqueta: string;
  medida: { clave: string; etiqueta: string; unidad: Unidad };
  categorias: CategoriaSegmento[];
  /** Concentración ya calculada (p. ej. "las 10 mayores entidades"), agregada y anónima. */
  concentracion?: { descripcion: string; entidades: number; participacion: number };
  nota?: string;
}

export interface Variacion {
  clave: string;
  etiqueta: string;
  unidad: Unidad;
  actual: number;
  base: number;
  /** Variación ya calculada por el motor sobre el universo comparable. */
  variacion: number;
  variacionUnidad: "pct" | "pp";
}

export interface SerieTemporal {
  clave: string;
  etiqueta: string;
  unidad: Unidad;
  puntos: Array<{ corteId: string; etiqueta: string; y: number }>;
}

/** Solo existe cuando hay dos o más cortes comparables bajo un criterio declarado. */
export interface Evolucion {
  base: { corteId: string; etiqueta: string; fechaCorte: string };
  nActual: number;
  nBase: number;
  /** Entidades presentes en ambos cortes según `criterio`. */
  nComparables: number;
  criterio: string;
  exclusiones: string[];
  variaciones: Variacion[];
  /** Con tres o más cortes comparables: la serie completa. */
  series?: SerieTemporal[];
  lectura?: string;
}

export interface SectorSnapshotV2 {
  version: 2;
  generadoEl: string;
  origen: "siar" | "fixture";
  fuente: FuenteV2;
  metodologia: MetodologiaV2;
  /** Todos los cortes con cifras, del más reciente al más antiguo. `cortes[0]` es el actual. */
  cortes: CorteV2[];
  /** 3–5 hallazgos del corte actual. */
  hallazgos: Hallazgo[];
  dimension: { cifras: Cifra[]; principal?: string };
  riesgo: { indicadores: IndicadorRiesgo[]; principal?: string };
  estructura: { segmentaciones: Segmentacion[] };
  evolucion?: Evolucion | null;
  contexto?: Contexto;
}

export type SectorSnapshotAny = SectorSnapshot | SectorSnapshotV2;

export function esV2(s: SectorSnapshotAny): s is SectorSnapshotV2 {
  return s.version === 2;
}

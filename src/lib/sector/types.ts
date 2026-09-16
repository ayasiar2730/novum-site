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

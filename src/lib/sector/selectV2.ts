import type {
  CapituloId,
  Cifra,
  Distribucion,
  Evolucion,
  Hallazgo,
  IndicadorRiesgo,
  SectorSnapshotV2,
  Segmentacion,
  Unidad,
} from "@/lib/sector/types";
import { corto, fechaLarga, kpi, participacion } from "@/lib/sector/format";
import type { RangoVM } from "@/lib/sector/select";

/**
 * Selectores puros del contrato v2: del snapshot a lo que cada bloque del
 * Observatorio necesita, ya formateado. Aquí no se calcula ninguna cifra
 * nueva ni se escribe ninguna conclusión: se ordena, se etiqueta y se
 * formatea lo que el motor trae. La única decisión es el MODO temporal, y
 * la toma el dato: cuántos cortes hay y si la comparación es válida.
 */

export type ModoTemporal = "foto" | "comparacion" | "serie";

/** 1 corte → fotografía; 2 con comparación válida → comparación; 3+ con series → serie. */
export function modoTemporal(s: SectorSnapshotV2): ModoTemporal {
  const e = s.evolucion;
  const valida = Boolean(e && e.nComparables > 0 && e.variaciones.length > 0 && e.criterio.trim());
  if (!valida) return "foto";
  if (s.cortes.length >= 3 && e?.series && e.series.length > 0) return "serie";
  if (s.cortes.length >= 2) return "comparacion";
  return "foto";
}

export interface ValorVM {
  valor: string;
  unidad: string;
}

function formatear(valor: number, unidad: Unidad): ValorVM {
  return kpi(valor, unidad);
}

export interface PortadaVM {
  corteEtiqueta: string;
  fechaCorte: string;
  fechaCorteIso: string;
  estado: "completo" | "parcial";
  estadoEtiqueta: string;
  cobertura: string;
  nUniverso: string;
  nReportantes: string;
  fuenteDatos: string;
  fuenteUrl?: string;
  procesamiento: string;
  metodologia: string;
  modo: ModoTemporal;
  nCortes: number;
}

export function selectPortada(s: SectorSnapshotV2): PortadaVM {
  const c = s.cortes[0];
  return {
    corteEtiqueta: c.etiqueta,
    fechaCorte: fechaLarga(c.fechaCorte),
    fechaCorteIso: c.fechaCorte,
    estado: c.estado,
    estadoEtiqueta: c.estado === "completo" ? "Corte completo" : "Corte parcial",
    cobertura: c.cobertura,
    nUniverso: kpi(c.nUniverso, "entidades").valor,
    nReportantes: kpi(c.nReportantes, "entidades").valor,
    fuenteDatos: s.fuente.datos.entidad,
    fuenteUrl: s.fuente.datos.url,
    procesamiento: s.fuente.procesamiento.entidad,
    metodologia: `${s.metodologia.nombre} · ${s.metodologia.codigo} ${s.metodologia.version}`,
    modo: modoTemporal(s),
    nCortes: s.cortes.length,
  };
}

export interface HallazgoVM {
  id: string;
  clasificacion: Hallazgo["clasificacion"];
  clasificacionEtiqueta: string;
  capitulo: CapituloId;
  capituloEtiqueta: string;
  titulo: string;
  cifra: ValorVM & { etiqueta: string };
  lectura: string;
  universo: string;
}

const CLASIFICACION: Record<Hallazgo["clasificacion"], string> = {
  dimension: "Dimensión",
  evolucion: "Evolución",
  riesgo: "Riesgo",
  estructura: "Estructura",
  concentracion: "Concentración",
};

export const CAPITULOS: Record<CapituloId, { numero: string; etiqueta: string }> = {
  dimension: { numero: "01", etiqueta: "Dimensión del sector" },
  riesgo: { numero: "02", etiqueta: "Riesgo y calidad financiera" },
  estructura: { numero: "03", etiqueta: "Estructura del sector" },
  evolucion: { numero: "04", etiqueta: "Evolución" },
};

export function selectHallazgos(s: SectorSnapshotV2): HallazgoVM[] {
  return s.hallazgos.slice(0, 5).map((h) => ({
    id: h.id,
    clasificacion: h.clasificacion,
    clasificacionEtiqueta: CLASIFICACION[h.clasificacion],
    capitulo: h.capitulo,
    capituloEtiqueta: `${CAPITULOS[h.capitulo].numero} · ${CAPITULOS[h.capitulo].etiqueta}`,
    titulo: h.titulo,
    cifra: { ...formatear(h.cifra.valor, h.cifra.unidad), etiqueta: h.cifra.etiqueta },
    lectura: h.lectura,
    universo: `${kpi(h.universo.nEntidades, "entidades").valor} entidades — ${h.universo.descripcion}`,
  }));
}

export interface CifraVM {
  clave: string;
  etiqueta: string;
  valor: string;
  unidad: string;
  definicion?: string;
  nota?: string;
  /** 0–100: proporción respecto de la cifra principal cuando comparten unidad; para la barra de contexto. */
  pctDePrincipal?: number;
}

export interface DimensionVM {
  principal: CifraVM | null;
  secundarias: CifraVM[];
}

function cifraVM(c: Cifra): CifraVM {
  const f = formatear(c.valor, c.unidad);
  return {
    clave: c.clave,
    etiqueta: c.etiqueta,
    valor: f.valor,
    unidad: f.unidad,
    definicion: c.definicion,
    nota: c.nota,
  };
}

export function selectDimension(s: SectorSnapshotV2): DimensionVM {
  const cifras = s.dimension.cifras;
  if (cifras.length === 0) return { principal: null, secundarias: [] };
  const principal = cifras.find((c) => c.clave === s.dimension.principal) ?? cifras[0];
  const secundarias = cifras
    .filter((c) => c !== principal)
    .map((c) => {
      const vm = cifraVM(c);
      if (c.unidad === principal.unidad && principal.valor > 0 && c.valor >= 0) {
        vm.pctDePrincipal = Math.min(100, (c.valor / principal.valor) * 100);
      }
      return vm;
    });
  return { principal: cifraVM(principal), secundarias };
}

export interface DistribucionVM {
  n: string;
  media: string;
  mediana: string;
  p25: string;
  p75: string;
  /**
   * Posiciones 0–100 para dibujar la banda p25–p75, la mediana y el ponderado.
   * `min`/`max` son el mínimo y el máximo OBSERVADOS, solo si el snapshot los
   * trae; si no, null: los límites de la escala no se rotulan (no son datos).
   */
  escala: {
    p25: number;
    mediana: number;
    p75: number;
    ponderado: number | null;
    min: string | null;
    max: string | null;
  };
}

export interface IndicadorVM {
  clave: string;
  etiqueta: string;
  definicion: string;
  ponderado: ValorVM | null;
  distribucion: DistribucionVM | null;
  direccion: IndicadorRiesgo["direccion"];
  nota?: string;
}

function escalar(d: Distribucion, ponderado: number | null, unidad: Unidad): DistribucionVM {
  const lo = d.min ?? Math.min(0, d.p25);
  const hi = d.max ?? Math.max(d.p75, ponderado ?? d.p75) * 1.15;
  const span = hi - lo || 1;
  const pos = (v: number) => Math.max(0, Math.min(100, ((v - lo) / span) * 100));
  return {
    n: kpi(d.n, "entidades").valor,
    media: corto(d.media, unidad),
    mediana: corto(d.mediana, unidad),
    p25: corto(d.p25, unidad),
    p75: corto(d.p75, unidad),
    escala: {
      p25: pos(d.p25),
      mediana: pos(d.mediana),
      p75: pos(d.p75),
      ponderado: ponderado === null ? null : pos(ponderado),
      min: d.min !== undefined ? corto(d.min, unidad) : null,
      max: d.max !== undefined ? corto(d.max, unidad) : null,
    },
  };
}

export interface RiesgoVM {
  principal: IndicadorVM | null;
  otros: IndicadorVM[];
}

export function selectRiesgo(s: SectorSnapshotV2): RiesgoVM {
  const vms: IndicadorVM[] = s.riesgo.indicadores.map((i) => ({
    clave: i.clave,
    etiqueta: i.etiqueta,
    definicion: i.definicion,
    ponderado: i.ponderado === null ? null : formatear(i.ponderado, i.unidad),
    distribucion: i.distribucion ? escalar(i.distribucion, i.ponderado, i.unidad) : null,
    direccion: i.direccion,
    nota: i.nota,
  }));
  if (vms.length === 0) return { principal: null, otros: [] };
  const principal = vms.find((v) => v.clave === s.riesgo.principal) ?? vms[0];
  return { principal, otros: vms.filter((v) => v !== principal) };
}

export interface CategoriaVM {
  etiqueta: string;
  entidades: string;
  valor: string;
  participacion: string;
  /** 0–100 */
  pct: number;
}

export interface SegmentacionVM {
  clave: string;
  etiqueta: string;
  medida: string;
  categorias: CategoriaVM[];
  concentracion?: { descripcion: string; entidades: string; participacion: string; pct: number };
  nota?: string;
}

export function selectEstructura(s: SectorSnapshotV2): SegmentacionVM[] {
  return s.estructura.segmentaciones
    .filter((seg) => seg.categorias.length > 0)
    .map((seg: Segmentacion) => ({
      clave: seg.clave,
      etiqueta: seg.etiqueta,
      medida: seg.medida.etiqueta,
      categorias: seg.categorias.map((c) => ({
        etiqueta: c.etiqueta,
        entidades: kpi(c.entidades, "entidades").valor,
        valor: corto(c.valor, seg.medida.unidad),
        participacion: participacion(c.participacion),
        pct: Math.max(0, Math.min(100, c.participacion * 100)),
      })),
      concentracion: seg.concentracion
        ? {
            descripcion: seg.concentracion.descripcion,
            entidades: kpi(seg.concentracion.entidades, "entidades").valor,
            participacion: participacion(seg.concentracion.participacion),
            pct: Math.max(0, Math.min(100, seg.concentracion.participacion * 100)),
          }
        : undefined,
      nota: seg.nota,
    }));
}

export interface VariacionVM {
  clave: string;
  etiqueta: string;
  actual: string;
  base: string;
  variacion: string;
  /** Solo el signo, para alinear; nunca color por «bueno/malo». */
  signo: "+" | "−" | "";
}

export interface SerieVM {
  clave: string;
  etiqueta: string;
  puntos: Array<{ etiqueta: string; valor: string; pct: number }>;
}

export interface EvolucionVM {
  modo: ModoTemporal;
  baseEtiqueta: string;
  baseFecha: string;
  actualEtiqueta: string;
  nComparables: string;
  nActual: string;
  nBase: string;
  criterio: string;
  exclusiones: string[];
  leyenda: string;
  variaciones: VariacionVM[];
  series: SerieVM[];
  lectura?: string;
}

function variacionTexto(v: number, unidad: "pct" | "pp"): { texto: string; signo: "+" | "−" | "" } {
  const signo: "+" | "−" | "" = v > 0 ? "+" : v < 0 ? "−" : "";
  const abs = Math.abs(v);
  const texto = unidad === "pct" ? `${signo}${corto(abs, "pct")}` : `${signo}${corto(abs, "pp")}`;
  return { texto, signo };
}

export function selectEvolucion(s: SectorSnapshotV2): EvolucionVM | null {
  const modo = modoTemporal(s);
  const e: Evolucion | null | undefined = s.evolucion;
  if (modo === "foto" || !e) return null;
  return {
    modo,
    baseEtiqueta: e.base.etiqueta,
    baseFecha: fechaLarga(e.base.fechaCorte),
    actualEtiqueta: s.cortes[0].etiqueta,
    nComparables: kpi(e.nComparables, "entidades").valor,
    nActual: kpi(e.nActual, "entidades").valor,
    nBase: kpi(e.nBase, "entidades").valor,
    criterio: e.criterio,
    exclusiones: e.exclusiones,
    leyenda: `Comparación construida sobre ${kpi(e.nComparables, "entidades").valor} entidades presentes en ambos cortes (${e.criterio}).`,
    variaciones: e.variaciones.map((v) => {
      const t = variacionTexto(v.variacion, v.variacionUnidad);
      return {
        clave: v.clave,
        etiqueta: v.etiqueta,
        actual: corto(v.actual, v.unidad),
        base: corto(v.base, v.unidad),
        variacion: t.texto,
        signo: t.signo,
      };
    }),
    series:
      modo === "serie" && e.series
        ? e.series.map((serie) => {
            const max = Math.max(...serie.puntos.map((p) => p.y), 0) || 1;
            return {
              clave: serie.clave,
              etiqueta: serie.etiqueta,
              puntos: serie.puntos.map((p) => ({
                etiqueta: p.etiqueta,
                valor: corto(p.y, serie.unidad),
                pct: (p.y / max) * 100,
              })),
            };
          })
        : [],
    lectura: e.lectura,
  };
}

export interface MetodologiaVM {
  nombre: string;
  codigo: string;
  version: string;
  descripcion: string;
  evaluador?: string;
  fechaCorte: string;
  fechaProcesamiento: string;
  universo: { definicion: string; criterio: string; n: string; nReportantes: string };
  cobertura: string;
  exclusiones: string[];
  definiciones: Array<{ etiqueta: string; definicion: string; formula?: string; unidad: string }>;
  comparabilidad: { criterio: string; descripcion: string };
  limitaciones: string[];
  k: string;
  fuenteDatos: { entidad: string; url?: string; descripcion?: string; publicadoEl?: string };
  procesamiento: { entidad: string; descripcion?: string };
}

const UNIDAD_TEXTO: Record<Unidad, string> = {
  cop: "pesos colombianos",
  entidades: "entidades",
  pct: "porcentaje",
  pp: "puntos porcentuales",
  n: "número",
  indice: "índice (base 100)",
};

export function selectMetodologia(s: SectorSnapshotV2): MetodologiaVM {
  const c = s.cortes[0];
  const m = s.metodologia;
  return {
    nombre: m.nombre,
    codigo: m.codigo,
    version: m.version,
    descripcion: m.descripcion,
    evaluador: m.evaluador,
    fechaCorte: fechaLarga(c.fechaCorte),
    fechaProcesamiento: fechaLarga(c.procesadoEl.slice(0, 10)),
    universo: {
      definicion: m.universo.definicion,
      criterio: m.universo.criterio,
      n: kpi(c.nUniverso, "entidades").valor,
      nReportantes: kpi(c.nReportantes, "entidades").valor,
    },
    cobertura: c.cobertura,
    exclusiones: m.exclusiones,
    definiciones: m.definiciones.map((d) => ({
      etiqueta: d.etiqueta,
      definicion: d.definicion,
      formula: d.formula,
      unidad: UNIDAD_TEXTO[d.unidad],
    })),
    comparabilidad: m.comparabilidad,
    limitaciones: m.limitaciones,
    k: kpi(m.minEntidadesPorCategoria, "entidades").valor,
    fuenteDatos: s.fuente.datos,
    procesamiento: s.fuente.procesamiento,
  };
}

/** Rangos de tamaño para «Su entidad en contexto», si el snapshot los trae. */
export function selectRangosContexto(s: SectorSnapshotV2): RangoVM[] | null {
  if (!s.contexto || s.contexto.rangos.length === 0) return null;
  return s.contexto.rangos.map((r) => ({
    etiqueta: r.etiqueta,
    entidades: participacion(r.participacionEntidades),
    activo: participacion(r.participacionActivo),
    pctEntidades: r.participacionEntidades * 100,
    pctActivo: r.participacionActivo * 100,
  }));
}

import type { Historia, SectorSnapshot, Unidad } from "@/lib/sector/types";
import { fechaLarga, kpi, participacion } from "@/lib/sector/format";

/**
 * Selectores puros: del snapshot a lo que cada componente necesita, ya formateado.
 * Aquí no se calcula ninguna cifra nueva ni se escribe ninguna conclusión:
 * se ordena, se etiqueta y se formatea lo que el snapshot trae.
 */

export interface CabeceraVM {
  corteEtiqueta: string;
  fechaCorte: string;
  fechaCorteIso: string;
  cobertura: string;
  nEntidades: string;
  comparacion: string | null;
  fuente: string;
  procesamiento: string;
  fuenteUrl?: string;
}

export function selectCabecera(s: SectorSnapshot): CabeceraVM {
  const c = s.comparacion;
  return {
    corteEtiqueta: s.corte.etiqueta,
    fechaCorte: fechaLarga(s.corte.fechaCorte),
    fechaCorteIso: s.corte.fechaCorte,
    cobertura: s.corte.cobertura.descripcion,
    nEntidades: kpi(s.corte.nEntidades, "entidades").valor,
    comparacion: c
      ? `Comparación con ${c.base.etiqueta}: ${kpi(c.nComparables, "entidades").valor} entidades comparables (${c.criterio}).`
      : null,
    fuente: s.fuente.entidad,
    procesamiento: s.fuente.procesamiento,
    fuenteUrl: s.fuente.url,
  };
}

export interface KpiVM {
  clave: string;
  etiqueta: string;
  valor: string;
  unidad: string;
  nota?: string;
}

export function selectKpis(s: SectorSnapshot): KpiVM[] {
  return s.kpis.map((k) => {
    const f = kpi(k.valor, k.unidad);
    return { clave: k.clave, etiqueta: k.etiqueta, valor: f.valor, unidad: f.unidad, nota: k.nota };
  });
}

export interface HistoriaVM {
  historia: Historia;
  /** «N entidades — descripción del universo», listo para mostrar. */
  universo: string;
  metrica?: { etiqueta: string; definicion: string };
}

export function selectHistorias(s: SectorSnapshot): HistoriaVM[] {
  return [...s.historias]
    .sort((a, b) => a.numero.localeCompare(b.numero))
    .map((h) => ({
      historia: h,
      universo: `${kpi(h.universo.nEntidades, "entidades").valor} entidades — ${h.universo.descripcion}`,
      metrica: h.metrica ? { etiqueta: h.metrica.etiqueta, definicion: h.metrica.definicion } : undefined,
    }));
}

export interface RangoVM {
  etiqueta: string;
  /** Formateados para mostrar ("12,5 %"). */
  entidades: string;
  activo: string;
  /** 0–100, para el ancho de la barra. */
  pctEntidades: number;
  pctActivo: number;
}

export function selectContexto(s: SectorSnapshot): RangoVM[] | null {
  if (!s.contexto || s.contexto.rangos.length === 0) return null;
  return s.contexto.rangos.map((r) => ({
    etiqueta: r.etiqueta,
    entidades: participacion(r.participacionEntidades),
    activo: participacion(r.participacionActivo),
    pctEntidades: r.participacionEntidades * 100,
    pctActivo: r.participacionActivo * 100,
  }));
}

/** Unidad dominante de una historia (la de su primera serie); las gráficas etiquetan con ella. */
export function unidadDe(h: Historia): Unidad {
  return h.series[0]?.unidad ?? "n";
}

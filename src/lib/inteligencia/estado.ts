/**
 * Estado del módulo en la dirección (URL): sección, filtros, entidad y corte.
 * Así el estado sobrevive al cambio de pestaña y de informe, se comparte con un
 * enlace y el botón «atrás» funciona. Un valor desconocido se ignora (no rompe).
 */

export type InformeId = "cartera-riesgo" | "panorama-financiero";

export interface EstadoModulo {
  seccion: string | null;
  tipo: string | null;
  departamento: string | null;
  entidad: string | null;
  corte: string | null;
  /** Variable elegida en las lecturas con selector (p. ej. qué crecimiento). */
  variable: string | null;
}

const PARAMS: Record<keyof EstadoModulo, string> = {
  seccion: "seccion",
  tipo: "tipo",
  departamento: "depto",
  entidad: "entidad",
  corte: "corte",
  variable: "ver",
};

export function leerEstado(q: URLSearchParams | { get(k: string): string | null }): EstadoModulo {
  const valor = (k: keyof EstadoModulo) => {
    const v = q.get(PARAMS[k]);
    return v && v.trim() ? v.trim().slice(0, 120) : null;
  };
  return {
    seccion: valor("seccion"),
    tipo: valor("tipo"),
    departamento: valor("departamento"),
    entidad: valor("entidad"),
    corte: valor("corte"),
    variable: valor("variable"),
  };
}

export function escribirEstado(e: Partial<EstadoModulo>): string {
  const q = new URLSearchParams();
  for (const k of Object.keys(PARAMS) as (keyof EstadoModulo)[]) {
    const v = e[k];
    if (v) q.set(PARAMS[k], v);
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}

/**
 * Al cambiar de informe se conservan los filtros que significan lo mismo en los
 * dos (departamento, entidad, corte). La sección y la variable son de cada
 * informe; el tipo se conserva solo si el otro informe lo tiene.
 */
export function estadoAlCambiarDeInforme(e: EstadoModulo, tiposDelDestino: string[]): EstadoModulo {
  return {
    seccion: null,
    variable: null,
    tipo: e.tipo && tiposDelDestino.includes(e.tipo) ? e.tipo : null,
    departamento: e.departamento,
    entidad: e.entidad,
    corte: e.corte,
  };
}

/** La sección válida: la pedida si existe; si no, la primera. */
export function seccionValida(pedida: string | null, secciones: readonly { id: string }[]): string {
  return secciones.some((s) => s.id === pedida) ? (pedida as string) : secciones[0].id;
}

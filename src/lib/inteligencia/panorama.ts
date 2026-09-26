import type { EntidadPanoramaPublica, FichaCifra, GrupoInteligencia, PanoramaPublico } from "./contrato";
import { clave } from "./formato";

/**
 * Lectura del Panorama financiero. Todas las cifras llegan calculadas por el
 * motor (por entidad y por grupo: sector, tipo, departamento y tipo ×
 * departamento); aquí solo se ELIGE cuál mostrar según los filtros y se ordena.
 * Ninguna función de este archivo suma, divide ni promedia cifras financieras.
 */

export interface FiltrosPanorama {
  /** Tipo oficial (como en `panorama.tipos`); null = todos. */
  tipo: string | null;
  /** Departamento (como en `panorama.departamentos`); null = todos. */
  departamento: string | null;
}

export interface Lector {
  claves: string[];
  ficha: Record<string, FichaCifra>;
  /** La cifra `k` de un arreglo de valores, o null. */
  de(v: (number | null)[], k: string): number | null;
}

export function lector(p: PanoramaPublico): Lector {
  const indice = new Map(p.claves.map((k, i) => [k, i]));
  return {
    claves: p.claves,
    ficha: p.ficha,
    de(v, k) {
      const i = indice.get(k);
      return i === undefined ? null : (v[i] ?? null);
    },
  };
}

/** El grupo que corresponde a los filtros (el motor ya lo calculó). null si no hay entidades en esa combinación. */
export function grupoDe(p: PanoramaPublico, f: FiltrosPanorama): GrupoInteligencia | null {
  if (f.tipo && f.departamento) return p.porTipoYDepartamento[f.tipo]?.[f.departamento] ?? null;
  if (f.tipo) return p.porTipo[f.tipo] ?? null;
  if (f.departamento) return p.porDepartamento[f.departamento] ?? null;
  return p.total;
}

/** Etiqueta del grupo elegido: «Sector», «Fondos de empleados», «Antioquia», «Fondos de empleados · Antioquia». */
export function etiquetaDeGrupo(f: FiltrosPanorama): string {
  if (f.tipo && f.departamento) return `${f.tipo} · ${f.departamento}`;
  return f.tipo ?? f.departamento ?? "Sector";
}

export function entidadesDe(p: PanoramaPublico, f: FiltrosPanorama): EntidadPanoramaPublica[] {
  const t = f.tipo ? p.tipos.indexOf(f.tipo) : -1;
  const d = f.departamento ? p.departamentos.indexOf(f.departamento) : -1;
  return p.entidades.filter((e) => (t < 0 || e.tipo === t) && (d < 0 || e.departamento === d));
}

/** Ordena por una cifra; las entidades sin dato van al final (no se esconden). */
export function ordenar(
  entidades: EntidadPanoramaPublica[],
  l: Lector,
  k: string,
  sentido: "desc" | "asc" = "desc",
): EntidadPanoramaPublica[] {
  return [...entidades].sort((a, b) => {
    const x = l.de(a.v, k);
    const y = l.de(b.v, k);
    if (x === null && y === null) return a.nombre.localeCompare(b.nombre, "es");
    if (x === null) return 1;
    if (y === null) return -1;
    return sentido === "desc" ? y - x : x - y;
  });
}

/** Búsqueda por nombre, sigla o código (sin acentos ni mayúsculas). */
export function buscar(
  entidades: EntidadPanoramaPublica[],
  texto: string,
  max = 12,
): EntidadPanoramaPublica[] {
  const q = clave(texto);
  if (!q) return [];
  const exactas: EntidadPanoramaPublica[] = [];
  const parciales: EntidadPanoramaPublica[] = [];
  for (const e of entidades) {
    const sigla = e.sigla ? clave(e.sigla) : "";
    if (sigla === q || e.codigo === texto.trim()) exactas.push(e);
    else if (sigla.includes(q) || clave(e.nombre).includes(q)) parciales.push(e);
    if (exactas.length + parciales.length >= max * 4) break;
  }
  return [...exactas, ...parciales].slice(0, max);
}

/** Puesto (1 = mayor) de una entidad entre otras por una cifra; null si no tiene dato. */
export function puesto(
  entidades: EntidadPanoramaPublica[],
  l: Lector,
  e: EntidadPanoramaPublica,
  k: string,
): number | null {
  const v = l.de(e.v, k);
  if (v === null) return null;
  return entidades.filter((x) => (l.de(x.v, k) ?? -Infinity) > v).length + 1;
}

/** Conteo de entidades por departamento para la lista-filtro (como la tabla del Power BI). */
export function conteoPorDepartamento(
  p: PanoramaPublico,
  f: FiltrosPanorama,
): { departamento: string; entidades: number }[] {
  const fuente = f.tipo ? (p.porTipoYDepartamento[f.tipo] ?? {}) : p.porDepartamento;
  return Object.entries(fuente)
    .filter(([d]) => d !== "Sin departamento")
    .map(([departamento, g]) => ({ departamento, entidades: g.entidades }))
    .sort((a, b) => b.entidades - a.entidades || a.departamento.localeCompare(b.departamento, "es"));
}

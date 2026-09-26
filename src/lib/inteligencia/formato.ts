import type { UnidadCifra } from "./contrato";

/**
 * Formato de las cifras de Inteligencia sectorial (es-CO). Solo presenta: nunca
 * redondea antes de calcular ni cambia una cifra. Sin dato → «—».
 */

const SIN_DATO = "—";

const nf = (min: number, max: number) =>
  new Intl.NumberFormat("es-CO", { minimumFractionDigits: min, maximumFractionDigits: max });
const n0 = nf(0, 0);
const n1 = nf(1, 1);
const n2 = nf(2, 2);

/** 0,06851 → «6,85 %». */
export function porcentaje(v: number | null | undefined, decimales = 2): string {
  if (v === null || v === undefined || !Number.isFinite(v)) return SIN_DATO;
  return `${(decimales === 1 ? n1 : n2).format(v * 100)} %`;
}

/** Diferencia de dos razones en puntos porcentuales: 0,0123 → «+1,23 pp». */
export function puntos(v: number | null | undefined): string {
  if (v === null || v === undefined || !Number.isFinite(v)) return SIN_DATO;
  const s = n2.format(Math.abs(v * 100));
  return `${v > 0 ? "+" : v < 0 ? "−" : ""}${s} pp`;
}

/**
 * Pesos en la escala que se lee: billones (bn), miles de millones (mm) o
 * millones (M). 62.969.361.138.110 → «$62,97 bn».
 */
export function pesos(v: number | null | undefined): string {
  if (v === null || v === undefined || !Number.isFinite(v)) return SIN_DATO;
  const a = Math.abs(v);
  const signo = v < 0 ? "−" : "";
  if (a >= 1e12) return `${signo}$${n2.format(a / 1e12)} bn`;
  if (a >= 1e9) return `${signo}$${n1.format(a / 1e9)} mm`;
  if (a >= 1e6) return `${signo}$${n1.format(a / 1e6)} M`;
  return `${signo}$${n0.format(a)}`;
}

/** Pesos completos con separador de miles (tablas de detalle). */
export function pesosCompletos(v: number | null | undefined): string {
  if (v === null || v === undefined || !Number.isFinite(v)) return SIN_DATO;
  return `${v < 0 ? "−" : ""}$${n0.format(Math.abs(v))}`;
}

export function entero(v: number | null | undefined): string {
  if (v === null || v === undefined || !Number.isFinite(v)) return SIN_DATO;
  return n0.format(v);
}

export function veces(v: number | null | undefined): string {
  if (v === null || v === undefined || !Number.isFinite(v)) return SIN_DATO;
  return `${n2.format(v)}×`;
}

/** Una cifra según la unidad que declara su ficha. */
export function cifra(v: number | null | undefined, unidad: UnidadCifra): string {
  if (unidad === "pesos") return pesos(v);
  if (unidad === "veces") return veces(v);
  return porcentaje(v);
}

/** Texto comparable: minúsculas, sin acentos, espacios simples (búsqueda de entidades). */
export function clave(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Nombre oficial en forma legible: «COOPERATIVA DE AHORRO Y CRÉDITO X» → «Cooperativa de Ahorro y Crédito X». */
export function nombreLegible(nombre: string, max = 64): string {
  const menores = new Set(["de", "del", "la", "las", "los", "y", "e", "en", "el", "a", "para", "por"]);
  const t = nombre
    .toLowerCase()
    .split(/\s+/)
    .map((w, i) => (i > 0 && menores.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ")
    .replace(/\b(Ltda|Sa|Sas|Cta|Ips|Eps)\b/g, (m) => m.toUpperCase());
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
}

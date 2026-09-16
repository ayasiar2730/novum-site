import type { Unidad } from "@/lib/sector/types";

/**
 * Formato es-CO para la sección del sector. Sin lógica de negocio: solo cómo se
 * escribe un número que ya viene calculado. «Billón» aquí es el colombiano
 * (millón de millones); la nota de fuente lo aclara en pantalla.
 */

const esCO = (opts: Intl.NumberFormatOptions) => new Intl.NumberFormat("es-CO", opts);

const entero = esCO({ maximumFractionDigits: 0 });
const unDecimal = esCO({ minimumFractionDigits: 1, maximumFractionDigits: 1 });
const dosDecimales = esCO({ minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Un valor en pesos como número grande legible: { valor: "61,8", unidad: "billones de pesos" }. */
export function copGrande(v: number): { valor: string; unidad: string } {
  const abs = Math.abs(v);
  if (abs >= 1e12) return { valor: unDecimal.format(v / 1e12), unidad: "billones de pesos" };
  if (abs >= 1e9) return { valor: entero.format(v / 1e6), unidad: "millones de pesos" };
  return { valor: entero.format(v), unidad: "pesos" };
}

/** Valor + unidad para un KPI, según su unidad declarada. */
export function kpi(v: number, unidad: Unidad): { valor: string; unidad: string } {
  switch (unidad) {
    case "cop":
      return copGrande(v);
    case "entidades":
      return { valor: entero.format(v), unidad: v === 1 ? "entidad" : "entidades" };
    case "pct":
      return { valor: unDecimal.format(v * 100), unidad: "%" };
    case "pp":
      return { valor: unDecimal.format(v), unidad: "puntos porcentuales" };
    case "indice":
      return { valor: entero.format(v), unidad: "índice (base 100)" };
    default:
      return { valor: entero.format(v), unidad: "" };
  }
}

/** Valor corto para etiquetas dentro de una gráfica. */
export function corto(v: number, unidad: Unidad): string {
  switch (unidad) {
    case "cop": {
      const { valor, unidad: u } = copGrande(v);
      return `$ ${valor} ${u === "billones de pesos" ? "bn" : u === "millones de pesos" ? "M" : ""}`.trim();
    }
    case "pct":
      return `${dosDecimales.format(v * 100)} %`;
    case "pp":
      return `${unDecimal.format(v)} pp`;
    case "entidades":
    case "n":
    case "indice":
      return entero.format(v);
    default:
      return entero.format(v);
  }
}

/** Participación 0–1 como "12,5 %". */
export function participacion(v: number): string {
  return `${unDecimal.format(v * 100)} %`;
}

/** "30 de junio de 2026" a partir de AAAA-MM-DD, sin desfase de zona horaria. */
export function fechaLarga(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const fecha = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(fecha);
}

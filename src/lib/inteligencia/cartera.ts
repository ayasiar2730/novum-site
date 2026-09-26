import type { CarteraPublica, EntidadCarteraPublica, ZonaRiesgo } from "./contrato";

/**
 * Lecturas del informe «Cartera y riesgo» (el informe original del sector). El
 * ICM de cada entidad, μ, σ y la zona llegan del motor; aquí están las mismas
 * lecturas de presentación que usa la pantalla de SIAR (`src/lib/sector.ts`):
 * sumas por segmento o departamento para el ICM ponderado del grupo, mediana,
 * percentiles, ranking y pares. Mismas reglas, mismos umbrales.
 */

export type Segmento = "COOPERATIVAS" | "MUTUALES";
export const ZONAS: ZonaRiesgo[] = ["Bajo", "Moderado", "Elevado", "Alto"];
/** Banda de pares del informe original: ±60 % de la cartera, mismo segmento. */
export const BANDA_PARES = 0.6;

export interface FiltrosCartera {
  segmento: Segmento | null;
  departamento: string | null;
}

export function filtrar(c: CarteraPublica, f: FiltrosCartera): EntidadCarteraPublica[] {
  return c.entidades.filter(
    (e) =>
      (!f.segmento || e.segmento === f.segmento) && (!f.departamento || e.departamento === f.departamento),
  );
}

export interface ResumenGrupo {
  entidades: number;
  cartera: number;
  mora: number;
  asociados: number;
  /** Σ mora / Σ cartera del grupo (ponderado). */
  icmPonderado: number | null;
  icmPromedio: number | null;
  icmMediana: number | null;
  porZona: Record<ZonaRiesgo, number>;
}

export function mediana(xs: number[]): number | null {
  if (!xs.length) return null;
  const o = [...xs].sort((a, b) => a - b);
  const m = Math.floor(o.length / 2);
  return o.length % 2 ? o[m] : (o[m - 1] + o[m]) / 2;
}

export function resumen(ents: EntidadCarteraPublica[]): ResumenGrupo {
  const cartera = ents.reduce((s, e) => s + e.cartera_total, 0);
  const mora = ents.reduce((s, e) => s + e.cartera_mora, 0);
  const icms = ents.map((e) => e.icm).filter((v): v is number => v !== null);
  const porZona = Object.fromEntries(ZONAS.map((z) => [z, 0])) as Record<ZonaRiesgo, number>;
  for (const e of ents) if (e.riesgo) porZona[e.riesgo]++;
  return {
    entidades: ents.length,
    cartera,
    mora,
    asociados: ents.reduce((s, e) => s + (e.asociados ?? 0), 0),
    icmPonderado: cartera > 0 ? mora / cartera : null,
    icmPromedio: icms.length ? icms.reduce((a, b) => a + b, 0) / icms.length : null,
    icmMediana: mediana(icms),
    porZona,
  };
}

/** Porcentaje de entidades con un valor ESTRICTAMENTE menor (la regla de SIAR). */
export function percentil(valores: number[], v: number): number {
  if (!valores.length) return 0;
  return (valores.filter((x) => x < v).length / valores.length) * 100;
}

export function rankPorCartera(ents: EntidadCarteraPublica[], e: EntidadCarteraPublica): number {
  return ents.filter((x) => x.cartera_total > e.cartera_total).length + 1;
}

/** Pares: mismo segmento y cartera entre 40 % y 160 % de la propia; sin la entidad. */
export function pares(ents: EntidadCarteraPublica[], mia: EntidadCarteraPublica): EntidadCarteraPublica[] {
  const lo = mia.cartera_total * (1 - BANDA_PARES);
  const hi = mia.cartera_total * (1 + BANDA_PARES);
  return ents
    .filter(
      (e) =>
        e.codigo !== mia.codigo &&
        e.segmento === mia.segmento &&
        e.cartera_total >= lo &&
        e.cartera_total <= hi,
    )
    .sort((a, b) => b.cartera_total - a.cartera_total);
}

/** Cubos del histograma del ICM (los del informe original: cada 2,5 puntos hasta 15 %). */
export const CORTES_ICM = [0.025, 0.05, 0.075, 0.1, 0.125, 0.15];
export function histograma(
  ents: EntidadCarteraPublica[],
): { etiqueta: string; desde: number; hasta: number | null; n: number }[] {
  const lims = [0, ...CORTES_ICM];
  const cubos = lims.map((desde, i) => ({
    desde,
    hasta: i < CORTES_ICM.length ? CORTES_ICM[i] : null,
    etiqueta: i < CORTES_ICM.length ? `${desde * 100}–${CORTES_ICM[i] * 100} %` : `≥ ${desde * 100} %`,
    n: 0,
  }));
  for (const e of ents) {
    if (e.icm === null) continue;
    const i = cubos.findIndex((c) => c.hasta === null || e.icm! < c.hasta);
    cubos[i].n++;
  }
  return cubos.map((c) => ({ ...c, etiqueta: c.etiqueta.replace(/\./g, ",") }));
}

export interface GrupoDepartamento {
  departamento: string;
  entidades: number;
  cartera: number;
  icmPonderado: number | null;
}

export function porDepartamento(ents: EntidadCarteraPublica[]): GrupoDepartamento[] {
  const m = new Map<string, { n: number; cartera: number; mora: number }>();
  for (const e of ents) {
    const d = e.departamento ?? "Sin departamento";
    const a = m.get(d) ?? { n: 0, cartera: 0, mora: 0 };
    a.n++;
    a.cartera += e.cartera_total;
    a.mora += e.cartera_mora;
    m.set(d, a);
  }
  return [...m.entries()]
    .map(([departamento, a]) => ({
      departamento,
      entidades: a.n,
      cartera: a.cartera,
      icmPonderado: a.cartera > 0 ? a.mora / a.cartera : null,
    }))
    .sort((a, b) => b.cartera - a.cartera);
}

/** Composición de la cartera en mora por categoría (B a E) del grupo. */
export function composicionMora(
  ents: EntidadCarteraPublica[],
): { categoria: "B" | "C" | "D" | "E"; valor: number }[] {
  const suma = (k: "cat_b" | "cat_c" | "cat_d" | "cat_e") => ents.reduce((s, e) => s + (e[k] ?? 0), 0);
  return [
    { categoria: "B", valor: suma("cat_b") },
    { categoria: "C", valor: suma("cat_c") },
    { categoria: "D", valor: suma("cat_d") },
    { categoria: "E", valor: suma("cat_e") },
  ];
}

/** Concentración: participación de las N mayores en la cartera del grupo. */
export function concentracion(ents: EntidadCarteraPublica[], n = 5): number | null {
  const total = ents.reduce((s, e) => s + e.cartera_total, 0);
  if (total <= 0) return null;
  const top = [...ents].sort((a, b) => b.cartera_total - a.cartera_total).slice(0, n);
  return top.reduce((s, e) => s + e.cartera_total, 0) / total;
}

/** Promedio, mediana, mínimo y máximo de una razón por entidad (sin contar las que no tienen dato). */
export function estadisticas(
  ents: EntidadCarteraPublica[],
  k: "icm" | "icv" | "cat_e_total",
): { promedio: number | null; mediana: number | null; minimo: number | null; maximo: number | null } {
  const xs = ents.map((e) => e[k]).filter((v): v is number => v !== null);
  if (!xs.length) return { promedio: null, mediana: null, minimo: null, maximo: null };
  return {
    promedio: xs.reduce((a, b) => a + b, 0) / xs.length,
    mediana: mediana(xs),
    minimo: Math.min(...xs),
    maximo: Math.max(...xs),
  };
}

/** Tres grupos por tamaño de cartera (terciles), con su ICM ponderado: la comparación sin entidad elegida. */
export function terciles(
  ents: EntidadCarteraPublica[],
): { nombre: string; entidades: number; desde: number; hasta: number; icmPonderado: number | null }[] {
  const o = [...ents].sort((a, b) => a.cartera_total - b.cartera_total);
  const n = o.length;
  if (n < 3) return [];
  const cortes = [0, Math.round(n / 3), Math.round((2 * n) / 3), n];
  const nombres = ["Tercio de menor cartera", "Tercio medio", "Tercio de mayor cartera"];
  return nombres.map((nombre, i) => {
    const g = o.slice(cortes[i], cortes[i + 1]);
    const r = resumen(g);
    return {
      nombre,
      entidades: g.length,
      desde: g[0].cartera_total,
      hasta: g[g.length - 1].cartera_total,
      icmPonderado: r.icmPonderado,
    };
  });
}

/** Frontera de cada zona (μ, μ+σ, μ+2σ): la regla del informe original. */
export function fronteras(mu: number | null, sigma: number | null): [number, number, number] | null {
  if (mu === null || sigma === null) return null;
  return [mu, mu + sigma, mu + 2 * sigma];
}

export interface Senal {
  id: string;
  titulo: string;
  texto: string;
}

/**
 * Señales del corte: hechos del grupo con su cifra, no juicios. Cada una dice
 * qué mide; la lectura de qué hacer con ella es de la entidad (o de un
 * acompañamiento). Reglas fijas y trazables a las cifras del archivo.
 */
export function senales(
  ents: EntidadCarteraPublica[],
  c: CarteraPublica,
  pct: (v: number | null) => string,
): Senal[] {
  const r = resumen(ents);
  const f = fronteras(c.estadisticas.icm_promedio, c.estadisticas.icm_desv);
  const out: Senal[] = [];
  if (!ents.length) return out;
  const altas = r.porZona.Elevado + r.porZona.Alto;
  if (f) {
    out.push({
      id: "zonas",
      titulo: `${altas} de ${r.entidades} entidades en zona Elevada o Alta`,
      texto: `Tienen un ICM de ${pct(f[1])} o más (μ + σ del corte). Representan ${pct(r.entidades ? altas / r.entidades : null)} de las entidades del grupo.`,
    });
  }
  const conc = concentracion(ents, 5);
  if (conc !== null && ents.length > 5) {
    out.push({
      id: "concentracion",
      titulo: `Las 5 mayores concentran ${pct(conc)} de la cartera`,
      texto:
        "La lectura del grupo pesa lo que pesan sus entidades más grandes: el ICM ponderado se mueve con ellas más que con la mediana.",
    });
  }
  if (r.icmPonderado !== null && r.icmMediana !== null) {
    out.push({
      id: "ponderado",
      titulo: `ICM ponderado ${pct(r.icmPonderado)} y mediana ${pct(r.icmMediana)}`,
      texto:
        r.icmPonderado > r.icmMediana
          ? "El ICM ponderado supera a la mediana: la mora pesa más en las entidades de mayor cartera."
          : "La mediana supera al ICM ponderado: la mora pesa más en las entidades de menor cartera.",
    });
  }
  const comp = composicionMora(ents);
  const moraTotal = comp.reduce((s, x) => s + x.valor, 0);
  if (moraTotal > 0) {
    const e = comp.find((x) => x.categoria === "E")!.valor;
    out.push({
      id: "categoria_e",
      titulo: `La categoría E es ${pct(e / moraTotal)} de la cartera en mora`,
      texto:
        "La categoría E (riesgo de incobrabilidad) es la de menor probabilidad de recuperación dentro de la cartera en mora.",
    });
  }
  const coop = resumen(ents.filter((x) => x.segmento === "COOPERATIVAS"));
  const mut = resumen(ents.filter((x) => x.segmento === "MUTUALES"));
  if (coop.entidades && mut.entidades) {
    out.push({
      id: "segmentos",
      titulo: `Cooperativas ${pct(coop.icmPonderado)} · mutuales ${pct(mut.icmPonderado)}`,
      texto: `ICM ponderado de cada segmento (${coop.entidades} cooperativas y ${mut.entidades} mutuales en el grupo).`,
    });
  }
  return out;
}

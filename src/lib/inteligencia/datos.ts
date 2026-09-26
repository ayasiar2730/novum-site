// Solo servidor: usa el disco. Lo importan páginas de servidor, nunca un componente "use client".
import fs from "node:fs";
import path from "node:path";
import { validarInteligencia, type InteligenciaSectorial } from "./contrato";

/**
 * Los cortes publicados de Inteligencia sectorial: un archivo por corte en
 * `public/datos/inteligencia/<AAAA-MM>.json` (lo genera el exportador de SIAR y
 * entra por PR). Se leen y validan al construir el sitio; un archivo inválido
 * NO se publica (se omite y el build lo dice). La interfaz descarga el archivo
 * del corte elegido desde la misma ruta pública.
 */

const DIR = path.join(process.cwd(), "public", "datos", "inteligencia");

export interface CortePublicado {
  id: string;
  etiqueta: string;
  estado: "completo" | "parcial";
  base: string | null;
  url: string;
  entidadesPanorama: number;
  entidadesCartera: number;
}

let cache: { cortes: CortePublicado[]; datos: Map<string, InteligenciaSectorial> } | null = null;

function cargarTodo() {
  if (cache) return cache;
  const datos = new Map<string, InteligenciaSectorial>();
  const archivos = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => /^\d{4}-\d{2}\.json$/.test(f)) : [];
  for (const f of archivos) {
    const d = JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8")) as InteligenciaSectorial;
    const problemas = validarInteligencia(d);
    if (problemas.length || `${d.corte.id}.json` !== f) {
      console.warn(
        `[inteligencia] ${f} no se publica: ${problemas.join(" · ") || "el nombre no es el del corte"}`,
      );
      continue;
    }
    datos.set(d.corte.id, d);
  }
  const cortes = [...datos.values()]
    .sort((a, b) => b.corte.id.localeCompare(a.corte.id))
    .map((d) => ({
      id: d.corte.id,
      etiqueta: d.corte.etiqueta,
      estado: d.corte.estado,
      base: d.corte.base?.etiqueta ?? null,
      url: `/datos/inteligencia/${d.corte.id}.json`,
      entidadesPanorama: d.panorama.entidades.length,
      entidadesCartera: d.cartera.entidades.length,
    }));
  cache = { cortes, datos };
  return cache;
}

export function cortesPublicados(): CortePublicado[] {
  return cargarTodo().cortes;
}

/** El corte que se abre por defecto: el completo más reciente (o el más reciente si no hay completos). */
export function corteDestacado(): CortePublicado | null {
  const cortes = cortesPublicados();
  return cortes.find((c) => c.estado === "completo") ?? cortes[0] ?? null;
}

export function datosDelCorte(id: string): InteligenciaSectorial | null {
  return cargarTodo().datos.get(id) ?? null;
}

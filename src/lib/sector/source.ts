import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { SectorSnapshot } from "@/lib/sector/types";

/**
 * Capa de origen del snapshot sectorial. SOLO servidor / build: usa `node:fs`,
 * así que ningún componente cliente puede importarla (fallaría el bundle).
 *
 * Reglas:
 *  - si `src/data/sector/snapshot.json` no existe → null (ausencia normal, no error);
 *  - si existe pero no cumple la validación mínima → null + aviso en la consola de build;
 *  - nunca se generan datos por defecto ni ceros;
 *  - la fixture de desarrollo solo entra fuera de producción y con SECTOR_FIXTURE=true
 *    (variable privada del servidor, jamás NEXT_PUBLIC_*).
 */

const SNAPSHOT_PATH = join(process.cwd(), "src", "data", "sector", "snapshot.json");

function esObjeto(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Validación estructural mínima: lo suficiente para que la UI no reviente ni muestre vacíos. */
function validar(v: unknown): v is SectorSnapshot {
  if (!esObjeto(v)) return false;
  if (v.version !== 1) return false;
  if (!esObjeto(v.corte) || typeof v.corte.fechaCorte !== "string" || typeof v.corte.etiqueta !== "string")
    return false;
  if (!esObjeto(v.corte.cobertura) || typeof v.corte.cobertura.descripcion !== "string") return false;
  if (typeof v.corte.nEntidades !== "number" || !(v.corte.nEntidades > 0)) return false;
  if (
    !esObjeto(v.fuente) ||
    typeof v.fuente.entidad !== "string" ||
    typeof v.fuente.procesamiento !== "string"
  ) {
    return false;
  }
  if (!Array.isArray(v.kpis) || v.kpis.length === 0) return false;
  if (!v.kpis.every((k) => esObjeto(k) && typeof k.valor === "number" && Number.isFinite(k.valor)))
    return false;
  if (!Array.isArray(v.historias) || v.historias.length === 0) return false;
  if (
    !v.historias.every(
      (h) =>
        esObjeto(h) &&
        typeof h.insight === "string" &&
        h.insight.trim().length > 0 &&
        Array.isArray(h.series) &&
        h.series.length > 0,
    )
  ) {
    return false;
  }
  if (v.origen !== "siar" && v.origen !== "script") return false;
  return true;
}

let cache: SectorSnapshot | null | undefined;

/** El snapshot aprobado, o null. Una sola lectura por proceso de build. */
export async function getSectorSnapshot(): Promise<SectorSnapshot | null> {
  if (cache !== undefined) return cache;

  // 1) Fixture de desarrollo: imposible en producción por construcción.
  if (process.env.NODE_ENV !== "production" && process.env.SECTOR_FIXTURE === "true") {
    const { SNAPSHOT_DEV } = await import("./fixture.dev");
    cache = SNAPSHOT_DEV;
    return cache;
  }

  // 2) Snapshot aprobado, si existe.
  if (!existsSync(SNAPSHOT_PATH)) {
    cache = null;
    return cache;
  }
  try {
    const crudo: unknown = JSON.parse(readFileSync(SNAPSHOT_PATH, "utf8"));
    if (!validar(crudo)) {
      console.warn(
        `[sector] ${SNAPSHOT_PATH} existe pero no cumple el contrato mínimo (version, corte, fuente, kpis, historias con insight). Se publica la versión editorial.`,
      );
      cache = null;
      return cache;
    }
    cache = crudo;
    return cache;
  } catch (e) {
    console.warn(`[sector] No se pudo leer ${SNAPSHOT_PATH}: ${e instanceof Error ? e.message : String(e)}`);
    cache = null;
    return cache;
  }
}

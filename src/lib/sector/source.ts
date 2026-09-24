import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { SectorSnapshot, SectorSnapshotAny, SectorSnapshotV2 } from "@/lib/sector/types";

/**
 * Capa de origen del snapshot sectorial. SOLO servidor / build: usa `node:fs`,
 * así que ningún componente cliente puede importarla (fallaría el bundle).
 *
 * Reglas:
 *  - un snapshot por corte publicado en `src/data/sector/informes/<AAAA-MM>.json`
 *    (el catálogo de informes); el último es el que usa el Home. Sin ninguno →
 *    null (ausencia normal, no error);
 *  - si existe pero no cumple la validación mínima → null + aviso en la consola de build;
 *  - nunca se generan datos por defecto ni ceros;
 *  - la fixture de desarrollo solo entra fuera de producción y con SECTOR_FIXTURE=true
 *    (v2) o SECTOR_FIXTURE=v1 (variable privada del servidor, jamás NEXT_PUBLIC_*);
 *  - se aceptan el contrato v1 (historias) y el v2 (Observatorio); un v2 que
 *    incumpla el k-anonimato declarado se rechaza entero: mejor la versión
 *    editorial que una categoría con dos entidades.
 */

/** Un archivo por corte publicado: la interfaz con SIAR (antes `src/data/sector/snapshot.json`). */
export const DIR_INFORMES = join(process.cwd(), "src", "data", "sector", "informes");
const RE_ARCHIVO = /^\d{4}-\d{2}\.json$/;

/** Los cortes publicados (AAAA-MM), del más reciente al más antiguo. */
export function cortesPublicados(): string[] {
  if (!existsSync(DIR_INFORMES)) return [];
  return readdirSync(DIR_INFORMES)
    .filter((f) => RE_ARCHIVO.test(f))
    .map((f) => f.slice(0, 7))
    .sort()
    .reverse();
}

function esObjeto(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

const numeroFinito = (x: unknown): x is number => typeof x === "number" && Number.isFinite(x);
const texto = (x: unknown): x is string => typeof x === "string" && x.trim().length > 0;

/** Validación estructural mínima del v2 + k-anonimato: lo suficiente para no publicar vacíos ni entidades. También la usa el generador del informe en PDF. */
export function validarV2(v: unknown): v is SectorSnapshotV2 {
  if (!esObjeto(v) || v.version !== 2) return false;
  if (v.origen !== "siar" && v.origen !== "fixture") return false;
  if (!esObjeto(v.fuente) || !esObjeto(v.fuente.datos) || !esObjeto(v.fuente.procesamiento)) return false;
  if (!texto(v.fuente.datos.entidad) || !texto(v.fuente.procesamiento.entidad)) return false;
  const m = v.metodologia;
  if (!esObjeto(m) || !texto(m.codigo) || !texto(m.version) || !esObjeto(m.universo)) return false;
  if (!texto(m.universo.definicion) || !Array.isArray(m.definiciones) || !Array.isArray(m.limitaciones))
    return false;
  if (!numeroFinito(m.minEntidadesPorCategoria) || m.minEntidadesPorCategoria < 3) return false;
  const k = m.minEntidadesPorCategoria;
  if (!Array.isArray(v.cortes) || v.cortes.length === 0) return false;
  if (
    !v.cortes.every(
      (c) =>
        esObjeto(c) &&
        texto(c.id) &&
        texto(c.etiqueta) &&
        texto(c.fechaCorte) &&
        (c.estado === "completo" || c.estado === "parcial") &&
        numeroFinito(c.nUniverso) &&
        c.nUniverso > 0 &&
        numeroFinito(c.nReportantes),
    )
  ) {
    return false;
  }
  if (!Array.isArray(v.hallazgos) || v.hallazgos.length === 0) return false;
  if (
    !v.hallazgos.every(
      (h) =>
        esObjeto(h) &&
        texto(h.titulo) &&
        texto(h.lectura) &&
        esObjeto(h.cifra) &&
        numeroFinito(h.cifra.valor),
    )
  ) {
    return false;
  }
  if (!esObjeto(v.dimension) || !Array.isArray(v.dimension.cifras)) return false;
  if (!v.dimension.cifras.every((c) => esObjeto(c) && texto(c.etiqueta) && numeroFinito(c.valor)))
    return false;
  if (!esObjeto(v.riesgo) || !Array.isArray(v.riesgo.indicadores)) return false;
  if (
    !v.riesgo.indicadores.every(
      (i) =>
        esObjeto(i) &&
        texto(i.etiqueta) &&
        texto(i.definicion) &&
        (i.ponderado === null || numeroFinito(i.ponderado)),
    )
  ) {
    return false;
  }
  if (!esObjeto(v.estructura) || !Array.isArray(v.estructura.segmentaciones)) return false;
  for (const seg of v.estructura.segmentaciones) {
    if (!esObjeto(seg) || !Array.isArray(seg.categorias)) return false;
    for (const cat of seg.categorias) {
      if (!esObjeto(cat) || !numeroFinito(cat.entidades) || !numeroFinito(cat.valor)) return false;
      // k-anonimato: una categoría con menos de k entidades identifica; se rechaza el snapshot entero.
      if (cat.entidades < k) return false;
    }
  }
  if (v.evolucion !== undefined && v.evolucion !== null) {
    const e = v.evolucion;
    if (!esObjeto(e) || !esObjeto(e.base) || !numeroFinito(e.nComparables) || !texto(e.criterio))
      return false;
    if (!Array.isArray(e.variaciones)) return false;
  }
  return true;
}

/** Validación estructural mínima del v1: lo suficiente para que la UI no reviente ni muestre vacíos. */
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

/** Lee y valida el snapshot publicado de un archivo; null (con aviso) si no se puede publicar. */
function leerArchivo(ruta: string): SectorSnapshotAny | null {
  if (!existsSync(ruta)) return null;
  try {
    const crudo: unknown = JSON.parse(readFileSync(ruta, "utf8"));
    if (esObjeto(crudo) && crudo.version === 2) {
      if (crudo.origen === "fixture") {
        console.warn(`[sector] ${ruta} es una fixture (origen "fixture"): no se publica.`);
        return null;
      }
      if (!validarV2(crudo)) {
        console.warn(
          `[sector] ${ruta} (v2) no cumple el contrato mínimo o el k-anonimato declarado. No se publica.`,
        );
        return null;
      }
      return crudo;
    }
    if (!validar(crudo)) {
      console.warn(
        `[sector] ${ruta} no cumple el contrato mínimo (version, corte, fuente, kpis, historias con insight). No se publica.`,
      );
      return null;
    }
    return crudo;
  } catch (e) {
    console.warn(`[sector] No se pudo leer ${ruta}: ${e instanceof Error ? e.message : String(e)}`);
    return null;
  }
}

const porCorte = new Map<string, SectorSnapshotAny | null>();

/** El snapshot publicado de un corte (AAAA-MM), o null. */
export function getSnapshotDeCorte(corteId: string): SectorSnapshotAny | null {
  if (!/^\d{4}-\d{2}$/.test(corteId)) return null;
  if (!porCorte.has(corteId)) porCorte.set(corteId, leerArchivo(join(DIR_INFORMES, `${corteId}.json`)));
  return porCorte.get(corteId) ?? null;
}

let cache: SectorSnapshotAny | null | undefined;

/** El último snapshot publicado y válido (v1 o v2), o null. Una sola lectura por proceso de build. */
export async function getSectorSnapshot(): Promise<SectorSnapshotAny | null> {
  if (cache !== undefined) return cache;

  // 1) Fixture de desarrollo: imposible en producción por construcción.
  if (process.env.NODE_ENV !== "production") {
    const f = process.env.SECTOR_FIXTURE;
    if (f === "true" || f === "v2") {
      const { SNAPSHOT_DEV_V2 } = await import("./fixture.dev");
      cache = SNAPSHOT_DEV_V2;
      return cache;
    }
    if (f === "v1") {
      const { SNAPSHOT_DEV } = await import("./fixture.dev");
      cache = SNAPSHOT_DEV;
      return cache;
    }
  }

  // 2) El corte publicado más reciente que valide.
  cache = null;
  for (const id of cortesPublicados()) {
    const s = getSnapshotDeCorte(id);
    if (s) {
      cache = s;
      break;
    }
  }
  return cache;
}

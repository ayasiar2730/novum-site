import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { cortesPublicados, getSnapshotDeCorte } from "@/lib/sector/source";
import { esV2, type SectorSnapshotV2 } from "@/lib/sector/types";

/**
 * El catálogo de INFORMES SECTORIALES publicados. SOLO servidor / build.
 *
 * Un informe existe cuando hay, para un corte, las dos piezas:
 *   · `src/data/sector/informes/<AAAA-MM>.json` — el SectorSnapshot v2 publicable
 *     (origen siar, 3–5 hallazgos con Lectura Novum, k ≥ 5);
 *   · `public/informes/informe-sectorial-<AAAA-MM>.pdf` — el PDF generado desde ese
 *     mismo snapshot (`scripts/informe-sectorial.mjs --publicar`).
 * Sin PDF el corte se lista igual (la página del informe se publica) pero sin el
 * botón de descarga: nunca un enlace roto. No hay nada que registrar a mano.
 */

export interface PdfPublicado {
  url: string;
  bytes: number;
  paginas: number | null;
  /** Nombre con el que se guarda al descargar. */
  nombreDescarga: string;
}

export interface InformePublicado {
  slug: string;
  corteId: string;
  snapshot: SectorSnapshotV2;
  pdf: PdfPublicado | null;
}

const PUBLICO = join(process.cwd(), "public");

export const slugDeCorte = (corteId: string) => `sector-solidario-${corteId}`;

function pdfDe(corteId: string, etiqueta: string): PdfPublicado | null {
  const url = `/informes/informe-sectorial-${corteId}.pdf`;
  const ruta = join(PUBLICO, url);
  if (!existsSync(ruta)) return null;
  const bytes = readFileSync(ruta);
  // Páginas: los objetos /Type /Page del PDF (sin /Pages). Solo informativo.
  const paginas = (bytes.toString("latin1").match(/\/Type\s*\/Page(?!s)/g) ?? []).length || null;
  const mes = etiqueta.toLowerCase().replace(/\s+/g, "-");
  return {
    url,
    bytes: bytes.length,
    paginas,
    nombreDescarga: `Novum-informe-sectorial-sector-solidario-${mes}.pdf`,
  };
}

let cache: InformePublicado[] | undefined;

/** Los informes publicados, del corte más reciente al más antiguo. */
export function listarInformes(): InformePublicado[] {
  if (cache) return cache;
  cache = cortesPublicados()
    .map((corteId) => {
      const s = getSnapshotDeCorte(corteId);
      if (!s || !esV2(s) || s.origen !== "siar" || s.hallazgos.length < 3) return null;
      // El archivo nombra el corte (slug y PDF): si no coincide con el snapshot, no se publica.
      if (s.cortes[0].id !== corteId) {
        console.warn(`[informes] ${corteId}.json trae el corte ${s.cortes[0].id}: no se publica.`);
        return null;
      }
      return { slug: slugDeCorte(corteId), corteId, snapshot: s, pdf: pdfDe(corteId, s.cortes[0].etiqueta) };
    })
    .filter((x): x is InformePublicado => x !== null);
  return cache;
}

export function informePorSlug(slug: string): InformePublicado | null {
  return listarInformes().find((i) => i.slug === slug) ?? null;
}

/** «426024» → «416 KB». */
export function pesoLegible(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

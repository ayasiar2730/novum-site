import { sector } from "@/content/sector";
import type { KpiVM } from "@/lib/sector/select";

/**
 * Los indicadores principales: número grande, unidad y una nota corta. Solo se
 * renderiza con snapshot válido (SectorIntelligence); sin datos no existe ninguna
 * representación de KPI en producción.
 */
export function SectorKpis({ kpis }: { kpis: KpiVM[] }) {
  return (
    <div data-reveal>
      <p className="sr-only">{sector.conDatos.kpisLabel}</p>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-10 border-t border-neutral-100 pt-8 md:grid-cols-4 md:gap-x-10">
        {kpis.map((k) => (
          <div key={k.clave} className="flex min-w-0 flex-col gap-2">
            <dt className="text-label uppercase text-neutral-500">{k.etiqueta}</dt>
            <dd className="flex flex-col gap-1">
              <span className="text-display-sm md:text-display-md tnum text-purple-900 [overflow-wrap:anywhere]">
                {k.valor}
              </span>
              <span className="text-small text-neutral-700">{k.unidad}</span>
              {k.nota ? <span className="text-small text-neutral-500">{k.nota}</span> : null}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

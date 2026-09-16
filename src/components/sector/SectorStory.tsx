import { sector } from "@/content/sector";
import type { HistoriaVM } from "@/lib/sector/select";
import { SectorChart } from "@/components/sector/SectorChart";
import { SectorInsight } from "@/components/sector/SectorInsight";

/**
 * Armazón de una historia analítica: numeral, título, subtítulo, la
 * visualización y, al lado, la lectura ejecutiva; abajo, universo, metodología
 * y fuente. Alterna el lado de la lectura entre historias (como Diferenciadores).
 */
export function SectorStory({ vm, index }: { vm: HistoriaVM; index: number }) {
  const h = vm.historia;
  const flip = index % 2 === 1;
  const titleId = `historia-${h.id}-title`;
  return (
    <article
      className="grid gap-8 py-12 md:py-16 lg:grid-cols-12 lg:gap-x-10"
      aria-labelledby={titleId}
      data-reveal
    >
      <header className="flex flex-col gap-3 lg:col-span-12">
        <p className="flex items-center gap-3 text-label uppercase text-purple-700">
          <span aria-hidden="true" className="h-px w-6 bg-purple-500" />
          <span className="tnum">{h.numero}</span>
        </p>
        <h3 id={titleId} className="text-h2-sm md:text-h2 text-neutral-950">
          {h.titulo}
        </h3>
        <p className="text-body measure text-neutral-700">{h.subtitulo}</p>
      </header>

      <div className={`lg:col-span-7 ${flip ? "lg:col-start-6" : "lg:col-start-1"} lg:row-start-2`}>
        <SectorChart historia={h} />
      </div>
      <div
        className={`lg:col-span-5 lg:self-center ${flip ? "lg:col-start-1 lg:row-start-2" : "lg:col-start-8 lg:row-start-2"}`}
      >
        <SectorInsight insight={h.insight} metrica={vm.metrica} />
      </div>

      <dl className="flex flex-col gap-1 text-small text-neutral-500 lg:col-span-12 lg:flex-row lg:flex-wrap lg:gap-x-8">
        <div className="flex gap-2">
          <dt className="shrink-0 text-neutral-700">{sector.conDatos.universoLabel}:</dt>
          <dd>{vm.universo}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="shrink-0 text-neutral-700">{sector.conDatos.metodologiaLabel}:</dt>
          <dd>{h.metodologia}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="shrink-0 text-neutral-700">Fuente:</dt>
          <dd>{h.fuente}</dd>
        </div>
      </dl>
    </article>
  );
}

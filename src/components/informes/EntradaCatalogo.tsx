import Link from "next/link";
import { sector } from "@/content/sector";
import type { InformePublicado } from "@/lib/informes/catalogo";
import { selectHallazgos, selectPortada } from "@/lib/sector/selectV2";
import { ButtonLink } from "@/components/ButtonLink";
import { DescargaPdf } from "@/components/informes/DescargaPdf";

/**
 * Una edición en el catálogo de /informes: el corte y su ficha a la izquierda;
 * a la derecha, los títulos de sus hallazgos (el sumario aprobado del informe)
 * y las dos salidas. Sin cifras nuevas: todo sale del snapshot publicado.
 */
export function EntradaCatalogo({ informe }: { informe: InformePublicado }) {
  const c = sector.catalogo;
  const t = sector.informe;
  const portada = selectPortada(informe.snapshot);
  const hallazgos = selectHallazgos(informe.snapshot);
  const href = `/informes/${informe.slug}`;
  const tituloId = `informe-${informe.corteId}-title`;

  return (
    <article
      className="grid gap-10 py-10 md:py-12 lg:grid-cols-12 lg:gap-8"
      aria-labelledby={tituloId}
      data-reveal
    >
      <div className="flex flex-col gap-6 lg:col-span-4">
        <h3 id={tituloId} className="text-h2-sm md:text-h2 text-neutral-950">
          <Link href={href} className="transition-colors duration-200 hover:text-purple-900">
            {t.titulo}
            <span className="block text-purple-700">
              {t.cortePrefijo} {portada.corteEtiqueta.toLowerCase()}
            </span>
          </Link>
        </h3>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-small">
          <div>
            <dt className="text-label uppercase text-neutral-700">{t.metodologia.fechaCorteLabel}</dt>
            <dd className="mt-1 text-body text-neutral-950">
              <time dateTime={portada.fechaCorteIso}>{portada.fechaCorte}</time>
            </dd>
          </div>
          <div>
            <dt className="text-label uppercase text-neutral-700">{c.estadoLabel}</dt>
            <dd className="mt-1 text-body text-neutral-950">{portada.estadoEtiqueta}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-label uppercase text-neutral-700">{c.entidadesAnalizadasLabel}</dt>
            <dd className="tnum mt-1 text-body text-neutral-950">
              {portada.nUniverso}{" "}
              <span className="text-neutral-700">
                de {portada.nReportantes} {c.reportantesLabel}
              </span>
            </dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-col gap-8 lg:col-span-7 lg:col-start-6">
        <div>
          <p className="text-label uppercase text-neutral-700">{c.contenidoLabel}</p>
          <ol className="mt-4 flex flex-col gap-3">
            {hallazgos.map((h) => (
              <li key={h.id} className="flex gap-3 text-body text-neutral-900">
                <span aria-hidden="true" className="mt-[0.6rem] h-2 w-2 shrink-0 rounded-full bg-green-500" />
                {h.titulo}
              </li>
            ))}
          </ol>
        </div>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <ButtonLink href={href} arrow>
            {c.leer}
          </ButtonLink>
          {informe.pdf ? <DescargaPdf pdf={informe.pdf} variant="secondary" /> : null}
        </div>
      </div>
    </article>
  );
}

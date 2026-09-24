import Link from "next/link";
import { sector } from "@/content/sector";
import type { InformePublicado } from "@/lib/informes/catalogo";
import { selectHallazgos, selectPortada } from "@/lib/sector/selectV2";
import { SectionHeading } from "@/components/SectionHeading";
import { ButtonLink } from "@/components/ButtonLink";
import { DescargaPdf, fichaPdf } from "@/components/informes/DescargaPdf";

/**
 * Acto IV del Home en la fase 2: la puerta de entrada al último informe
 * publicado. A la izquierda, el marco de «Inteligencia del sector»; a la
 * derecha, el informe como objeto: título, ficha del corte, las cifras de sus
 * tres primeros hallazgos (tal como llegan en el snapshot) y las dos salidas,
 * leerlo en la web o descargar el PDF. El informe completo vive en su página.
 */
export function InformeDestacado({ informe }: { informe: InformePublicado }) {
  const c = sector.catalogo;
  const portada = selectPortada(informe.snapshot);
  const cifras = selectHallazgos(informe.snapshot).slice(0, 3);
  const href = `/informes/${informe.slug}`;

  return (
    <section
      id={sector.id}
      className="relative overflow-hidden bg-neutral-0"
      aria-labelledby="inteligencia-title"
    >
      {/* entrega desde el sistema: la trama se disuelve en el observatorio */}
      <div aria-hidden="true" className="trama-sale pointer-events-none absolute inset-x-0 top-0 h-40" />
      <div className="container-site relative py-20 md:py-24">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col gap-8 lg:col-span-5" data-reveal>
            <SectionHeading
              id="inteligencia-title"
              eyebrow={sector.eyebrow}
              title={sector.title}
              intro={sector.intro}
            />
            <p className="border-l-2 border-purple-500 pl-5 text-body text-neutral-900">{sector.capacidad}</p>
          </div>

          <article
            className="flex flex-col gap-8 border-t-2 border-purple-700 pt-6 lg:col-span-6 lg:col-start-7 lg:mt-2"
            aria-labelledby="informe-destacado-title"
            data-reveal
            style={{ transitionDelay: "80ms" }}
          >
            <div className="flex flex-col gap-3">
              <p className="flex items-center gap-2 text-label uppercase text-purple-700">
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-green-500" />
                {c.destacadoLabel}
              </p>
              <h3 id="informe-destacado-title" className="text-h2-sm md:text-h2 text-neutral-950">
                {sector.informe.titulo}
                <span className="block text-purple-700">
                  {sector.informe.cortePrefijo} {portada.corteEtiqueta.toLowerCase()}
                </span>
              </h3>
              <p className="tnum text-small text-neutral-700">
                {portada.nUniverso} {c.entidadesLabel} · {portada.estadoEtiqueta} ·{" "}
                <time dateTime={portada.fechaCorteIso}>{portada.fechaCorte}</time>
              </p>
            </div>

            <dl className="grid gap-6 border-y border-neutral-100 py-6 sm:grid-cols-[1.5fr_1fr_1fr] sm:gap-0 sm:divide-x sm:divide-neutral-100">
              {cifras.map((h) => (
                <div key={h.id} className="flex flex-col-reverse gap-1 sm:px-5 sm:first:pl-0 sm:last:pr-0">
                  <dt className="text-small text-neutral-700">{h.cifra.etiqueta}</dt>
                  <dd className="tnum text-h2-sm text-neutral-950">
                    {h.cifra.valor}
                    <span className="ml-1.5 text-small font-medium text-neutral-700">{h.cifra.unidad}</span>
                  </dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <ButtonLink href={href} arrow>
                  {c.leer}
                </ButtonLink>
                {informe.pdf ? <DescargaPdf pdf={informe.pdf} variant="secondary" ficha={false} /> : null}
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                {informe.pdf ? (
                  <p className="tnum text-small text-neutral-700">{fichaPdf(informe.pdf)}</p>
                ) : null}
                <Link
                  href="/informes"
                  className="inline-flex min-h-11 items-center gap-2 text-small font-semibold text-purple-700 transition-colors duration-200 hover:text-purple-900"
                >
                  {c.todos}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

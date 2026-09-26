import type { Metadata } from "next";
import Link from "next/link";
import { paginas } from "@/content/site";
import { inteligencia } from "@/content/inteligencia";
import { corteDestacado, datosDelCorte } from "@/lib/inteligencia/datos";
import { lector } from "@/lib/inteligencia/panorama";
import { entero, pesos, porcentaje } from "@/lib/inteligencia/formato";
import { metadatosDePagina } from "@/lib/metadatos";
import { Migas } from "@/components/Migas";
import { SectionHeading } from "@/components/SectionHeading";
import type { InformeId } from "@/lib/inteligencia/estado";

const p = paginas.inteligencia;
const t = inteligencia;

export const metadata: Metadata = metadatosDePagina({
  titulo: p.titulo,
  descripcion: p.descripcion,
  ruta: t.ruta,
});

/**
 * Inteligencia sectorial: la puerta a los dos informes interactivos (Cartera y
 * riesgo, Panorama financiero) y a las ediciones en PDF. Las cifras de las
 * tarjetas salen del archivo del corte publicado, leído al construir el sitio.
 */
export default function InteligenciaPage() {
  const corte = corteDestacado();
  const d = corte ? datosDelCorte(corte.id) : null;
  const l = d ? lector(d.panorama) : null;
  const tot = d && l ? (k: string) => l.de(d.panorama.total.v, k) : () => null;

  const cifras: Record<InformeId, { etiqueta: string; valor: string }[]> = {
    "cartera-riesgo": d
      ? [
          { etiqueta: "Entidades", valor: entero(d.cartera.entidades.length) },
          { etiqueta: "ICM ponderado", valor: porcentaje(d.cartera.estadisticas.icm_ponderado) },
          { etiqueta: "Promedio μ", valor: porcentaje(d.cartera.estadisticas.icm_promedio) },
        ]
      : [],
    "panorama-financiero": d
      ? [
          { etiqueta: "Activo total", valor: pesos(tot("activo")) },
          { etiqueta: "Crecimiento del activo", valor: porcentaje(tot("crecimiento_activo")) },
          { etiqueta: "Entidades", valor: entero(d.panorama.entidades.length) },
        ]
      : [],
  };

  return (
    <main id="contenido" tabIndex={-1} className="relative flex-1 overflow-x-clip bg-neutral-0 outline-none">
      <div aria-hidden="true" className="trama-sale pointer-events-none absolute inset-x-0 top-0 h-40" />
      <div className="container-site relative pt-4 md:pt-6">
        <Migas items={[{ nombre: p.titulo, href: t.ruta }]} />
      </div>

      <section aria-labelledby="inteligencia-title">
        <div className="container-site relative pb-10 pt-8 md:pb-14 md:pt-12" data-reveal>
          <SectionHeading
            id="inteligencia-title"
            eyebrow={t.eyebrow}
            title={p.titulo}
            intro={t.intro}
            size="lg"
            nivel={1}
          />
          {corte ? (
            <p className="mt-6 text-small text-neutral-700">
              {t.corteLabel} <span className="font-semibold text-neutral-950">{corte.etiqueta}</span>
              {corte.base ? ` · ${t.baseLabel} ${corte.base}` : ""}
            </p>
          ) : null}
        </div>
      </section>

      <section aria-labelledby="informes-title" className="container-site pb-16 md:pb-20">
        <h2 id="informes-title" className="flex items-center gap-3 text-label uppercase text-purple-700">
          <span aria-hidden="true" className="h-px w-6 bg-purple-500" />
          {t.informesLabel}
        </h2>
        {corte ? (
          <ul className="mt-6 grid gap-5 md:grid-cols-2">
            {(Object.keys(t.informes) as InformeId[]).map((id, i) => {
              const inf = t.informes[id];
              return (
                <li key={id} data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
                  <article className="group relative flex h-full flex-col gap-5 rounded-lg border border-neutral-100 bg-neutral-0 p-6 transition-shadow duration-200 hover:shadow-lift md:p-8">
                    <span className="text-label uppercase text-purple-700">{`0${i + 1}`}</span>
                    <h3 className="text-h2-sm text-neutral-950 md:text-h2">
                      <Link
                        href={`${t.ruta}/${id}`}
                        className="after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none"
                      >
                        {inf.titulo}
                      </Link>
                    </h3>
                    <p className="text-body-sm font-semibold text-neutral-900">{inf.pregunta}</p>
                    <p className="text-body-sm text-neutral-700">{inf.descripcion}</p>
                    <dl className="mt-auto grid grid-cols-3 gap-3 border-t border-neutral-100 pt-5">
                      {cifras[id].map((c) => (
                        <div key={c.etiqueta} className="flex min-w-0 flex-col gap-1">
                          <dt className="text-label normal-case tracking-normal text-neutral-700">
                            {c.etiqueta}
                          </dt>
                          <dd className="tnum truncate text-body-sm font-semibold text-neutral-950 md:text-h3-sm">
                            {c.valor}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    <span className="inline-flex items-center gap-2 text-small font-semibold text-purple-700 group-hover:text-purple-900">
                      {t.abrir}
                      <span aria-hidden="true">→</span>
                    </span>
                  </article>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-6 max-w-2xl text-body-sm text-neutral-700">{t.sinDatos}</p>
        )}
      </section>

      <section aria-labelledby="ediciones-title" className="bg-neutral-50">
        <div className="container-site flex flex-col gap-4 py-14 md:flex-row md:items-center md:justify-between md:py-16">
          <div className="flex max-w-2xl flex-col gap-2">
            <h2 id="ediciones-title" className="text-h3-sm text-neutral-950 md:text-h3">
              {t.edicionesLabel}
            </h2>
            <p className="text-body-sm text-neutral-700">{t.edicionesTexto}</p>
          </div>
          <Link
            href="/informes"
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-purple-500 px-5 text-nav text-purple-900 transition-colors hover:bg-purple-100"
          >
            {t.edicionesCta}
          </Link>
        </div>
      </section>

      <section aria-label="Fuente" className="container-site py-12 text-small text-neutral-700">
        <p>{t.fuente.datos}</p>
        <p className="mt-1">{t.fuente.procesamiento}</p>
      </section>
    </main>
  );
}

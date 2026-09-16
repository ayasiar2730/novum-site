import { cta } from "@/content/site";
import { sector } from "@/content/sector";
import { demoLink } from "@/lib/links";
import type { RangoVM } from "@/lib/sector/select";
import { ButtonLink } from "@/components/ButtonLink";
import { Bar } from "@/components/sector/charts/Bar";

/** Dos puntos sobre una escala: la entidad frente a su grupo. Mismo lenguaje que el glifo de Diferenciadores. */
function Glyph() {
  return (
    <svg viewBox="0 0 120 60" aria-hidden="true" className="h-14 w-28">
      <path d="M8 40h104" stroke="var(--color-neutral-300)" strokeWidth="1.5" strokeLinecap="round" />
      {[20, 44, 68, 92].map((x) => (
        <path
          key={x}
          d={`M${x} 36v8`}
          stroke="var(--color-neutral-300)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ))}
      <circle cx="44" cy="22" r="7" fill="none" stroke="var(--color-purple-500)" strokeWidth="1.5" />
      <circle
        cx="60"
        cy="22"
        r="7"
        fill="none"
        stroke="var(--color-purple-500)"
        strokeWidth="1.5"
        strokeOpacity="0.5"
      />
      <circle cx="80" cy="22" r="7" fill="var(--color-green-500)" />
      <path d="M80 29v7" stroke="var(--color-green-500)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Transición comercial al cierre de la sección. Con snapshot, además los
 * rangos de tamaño (participación en entidades y en activo) que llegan en
 * `contexto`; sin snapshot, solo la narrativa y el CTA. Sin NIT, sin buscador.
 */
export function SectorContext({ rangos }: { rangos: RangoVM[] | null }) {
  const c = sector.contexto;
  return (
    <div className="grid gap-10 border-t border-neutral-100 pt-14 lg:grid-cols-12 lg:gap-x-10" data-reveal>
      <div className="flex flex-col gap-6 lg:col-span-7">
        <Glyph />
        <p className="flex items-center gap-3 text-label uppercase text-purple-700">
          <span aria-hidden="true" className="h-px w-6 bg-purple-500" />
          {c.eyebrow}
        </p>
        <h3 className="text-h1-sm md:text-h1 measure text-neutral-950">{c.title}</h3>
        <p className="text-body measure text-neutral-700">{c.body}</p>
        <div className="pt-1">
          <ButtonLink href={demoLink} external arrow>
            {cta.primary}
          </ButtonLink>
        </div>
      </div>

      {rangos ? (
        <div className="flex flex-col gap-5 lg:col-span-5 lg:self-center">
          <p className="text-label uppercase text-neutral-500">{sector.conDatos.contextoRangosLabel}</p>
          <ul className="flex flex-col gap-4">
            {rangos.map((r) => (
              <li key={r.etiqueta} className="flex flex-col gap-1.5">
                <span className="text-small font-semibold text-neutral-900">{r.etiqueta}</span>
                <div className="grid grid-cols-[1fr_auto] items-center gap-3">
                  <Bar
                    pct={r.pctEntidades}
                    tono="suave"
                    title={`${r.etiqueta}: ${r.entidades} de las entidades`}
                    height="h-2"
                  />
                  <span className="tnum text-small text-neutral-700">{r.entidades} entidades</span>
                </div>
                <div className="grid grid-cols-[1fr_auto] items-center gap-3">
                  <Bar
                    pct={r.pctActivo}
                    tono="medio"
                    title={`${r.etiqueta}: ${r.activo} del activo`}
                    height="h-2"
                  />
                  <span className="tnum text-small text-neutral-900">{r.activo} del activo</span>
                </div>
              </li>
            ))}
          </ul>
          <p className="text-small text-neutral-500">{sector.conDatos.contextoRangosNota}</p>
        </div>
      ) : null}
    </div>
  );
}

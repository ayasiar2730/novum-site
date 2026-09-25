import { metodologia } from "@/content/portafolio";
import { SectionHeading } from "@/components/SectionHeading";
import { ButtonLink } from "@/components/ButtonLink";

/**
 * «Cómo trabajamos»: los cinco pasos como estaciones sobre una misma línea
 * del sistema (horizontal en escritorio, vertical en móvil). En el Home va
 * compacto, con el enlace a /nosotros; en /nosotros añade la capacidad
 * instalada que deja cada implementación.
 */
export function ComoTrabajamos({ compacto = false }: { compacto?: boolean }) {
  return (
    <section
      id="metodologia"
      className="scroll-mt-28 bg-neutral-0 py-20 md:py-24"
      aria-labelledby="metodologia-title"
    >
      <div className="container-site">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-7" data-reveal>
            <SectionHeading
              id="metodologia-title"
              eyebrow={metodologia.eyebrow}
              title={metodologia.titulo}
              intro={metodologia.intro}
            />
          </div>
          {compacto ? (
            <div className="lg:col-span-4 lg:col-start-9 lg:justify-self-end" data-reveal>
              <ButtonLink href="/nosotros#metodologia" variant="secondary" arrow>
                {metodologia.ver}
              </ButtonLink>
            </div>
          ) : null}
        </div>

        <ol className="relative mt-12 grid gap-8 md:mt-14 lg:grid-cols-5 lg:gap-6">
          {/* la línea que recorre las cinco estaciones */}
          <span
            aria-hidden="true"
            className="absolute bottom-3 left-[0.3125rem] top-3 w-px bg-purple-500/40 lg:bottom-auto lg:left-[0.3125rem] lg:right-0 lg:top-[0.3125rem] lg:h-px lg:w-auto"
          />
          {metodologia.pasos.map((p, i) => (
            <li
              key={p.titulo}
              className="relative grid grid-cols-[auto_1fr] gap-5 lg:flex lg:flex-col lg:gap-4"
              data-reveal
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <span
                aria-hidden="true"
                className={`relative z-[1] mt-[0.35rem] h-3 w-3 rounded-sm border-[1.5px] lg:mt-0 ${
                  i === metodologia.pasos.length - 1
                    ? "border-green-500 bg-green-500"
                    : "border-purple-500 bg-neutral-0"
                }`}
              />
              <div className="flex flex-col gap-1.5">
                <p className="tnum text-label text-purple-700">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="text-h3-sm md:text-h3 text-neutral-950">{p.titulo}</h3>
                <p className="text-body-sm text-neutral-700">{p.texto}</p>
              </div>
            </li>
          ))}
        </ol>

        {compacto ? null : (
          <div
            className="mt-14 grid gap-8 rounded-lg bg-neutral-50 p-6 md:mt-16 md:p-10 lg:grid-cols-12 lg:gap-8"
            data-reveal
          >
            <h3 className="text-h3-sm md:text-h2-sm text-neutral-950 lg:col-span-4">
              {metodologia.capacidadTitulo}
            </h3>
            <ul className="flex flex-col gap-3 lg:col-span-7 lg:col-start-6">
              {metodologia.capacidad.map((c) => (
                <li key={c} className="flex gap-3 text-body text-neutral-900">
                  <span
                    aria-hidden="true"
                    className="mt-[0.6rem] h-2 w-2 shrink-0 rounded-full bg-green-500"
                  />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

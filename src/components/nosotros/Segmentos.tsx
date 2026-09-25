import { segmentos } from "@/content/portafolio";
import { SectionHeading } from "@/components/SectionHeading";

/**
 * A quién acompañamos: los cuatro tipos de organización del sector y, al
 * cierre, con quién trabajamos dentro de cada entidad.
 */
export function Segmentos() {
  return (
    <section className="bg-neutral-50 py-16 md:py-20" aria-labelledby="segmentos-title">
      <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5" data-reveal>
          <SectionHeading
            id="segmentos-title"
            eyebrow={segmentos.eyebrow}
            title={segmentos.titulo}
            intro={segmentos.intro}
          />
        </div>
        <div className="flex flex-col gap-10 lg:col-span-6 lg:col-start-7">
          <ul className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
            {segmentos.items.map((s, i) => (
              <li
                key={s.titulo}
                className="grid grid-cols-[auto_1fr] gap-4"
                data-reveal
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.5em] h-3 w-3 rounded-sm border-[1.5px] border-purple-500 bg-purple-100"
                />
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-h3-sm text-neutral-950">{s.titulo}</h3>
                  <p className="text-body-sm text-neutral-700">{s.texto}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="border-l-2 border-purple-500 pl-5 text-body text-neutral-900" data-reveal>
            {segmentos.audiencias}
          </p>
        </div>
      </div>
    </section>
  );
}

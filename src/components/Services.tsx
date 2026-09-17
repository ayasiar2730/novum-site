import { services } from "@/content/site";
import { SectionHeading } from "@/components/SectionHeading";

/**
 * Acompañamiento (B1.5): TECNOLOGÍA + PERSONAS. Los seis servicios son nodos
 * de una red —una retícula de tres por dos con las líneas del sistema pasando
 * por cada nodo—, no seis tarjetas. Las descripciones están siempre visibles;
 * hover y foco solo enfatizan el nodo y su título. En pantallas estrechas la
 * red se vuelve una trayectoria vertical con la misma espina.
 */
export function Services() {
  return (
    <section id="servicios" className="py-20 md:py-24" aria-labelledby="servicios-title">
      <div className="container-site">
        <div data-reveal>
          <SectionHeading
            id="servicios-title"
            eyebrow={services.eyebrow}
            title={services.title}
            intro={services.intro}
          />
        </div>

        <div className="relative mt-14 md:mt-16">
          {/* la red: espina vertical hasta lg; en escritorio cada nodo traza su tramo horizontal y vertical */}
          <span
            aria-hidden="true"
            className="absolute bottom-8 left-[0.4375rem] top-2 w-px bg-purple-500/30 lg:hidden"
          />
          <ol className="relative grid gap-y-12 lg:grid-cols-3 lg:gap-y-0">
            {services.items.map((item, i) => {
              const primeraFila = i < 3;
              return (
                <li
                  key={item.title}
                  className={`group relative grid grid-cols-[auto_1fr] gap-5 lg:block lg:pb-12 lg:pl-9 lg:pr-10 lg:pt-7 lg:before:absolute lg:before:left-0 lg:before:right-0 lg:before:top-[2.2rem] lg:before:h-px lg:before:bg-purple-500/30 lg:before:content-[''] lg:after:absolute lg:after:left-[0.4375rem] lg:after:w-px lg:after:bg-purple-500/30 lg:after:content-[''] ${
                    primeraFila
                      ? "lg:after:bottom-0 lg:after:top-[2.2rem]"
                      : "lg:after:top-0 lg:after:h-[2.2rem]"
                  }`}
                  data-reveal
                  style={{ transitionDelay: `${(i % 3) * 60}ms` }}
                >
                  <span
                    aria-hidden="true"
                    className="relative z-[1] mt-[0.3rem] h-4 w-4 shrink-0 rounded-sm border-[1.5px] border-purple-500 bg-neutral-0 transition-colors duration-200 group-focus-within:bg-purple-500 group-hover:bg-purple-500 lg:absolute lg:left-0 lg:top-[1.7rem] lg:mt-0"
                  />
                  <div className="relative flex flex-col gap-3">
                    <h3 className="text-h3-sm md:text-h3 text-neutral-950 transition-colors duration-200 group-focus-within:text-purple-900 group-hover:text-purple-900">
                      {item.title}
                    </h3>
                    <p className="text-small max-w-[24rem] text-neutral-700">{item.body}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

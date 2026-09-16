import { problem } from "@/content/site";
import { SectionHeading } from "@/components/SectionHeading";

/**
 * Composición editorial asimétrica: el encabezado se queda fijo a la izquierda
 * mientras los tres problemas se leen a la derecha, separados por aire y
 * marcados con un nodo (Fase A: sin filos de formulario).
 * Sin cajas, sin numeración: son problemas paralelos, no etapas.
 */
export function Problem() {
  return (
    <section className="section-y bg-neutral-0" aria-labelledby="problema-title">
      <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28" data-reveal>
            <SectionHeading
              id="problema-title"
              eyebrow={problem.eyebrow}
              title={problem.title}
              intro={problem.intro}
            />
          </div>
        </div>

        <div className="flex flex-col gap-12 lg:col-span-7 lg:col-start-6 lg:gap-14">
          {problem.items.map((item, i) => (
            <div
              key={item.title}
              className="grid gap-3 md:grid-cols-12 md:gap-6"
              data-reveal
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <h3 className="flex items-start gap-4 text-h2-sm md:text-h2 text-purple-900 md:col-span-5">
                <span
                  aria-hidden="true"
                  className="mt-[0.55em] h-2.5 w-2.5 shrink-0 rounded-full border-[1.5px] border-purple-500 bg-purple-100"
                />
                <span>{item.title}</span>
              </h3>
              <p className="text-body text-neutral-700 md:col-span-7 md:self-center">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

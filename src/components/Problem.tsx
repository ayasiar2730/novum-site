import { problem } from "@/content/site";
import { SectionHeading } from "@/components/SectionHeading";

/**
 * Composición editorial asimétrica: el encabezado se queda fijo a la izquierda
 * mientras los tres problemas se leen a la derecha como una lista con filos.
 * Sin cajas, sin numeración: son problemas paralelos, no etapas.
 */
export function Problem() {
  return (
    <section className="section-y border-t border-neutral-100 bg-neutral-0" aria-labelledby="problema-title">
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

        <div className="divide-y divide-neutral-100 border-y border-neutral-100 lg:col-span-7 lg:col-start-6">
          {problem.items.map((item, i) => (
            <div
              key={item.title}
              className="grid gap-3 py-8 md:grid-cols-12 md:gap-6 md:py-10"
              data-reveal
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <h3 className="text-h2-sm md:text-h2 text-purple-900 md:col-span-5">{item.title}</h3>
              <p className="text-body text-neutral-700 md:col-span-7 md:self-center">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

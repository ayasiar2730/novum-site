import { differentiators } from "@/content/site";
import { SectionHeading } from "@/components/SectionHeading";

/** Cuatro filas en layout alterno separadas por líneas. Sin tarjetas, sin numeración. */
export function Differentiators() {
  return (
    <section className="section-y border-t border-neutral-100" aria-labelledby="distinto-title">
      <div className="container-site">
        <SectionHeading id="distinto-title" eyebrow={differentiators.eyebrow} title={differentiators.title} />
        <div className="mt-12 divide-y divide-neutral-100 border-y border-neutral-100">
          {differentiators.items.map((item, i) => {
            const flip = i % 2 === 1;
            return (
              <div key={item.title} className="grid gap-4 py-8 md:grid-cols-12 md:gap-8 md:py-10">
                <h3
                  className={`text-h2-sm md:text-h2 text-purple-900 md:row-start-1 ${
                    flip ? "md:col-span-5 md:col-start-8" : "md:col-span-5 md:col-start-1"
                  }`}
                >
                  {item.title}
                </h3>
                <p
                  className={`text-body-sm text-neutral-700 md:row-start-1 md:self-center ${
                    flip ? "md:col-span-7 md:col-start-1" : "md:col-span-7 md:col-start-6"
                  }`}
                >
                  {item.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

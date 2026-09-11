import { problem } from "@/content/site";
import { SectionHeading } from "@/components/SectionHeading";

/** Composición editorial: tres bloques con línea vertical de 1 px. Sin cajas, sin numeración. */
export function Problem() {
  return (
    <section className="section-y border-t border-neutral-100" aria-labelledby="problema-title">
      <div className="container-site">
        <SectionHeading id="problema-title" eyebrow={problem.eyebrow} title={problem.title} />
        <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-neutral-100">
          {problem.items.map((item, i) => (
            <div
              key={item.title}
              className={`flex flex-col gap-3 ${i > 0 ? "md:pl-10" : ""} ${i < 2 ? "md:pr-10" : ""}`}
            >
              <h3 className="text-h3-sm md:text-h3 text-purple-900">{item.title}</h3>
              <p className="text-body-sm text-neutral-700">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

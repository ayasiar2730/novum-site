import { services } from "@/content/site";
import { SectionHeading } from "@/components/SectionHeading";

/** Lista 2 × 2 con divisores de 1 px y estado hover. Sin íconos, sin tarjetas. */
export function Services() {
  return (
    <section
      id="servicios"
      className="section-y border-t border-neutral-100 bg-neutral-0"
      aria-labelledby="servicios-title"
    >
      <div className="container-site">
        <div data-reveal>
          <SectionHeading
            id="servicios-title"
            eyebrow={services.eyebrow}
            title={services.title}
            intro={services.intro}
          />
        </div>
        <div className="mt-14 grid border-t border-l border-neutral-100 md:grid-cols-2">
          {services.items.map((item, i) => (
            <div
              key={item.title}
              className="group flex flex-col gap-4 border-r border-b border-neutral-100 px-6 py-9 transition-colors duration-200 hover:bg-neutral-50 md:px-10 md:py-12"
              data-reveal
              style={{ transitionDelay: `${(i % 2) * 60}ms` }}
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-h3 md:text-h2-sm text-neutral-950 transition-colors duration-200 group-hover:text-purple-900">
                  {item.title}
                </h3>
                <span
                  aria-hidden="true"
                  className="text-purple-500 opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                >
                  →
                </span>
              </div>
              <p className="text-body-sm text-neutral-700">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

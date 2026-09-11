import { services } from "@/content/site";
import { SectionHeading } from "@/components/SectionHeading";

/** Lista 2 × 2 con divisores de 1 px. Sin íconos, sin tarjetas. */
export function Services() {
  return (
    <section
      id="servicios"
      className="section-y border-t border-neutral-100"
      aria-labelledby="servicios-title"
    >
      <div className="container-site">
        <SectionHeading
          id="servicios-title"
          eyebrow={services.eyebrow}
          title={services.title}
          intro={services.intro}
        />
        <div className="mt-12 grid border-t border-l border-neutral-100 md:grid-cols-2">
          {services.items.map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-3 border-r border-b border-neutral-100 px-6 py-8 md:px-10 md:py-10"
            >
              <h3 className="text-h3-sm md:text-h3 text-neutral-950">{item.title}</h3>
              <p className="text-body-sm text-neutral-700">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

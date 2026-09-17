import { services } from "@/content/site";
import { SectionHeading } from "@/components/SectionHeading";
import { Red } from "@/components/Red";

/**
 * Acompañamiento (B1.5): TECNOLOGÍA + PERSONAS. Los seis servicios son nodos de
 * una red alrededor del núcleo Novum (Red), en el mismo lenguaje del ecosistema
 * y del hero; la lista es la información completa y siempre visible. Sin
 * tarjetas, sin retícula.
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
        <div className="mt-14 md:mt-16">
          <Red items={services.items.map((s) => ({ title: s.title, body: s.body }))} />
        </div>
      </div>
    </section>
  );
}

import { services } from "@/content/site";
import { SectionHeading, type NivelTitulo } from "@/components/SectionHeading";
import { Red } from "@/components/Red";

/**
 * Acompañamiento (B1.5): TECNOLOGÍA + PERSONAS. Los seis servicios son nodos de
 * una red alrededor del núcleo Novum (Red), en el mismo lenguaje del ecosistema
 * y del hero; la lista es la información completa y siempre visible. Sin
 * tarjetas, sin retícula.
 */
/** `nivel={1}` cuando la sección abre su propia página (fase 2): su título pasa a ser el h1. */
export function Services({ nivel = 2 }: { nivel?: NivelTitulo } = {}) {
  return (
    <section
      id="servicios"
      className={nivel === 1 ? "pb-20 pt-8 md:pb-24 md:pt-12" : "py-20 md:py-24"}
      aria-labelledby="servicios-title"
    >
      <div className="container-site">
        <div data-reveal>
          <SectionHeading
            id="servicios-title"
            eyebrow={services.eyebrow}
            title={services.title}
            intro={services.intro}
            nivel={nivel}
          />
        </div>
        <div className="mt-14 md:mt-16">
          <Red
            items={services.items.map((s) => ({ title: s.title, body: s.body }))}
            nivel={nivel === 1 ? 2 : 3}
          />
        </div>
      </div>
    </section>
  );
}

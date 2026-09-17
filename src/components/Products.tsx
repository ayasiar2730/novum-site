import { products } from "@/content/site";
import { SectionHeading } from "@/components/SectionHeading";
import { Ecosystem, type Solution } from "@/components/Ecosystem";

/**
 * Acto del sistema (B1.2): el ecosistema Novum. SIAR tiene más jerarquía por
 * su profundidad metodológica —descripción, base normativa y siete
 * componentes—; Presupuesto, Planeación estratégica y Más soluciones son
 * módulos del mismo sistema, no secundarios. Sin estados de desarrollo, sin
 * roadmap, sin mockups: todo el contenido está en HTML y el ecosistema
 * responde a la solución activa (Ecosystem).
 */
const keys = ["presupuesto", "planeacion", "mas"];

export function Products() {
  const { siar, others } = products;
  const solutions: Solution[] = [
    {
      key: "siar",
      name: siar.name,
      fullName: siar.fullName,
      tagline: siar.tagline,
      description: siar.description,
      basis: siar.basis,
      pillars: siar.pillars,
    },
    ...others.map((o, i) => ({ key: keys[i], name: o.name, tagline: o.tagline, open: o.open })),
  ];

  return (
    <section id="soluciones" className="py-24 md:py-28" aria-labelledby="soluciones-title">
      <div className="container-site">
        <div data-reveal>
          <SectionHeading
            id="soluciones-title"
            eyebrow={products.eyebrow}
            title={products.title}
            intro={products.intro}
            size="lg"
          />
        </div>
        <div className="mt-16 md:mt-20">
          <Ecosystem solutions={solutions} />
        </div>
      </div>
    </section>
  );
}

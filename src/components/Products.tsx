import { products } from "@/content/site";
import { SectionHeading, type NivelTitulo } from "@/components/SectionHeading";
import { Ecosystem, type Solution } from "@/components/Ecosystem";

/**
 * Tecnología Novum (B1.2; página /tecnologia en la fase 2): el ecosistema. Novum
 * Riesgos tiene más jerarquía por su profundidad metodológica —descripción, base
 * normativa y siete componentes—; Novum Presupuesto, Novum Planeación Estratégica y Más
 * soluciones son productos independientes, no secundarios. Sin estados de desarrollo, sin
 * roadmap, sin mockups: todo el contenido está en HTML y el ecosistema
 * responde a la solución activa (Ecosystem).
 */
const keys = ["presupuesto", "planeacion", "mas"];

/** `nivel={1}` cuando la sección abre su propia página (fase 2): su título pasa a ser el h1. */
export function Products({ nivel = 2 }: { nivel?: NivelTitulo } = {}) {
  const { siar, others } = products;
  const solutions: Solution[] = [
    {
      key: "siar",
      name: siar.name,
      etiqueta: siar.etiqueta,
      fullName: siar.fullName,
      tagline: siar.tagline,
      description: siar.description,
      basis: siar.basis,
      pillars: siar.pillars,
    },
    ...others.map((o, i) => ({
      key: keys[i],
      name: o.name,
      etiqueta: o.etiqueta,
      tagline: o.tagline,
      open: o.open,
    })),
  ];

  return (
    <section
      id="soluciones"
      className={nivel === 1 ? "pb-24 pt-8 md:pb-28 md:pt-12" : "py-24 md:py-28"}
      aria-labelledby="soluciones-title"
    >
      <div className="container-site">
        <div data-reveal>
          <SectionHeading
            id="soluciones-title"
            eyebrow={products.eyebrow}
            title={products.title}
            intro={products.intro}
            size="lg"
            nivel={nivel}
          />
        </div>
        <div className="mt-16 md:mt-20">
          <Ecosystem solutions={solutions} nivel={nivel === 1 ? 2 : 3} />
        </div>
      </div>
    </section>
  );
}

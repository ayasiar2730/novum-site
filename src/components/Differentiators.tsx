import { differentiators } from "@/content/site";
import { SectionHeading } from "@/components/SectionHeading";
import { Criterio } from "@/components/Criterio";

/**
 * Acto de criterio (B1.3). Los cuatro diferenciadores aprobados se leen como
 * una secuencia — DATOS → EVIDENCIA → CONTEXTO → DIAGNÓSTICO → DECISIÓN —
 * con un panel visual dominante en escritorio que responde al criterio activo.
 * Las etapas son etiquetas de la secuencia; los títulos y textos no cambian.
 */
const stages = ["Datos", "Evidencia", "Contexto", "Diagnóstico"];

export function Differentiators() {
  const items = differentiators.items.map((item, i) => ({ stage: stages[i], ...item }));
  return (
    <section className="py-20 md:py-24" aria-labelledby="distinto-title">
      <div className="container-site">
        <div data-reveal>
          <SectionHeading
            id="distinto-title"
            eyebrow={differentiators.eyebrow}
            title={differentiators.title}
          />
        </div>
        <div className="mt-14 md:mt-16">
          <Criterio items={items} />
        </div>
      </div>
    </section>
  );
}

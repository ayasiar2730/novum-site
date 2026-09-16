import { differentiators } from "@/content/site";
import { SectionHeading } from "@/components/SectionHeading";

/**
 * Cuatro filas en layout alterno separadas por aire (Fase A: sin líneas).
 * Cada fila lleva un glifo abstracto del lenguaje de nodos del hero a 80–112 px,
 * como objeto visual: los datos son el único ornamento (design system §1).
 * Los trazos no escalan con el tamaño (vector-effect) para conservar la finura del sistema.
 */
const glyphs = [
  // Analítica en todo: anillo con núcleo
  <svg key="0" viewBox="0 0 40 40" aria-hidden="true" className="h-10 w-10">
    <circle cx="20" cy="20" r="15" fill="none" stroke="var(--color-purple-500)" strokeWidth="1.5" />
    <circle
      cx="20"
      cy="20"
      r="8"
      fill="none"
      stroke="var(--color-purple-500)"
      strokeWidth="1.5"
      strokeDasharray="2 4"
    />
    <circle cx="20" cy="20" r="3" fill="var(--color-purple-700)" />
  </svg>,
  // Evidencia creada en el proceso: nodo con registro
  <svg key="1" viewBox="0 0 40 40" aria-hidden="true" className="h-10 w-10">
    <circle cx="14" cy="20" r="6" fill="var(--color-purple-700)" />
    <path d="M20 20h12" stroke="var(--color-purple-500)" strokeWidth="1.5" strokeLinecap="round" />
    <path
      d="M26 13h8M26 27h8"
      stroke="var(--color-purple-500)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeOpacity="0.5"
    />
  </svg>,
  // Su entidad frente al sector: dos puntos sobre una escala
  <svg key="2" viewBox="0 0 40 40" aria-hidden="true" className="h-10 w-10">
    <path d="M6 24h28" stroke="var(--color-neutral-300)" strokeWidth="1.5" strokeLinecap="round" />
    <path
      d="M10 21v6M20 21v6M30 21v6"
      stroke="var(--color-neutral-300)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="20" cy="15" r="4" fill="none" stroke="var(--color-purple-500)" strokeWidth="1.5" />
    <circle cx="28" cy="15" r="4" fill="var(--color-green-500)" />
  </svg>,
  // Diagnóstico antes que software: arco de madurez
  <svg key="3" viewBox="0 0 40 40" aria-hidden="true" className="h-10 w-10">
    <path
      d="M8 28a12 12 0 0 1 24 0"
      fill="none"
      stroke="var(--color-neutral-300)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M8 28a12 12 0 0 1 14-11.8"
      fill="none"
      stroke="var(--color-purple-700)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="22" cy="16.2" r="3" fill="var(--color-green-500)" />
  </svg>,
];

export function Differentiators() {
  return (
    <section className="section-y" aria-labelledby="distinto-title">
      <div className="container-site">
        <div data-reveal>
          <SectionHeading
            id="distinto-title"
            eyebrow={differentiators.eyebrow}
            title={differentiators.title}
          />
        </div>
        <div className="mt-14 flex flex-col gap-14 md:gap-20">
          {differentiators.items.map((item, i) => {
            const flip = i % 2 === 1;
            return (
              <div
                key={item.title}
                className="grid gap-6 md:grid-cols-12 md:gap-8"
                data-reveal
                style={{ transitionDelay: `${(i % 2) * 60}ms` }}
              >
                <div
                  className={`flex items-start gap-6 md:row-start-1 md:items-center ${
                    flip ? "md:col-span-6 md:col-start-7" : "md:col-span-6 md:col-start-1"
                  }`}
                >
                  <span
                    className="glifo shrink-0 text-purple-500 [&>svg]:h-20 [&>svg]:w-20 md:[&>svg]:h-28 md:[&>svg]:w-28"
                    data-reveal="scale"
                    style={{ transitionDelay: `${(i % 2) * 60 + 80}ms` }}
                  >
                    {glyphs[i]}
                  </span>
                  <h3 className="text-h2-sm md:text-h2 text-purple-900">{item.title}</h3>
                </div>
                <p
                  className={`text-body text-neutral-700 md:row-start-1 md:self-center ${
                    flip ? "md:col-span-5 md:col-start-1" : "md:col-span-5 md:col-start-8"
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

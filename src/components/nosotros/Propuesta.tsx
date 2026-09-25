import { propuesta } from "@/content/portafolio";
import { SectionHeading } from "@/components/SectionHeading";

const acentos = ["border-purple-700", "border-purple-500", "border-green-500"];

/**
 * Propuesta de valor: Innovación, Tecnología y Solidaridad. Tres columnas
 * con un filete de color arriba (morado para análisis y tecnología, verde para
 * lo solidario), sin tarjetas.
 */
export function Propuesta() {
  return (
    <section className="bg-neutral-0 py-16 md:py-20" aria-labelledby="propuesta-title">
      <div className="container-site">
        <div className="lg:max-w-[46rem]" data-reveal>
          <SectionHeading
            id="propuesta-title"
            eyebrow={propuesta.eyebrow}
            title={propuesta.titulo}
            intro={propuesta.intro}
          />
        </div>
        <ul className="mt-12 grid gap-8 md:mt-14 md:grid-cols-3 md:gap-8">
          {propuesta.pilares.map((p, i) => (
            <li
              key={p.titulo}
              className={`flex flex-col gap-3 border-t-2 pt-5 ${acentos[i]}`}
              data-reveal
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <h3 className="text-h3-sm md:text-h3 text-neutral-950">{p.titulo}</h3>
              <p className="text-body-sm text-neutral-700">{p.texto}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

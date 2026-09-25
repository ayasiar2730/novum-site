import { products } from "@/content/site";
import { PRODUCTOS } from "@/lib/productos";
import { SectionHeading } from "@/components/SectionHeading";
import { ButtonLink } from "@/components/ButtonLink";

/**
 * Tecnología Novum en el Home (fase 2): los tres productos, cada uno con su
 * nombre, lo que resuelve y lo que trae; el ecosistema completo y el criterio
 * viven en /tecnologia. Tres columnas sobre la misma línea del sistema, con el
 * nodo de cada producto (Novum Riesgos, el de más profundidad, relleno).
 */
export function ResumenTecnologia() {
  return (
    <section id="tecnologia" className="pb-20 md:pb-28" aria-labelledby="tecnologia-title">
      <div className="container-site">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-7" data-reveal>
            <SectionHeading
              id="tecnologia-title"
              eyebrow={products.eyebrow}
              title={products.title}
              intro={products.intro}
            />
          </div>
          <div className="lg:col-span-4 lg:col-start-9 lg:justify-self-end" data-reveal>
            <ButtonLink href="/tecnologia" variant="secondary" arrow>
              {products.ver}
            </ButtonLink>
          </div>
        </div>

        <ul className="relative mt-12 grid gap-10 md:mt-14 md:grid-cols-3 md:gap-8">
          <span
            aria-hidden="true"
            className="absolute left-[0.3125rem] right-0 top-[0.3125rem] hidden h-px bg-purple-500/40 md:block"
          />
          {PRODUCTOS.map((p, i) => (
            <li
              key={p.clave}
              className="flex flex-col gap-4"
              data-reveal
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <span
                aria-hidden="true"
                className={`relative z-[1] h-3 w-3 rounded-sm border-[1.5px] ${
                  i === 0 ? "border-purple-700 bg-purple-500" : "border-purple-500 bg-neutral-0"
                }`}
              />
              <div className="flex flex-col gap-2">
                <p className="text-label uppercase text-purple-700">{p.subtitulo}</p>
                <h3 className="text-h3-sm md:text-h3 text-neutral-950">{p.nombre}</h3>
                <p className="text-body-sm max-w-[26rem] text-neutral-700">{p.texto}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

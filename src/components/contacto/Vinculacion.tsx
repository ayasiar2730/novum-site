import { vinculacion } from "@/content/portafolio";
import { SectionHeading } from "@/components/SectionHeading";

/**
 * Formas de vinculación: abre /contacto (su título es el h1). Seis maneras de
 * trabajar con Novum, de una necesidad puntual a una transformación completa;
 * la banda de contacto que sigue es la salida.
 */
export function Vinculacion() {
  return (
    <section className="pb-16 pt-8 md:pb-20 md:pt-12" aria-labelledby="vinculacion-title">
      <div className="container-site">
        <div className="lg:max-w-[48rem]" data-reveal>
          <SectionHeading
            id="vinculacion-title"
            eyebrow={vinculacion.eyebrow}
            title={vinculacion.titulo}
            intro={vinculacion.intro}
            size="lg"
            nivel={1}
          />
        </div>
        <ul className="mt-12 grid gap-x-8 md:mt-14 md:grid-cols-2 lg:grid-cols-3">
          {vinculacion.items.map((v, i) => (
            <li
              key={v.titulo}
              className="grid grid-cols-[auto_1fr] gap-4 border-t border-neutral-100 py-6"
              data-reveal
              style={{ transitionDelay: `${(i % 3) * 60}ms` }}
            >
              <span
                aria-hidden="true"
                className="mt-[0.5em] h-3 w-3 rounded-sm border-[1.5px] border-purple-500 bg-neutral-0"
              />
              <div className="flex flex-col gap-1.5">
                <h2 className="text-h3-sm md:text-h3 text-neutral-950">{v.titulo}</h2>
                <p className="text-body-sm text-neutral-700">{v.texto}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

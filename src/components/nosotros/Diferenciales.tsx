import { diferenciales } from "@/content/portafolio";
import { SectionHeading } from "@/components/SectionHeading";

/** Por qué Novum: los seis diferenciales del portafolio, en una retícula de tres por dos con filetes. */
export function Diferenciales() {
  return (
    <section className="bg-neutral-0 py-16 md:py-20" aria-labelledby="diferenciales-title">
      <div className="container-site">
        <div className="lg:max-w-[46rem]" data-reveal>
          <SectionHeading
            id="diferenciales-title"
            eyebrow={diferenciales.eyebrow}
            title={diferenciales.titulo}
            intro={diferenciales.intro}
          />
        </div>
        <ol className="mt-12 grid gap-x-8 md:mt-14 md:grid-cols-2 lg:grid-cols-3">
          {diferenciales.items.map((d, i) => (
            <li
              key={d.titulo}
              className="flex flex-col gap-2 border-t border-neutral-100 py-6"
              data-reveal
              style={{ transitionDelay: `${(i % 3) * 60}ms` }}
            >
              <p className="tnum text-label text-purple-700" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="text-h3-sm md:text-h3 text-neutral-950">{d.titulo}</h3>
              <p className="text-body-sm text-neutral-700">{d.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

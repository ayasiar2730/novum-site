import type { CSSProperties } from "react";
import { problem } from "@/content/site";
import { SectionHeading } from "@/components/SectionHeading";

/**
 * Acto de tensión (B1.1): INFORMACIÓN → fragmentación → necesidad de conexión.
 * Tres situaciones como módulos que entran desalineados (--dx) y encuentran
 * una estructura común al llegar a pantalla; la conexión entre ellos queda
 * discontinua a propósito: existe, pero no está resuelta todavía — la
 * resuelve el acto siguiente. Sin JS o con reduced-motion se ven alineados.
 * Sin tarjetas, sin numeración: son problemas paralelos, no etapas.
 */
const offsets = ["4.5rem", "0rem", "2.5rem"];

export function Problem() {
  return (
    <section
      className="relative overflow-x-clip bg-neutral-0 py-20 md:py-28"
      aria-labelledby="problema-title"
    >
      {/* entrega al acto siguiente: la trama del sistema aparece progresivamente */}
      <div aria-hidden="true" className="trama-entra pointer-events-none absolute inset-x-0 bottom-0 h-40" />
      <div className="container-site grid gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28" data-reveal>
            <SectionHeading
              id="problema-title"
              eyebrow={problem.eyebrow}
              title={problem.title}
              intro={problem.intro}
            />
          </div>
        </div>

        <div className="relative lg:col-span-7 lg:col-start-6">
          {/* estructura común: la conexión discontinua entra desde el hero y recorre los tres módulos */}
          <div
            aria-hidden="true"
            className="absolute bottom-6 left-[0.3125rem] top-[-7rem] hidden w-px border-l border-dashed border-purple-500/50 [mask-image:linear-gradient(180deg,transparent,black_35%)] lg:block"
            data-reveal
            style={{ transitionDelay: "520ms" }}
          />
          <ol className="flex flex-col gap-14 lg:gap-16">
            {problem.items.map((item, i) => (
              <li
                key={item.title}
                className="grid gap-4 lg:grid-cols-[auto_1fr] lg:gap-6"
                data-reveal="frag"
                style={{ "--dx": offsets[i], transitionDelay: `${i * 90}ms` } as CSSProperties}
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.45em] hidden h-3 w-3 shrink-0 rounded-sm border-[1.5px] border-purple-500 bg-neutral-0 lg:block"
                />
                <div className="grid gap-3 md:grid-cols-12 md:gap-6">
                  <h3 className="text-h2-sm md:text-h2 text-purple-900 md:col-span-5">{item.title}</h3>
                  <p className="text-body text-neutral-700 md:col-span-7 md:self-center">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

import { about } from "@/content/site";
import { SectionHeading } from "@/components/SectionHeading";

/**
 * #nosotros — "Experiencia que entiende el sector": presentación institucional
 * de un equipo multidisciplinario, sin nombres, cargos ni fotografías.
 * Los perfiles individuales siguen en código tras NEXT_PUBLIC_SHOW_TEAM
 * (false en producción) y solo se renderizan si esa variable es "true".
 * La declaración institucional de la empresa vive en el pie de página.
 */
const showTeam = process.env.NEXT_PUBLIC_SHOW_TEAM === "true";

export function About() {
  return (
    <section id="nosotros" className="section-y" aria-labelledby="nosotros-title">
      <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4" data-reveal>
          <SectionHeading id="nosotros-title" eyebrow={about.eyebrow} title={about.title} />
        </div>

        <div className="flex flex-col gap-10 lg:col-span-8" data-reveal style={{ transitionDelay: "80ms" }}>
          <p className="border-l-2 border-green-500 pl-6 text-h3-sm font-medium leading-[1.45] text-neutral-950 md:pl-8 md:text-[1.625rem] md:leading-[1.4]">
            {about.base}
          </p>
          <p className="text-body measure text-neutral-700">{about.complement}</p>

          {/* Capacidades: lista editorial con nodos, sin filos ni tarjetas */}
          <div>
            <p className="flex items-center gap-3 text-label uppercase text-purple-700">
              <span aria-hidden="true" className="h-px w-6 bg-purple-500" />
              {about.capabilitiesLabel}
            </p>
            <ul className="mt-5 grid grid-cols-2 gap-x-8 sm:grid-cols-3">
              {about.capabilities.map((capability) => (
                <li
                  key={capability}
                  className="flex items-center gap-3 py-3 text-body font-semibold text-neutral-950"
                >
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 shrink-0 rounded-full border-[1.5px] border-purple-500 bg-purple-100"
                  />
                  {capability}
                </li>
              ))}
            </ul>
          </div>

          {showTeam ? (
            <div className="border-t border-neutral-100 pt-10">
              <h3 className="flex items-center gap-3 text-label uppercase text-purple-700">
                <span aria-hidden="true" className="h-px w-6 bg-purple-500" />
                {about.teamTitle}
              </h3>
              <ul className="mt-6 divide-y divide-neutral-100 border-b border-neutral-100">
                {about.team.map((member) => (
                  <li key={member.name} className="grid gap-2 py-5 md:grid-cols-12 md:gap-6">
                    <div className="md:col-span-5">
                      <p className="text-body font-semibold text-neutral-950">{member.name}</p>
                      <p className="mt-1.5 text-label uppercase text-purple-700">{member.role}</p>
                    </div>
                    <p className="text-body-sm text-neutral-700 md:col-span-7 md:self-center">{member.bio}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

import { about } from "@/content/site";

/**
 * #nosotros (B1.6) — "Experiencia que entiende el sector": pausa de autoridad
 * antes del cierre. Una gran afirmación, el complemento al lado y las seis
 * capacidades como nodos sobre una misma línea del sistema. Sin nombres,
 * cargos ni fotografías: los perfiles individuales siguen en código tras
 * NEXT_PUBLIC_SHOW_TEAM (false en producción, fail-closed).
 */
const showTeam = process.env.NEXT_PUBLIC_SHOW_TEAM === "true";

export function About() {
  return (
    <section id="nosotros" className="py-16 md:py-20" aria-labelledby="nosotros-title">
      <div className="container-site">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8" data-reveal>
          <div className="flex flex-col gap-6 lg:col-span-8">
            <p className="flex items-center gap-3 text-label uppercase text-purple-700">
              <span aria-hidden="true" className="h-px w-6 bg-purple-500" />
              {about.eyebrow}
            </p>
            <h2 id="nosotros-title" className="text-h1-sm md:text-h1 text-neutral-950">
              {about.title}
            </h2>
            <p className="border-l-2 border-purple-500 pl-6 text-h3-sm font-medium leading-[1.45] text-neutral-950 md:pl-8 md:text-[1.625rem] md:leading-[1.4]">
              {about.base}
            </p>
          </div>
          <p className="text-body-sm text-neutral-700 lg:col-span-4 lg:self-end lg:pb-1">
            {about.complement}
          </p>
        </div>

        {/* Capacidades: seis nodos sobre una misma línea */}
        <div className="mt-12 md:mt-14" data-reveal style={{ transitionDelay: "80ms" }}>
          <p className="text-label uppercase text-purple-700">{about.capabilitiesLabel}</p>
          <ul className="relative mt-5 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-0">
            <span
              aria-hidden="true"
              className="absolute left-[0.3125rem] right-[16.6667%] top-[0.3125rem] hidden h-px bg-purple-500/40 lg:block"
            />
            {about.capabilities.map((capability) => (
              <li
                key={capability}
                className="flex items-center gap-3 text-body font-semibold text-neutral-950 lg:flex-col lg:items-start lg:gap-4"
              >
                <span
                  aria-hidden="true"
                  className="relative z-[1] h-3 w-3 shrink-0 rounded-sm border-[1.5px] border-purple-500 bg-purple-100"
                />
                {capability}
              </li>
            ))}
          </ul>
        </div>

        {showTeam ? (
          <div className="mt-12 border-t border-neutral-100 pt-10">
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
    </section>
  );
}

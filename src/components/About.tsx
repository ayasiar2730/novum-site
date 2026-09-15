import { about, site } from "@/content/site";
import { SectionHeading } from "@/components/SectionHeading";

/**
 * #nosotros existe SIEMPRE en producción con la declaración institucional,
 * presentada como una afirmación grande con el único filete verde de la página.
 * Solo los perfiles individuales dependen de NEXT_PUBLIC_SHOW_TEAM
 * (true en preview, false en producción).
 */
const showTeam = process.env.NEXT_PUBLIC_SHOW_TEAM === "true";

export function About() {
  return (
    <section id="nosotros" className="section-y border-t border-neutral-100" aria-labelledby="nosotros-title">
      <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4" data-reveal>
          <SectionHeading id="nosotros-title" eyebrow={about.eyebrow} title={about.title} />
        </div>

        <div className="lg:col-span-8" data-reveal style={{ transitionDelay: "80ms" }}>
          <p className="border-l-2 border-green-500 pl-6 text-h3-sm font-medium leading-[1.45] text-neutral-950 md:pl-8 md:text-[1.75rem] md:leading-[1.4]">
            {site.institutional}
          </p>

          {showTeam ? (
            <div className="mt-14 border-t border-neutral-100 pt-10">
              <h3 className="flex items-center gap-3 text-label uppercase text-purple-700">
                <span aria-hidden="true" className="h-px w-6 bg-purple-500" />
                {about.teamTitle}
              </h3>
              <ul className="mt-6 divide-y divide-neutral-100 border-b border-neutral-100">
                {about.team.map((member, i) => (
                  <li
                    key={member.name}
                    className="grid gap-2 py-5 md:grid-cols-12 md:gap-6"
                    data-reveal
                    style={{ transitionDelay: `${i * 60}ms` }}
                  >
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

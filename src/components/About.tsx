import { about, site } from "@/content/site";
import { SectionHeading } from "@/components/SectionHeading";

/**
 * #nosotros existe SIEMPRE en producción con la declaración institucional.
 * Solo los perfiles individuales dependen de NEXT_PUBLIC_SHOW_TEAM
 * (true en preview, false en producción).
 */
const showTeam = process.env.NEXT_PUBLIC_SHOW_TEAM === "true";

export function About() {
  return (
    <section id="nosotros" className="section-y border-t border-neutral-100" aria-labelledby="nosotros-title">
      <div className="container-site">
        <SectionHeading id="nosotros-title" eyebrow={about.eyebrow} title={about.title} />
        <p className="mt-8 text-lead text-neutral-900 md:w-3/4">{site.institutional}</p>

        {showTeam ? (
          <div className="mt-14 border-t border-neutral-100 pt-10">
            <h3 className="text-label uppercase text-purple-700">{about.teamTitle}</h3>
            <ul className="mt-6 divide-y divide-neutral-100 border-b border-neutral-100">
              {about.team.map((member) => (
                <li key={member.name} className="grid gap-2 py-5 md:grid-cols-12 md:gap-6">
                  <div className="md:col-span-5">
                    <p className="font-semibold text-neutral-950">{member.name}</p>
                    <p className="mt-1.5 text-label uppercase text-purple-700">{member.role}</p>
                  </div>
                  <p className="text-body-sm text-neutral-700 md:col-span-7">{member.bio}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}

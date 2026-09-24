import { contact, cta, finalCta } from "@/content/site";
import { chatLink, demoLink } from "@/lib/links";
import { ButtonLink } from "@/components/ButtonLink";
import { SectionHeading, type NivelTitulo } from "@/components/SectionHeading";
import { DESKTOP, inputPath, outputPath } from "@/components/systemGeometry";

/** La única banda oscura de la página (design system §2), con el motivo del sistema en marca de agua. */
function Watermark() {
  const D = DESKTOP;
  const inputs = D.groups.flatMap((g) => g.nodes);
  // El reveal va en el envoltorio: la marca de agua conserva su opacidad propia.
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden lg:block"
      data-reveal="scale"
    >
      <svg
        viewBox={D.viewBox}
        className="absolute -right-40 top-1/2 h-[135%] w-auto -translate-y-1/2 opacity-[0.12]"
      >
        <g fill="none" stroke="#ffffff" strokeWidth="1.25" strokeLinecap="round">
          {inputs.map((n) => (
            <path key={n.label} d={inputPath(n, D.center.x, D.center.y)} />
          ))}
          <path d={outputPath(D.center.x, D.center.y, D.output.x, D.output.y)} />
          {inputs.map((n) => (
            <circle key={n.label} cx={n.x} cy={n.y} r="6.5" />
          ))}
          <circle cx={D.center.x} cy={D.center.y} r="32" />
          <circle cx={D.center.x} cy={D.center.y} r="66" strokeOpacity="0.5" />
          <circle cx={D.output.x} cy={D.output.y} r="19" />
        </g>
        <circle cx={D.center.x} cy={D.center.y} r="16" fill="#ffffff" />
        <circle cx={D.output.x} cy={D.output.y} r="11" fill="var(--color-green-500)" />
      </svg>
    </div>
  );
}

/** `nivel={1}` cuando la sección abre su propia página (fase 2): su título pasa a ser el h1. */
export function FinalCta({ nivel = 2 }: { nivel?: NivelTitulo } = {}) {
  return (
    <section
      id="contacto"
      className="relative overflow-hidden rounded-t-xl bg-purple-900 text-white shadow-band"
      aria-labelledby="contacto-title"
    >
      <div aria-hidden="true" className="glow-dark pointer-events-none absolute inset-0" />
      <Watermark />

      <div className="container-site section-y relative">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="flex flex-col gap-7 lg:col-span-8" data-reveal>
            <SectionHeading
              id="contacto-title"
              eyebrow={finalCta.eyebrow}
              title={finalCta.title}
              tone="dark"
              size="lg"
              nivel={nivel}
            />
            <p className="text-body measure text-neutral-100/90">{finalCta.body}</p>
            <div className="flex flex-col gap-3 pt-1 sm:flex-row">
              <ButtonLink href={demoLink} external variant="onDark" arrow>
                {cta.primary}
              </ButtonLink>
              <ButtonLink href={chatLink} external variant="onDarkSecondary">
                {cta.secondary}
              </ButtonLink>
            </div>
          </div>

          <div
            className="flex flex-col gap-8 text-small lg:col-span-4 lg:border-l lg:border-white/15 lg:pl-10"
            data-reveal
            style={{ transitionDelay: "100ms" }}
          >
            <div>
              <p className="mb-2 text-label uppercase text-purple-100/75">Correo</p>
              <ul className="flex flex-col">
                {contact.emails.map((email) => (
                  <li key={email}>
                    <a
                      href={`mailto:${email}`}
                      className="flex min-h-11 items-center text-white transition-colors [overflow-wrap:anywhere] hover:text-green-300"
                    >
                      {email}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 text-label uppercase text-purple-100/75">WhatsApp</p>
              <ul className="flex flex-col">
                {contact.whatsapp.map((w) => (
                  <li key={w.number}>
                    <a
                      href={`https://wa.me/${w.number}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tnum flex min-h-11 items-center text-white transition-colors hover:text-green-300"
                    >
                      {w.display}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { contact, cta, finalCta } from "@/content/site";
import { chatLink, demoLink } from "@/lib/links";
import { ButtonLink } from "@/components/ButtonLink";
import { SectionHeading } from "@/components/SectionHeading";

/** La única banda oscura de la página (design system §2), con el motivo del sistema en marca de agua. */
function Watermark() {
  return (
    <svg
      viewBox="0 0 800 600"
      aria-hidden="true"
      className="pointer-events-none absolute -right-40 top-1/2 hidden h-[135%] w-auto -translate-y-1/2 opacity-[0.12] lg:block"
    >
      <g fill="none" stroke="#ffffff" strokeWidth="1.25" strokeLinecap="round">
        <path d="M 148 190 C 270 190 270 300 376 300" />
        <path d="M 148 300 C 262 300 262 300 376 300" />
        <path d="M 148 410 C 270 410 270 300 376 300" />
        <path d="M 424 300 C 500 300 500 225 582 225" />
        <path d="M 424 300 C 500 300 500 375 582 375" />
        <path d="M 598 225 C 670 225 670 300 720 300" />
        <path d="M 598 375 C 670 375 670 300 720 300" />
        <circle cx="140" cy="190" r="6" />
        <circle cx="140" cy="300" r="6" />
        <circle cx="140" cy="410" r="6" />
        <circle cx="400" cy="300" r="26" />
        <circle cx="400" cy="300" r="64" strokeOpacity="0.5" />
        <circle cx="590" cy="225" r="8" />
        <circle cx="590" cy="375" r="8" />
        <circle cx="730" cy="300" r="18" />
      </g>
      <circle cx="400" cy="300" r="14" fill="#ffffff" />
      <circle cx="730" cy="300" r="10" fill="var(--color-green-500)" />
    </svg>
  );
}

export function FinalCta() {
  return (
    <section
      id="contacto"
      className="relative overflow-hidden bg-purple-900 text-white"
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
              <p className="mb-2 text-label uppercase text-green-300">Correo</p>
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
              <p className="mb-2 text-label uppercase text-green-300">WhatsApp</p>
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

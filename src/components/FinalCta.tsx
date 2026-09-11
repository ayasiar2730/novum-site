import { contact, cta, finalCta } from "@/content/site";
import { chatLink, demoLink } from "@/lib/links";
import { ButtonLink } from "@/components/ButtonLink";
import { SectionHeading } from "@/components/SectionHeading";

/** La única banda oscura de la página (design system §2). */
export function FinalCta() {
  return (
    <section id="contacto" className="bg-purple-900 text-white" aria-labelledby="contacto-title">
      <div className="container-site section-y">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="flex flex-col gap-6 md:col-span-8">
            <SectionHeading
              id="contacto-title"
              eyebrow={finalCta.eyebrow}
              title={finalCta.title}
              tone="dark"
            />
            <p className="text-body measure text-neutral-100">{finalCta.body}</p>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <ButtonLink href={demoLink} external variant="onDark">
                {cta.primary}
              </ButtonLink>
              <ButtonLink href={chatLink} external variant="onDarkSecondary">
                {cta.secondary}
              </ButtonLink>
            </div>
          </div>

          <div className="flex flex-col gap-8 text-small md:col-span-4 md:border-l md:border-white/15 md:pl-10">
            <div>
              <p className="mb-3 text-label uppercase text-green-300">Correo</p>
              <ul className="flex flex-col gap-2">
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
              <p className="mb-3 text-label uppercase text-green-300">WhatsApp</p>
              <ul className="flex flex-col gap-2">
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

import Link from "next/link";
import { contact, cta, nav, site } from "@/content/site";
import { Logo } from "@/components/Logo";
import { RedesSociales } from "@/components/RedesSociales";

export function Footer() {
  return (
    <footer className="border-t border-neutral-100 bg-neutral-50">
      <div className="container-site grid gap-12 py-14 md:grid-cols-12 md:py-20">
        <div className="flex flex-col gap-5 md:col-span-5">
          <Logo variant="mark" />
          <p className="text-h3-sm md:text-h3 measure text-neutral-950">{site.tagline}</p>
          <p className="text-small text-neutral-700">{site.footerLine}</p>
          <p className="text-small text-neutral-500">{site.legalName}</p>
        </div>

        <nav aria-label="Pie de página" className="md:col-span-2 md:col-start-7">
          <p className="mb-3 text-label uppercase text-neutral-500">Navegación</p>
          <ul className="flex flex-col text-small">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex min-h-11 items-center text-neutral-700 transition-colors hover:text-purple-900"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={site.appUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-center text-neutral-700 transition-colors hover:text-purple-900"
              >
                {cta.app}
              </a>
            </li>
          </ul>
        </nav>

        <div className="md:col-span-4">
          <p className="mb-3 text-label uppercase text-neutral-500">Contacto</p>
          <ul className="flex flex-col text-small">
            {contact.emails.map((email) => (
              <li key={email}>
                <a
                  href={`mailto:${email}`}
                  className="flex min-h-11 items-center text-neutral-700 transition-colors [overflow-wrap:anywhere] hover:text-purple-900"
                >
                  {email}
                </a>
              </li>
            ))}
            {contact.whatsapp.map((w) => (
              <li key={w.number}>
                <a
                  href={`https://wa.me/${w.number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tnum flex min-h-11 items-center text-neutral-700 transition-colors hover:text-purple-900"
                >
                  {w.display}
                </a>
              </li>
            ))}
          </ul>
          <p className="mb-3 mt-6 text-label uppercase text-neutral-500">Redes</p>
          <RedesSociales />
        </div>
      </div>

      <div className="border-t border-neutral-100">
        <div className="container-site flex flex-col gap-2 py-5 text-label uppercase text-neutral-500 md:flex-row md:items-center md:justify-between">
          <p>
            © {site.year} {site.legalName}
          </p>
          <p>Colombia</p>
        </div>
      </div>
    </footer>
  );
}

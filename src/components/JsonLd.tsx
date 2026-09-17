import { existsSync } from "node:fs";
import path from "node:path";
import { contact, site } from "@/content/site";

/**
 * Datos estructurados. Solo lo que representa contenido visible en la página.
 * Sin sameAs (no hay LinkedIn aún), sin address (ciudad pendiente),
 * sin foundingDate (sociedad en constitución). El logo solo se declara cuando
 * public/brand/logo.svg existe de verdad: apuntar a un 404 es peor que omitirlo.
 * No inventar.
 */
const hasLogo = existsSync(path.join(process.cwd(), "public", "brand", "logo.svg"));

const graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.legalName,
      alternateName: site.name,
      url: `${site.url}/`,
      ...(hasLogo ? { logo: `${site.url}/brand/logo.svg` } : {}),
      description: site.institutional,
      email: contact.emails[0],
      telephone: `+${contact.whatsapp[0].number}`,
      areaServed: { "@type": "Country", name: "Colombia" },
      knowsAbout: [
        "gestión de riesgos",
        "SARC",
        "economía solidaria",
        "cooperativas de ahorro y crédito",
        "fondos de empleados",
        "asociaciones mutuales",
        "presupuesto",
        "planeación estratégica",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      name: site.name,
      url: `${site.url}/`,
      inLanguage: "es-CO",
      publisher: { "@id": `${site.url}/#organization` },
    },
  ],
};

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      // JSON generado desde constantes propias; no hay entrada de usuario.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

import { contact, site } from "@/content/site";

/**
 * Datos estructurados. Solo lo que representa contenido visible en la página.
 * Sin sameAs (no hay LinkedIn aún), sin address (ciudad pendiente),
 * sin foundingDate (sociedad en constitución). No inventar.
 */
const graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.legalName,
      alternateName: site.name,
      url: `${site.url}/`,
      logo: `${site.url}/brand/logo.svg`,
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

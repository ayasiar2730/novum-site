import Link from "next/link";
import { site } from "@/content/site";

export interface Miga {
  nombre: string;
  href: string;
}

/**
 * Migas de pan de las páginas internas (fase 2), con su BreadcrumbList de
 * schema.org: la misma ruta visible y declarada. «Inicio» va siempre primero;
 * la última miga es la página actual y no es enlace.
 */
export function Migas({ items }: { items: Miga[] }) {
  const todas: Miga[] = [{ nombre: "Inicio", href: "/" }, ...items];
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: todas.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: m.nombre,
      item: `${site.url}${m.href}`,
    })),
  };
  return (
    <nav aria-label="Ruta de navegación" className="text-small">
      <ol className="flex flex-wrap items-center gap-x-2 text-neutral-700">
        {todas.map((m, i) => {
          const actual = i === todas.length - 1;
          return (
            <li key={m.href} className="flex min-h-11 items-center gap-2">
              {i > 0 ? (
                <span aria-hidden="true" className="text-neutral-300">
                  /
                </span>
              ) : null}
              {actual ? (
                <span aria-current="page" className="text-neutral-950">
                  {m.nombre}
                </span>
              ) : (
                <Link
                  href={m.href}
                  className="inline-flex min-h-11 items-center transition-colors duration-200 hover:text-purple-900"
                >
                  {m.nombre}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
      <script
        type="application/ld+json"
        // Construido desde rutas y títulos propios; se escapa «<» por higiene.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }}
      />
    </nav>
  );
}

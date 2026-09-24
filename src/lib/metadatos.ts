import type { Metadata } from "next";
import { site } from "@/content/site";
import { ogAlt, ogSize } from "@/lib/og";

/**
 * Metadatos de una página interna: título (la plantilla del layout añade
 * «· Novum Integral»), descripción, canónica y Open Graph / Twitter propios.
 * Open Graph se declara completo porque Next no fusiona el del layout: una
 * página sin el suyo heredaría `og:url` del Home, y una con el suyo pierde la
 * imagen del `opengraph-image` de la raíz. Por eso la imagen se declara aquí,
 * apuntando a esas mismas rutas.
 */
export function metadatosDePagina({
  titulo,
  descripcion,
  ruta,
}: {
  titulo: string;
  descripcion: string;
  ruta: string;
}): Metadata {
  const tituloCompleto = `${titulo} · ${site.name}`;
  const imagen = (url: string) => [
    { url, alt: ogAlt, width: ogSize.width, height: ogSize.height, type: "image/png" },
  ];
  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical: ruta },
    openGraph: {
      type: "website",
      locale: "es_CO",
      url: ruta,
      siteName: site.name,
      title: tituloCompleto,
      description: descripcion,
      images: imagen("/opengraph-image"),
    },
    twitter: {
      card: "summary_large_image",
      title: tituloCompleto,
      description: descripcion,
      images: imagen("/twitter-image"),
    },
  };
}

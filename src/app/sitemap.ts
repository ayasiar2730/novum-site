import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${site.url}/`,
      // Fecha del último corte editorial (site.contentUpdatedAt), no la del build:
      // un sitemap que cambia en cada despliegue sin cambiar el contenido no informa nada.
      lastModified: site.contentUpdatedAt,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}

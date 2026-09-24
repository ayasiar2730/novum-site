import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { listarInformes } from "@/lib/informes/catalogo";

// Fechas de contenido, no del build: un sitemap que cambia en cada despliegue
// sin cambiar el contenido no informa nada. Las páginas institucionales usan el
// último corte editorial (site.contentUpdatedAt); cada informe, el día en que
// se generó su snapshot; el Home y el catálogo, lo más reciente de ambos.
const dia = (iso: string) => iso.slice(0, 10);

export default function sitemap(): MetadataRoute.Sitemap {
  const informes = listarInformes();
  const ultimoInforme = informes
    .map((i) => dia(i.snapshot.generadoEl))
    .sort()
    .at(-1);
  const reciente = [site.contentUpdatedAt, ultimoInforme ?? ""].sort().at(-1) ?? site.contentUpdatedAt;

  const pagina = (ruta: string, lastModified: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${site.url}${ruta}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
  });

  return [
    pagina("/", reciente, 1),
    pagina("/soluciones", site.contentUpdatedAt, 0.8),
    pagina("/informes", reciente, 0.8),
    ...informes.map((i) => pagina(`/informes/${i.slug}`, dia(i.snapshot.generadoEl), 0.7)),
    pagina("/acompanamiento", site.contentUpdatedAt, 0.6),
    pagina("/nosotros", site.contentUpdatedAt, 0.5),
    pagina("/contacto", site.contentUpdatedAt, 0.5),
  ];
}

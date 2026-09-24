import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { paginas } from "@/content/site";
import { sector } from "@/content/sector";
import { informePorSlug, listarInformes } from "@/lib/informes/catalogo";
import { selectPortada, selectRangosContexto } from "@/lib/sector/selectV2";
import { metadatosDePagina } from "@/lib/metadatos";
import { Migas } from "@/components/Migas";
import { Informe } from "@/components/sector/informe/Informe";
import { SectorContext } from "@/components/sector/SectorContext";
import { DescargaPdf } from "@/components/informes/DescargaPdf";

type Props = { params: Promise<{ slug: string }> };

/** Solo existen las ediciones publicadas: cualquier otro slug es 404 (sin render bajo demanda). */
export const dynamicParams = false;

export function generateStaticParams() {
  return listarInformes().map((i) => ({ slug: i.slug }));
}

const tituloDe = (corteEtiqueta: string) =>
  `${sector.informe.titulo} · ${sector.informe.cortePrefijo} ${corteEtiqueta.toLowerCase()}`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const informe = informePorSlug(slug);
  if (!informe) return {};
  const portada = selectPortada(informe.snapshot);
  return metadatosDePagina({
    titulo: tituloDe(portada.corteEtiqueta),
    descripcion: sector.catalogo.descripcionEdicion
      .replace("{fecha}", portada.fechaCorte)
      .replace("{n}", portada.nUniverso),
    ruta: `/informes/${informe.slug}`,
  });
}

/**
 * La página de una edición: el informe completo en la web (el Observatorio con
 * su portada como h1) y, en la portada, la descarga del PDF ejecutivo generado
 * desde el mismo snapshot. Cierra con «Su entidad en contexto».
 */
export default async function InformePage({ params }: Props) {
  const { slug } = await params;
  const informe = informePorSlug(slug);
  if (!informe) notFound();
  const portada = selectPortada(informe.snapshot);

  return (
    <main id="contenido" tabIndex={-1} className="relative flex-1 overflow-x-clip bg-neutral-0 outline-none">
      <div aria-hidden="true" className="trama-sale pointer-events-none absolute inset-x-0 top-0 h-40" />
      <div className="container-site relative pt-4 md:pt-6">
        <Migas
          items={[
            { nombre: paginas.informes.titulo, href: "/informes" },
            {
              nombre: `${sector.informe.cortePrefijo} ${portada.corteEtiqueta.toLowerCase()}`,
              href: `/informes/${slug}`,
            },
          ]}
        />
      </div>
      <article aria-labelledby="informe-title" className="relative">
        <div className="container-site relative pb-20 pt-8 md:pb-24 md:pt-12">
          <Informe
            snapshot={informe.snapshot}
            titleId="informe-title"
            nivel={1}
            acciones={informe.pdf ? <DescargaPdf pdf={informe.pdf} /> : null}
          />
          <div className="mt-14 md:mt-16">
            <SectorContext rangos={selectRangosContexto(informe.snapshot)} />
          </div>
        </div>
      </article>
    </main>
  );
}

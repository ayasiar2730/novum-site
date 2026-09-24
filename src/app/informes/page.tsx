import type { Metadata } from "next";
import { paginas } from "@/content/site";
import { sector } from "@/content/sector";
import { listarInformes } from "@/lib/informes/catalogo";
import { metadatosDePagina } from "@/lib/metadatos";
import { Migas } from "@/components/Migas";
import { SectionHeading } from "@/components/SectionHeading";
import { EntradaCatalogo } from "@/components/informes/EntradaCatalogo";
import { SectorContext } from "@/components/sector/SectorContext";

const p = paginas.informes;
const c = sector.catalogo;

export const metadata: Metadata = metadatosDePagina({
  titulo: p.titulo,
  descripcion: p.descripcion,
  ruta: "/informes",
});

/**
 * Catálogo de informes sectoriales (fase 2). La web es el catálogo y la puerta
 * de entrada; cada edición tiene su página y su PDF ejecutivo. Las ediciones
 * salen de `src/data/sector/informes/*.json` (lib/informes/catalogo.ts): no hay
 * nada que registrar a mano. Sin informes publicados, la página explica cómo se
 * elaboran y no muestra listas vacías ni «próximamente».
 */
export default function InformesPage() {
  const informes = listarInformes();
  const k = informes.length
    ? Math.min(...informes.map((i) => i.snapshot.metodologia.minEntidadesPorCategoria))
    : 5;

  return (
    <main id="contenido" tabIndex={-1} className="relative flex-1 overflow-x-clip bg-neutral-0 outline-none">
      <div aria-hidden="true" className="trama-sale pointer-events-none absolute inset-x-0 top-0 h-40" />
      <div className="container-site relative pt-4 md:pt-6">
        <Migas items={[{ nombre: p.titulo, href: "/informes" }]} />
      </div>

      <section aria-labelledby="informes-title">
        <div className="container-site relative pb-12 pt-8 md:pb-16 md:pt-12" data-reveal>
          <SectionHeading
            id="informes-title"
            eyebrow={sector.eyebrow}
            title={p.titulo}
            intro={c.intro}
            size="lg"
            nivel={1}
          />
        </div>
      </section>

      {informes.length ? (
        <section aria-labelledby="publicados-title" className="container-site pb-20 md:pb-24">
          <h2 id="publicados-title" className="flex items-center gap-3 text-label uppercase text-purple-700">
            <span aria-hidden="true" className="h-px w-6 bg-purple-500" />
            {c.publicadosLabel}
          </h2>
          <ol className="mt-6 divide-y divide-neutral-100 border-y border-neutral-100">
            {informes.map((i) => (
              <li key={i.slug}>
                <EntradaCatalogo informe={i} />
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <section aria-labelledby="como-title" className="bg-neutral-50">
        <div className="container-site py-16 md:py-20">
          <h2 id="como-title" className="text-h2-sm md:text-h2 text-neutral-950" data-reveal>
            {c.comoLabel}
          </h2>
          <ul className="mt-10 grid gap-8 md:grid-cols-2 md:gap-x-10 lg:grid-cols-4">
            {c.como.map((item, i) => (
              <li
                key={item.titulo}
                className="flex flex-col gap-3 border-t border-neutral-300 pt-5"
                data-reveal
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <h3 className="text-h3-sm text-neutral-950">{item.titulo}</h3>
                <p className="text-body-sm text-neutral-700">{item.texto.replace("{k}", String(k))}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="container-site py-20 md:py-24">
        <SectorContext rangos={null} />
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { paginas, products, site } from "@/content/site";
import { lineaPorSlug, lineas, solucionesTexto } from "@/content/portafolio";
import { productoPorClave } from "@/lib/productos";
import { metadatosDePagina } from "@/lib/metadatos";
import { Migas } from "@/components/Migas";
import { ButtonLink } from "@/components/ButtonLink";
import { FinalCta } from "@/components/FinalCta";

type Props = { params: Promise<{ slug: string }> };

/** Solo las siete líneas del portafolio: cualquier otro slug es 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return lineas.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const linea = lineaPorSlug(slug);
  if (!linea) return {};
  return metadatosDePagina({
    titulo: linea.titulo,
    descripcion: linea.promesa,
    ruta: `/soluciones/${linea.slug}`,
  });
}

/**
 * La página de una línea del portafolio: número y promesa, las capacidades y
 * servicios, el valor que recibe la entidad, la tecnología de la línea (si la
 * tiene) y el paso a las otras seis. Declara el servicio en schema.org.
 */
export default async function LineaPage({ params }: Props) {
  const { slug } = await params;
  const linea = lineaPorSlug(slug);
  if (!linea) notFound();
  const producto = linea.producto ? productoPorClave(linea.producto) : null;
  const otras = lineas.filter((l) => l.slug !== linea.slug);
  const t = solucionesTexto;

  const ld = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: linea.titulo,
    description: linea.promesa,
    serviceType: linea.titulo,
    url: `${site.url}/soluciones/${linea.slug}`,
    provider: { "@id": `${site.url}/#organization` },
    areaServed: { "@type": "Country", name: "Colombia" },
  };

  return (
    <main id="contenido" tabIndex={-1} className="relative flex-1 overflow-x-clip bg-neutral-0 outline-none">
      <div aria-hidden="true" className="trama-sale pointer-events-none absolute inset-x-0 top-0 h-40" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }}
      />
      <div className="container-site relative pt-4 md:pt-6">
        <Migas
          items={[
            { nombre: paginas.soluciones.titulo, href: "/soluciones" },
            { nombre: linea.corto, href: `/soluciones/${linea.slug}` },
          ]}
        />
      </div>

      <article aria-labelledby="linea-title" className="relative">
        {/* Apertura: número editorial, título y promesa */}
        <header className="container-site pb-14 pt-8 md:pb-16 md:pt-12" data-reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-10">
            <p className="tnum text-[4rem] font-bold leading-none tracking-[-0.03em] text-purple-100 md:text-[6rem]">
              <span className="sr-only">Línea {linea.numero}</span>
              <span aria-hidden="true">{linea.numero}</span>
            </p>
            <div className="flex max-w-[46rem] flex-col gap-5 md:pt-3">
              <p className="flex items-center gap-3 text-label uppercase text-purple-700">
                <span aria-hidden="true" className="h-px w-6 bg-purple-500" />
                {t.eyebrow}
              </p>
              <h1 id="linea-title" className="text-h1-sm md:text-display-md text-neutral-950">
                {linea.titulo}
              </h1>
              <p className="text-lead text-neutral-700">{linea.promesa}</p>
            </div>
          </div>
        </header>

        {/* Capacidades y servicios */}
        <section className="border-t border-neutral-100" aria-labelledby="capacidades-title">
          <div className="container-site grid gap-8 py-14 md:py-16 lg:grid-cols-12 lg:gap-8">
            <h2
              id="capacidades-title"
              className="flex items-center gap-3 self-start text-label uppercase text-purple-700 lg:col-span-3 lg:pt-1"
            >
              <span
                aria-hidden="true"
                className="h-3 w-3 rounded-sm border-[1.5px] border-purple-500 bg-purple-100"
              />
              {t.capacidadesLabel}
            </h2>
            <ul className="flex flex-col gap-4 lg:col-span-8 lg:col-start-5">
              {linea.capacidades.map((c, i) => (
                <li
                  key={c}
                  className="flex gap-4 text-body text-neutral-900"
                  data-reveal
                  style={{ transitionDelay: `${Math.min(i, 6) * 40}ms` }}
                >
                  <span
                    aria-hidden="true"
                    className="mt-[0.6rem] h-2 w-2 shrink-0 rounded-full bg-green-500"
                  />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Valor que recibe la entidad */}
        <section className="bg-neutral-50" aria-labelledby="valor-title">
          <div className="container-site py-14 md:py-16">
            <h2 id="valor-title" className="text-h2-sm md:text-h2 text-neutral-950" data-reveal>
              {t.valorLabel}
            </h2>
            <ul className="mt-10 grid gap-8 md:grid-cols-3">
              {linea.valor.map((v, i) => (
                <li
                  key={v.titulo}
                  className="flex flex-col gap-2 border-t-2 border-purple-700 pt-5"
                  data-reveal
                  style={{ transitionDelay: `${i * 70}ms` }}
                >
                  <h3 className="text-h3-sm md:text-h3 text-neutral-950">{v.titulo}</h3>
                  <p className="text-body-sm text-neutral-700">{v.texto}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Tecnología de la línea */}
        {producto ? (
          <section aria-labelledby="producto-title">
            <div className="container-site grid gap-8 py-14 md:py-16 lg:grid-cols-12 lg:items-center lg:gap-8">
              <div className="flex flex-col gap-3 lg:col-span-7" data-reveal>
                <p className="text-label uppercase text-purple-700">{t.productoLabel}</p>
                <h2 id="producto-title" className="text-h2-sm md:text-h2 text-neutral-950">
                  {producto.nombre}
                  <span className="block text-h3-sm font-medium text-neutral-700 md:text-h3">
                    {producto.subtitulo}
                  </span>
                </h2>
                <p className="text-body max-w-[36rem] text-neutral-700">{producto.texto}</p>
              </div>
              <div className="lg:col-span-4 lg:col-start-9 lg:justify-self-end" data-reveal>
                <ButtonLink href="/tecnologia" variant="secondary" arrow>
                  {products.ver}
                </ButtonLink>
              </div>
            </div>
          </section>
        ) : null}

        {/* Las otras líneas */}
        <nav aria-labelledby="otras-title" className="border-t border-neutral-100">
          <div className="container-site py-14 md:py-16">
            <h2 id="otras-title" className="text-label uppercase text-neutral-700">
              {t.otrasLabel}
            </h2>
            <ul className="mt-5 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
              {otras.map((l) => (
                <li key={l.slug} className="border-b border-neutral-100">
                  <Link
                    href={`/soluciones/${l.slug}`}
                    className="group flex min-h-14 items-baseline gap-4 py-3 text-body text-neutral-900 transition-colors duration-200 hover:text-purple-900"
                  >
                    <span className="tnum text-label text-purple-700">{l.numero}</span>
                    {l.titulo}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </article>

      <FinalCta />
    </main>
  );
}

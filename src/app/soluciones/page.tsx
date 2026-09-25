import type { Metadata } from "next";
import Link from "next/link";
import { paginas } from "@/content/site";
import { solucionesTexto, vinculacion } from "@/content/portafolio";
import { metadatosDePagina } from "@/lib/metadatos";
import { Migas } from "@/components/Migas";
import { SectionHeading } from "@/components/SectionHeading";
import { ListaLineas } from "@/components/lineas/ListaLineas";
import { FinalCta } from "@/components/FinalCta";

const p = paginas.soluciones;

export const metadata: Metadata = metadatosDePagina({
  titulo: p.titulo,
  descripcion: p.descripcion,
  ruta: "/soluciones",
});

/**
 * Soluciones (fase 2): el índice de las siete líneas del portafolio, cada una
 * con su promesa y lo que la entidad recibe; cada fila lleva a la página de
 * su línea. Sobre la superficie del sistema, como el acto III del Home.
 */
export default function SolucionesPage() {
  return (
    <main id="contenido" tabIndex={-1} className="flex-1 bg-neutral-0 outline-none">
      <div className="surface-sistema">
        <div className="container-site pt-4 md:pt-6">
          <Migas items={[{ nombre: p.titulo, href: "/soluciones" }]} />
        </div>
        <section className="pb-20 pt-8 md:pb-28 md:pt-12" aria-labelledby="soluciones-title">
          <div className="container-site">
            <div className="lg:max-w-[48rem]" data-reveal>
              <SectionHeading
                id="soluciones-title"
                eyebrow={solucionesTexto.eyebrow}
                title={solucionesTexto.titulo}
                intro={solucionesTexto.intro}
                size="lg"
                nivel={1}
              />
            </div>
            <div className="mt-12 md:mt-14">
              <ListaLineas variante="completa" nivel={2} />
            </div>
            <p className="mt-10 max-w-[44rem] text-body text-neutral-700" data-reveal>
              {vinculacion.intro}{" "}
              <Link
                href="/contacto"
                className="font-semibold text-purple-700 underline-offset-4 transition-colors hover:text-purple-900 hover:underline"
              >
                {vinculacion.eyebrow} →
              </Link>
            </p>
          </div>
        </section>
      </div>
      <FinalCta />
    </main>
  );
}

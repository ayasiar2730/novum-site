import type { Metadata } from "next";
import { paginas } from "@/content/site";
import { metadatosDePagina } from "@/lib/metadatos";
import { Migas } from "@/components/Migas";
import { Products } from "@/components/Products";
import { Differentiators } from "@/components/Differentiators";
import { FinalCta } from "@/components/FinalCta";

const p = paginas.tecnologia;

export const metadata: Metadata = metadatosDePagina({
  titulo: p.titulo,
  descripcion: p.descripcion,
  ruta: "/tecnologia",
});

/**
 * Tecnología Novum (fase 2): el ecosistema de productos —Novum Risk, Novum
 * Budget, Novum Strategic Planning— y el criterio con que están hechos, sobre
 * la superficie del sistema.
 */
export default function TecnologiaPage() {
  return (
    <main id="contenido" tabIndex={-1} className="flex-1 bg-neutral-0 outline-none">
      <div className="surface-sistema">
        <div className="container-site pt-4 md:pt-6">
          <Migas items={[{ nombre: p.titulo, href: "/tecnologia" }]} />
        </div>
        <Products nivel={1} />
        <Differentiators />
      </div>
      <FinalCta />
    </main>
  );
}

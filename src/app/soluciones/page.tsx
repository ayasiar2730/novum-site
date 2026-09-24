import type { Metadata } from "next";
import { paginas } from "@/content/site";
import { metadatosDePagina } from "@/lib/metadatos";
import { Migas } from "@/components/Migas";
import { Products } from "@/components/Products";
import { Differentiators } from "@/components/Differentiators";
import { FinalCta } from "@/components/FinalCta";

const p = paginas.soluciones;

export const metadata: Metadata = metadatosDePagina({
  titulo: p.titulo,
  descripcion: p.descripcion,
  ruta: "/soluciones",
});

/** Soluciones (fase 2): el acto del sistema del Home como página propia, sobre su misma superficie. */
export default function SolucionesPage() {
  return (
    <main id="contenido" tabIndex={-1} className="flex-1 bg-neutral-0 outline-none">
      <div className="surface-sistema">
        <div className="container-site pt-4 md:pt-6">
          <Migas items={[{ nombre: p.titulo, href: "/soluciones" }]} />
        </div>
        <Products nivel={1} />
        <Differentiators />
      </div>
      <FinalCta />
    </main>
  );
}

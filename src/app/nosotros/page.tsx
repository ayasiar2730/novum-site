import type { Metadata } from "next";
import { paginas } from "@/content/site";
import { metadatosDePagina } from "@/lib/metadatos";
import { Migas } from "@/components/Migas";
import { About } from "@/components/About";
import { Convergence } from "@/components/Convergence";
import { FinalCta } from "@/components/FinalCta";

const p = paginas.nosotros;

export const metadata: Metadata = metadatosDePagina({
  titulo: p.titulo,
  descripcion: p.descripcion,
  ruta: "/nosotros",
});

/**
 * Nosotros (fase 2): la declaración institucional y sus seis capacidades, que
 * convergen en la banda de contacto como en el Home. Los perfiles siguen tras
 * SHOW_TEAM (About).
 */
export default function NosotrosPage() {
  return (
    <main id="contenido" tabIndex={-1} className="flex-1 bg-neutral-0 outline-none">
      <div className="container-site pt-4 md:pt-6">
        <Migas items={[{ nombre: p.titulo, href: "/nosotros" }]} />
      </div>
      <About nivel={1} />
      <Convergence />
      <FinalCta />
    </main>
  );
}

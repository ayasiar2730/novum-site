import type { Metadata } from "next";
import { paginas } from "@/content/site";
import { metadatosDePagina } from "@/lib/metadatos";
import { Migas } from "@/components/Migas";
import { About } from "@/components/About";
import { Propuesta } from "@/components/nosotros/Propuesta";
import { Segmentos } from "@/components/nosotros/Segmentos";
import { ComoTrabajamos } from "@/components/nosotros/ComoTrabajamos";
import { Diferenciales } from "@/components/nosotros/Diferenciales";
import { Convergence } from "@/components/Convergence";
import { FinalCta } from "@/components/FinalCta";

const p = paginas.nosotros;

export const metadata: Metadata = metadatosDePagina({
  titulo: p.titulo,
  descripcion: p.descripcion,
  ruta: "/nosotros",
});

/**
 * Nosotros (fase 2): quiénes somos y cómo trabajamos — la declaración
 * institucional y sus capacidades, la propuesta de valor, a quién
 * acompañamos, la metodología (ancla #metodologia, a la que enlaza el Home) y
 * por qué Novum. Los perfiles siguen tras NEXT_PUBLIC_SHOW_TEAM (About).
 */
export default function NosotrosPage() {
  return (
    <main id="contenido" tabIndex={-1} className="flex-1 bg-neutral-0 outline-none">
      <div className="container-site pt-4 md:pt-6">
        <Migas items={[{ nombre: p.titulo, href: "/nosotros" }]} />
      </div>
      <About nivel={1} />
      <Propuesta />
      <Segmentos />
      <ComoTrabajamos />
      <Diferenciales />
      <Convergence />
      <FinalCta />
    </main>
  );
}

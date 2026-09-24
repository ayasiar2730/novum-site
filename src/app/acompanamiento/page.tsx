import type { Metadata } from "next";
import { paginas } from "@/content/site";
import { metadatosDePagina } from "@/lib/metadatos";
import { Migas } from "@/components/Migas";
import { Services } from "@/components/Services";
import { FinalCta } from "@/components/FinalCta";

const p = paginas.acompanamiento;

export const metadata: Metadata = metadatosDePagina({
  titulo: p.titulo,
  descripcion: p.descripcion,
  ruta: "/acompanamiento",
});

/** Acompañamiento (fase 2): los seis servicios alrededor del núcleo Novum, como página propia. */
export default function AcompanamientoPage() {
  return (
    <main id="contenido" tabIndex={-1} className="flex-1 bg-neutral-0 outline-none">
      <div className="container-site pt-4 md:pt-6">
        <Migas items={[{ nombre: p.titulo, href: "/acompanamiento" }]} />
      </div>
      <Services nivel={1} />
      <FinalCta />
    </main>
  );
}

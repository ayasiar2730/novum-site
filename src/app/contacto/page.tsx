import type { Metadata } from "next";
import { paginas } from "@/content/site";
import { metadatosDePagina } from "@/lib/metadatos";
import { Migas } from "@/components/Migas";
import { FinalCta } from "@/components/FinalCta";

const p = paginas.contacto;

export const metadata: Metadata = metadatosDePagina({
  titulo: p.titulo,
  descripcion: p.descripcion,
  ruta: "/contacto",
});

/**
 * Contacto (fase 2): la banda de decisión del Home como página. Demostración y
 * WhatsApp directos, correo y teléfonos; sin formulario hasta que exista la
 * política de tratamiento de datos (Ley 1581).
 */
export default function ContactoPage() {
  return (
    <main id="contenido" tabIndex={-1} className="flex flex-1 flex-col bg-neutral-0 outline-none">
      <div className="container-site pb-8 pt-4 md:pb-10 md:pt-6">
        <Migas items={[{ nombre: p.titulo, href: "/contacto" }]} />
      </div>
      <div className="flex flex-1 flex-col [&>section]:flex-1">
        <FinalCta nivel={1} />
      </div>
    </main>
  );
}

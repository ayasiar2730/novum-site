import type { Metadata } from "next";
import { paginas } from "@/content/site";
import { metadatosDePagina } from "@/lib/metadatos";
import { Migas } from "@/components/Migas";
import { Vinculacion } from "@/components/contacto/Vinculacion";
import { FinalCta } from "@/components/FinalCta";

const p = paginas.contacto;

export const metadata: Metadata = metadatosDePagina({
  titulo: p.titulo,
  descripcion: p.descripcion,
  ruta: "/contacto",
});

/**
 * Contacto (fase 2): cómo se trabaja con Novum —las seis formas de
 * vinculación— y la banda de contacto con demostración, WhatsApp y correo.
 * Sin formulario hasta que exista la política de tratamiento de datos (Ley 1581).
 */
export default function ContactoPage() {
  return (
    <main id="contenido" tabIndex={-1} className="flex flex-1 flex-col bg-neutral-0 outline-none">
      <div className="container-site pt-4 md:pt-6">
        <Migas items={[{ nombre: p.titulo, href: "/contacto" }]} />
      </div>
      <Vinculacion />
      <FinalCta />
    </main>
  );
}

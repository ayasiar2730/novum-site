import { solucionesTexto } from "@/content/portafolio";
import { SectionHeading } from "@/components/SectionHeading";
import { ButtonLink } from "@/components/ButtonLink";
import { ListaLineas } from "@/components/lineas/ListaLineas";

/**
 * Acto III del Home (fase 2): las siete líneas del portafolio, una fila por
 * línea con su promesa y su enlace. El detalle de cada una —capacidades,
 * valor, tecnología— vive en su página.
 */
export function ResumenLineas() {
  return (
    <section id="soluciones" className="py-20 md:py-28" aria-labelledby="lineas-title">
      <div className="container-site">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-7" data-reveal>
            <SectionHeading
              id="lineas-title"
              eyebrow={solucionesTexto.eyebrow}
              title={solucionesTexto.titulo}
              intro={solucionesTexto.intro}
              size="lg"
            />
          </div>
          <div className="lg:col-span-4 lg:col-start-9 lg:justify-self-end" data-reveal>
            <ButtonLink href="/soluciones" variant="secondary" arrow>
              {solucionesTexto.verTodas}
            </ButtonLink>
          </div>
        </div>
        <div className="mt-12 md:mt-14">
          <ListaLineas />
        </div>
      </div>
    </section>
  );
}

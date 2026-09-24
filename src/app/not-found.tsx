import { sector } from "@/content/sector";
import { ButtonLink } from "@/components/ButtonLink";

/** 404. El header y el footer llegan del layout, como en cualquier página. */
export default function NotFound() {
  return (
    <main
      id="contenido"
      tabIndex={-1}
      className="container-site flex flex-1 flex-col items-start justify-center gap-6 py-24 outline-none"
    >
      <p className="text-label uppercase text-purple-700">Error 404</p>
      <h1 className="text-h1-sm md:text-h1 measure text-neutral-950">Esta página no existe.</h1>
      <p className="text-body measure text-neutral-700">
        Es posible que el enlace esté incompleto o que la página se haya movido.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/">Volver al inicio</ButtonLink>
        <ButtonLink href="/informes" variant="secondary">
          {sector.catalogo.verCatalogo}
        </ButtonLink>
      </div>
    </main>
  );
}

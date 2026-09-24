import { sector } from "@/content/sector";
import { pesoLegible, type PdfPublicado } from "@/lib/informes/catalogo";
import { ButtonLink } from "@/components/ButtonLink";

function IconoDescarga() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 2.5v7.5M4.75 6.75 8 10l3.25-3.25M3 13h10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** «PDF · 416 KB · 13 páginas»: lo que el visitante descarga, antes de hacerlo. */
export function fichaPdf(pdf: PdfPublicado): string {
  const c = sector.catalogo;
  return [c.pdfLabel, pesoLegible(pdf.bytes), pdf.paginas ? `${pdf.paginas} ${c.paginasLabel}` : null]
    .filter(Boolean)
    .join(" · ");
}

/** Botón de descarga del PDF ejecutivo del informe, con su ficha al lado. */
export function DescargaPdf({
  pdf,
  variant = "primary",
  ficha = true,
}: {
  pdf: PdfPublicado;
  variant?: "primary" | "secondary";
  ficha?: boolean;
}) {
  return (
    <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
      <ButtonLink href={pdf.url} download={pdf.nombreDescarga} variant={variant}>
        <IconoDescarga />
        {sector.catalogo.descargar}
      </ButtonLink>
      {ficha ? <p className="tnum text-small text-neutral-700">{fichaPdf(pdf)}</p> : null}
    </div>
  );
}

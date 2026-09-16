import { sector } from "@/content/sector";
import type { CabeceraVM } from "@/lib/sector/select";

/**
 * Fuente, corte y cobertura. Sin snapshot solo la fuente conceptual y el
 * procesamiento; con snapshot, además la fecha de corte (que llega de los datos,
 * nunca hardcodeada), la cobertura y la comparación.
 */
export function SectorSource({ cabecera }: { cabecera: CabeceraVM | null }) {
  const f = sector.fuente;
  return (
    <div className="flex flex-col gap-1.5 text-small text-neutral-500">
      {cabecera ? (
        <p className="text-neutral-700">
          <span className="text-label uppercase text-neutral-500">{f.corteLabel}</span>{" "}
          <time dateTime={cabecera.fechaCorteIso} className="font-semibold text-neutral-900">
            {cabecera.fechaCorte}
          </time>
          <span aria-hidden="true"> · </span>
          <span className="text-label uppercase text-neutral-500">{f.coberturaLabel}</span>{" "}
          {cabecera.cobertura}
        </p>
      ) : null}
      {cabecera?.comparacion ? <p>{cabecera.comparacion}</p> : null}
      <p>{cabecera ? `Fuente de información sectorial: ${cabecera.fuente}.` : f.datos}</p>
      <p>{cabecera ? `Análisis y procesamiento: ${cabecera.procesamiento}.` : f.procesamiento}</p>
      {cabecera ? <p>{f.unidadNota}</p> : null}
    </div>
  );
}

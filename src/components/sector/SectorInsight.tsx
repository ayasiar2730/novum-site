import { sector } from "@/content/sector";

/**
 * Lectura ejecutiva de una historia. Recibe el texto ya escrito desde el
 * snapshot: aquí no se calcula ni se concluye nada.
 */
export function SectorInsight({
  insight,
  metrica,
}: {
  insight: string;
  metrica?: { etiqueta: string; definicion: string };
}) {
  return (
    <div className="flex flex-col gap-4 border-l-2 border-purple-500 pl-5 md:pl-6">
      <p className="text-label uppercase text-purple-700">{sector.conDatos.lecturaLabel}</p>
      <p className="text-lead text-neutral-950">{insight}</p>
      {metrica ? (
        <p className="text-small text-neutral-500">
          <span className="font-semibold text-neutral-700">{metrica.etiqueta}:</span> {metrica.definicion}
        </p>
      ) : null}
    </div>
  );
}

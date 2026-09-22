import type { DistribucionVM } from "@/lib/sector/selectV2";

/**
 * La distribución de un indicador entre entidades como una banda: la pista
 * completa va de mínimo a máximo, el rango intercuartílico (P25–P75) es la
 * banda morada, la mediana un trazo y el indicador del sector (ponderado) un
 * nodo. Todo en una sola línea; los valores van en HTML alrededor para que el
 * texto no se encoja con el viewBox. Sin color por «bueno/malo».
 */
export function BandaDistribucion({
  d,
  id,
  etiqueta,
  compacta = false,
}: {
  d: DistribucionVM;
  id: string;
  etiqueta: string;
  compacta?: boolean;
}) {
  const { p25, p75, mediana, ponderado } = d.escala;
  const h = compacta ? 14 : 22;
  const mid = h / 2;
  return (
    <figure className="flex flex-col gap-2" aria-describedby={`${id}-desc`}>
      <p id={`${id}-desc`} className="sr-only">
        {etiqueta}: mediana {d.mediana}, media {d.media}, rango intercuartílico de {d.p25} a {d.p75}, sobre{" "}
        {d.n} entidades con dato.
      </p>
      <div className="relative">
        <svg
          viewBox={`0 0 100 ${h}`}
          preserveAspectRatio="none"
          className={`${compacta ? "h-3.5" : "h-6"} w-full`}
          aria-hidden="true"
        >
          <rect x="0" y={mid - 1} width="100" height="2" fill="var(--color-neutral-100)" />
          <rect
            x={p25}
            y={mid - (compacta ? 4 : 6)}
            width={Math.max(0.5, p75 - p25)}
            height={compacta ? 8 : 12}
            fill="var(--color-purple-500)"
            fillOpacity="0.28"
          />
          <rect
            x={mediana - 0.4}
            y={mid - (compacta ? 6 : 9)}
            width="0.8"
            height={compacta ? 12 : 18}
            fill="var(--color-purple-700)"
          />
        </svg>
        {/* el indicador del sector: un nodo en HTML para que no se deforme con el viewBox */}
        {ponderado !== null ? (
          <span
            aria-hidden="true"
            className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-900 ring-2 ring-neutral-0 ${
              compacta ? "h-2.5 w-2.5" : "h-3.5 w-3.5"
            }`}
            style={{ left: `${ponderado}%` }}
          />
        ) : null}
      </div>
      {compacta ? null : (
        <figcaption className="flex justify-between text-label uppercase text-neutral-700">
          <span className="tnum">{d.escala.min}</span>
          <span className="tnum">{d.escala.max}</span>
        </figcaption>
      )}
    </figure>
  );
}

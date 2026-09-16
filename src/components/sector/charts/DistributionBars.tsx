import type { Serie } from "@/lib/sector/types";
import { corto } from "@/lib/sector/format";
import { Bar } from "@/components/sector/charts/Bar";

/**
 * Distribución por bandas o categorías: una barra por punto, a escala del
 * máximo, con el valor visible y la nota del snapshot (p. ej. participación).
 * Usa la primera serie; las demás se listan en la tabla accesible.
 */
export function DistributionBars({ id, series, desc }: { id: string; series: Serie[]; desc: string }) {
  const s = series[0];
  const max = Math.max(...s.puntos.map((p) => p.y), 1);
  return (
    <figure aria-describedby={`${id}-desc`} className="flex flex-col gap-6">
      <p id={`${id}-desc`} className="sr-only">
        {desc}
      </p>
      <ul className="flex flex-col gap-4">
        {s.puntos.map((p, i) => (
          <li key={p.x} className="grid gap-1.5 sm:grid-cols-12 sm:items-center sm:gap-4">
            <span className="text-small font-semibold text-neutral-900 sm:col-span-3">{p.x}</span>
            <div className="grid grid-cols-[1fr_auto] items-center gap-3 sm:col-span-9">
              <Bar
                pct={(p.y / max) * 100}
                tono={i === 0 ? "fuerte" : "medio"}
                title={`${p.x}: ${corto(p.y, s.unidad)}${p.nota ? ` (${p.nota})` : ""}`}
              />
              <span className="tnum text-small text-neutral-900">
                <span className="font-semibold">{corto(p.y, s.unidad)}</span>
                {p.nota ? <span className="ml-2 text-neutral-700">{p.nota}</span> : null}
              </span>
            </div>
          </li>
        ))}
      </ul>
      <figcaption className="text-small text-neutral-700">{s.etiqueta}</figcaption>
      <table className="sr-only">
        <caption>{desc}</caption>
        <thead>
          <tr>
            <th scope="col">Categoría</th>
            {series.map((serie) => (
              <th key={serie.id} scope="col">
                {serie.etiqueta}
              </th>
            ))}
            <th scope="col">Nota</th>
          </tr>
        </thead>
        <tbody>
          {s.puntos.map((p, i) => (
            <tr key={p.x}>
              <th scope="row">{p.x}</th>
              {series.map((serie) => (
                <td key={serie.id}>{serie.puntos[i] ? corto(serie.puntos[i].y, serie.unidad) : ""}</td>
              ))}
              <td>{p.nota ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

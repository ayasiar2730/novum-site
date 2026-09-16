import type { Serie } from "@/lib/sector/types";
import { corto } from "@/lib/sector/format";
import { Bar, swatch } from "@/components/sector/charts/Bar";

/**
 * Comparación temporal: por cada serie, dos barras (primer punto = base,
 * último punto = actual) a la misma escala, con los valores siempre visibles
 * y la nota preparada del snapshot (p. ej. la variación) tal cual llega.
 */
export function ComparisonBars({ id, series, desc }: { id: string; series: Serie[]; desc: string }) {
  const max = Math.max(...series.flatMap((s) => s.puntos.map((p) => p.y)), 1);
  const filas = series.map((s) => {
    const base = s.puntos[0];
    const actual = s.puntos[s.puntos.length - 1];
    return { s, base, actual };
  });
  const baseLabel = filas[0]?.base.x ?? "";
  const actualLabel = filas[0]?.actual.x ?? "";

  return (
    <figure aria-describedby={`${id}-desc`} className="flex flex-col gap-6">
      <p id={`${id}-desc`} className="sr-only">
        {desc}
      </p>
      <ul className="flex flex-col gap-5">
        {filas.map(({ s, base, actual }) => (
          <li key={s.id} className="grid gap-2 sm:grid-cols-12 sm:items-center sm:gap-4">
            <span className="text-small font-semibold text-neutral-900 sm:col-span-3">{s.etiqueta}</span>
            <div className="flex flex-col gap-1.5 sm:col-span-9">
              <div className="grid grid-cols-[1fr_auto] items-center gap-3">
                <Bar
                  pct={(base.y / max) * 100}
                  tono="suave"
                  title={`${s.etiqueta}, ${base.x}: ${corto(base.y, s.unidad)}`}
                  height="h-2"
                />
                <span className="tnum text-small text-neutral-700">{corto(base.y, s.unidad)}</span>
              </div>
              <div className="grid grid-cols-[1fr_auto] items-center gap-3">
                <Bar
                  pct={(actual.y / max) * 100}
                  tono="medio"
                  title={`${s.etiqueta}, ${actual.x}: ${corto(actual.y, s.unidad)}`}
                />
                <span className="tnum text-small text-neutral-900">
                  <span className="font-semibold">{corto(actual.y, s.unidad)}</span>
                  {actual.nota ? (
                    <span className="ml-2 font-semibold text-green-700">{actual.nota}</span>
                  ) : null}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <figcaption className="flex flex-wrap gap-x-6 gap-y-2 text-small text-neutral-700">
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className={`h-2 w-4 rounded-sm ${swatch.suave}`} />
          {baseLabel}
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className={`h-2 w-4 rounded-sm ${swatch.medio}`} />
          {actualLabel}
        </span>
      </figcaption>
      <table className="sr-only">
        <caption>{desc}</caption>
        <thead>
          <tr>
            <th scope="col">Serie</th>
            <th scope="col">{baseLabel}</th>
            <th scope="col">{actualLabel}</th>
            <th scope="col">Nota</th>
          </tr>
        </thead>
        <tbody>
          {filas.map(({ s, base, actual }) => (
            <tr key={s.id}>
              <th scope="row">{s.etiqueta}</th>
              <td>{corto(base.y, s.unidad)}</td>
              <td>{corto(actual.y, s.unidad)}</td>
              <td>{actual.nota ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

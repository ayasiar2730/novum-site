import type { Serie } from "@/lib/sector/types";
import { corto } from "@/lib/sector/format";

/**
 * Composición 100 %: una barra apilada por serie (p. ej. por tipo de entidad,
 * por territorio) y una leyenda numerada con el valor de cada segmento. El
 * orden y el número identifican cada parte además del color.
 */
const tonos = [
  "var(--color-purple-900)",
  "var(--color-purple-700)",
  "var(--color-purple-500)",
  "var(--color-green-500)",
  "var(--color-purple-100)",
  "var(--color-neutral-300)",
];

function total(s: Serie): number {
  const t = s.puntos.reduce((acc, p) => acc + p.y, 0);
  return t > 0 ? t : 1;
}

export function CompositionBar({ id, series, desc }: { id: string; series: Serie[]; desc: string }) {
  return (
    <figure aria-describedby={`${id}-desc`} className="flex flex-col gap-8">
      <p id={`${id}-desc`} className="sr-only">
        {desc}
      </p>
      {series.map((s) => {
        const t = total(s);
        let x = 0;
        const segmentos = s.puntos.map((p, i) => {
          const w = (p.y / t) * 100;
          const seg = { p, i, x, w, fill: tonos[i % tonos.length] };
          x += w;
          return seg;
        });
        return (
          <div key={s.id} className="flex flex-col gap-3">
            <p className="text-small font-semibold text-neutral-900">{s.etiqueta}</p>
            <svg viewBox="0 0 100 12" preserveAspectRatio="none" className="h-4 w-full" role="img">
              <title>{`${s.etiqueta}: ${s.puntos.map((p) => `${p.x} ${corto(p.y, s.unidad)}`).join(", ")}`}</title>
              {segmentos.map((seg) => (
                <rect key={seg.p.x} x={seg.x} y="0" width={seg.w} height="12" fill={seg.fill}>
                  <title>{`${seg.i + 1}. ${seg.p.x}: ${corto(seg.p.y, s.unidad)}`}</title>
                </rect>
              ))}
            </svg>
            <ol className="grid grid-cols-2 gap-x-6 gap-y-2 text-small sm:grid-cols-3 lg:grid-cols-4">
              {segmentos.map((seg) => (
                <li key={seg.p.x} className="flex min-w-0 items-baseline gap-2">
                  <span
                    aria-hidden="true"
                    className="mt-1 h-2.5 w-2.5 shrink-0 self-center rounded-sm ring-1 ring-inset ring-neutral-300/60"
                    style={{ backgroundColor: seg.fill }}
                  />
                  <span className="tnum text-neutral-500">{seg.i + 1}.</span>
                  <span className="min-w-0 truncate text-neutral-700">{seg.p.x}</span>
                  <span className="tnum ml-auto font-semibold text-neutral-900">
                    {corto(seg.p.y, s.unidad)}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        );
      })}
      <figcaption className="sr-only">{desc}</figcaption>
    </figure>
  );
}

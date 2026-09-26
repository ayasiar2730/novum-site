"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Gráficas del módulo de Inteligencia sectorial. SVG y CSS, sin librerías.
 * Dos reglas del informe original que no se negocian:
 *   · ninguna gráfica sin etiquetas visibles: el valor se lee sin pasar el cursor;
 *   · una cifra sola no es un juicio: la referencia (sector, grupo) se dibuja al lado.
 * Color: morado = método y dato; verde = la entidad elegida (el resultado que se mira);
 * neutros = estructura. En móvil la etiqueta sube sobre la barra: nunca un ancho fijo.
 */

export interface FilaBarra {
  id: string;
  etiqueta: string;
  detalle?: string;
  valor: number | null;
  texto: string;
  destacada?: boolean;
}

/**
 * Barras horizontales con etiqueta y valor siempre visibles. Admite negativos
 * (crecen desde el cero hacia la izquierda) y una referencia (línea vertical,
 * p. ej. el valor del sector).
 */
export function BarrasH({
  filas,
  referencia,
  etiquetaReferencia,
  titulo,
  vacio = "Sin datos para mostrar.",
}: {
  filas: FilaBarra[];
  referencia?: number | null;
  etiquetaReferencia?: string;
  titulo?: string;
  vacio?: string;
}) {
  const valores = filas.map((f) => f.valor).filter((v): v is number => v !== null && Number.isFinite(v));
  if (!valores.length) return <p className="text-small text-neutral-700">{vacio}</p>;
  const ref =
    referencia !== null && referencia !== undefined && Number.isFinite(referencia) ? referencia : null;
  const max = Math.max(0, ...valores, ref ?? 0);
  const min = Math.min(0, ...valores, ref ?? 0);
  const rango = max - min || 1;
  const cero = ((0 - min) / rango) * 100;
  const pos = (v: number) => ((v - min) / rango) * 100;
  return (
    <figure className="flex flex-col gap-3">
      {titulo ? <figcaption className="sr-only">{titulo}</figcaption> : null}
      <ul className="flex flex-col gap-2.5">
        {filas.map((f) => {
          const v = f.valor;
          const izquierda = v === null ? cero : Math.min(pos(v), cero);
          const ancho = v === null ? 0 : Math.abs(pos(v) - cero);
          return (
            <li
              key={f.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-3 gap-y-1 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_auto] md:items-center"
            >
              <span
                className={`order-1 min-w-0 truncate text-small ${f.destacada ? "font-semibold text-neutral-950" : "text-neutral-700"}`}
                title={f.detalle ? `${f.etiqueta} — ${f.detalle}` : f.etiqueta}
              >
                {f.destacada ? (
                  <span
                    aria-hidden="true"
                    className="mr-1.5 inline-block size-2 rounded-full bg-green-500 align-middle"
                  />
                ) : null}
                {f.etiqueta}
              </span>
              <span
                className="relative order-3 col-span-2 block h-3.5 rounded-sm bg-neutral-50 md:order-2 md:col-span-1"
                aria-hidden="true"
              >
                <span
                  className={`absolute inset-y-0 rounded-sm ${f.destacada ? "bg-green-500" : v !== null && v < 0 ? "bg-purple-700" : "bg-purple-500"}`}
                  style={{ left: `${izquierda}%`, width: `${Math.max(ancho, v === null ? 0 : 0.6)}%` }}
                />
                {min < 0 ? (
                  <span
                    className="absolute inset-y-[-3px] w-px bg-neutral-300"
                    style={{ left: `${cero}%` }}
                  />
                ) : null}
                {ref !== null ? (
                  <span
                    className="absolute inset-y-[-4px] w-0.5 rounded-full bg-neutral-900"
                    style={{ left: `calc(${pos(ref)}% - 1px)` }}
                  />
                ) : null}
              </span>
              <span
                className={`tnum order-2 text-right text-small md:order-3 ${f.destacada ? "font-semibold text-neutral-950" : "text-neutral-900"}`}
              >
                {f.texto}
              </span>
            </li>
          );
        })}
      </ul>
      {ref !== null && etiquetaReferencia ? (
        <p className="flex items-center gap-2 text-label normal-case tracking-normal text-neutral-700">
          <span aria-hidden="true" className="inline-block h-3 w-0.5 rounded-full bg-neutral-900" />
          {etiquetaReferencia}
        </p>
      ) : null}
    </figure>
  );
}

/** Dos valores del mismo indicador lado a lado (p. ej. junio 2025 frente a junio 2026), por categoría. */
export function BarrasPareadas({
  filas,
  etiquetas,
  formato,
}: {
  filas: { id: string; etiqueta: string; a: number | null; b: number | null }[];
  etiquetas: [string, string];
  formato: (v: number | null) => string;
}) {
  const vals = filas.flatMap((f) => [f.a, f.b]).filter((v): v is number => v !== null && Number.isFinite(v));
  const max = Math.max(...vals.map(Math.abs), 0) || 1;
  const w = (v: number | null) => (v === null ? 0 : Math.max((Math.abs(v) / max) * 100, 0.6));
  return (
    <figure className="flex flex-col gap-4">
      <Leyenda
        items={[
          { etiqueta: etiquetas[0], clase: "bg-purple-100 ring-1 ring-inset ring-purple-500" },
          { etiqueta: etiquetas[1], clase: "bg-purple-500" },
        ]}
      />
      <ul className="flex flex-col gap-3">
        {filas.map((f) => (
          <li
            key={f.id}
            className="grid grid-cols-1 gap-1 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] md:gap-3"
          >
            <span className="min-w-0 truncate text-small text-neutral-700" title={f.etiqueta}>
              {f.etiqueta}
            </span>
            <span className="flex flex-col gap-1">
              {(
                [
                  ["a", f.a, "bg-purple-100 ring-1 ring-inset ring-purple-500"],
                  ["b", f.b, "bg-purple-500"],
                ] as const
              ).map(([k, v, clase]) => (
                <span key={k} className="flex items-center gap-2">
                  <span className="relative block h-2.5 flex-1 rounded-sm bg-neutral-50" aria-hidden="true">
                    <span
                      className={`absolute inset-y-0 left-0 rounded-sm ${clase}`}
                      style={{ width: `${w(v)}%` }}
                    />
                  </span>
                  <span className="tnum w-20 shrink-0 text-right text-small text-neutral-900">
                    <span className="sr-only">{k === "a" ? etiquetas[0] : etiquetas[1]}: </span>
                    {formato(v)}
                  </span>
                </span>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

export function Leyenda({ items }: { items: { etiqueta: string; clase: string }[] }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
      {items.map((i) => (
        <li key={i.etiqueta} className="flex items-center gap-2 text-small text-neutral-700">
          <span aria-hidden="true" className={`inline-block size-3 rounded-sm ${i.clase}`} />
          {i.etiqueta}
        </li>
      ))}
    </ul>
  );
}

/** Barra 100 % apilada con leyenda y valores (composición de un total). */
export function Composicion({
  partes,
  formato,
}: {
  partes: { etiqueta: string; valor: number; clase: string; texto?: string }[];
  formato: (v: number) => string;
}) {
  const total = partes.reduce((s, p) => s + Math.max(p.valor, 0), 0);
  if (total <= 0) return <p className="text-small text-neutral-700">Sin datos para mostrar.</p>;
  return (
    <figure className="flex flex-col gap-3">
      <span className="flex h-4 w-full overflow-hidden rounded-sm bg-neutral-50" aria-hidden="true">
        {partes.map((p) => (
          <span
            key={p.etiqueta}
            className={p.clase}
            style={{ width: `${(Math.max(p.valor, 0) / total) * 100}%` }}
          />
        ))}
      </span>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-4">
        {partes.map((p) => (
          <li key={p.etiqueta} className="flex flex-col gap-0.5">
            <span className="flex items-center gap-2 text-small text-neutral-700">
              <span aria-hidden="true" className={`inline-block size-3 rounded-sm ${p.clase}`} />
              {p.etiqueta}
            </span>
            <span className="tnum text-small font-semibold text-neutral-950">
              {p.texto ?? formato(p.valor)}{" "}
              <span className="font-normal text-neutral-700">
                · {Math.round((Math.max(p.valor, 0) / total) * 1000) / 10} %
              </span>
            </span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

/** Histograma en columnas con el conteo encima de cada una; una columna puede ir destacada. */
export function Histograma({
  cubos,
  destacado,
}: {
  cubos: { etiqueta: string; n: number; clase?: string }[];
  destacado?: number | null;
}) {
  const max = Math.max(...cubos.map((c) => c.n), 1);
  return (
    <figure className="flex flex-col gap-2">
      <div
        className="grid h-44 items-end gap-1.5 md:gap-3"
        style={{ gridTemplateColumns: `repeat(${cubos.length}, minmax(0, 1fr))` }}
      >
        {cubos.map((c, i) => (
          <div key={c.etiqueta} className="flex h-full flex-col items-center justify-end gap-1">
            <span
              className={`tnum text-small ${i === destacado ? "font-semibold text-neutral-950" : "text-neutral-700"}`}
            >
              {c.n}
            </span>
            <span
              aria-hidden="true"
              className={`w-full rounded-t-sm ${i === destacado ? "bg-green-500" : (c.clase ?? "bg-purple-500")}`}
              style={{ height: `${Math.max((c.n / max) * 100, c.n ? 3 : 0)}%` }}
            />
          </div>
        ))}
      </div>
      <div
        className="grid gap-1.5 md:gap-3"
        style={{ gridTemplateColumns: `repeat(${cubos.length}, minmax(0, 1fr))` }}
      >
        {cubos.map((c) => (
          <span
            key={c.etiqueta}
            className="tnum text-center text-[0.6875rem] leading-tight text-neutral-700 md:text-label md:normal-case md:tracking-normal"
          >
            {c.etiqueta}
          </span>
        ))}
      </div>
    </figure>
  );
}

export interface PuntoDispersion {
  id: string;
  x: number;
  y: number;
  etiqueta: string;
  clase: string;
  destacado?: boolean;
}

/**
 * Dispersión (p. ej. cartera frente a ICM). El eje X es logarítmico: las
 * carteras van de millones a billones y en escala lineal todo cae en una
 * esquina. La línea horizontal es la referencia (μ). El SVG se dibuja al
 * ancho real del contenedor (el texto no crece con la pantalla). Un techo
 * opcional evita que un valor extremo aplaste a los demás: lo que queda
 * encima se dibuja en el borde con un triángulo y se cuenta debajo.
 */
export function Dispersion({
  puntos,
  referenciaY,
  etiquetaReferencia,
  formatoX,
  formatoY,
  tituloX,
  tituloY,
  techoY,
  leyenda,
}: {
  puntos: PuntoDispersion[];
  referenciaY?: number | null;
  etiquetaReferencia?: string;
  formatoX: (v: number) => string;
  formatoY: (v: number) => string;
  tituloX: string;
  tituloY: string;
  techoY?: number | null;
  leyenda?: { etiqueta: string; clase: string }[];
}) {
  const caja = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(720);
  useEffect(() => {
    const el = caja.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(280, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const validos = puntos.filter((p) => p.x > 0 && Number.isFinite(p.y));
  if (!validos.length) return <p className="text-small text-neutral-700">Sin datos para mostrar.</p>;
  const H = Math.round(Math.min(Math.max(W * 0.46, 260), 420));
  const angosto = W < 480;
  const m = { l: angosto ? 50 : 58, r: 12, t: 16, b: 44 };
  const lx = validos.map((p) => Math.log10(p.x));
  const x0 = Math.floor(Math.min(...lx));
  const x1 = Math.ceil(Math.max(...lx));
  const maxY = Math.max(...validos.map((p) => p.y), referenciaY ?? 0);
  const techo = techoY && techoY < maxY ? techoY : null;
  const yMax = (techo ?? maxY) * 1.08 || 1;
  const sx = (v: number) => m.l + ((Math.log10(v) - x0) / (x1 - x0 || 1)) * (W - m.l - m.r);
  const sy = (v: number) => H - m.b - (Math.min(Math.max(v, 0), yMax) / yMax) * (H - m.t - m.b);
  const pasoX = angosto ? 2 : 1;
  const ticksX = Array.from({ length: x1 - x0 + 1 }, (_, i) => 10 ** (x0 + i)).filter(
    (_, i) => i % pasoX === 0,
  );
  const ticksY = [0, 0.25, 0.5, 0.75, 1].map((f) => f * yMax);
  const orden = [...validos].sort((a, b) => Number(!!a.destacado) - Number(!!b.destacado));
  const dest = validos.find((p) => p.destacado);
  const fuera = techo ? validos.filter((p) => p.y > yMax) : [];
  return (
    <figure className="flex flex-col gap-2">
      <div ref={caja} className="w-full">
        <svg
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
          className="block max-w-full"
          role="img"
          aria-label={`${tituloY} frente a ${tituloX}`}
        >
          {ticksY.map((t) => (
            <g key={`y${t}`}>
              <line x1={m.l} x2={W - m.r} y1={sy(t)} y2={sy(t)} stroke="var(--color-neutral-100)" />
              <text x={m.l - 8} y={sy(t) + 4} textAnchor="end" fontSize="12" fill="var(--color-neutral-700)">
                {formatoY(t)}
              </text>
            </g>
          ))}
          {ticksX.map((t) => (
            <text
              key={`x${t}`}
              x={sx(t)}
              y={H - m.b + 18}
              textAnchor="middle"
              fontSize="12"
              fill="var(--color-neutral-700)"
            >
              {formatoX(t)}
            </text>
          ))}
          <text x={(W + m.l) / 2} y={H - 6} textAnchor="middle" fontSize="12" fill="var(--color-neutral-700)">
            {tituloX}
          </text>
          {referenciaY !== null && referenciaY !== undefined ? (
            <line
              x1={m.l}
              x2={W - m.r}
              y1={sy(referenciaY)}
              y2={sy(referenciaY)}
              stroke="var(--color-neutral-900)"
              strokeDasharray="4 4"
              strokeWidth="1.25"
            />
          ) : null}
          {orden.map((p) => {
            const arriba = p.y > yMax;
            const cx = sx(p.x);
            const cy = sy(p.y);
            const titulo = `${p.etiqueta}: ${formatoX(p.x)} · ${formatoY(p.y)}`;
            return arriba ? (
              <path
                key={p.id}
                d={`M${cx - 5} ${cy + 4} L${cx + 5} ${cy + 4} L${cx} ${cy - 4} Z`}
                className={p.destacado ? "fill-green-500" : p.clase}
              >
                <title>{titulo}</title>
              </path>
            ) : (
              <circle
                key={p.id}
                cx={cx}
                cy={cy}
                r={p.destacado ? 7 : angosto ? 3.5 : 4.5}
                className={p.destacado ? "fill-green-500" : p.clase}
                stroke={p.destacado ? "var(--color-neutral-950)" : "var(--color-neutral-0)"}
                strokeWidth={p.destacado ? 1.5 : 0.75}
                fillOpacity={p.destacado ? 1 : 0.9}
              >
                <title>{titulo}</title>
              </circle>
            );
          })}
          {dest ? (
            <text
              x={sx(dest.x) > W * 0.65 ? sx(dest.x) - 12 : sx(dest.x) + 12}
              y={Math.max(sy(dest.y) - 12, m.t + 10)}
              textAnchor={sx(dest.x) > W * 0.65 ? "end" : "start"}
              fontSize="13"
              fontWeight="600"
              fill="var(--color-neutral-950)"
              stroke="var(--color-neutral-0)"
              strokeWidth="3"
              paintOrder="stroke"
            >
              {dest.etiqueta}
            </text>
          ) : null}
        </svg>
      </div>
      <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center md:justify-between">
        {leyenda ? <Leyenda items={leyenda} /> : null}
        {referenciaY !== null && referenciaY !== undefined && etiquetaReferencia ? (
          <p className="flex items-center gap-2 text-small text-neutral-700">
            <span aria-hidden="true" className="inline-block w-5 border-t border-dashed border-neutral-900" />
            {etiquetaReferencia}
          </p>
        ) : null}
      </div>
      {fuera.length ? (
        <p className="text-small text-neutral-700">
          {`${fuera.length} ${fuera.length === 1 ? "entidad tiene" : "entidades tienen"} un valor por encima de ${formatoY(yMax)}: ${fuera.map((p) => `${p.etiqueta} (${formatoY(p.y)})`).join(", ")}. Se dibujan en el borde superior (▲).`}
        </p>
      ) : null}
    </figure>
  );
}

/** Una cifra principal con su contexto. `acento` = la cifra de la entidad elegida. */
export function Kpi({
  etiqueta,
  valor,
  contexto,
  acento = false,
  accion,
}: {
  etiqueta: string;
  valor: string;
  contexto?: ReactNode;
  acento?: boolean;
  accion?: ReactNode;
}) {
  return (
    <div
      className={`flex min-w-0 flex-col gap-1.5 rounded-lg border bg-neutral-0 p-4 md:p-5 ${acento ? "border-green-500/50" : "border-neutral-100"}`}
    >
      <span className="flex items-start justify-between gap-2">
        <span className="text-label uppercase text-neutral-700">{etiqueta}</span>
        {accion}
      </span>
      <span className="tnum text-h3-sm font-semibold text-neutral-950 md:text-h3">{valor}</span>
      {contexto ? <span className="text-small text-neutral-700">{contexto}</span> : null}
    </div>
  );
}

"use client";

import { useCallback, useRef, useState } from "react";
import { useLectura } from "@/components/useLectura";

export type Solution = {
  key: string;
  name: string;
  tagline: string;
  /** Solución en construcción: nodo discontinuo. */
  open?: boolean;
  /** Solo SIAR: profundidad del producto. */
  fullName?: string;
  description?: string;
  basis?: string;
  pillars?: readonly string[];
};

/** Geometría del ecosistema (viewBox 0 0 720 560): NOVUM al centro-izquierda, las soluciones a la derecha. */
const CORE = { x: 96, y: 250, s: 72, r: 18 };
const NODES: Record<
  string,
  { x: number; y: number; r: number; label: [number, number, "start" | "middle" | "end"] }
> = {
  siar: { x: 424, y: 150, r: 34, label: [0, 0, "middle"] },
  presupuesto: { x: 566, y: 352, r: 20, label: [0, 40, "middle"] },
  planeacion: { x: 436, y: 462, r: 20, label: [0, 40, "middle"] },
  mas: { x: 254, y: 470, r: 16, label: [0, 36, "middle"] },
};
const ORBIT = 98;
const LABEL_ORBIT = 126;

function branch(k: string) {
  const n = NODES[k];
  const x0 = CORE.x + CORE.s / 2;
  const x1 = n.x - n.r - 4;
  const bend = (x1 - x0) * 0.45;
  return `M ${x0} ${CORE.y} C ${x0 + bend} ${CORE.y} ${x1 - bend} ${n.y} ${x1} ${n.y}`;
}

/**
 * Ecosistema Novum (B1.2). La lista de la izquierda es la información completa
 * —siempre visible, sin pestañas ni carrusel—; hover, foco o clic en una
 * solución la vuelve activa y el sistema de la derecha responde: la rama se
 * enciende, el nodo crece y, con SIAR, sus siete componentes se despliegan
 * alrededor (la constelación es profundidad del producto, no otra
 * ilustración). El SVG es decorativo para tecnologías de apoyo: el HTML ya
 * dice todo lo que muestra.
 */
export function Ecosystem({ solutions, nivel = 3 }: { solutions: Solution[]; nivel?: 2 | 3 }) {
  const Titulo = nivel === 2 ? "h2" : "h3";
  const [active, setActive] = useState(solutions[0].key);
  const siar = solutions.find((s) => s.pillars);
  const pillars = siar?.pillars ?? [];
  const listRef = useRef<HTMLOListElement>(null);
  useLectura(
    listRef,
    ":scope > li",
    useCallback((i: number) => setActive(solutions[i].key), [solutions]),
  );

  return (
    <div className="grid gap-14 lg:grid-cols-12 lg:items-start lg:gap-8">
      <ol ref={listRef} className="relative flex flex-col gap-10 lg:col-span-5 lg:gap-11">
        <span
          aria-hidden="true"
          className="absolute bottom-6 left-[0.3125rem] top-6 w-px bg-neutral-300/70"
        />
        {solutions.map((s, i) => {
          const on = s.key === active;
          const main = Boolean(s.description);
          return (
            <li
              key={s.key}
              className="relative grid grid-cols-[auto_1fr] gap-5 lg:gap-6"
              onMouseEnter={() => setActive(s.key)}
              data-reveal
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <span
                aria-hidden="true"
                className={`relative z-[1] mt-[0.5em] h-3 w-3 shrink-0 rounded-sm border-[1.5px] transition-colors duration-300 ${
                  s.open ? "border-dashed" : ""
                } ${on ? "border-purple-700 bg-purple-500" : "border-purple-500 bg-neutral-0"}`}
              />
              <div className={`flex flex-col ${main ? "gap-4" : "gap-2"}`}>
                {s.fullName ? (
                  <span className="text-label uppercase text-purple-700">
                    {s.name} — {s.fullName}
                  </span>
                ) : null}
                <Titulo className={main ? "text-h2-sm md:text-h1" : "text-h3-sm md:text-h3"}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onFocus={() => setActive(s.key)}
                    onClick={() => setActive(s.key)}
                    className={`-my-1 min-h-11 rounded-sm py-1 text-left transition-colors duration-300 ${
                      on ? "text-neutral-950" : "text-neutral-700 hover:text-neutral-950"
                    }`}
                  >
                    {main ? (
                      <>
                        <span className="text-purple-700">{s.name}.</span> {s.tagline}
                      </>
                    ) : (
                      s.name
                    )}
                  </button>
                </Titulo>
                {main ? (
                  <>
                    <p className="text-body max-w-[34rem] text-neutral-700">{s.description}</p>
                    <p className="max-w-[34rem] border-l-2 border-purple-500 pl-4 text-body-sm text-neutral-700">
                      {s.basis}
                    </p>
                    <ul className="flex flex-wrap gap-2 pt-1" aria-label={`Componentes de ${s.name}`}>
                      {s.pillars?.map((p) => (
                        <li
                          key={p}
                          className="rounded-md border border-purple-500/40 bg-neutral-0/60 px-2.5 py-1 text-label uppercase text-purple-900"
                        >
                          {p}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className="text-body-sm max-w-[30rem] text-neutral-700">{s.tagline}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <div
        className="hidden lg:sticky lg:top-28 lg:col-span-7 lg:block"
        data-reveal="scale"
        style={{ transitionDelay: "120ms" }}
      >
        <svg
          viewBox="0 0 720 560"
          aria-hidden="true"
          className="eco h-auto w-full overflow-visible font-sans"
        >
          <defs>
            <radialGradient id="ecoField" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" style={{ stopColor: "var(--color-purple-500)", stopOpacity: 0.18 }} />
              <stop offset="1" style={{ stopColor: "var(--color-purple-500)", stopOpacity: 0 }} />
            </radialGradient>
          </defs>

          {/* ramas desde el núcleo */}
          {solutions.map((s) => (
            <path
              key={s.key}
              d={branch(s.key)}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={s.open ? "3 5" : undefined}
              data-branch
              data-on={s.key === active ? "" : undefined}
            />
          ))}

          {/* NOVUM: el núcleo del ecosistema, la ficha del sistema */}
          <g>
            <rect
              x={CORE.x - CORE.s / 2}
              y={CORE.y - CORE.s / 2}
              width={CORE.s}
              height={CORE.s}
              rx={CORE.r}
              fill="var(--color-purple-900)"
            />
            <circle cx={CORE.x} cy={CORE.y} r="11" fill="var(--color-neutral-0)" />
            <text
              x={CORE.x}
              y={CORE.y + CORE.s / 2 + 26}
              textAnchor="middle"
              fontSize="12"
              fontWeight="700"
              letterSpacing="2.4"
              fill="var(--color-purple-900)"
            >
              NOVUM
            </text>
          </g>

          {/* constelación de SIAR: profundidad del producto */}
          {siar ? (
            <g data-constellation data-on={active === siar.key ? "" : undefined}>
              <circle cx={NODES.siar.x} cy={NODES.siar.y} r={ORBIT + 46} fill="url(#ecoField)" />
              <circle
                cx={NODES.siar.x}
                cy={NODES.siar.y}
                r={ORBIT}
                fill="none"
                stroke="var(--color-purple-500)"
                strokeOpacity="0.3"
                strokeDasharray="2 6"
              />
              {pillars.map((p, i) => {
                const a = -Math.PI / 2 + (i * 2 * Math.PI) / pillars.length;
                const cos = Math.cos(a);
                const sin = Math.sin(a);
                const anchor = Math.abs(cos) < 0.25 ? "middle" : cos > 0 ? "start" : "end";
                const ly =
                  NODES.siar.y + LABEL_ORBIT * sin + (Math.abs(cos) < 0.25 ? (sin < 0 ? -4 : 12) : 4);
                return (
                  <g key={p}>
                    <line
                      x1={NODES.siar.x}
                      y1={NODES.siar.y}
                      x2={NODES.siar.x + ORBIT * cos}
                      y2={NODES.siar.y + ORBIT * sin}
                      stroke="var(--color-purple-500)"
                      strokeOpacity="0.4"
                      strokeWidth="1.25"
                    />
                    <circle
                      cx={NODES.siar.x + ORBIT * cos}
                      cy={NODES.siar.y + ORBIT * sin}
                      r="6"
                      fill="var(--color-neutral-0)"
                      stroke="var(--color-purple-500)"
                      strokeWidth="1.5"
                    />
                    <text
                      x={NODES.siar.x + LABEL_ORBIT * cos}
                      y={ly}
                      textAnchor={anchor}
                      fontSize="11.5"
                      fontWeight="600"
                      letterSpacing="1.1"
                      fill="var(--color-neutral-700)"
                    >
                      {p.toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </g>
          ) : null}

          {/* soluciones */}
          {solutions.map((s) => {
            const n = NODES[s.key];
            const on = s.key === active;
            return (
              <g
                key={s.key}
                data-node
                data-on={on ? "" : undefined}
                onMouseEnter={() => setActive(s.key)}
                onClick={() => setActive(s.key)}
              >
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={n.r}
                  fill="var(--color-neutral-0)"
                  stroke={s.open ? "var(--color-neutral-500)" : "var(--color-purple-500)"}
                  strokeWidth={s.description ? 2 : 1.5}
                  strokeDasharray={s.open ? "3 4" : undefined}
                  data-node-ring
                />
                {s.description ? (
                  <text
                    x={n.x}
                    y={n.y + 5}
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="700"
                    letterSpacing="2.2"
                    fill="var(--color-purple-900)"
                  >
                    {s.name.toUpperCase()}
                  </text>
                ) : (
                  <>
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={s.open ? 4 : 7}
                      fill={s.open ? "var(--color-neutral-500)" : "var(--color-purple-700)"}
                    />
                    <text
                      x={n.x + n.label[0]}
                      y={n.y + n.label[1]}
                      textAnchor={n.label[2]}
                      fontSize="12"
                      fontWeight="600"
                      letterSpacing="1.4"
                      fill={s.open ? "var(--color-neutral-500)" : "var(--color-neutral-900)"}
                    >
                      {s.name.toUpperCase()}
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

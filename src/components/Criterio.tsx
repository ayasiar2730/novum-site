"use client";

import { useState } from "react";
import { criterioGlyphs } from "@/components/criterioGlyphs";

export type CriterioItem = { stage: string; title: string; body: string };

/** Estaciones del panel (viewBox 0 0 480 620): cuatro criterios en diagonal descendente y la decisión al final. */
const STATIONS = [
  { x: 96, y: 84 },
  { x: 196, y: 214 },
  { x: 288, y: 344 },
  { x: 372, y: 474 },
];
const DECISION = { x: 416, y: 576 };

function segment(a: { x: number; y: number }, b: { x: number; y: number }) {
  const bend = (b.y - a.y) * 0.5;
  return `M ${a.x} ${a.y} C ${a.x} ${a.y + bend} ${b.x} ${b.y - bend} ${b.x} ${b.y}`;
}

/**
 * Narrativa de criterio (B1.3): DATOS → EVIDENCIA → CONTEXTO → DIAGNÓSTICO → DECISIÓN.
 * Los cuatro textos aprobados se leen completos en la columna izquierda y
 * activan estados: el panel de la derecha ilumina la estación activa y el
 * tramo recorrido hasta ella; el último tramo enciende DECISIÓN. Hover, foco
 * o clic cambian el estado; nada depende del hover para leerse. En pantallas
 * estrechas el panel desaparece y la lectura es vertical, con el glifo al lado.
 */
export function Criterio({ items }: { items: CriterioItem[] }) {
  const [active, setActive] = useState(0);
  const decided = active === items.length - 1;

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
      <ol className="relative flex flex-col gap-11 lg:col-span-6 lg:gap-12">
        {/* espina: el criterio es una secuencia, no cuatro bloques */}
        <span
          aria-hidden="true"
          className="absolute bottom-8 left-[1.4375rem] top-8 w-px bg-neutral-300/70 lg:left-[0.3125rem]"
        />
        {items.map((item, i) => {
          const on = i === active;
          return (
            <li
              key={item.title}
              className="relative grid grid-cols-[3rem_1fr] gap-5 lg:grid-cols-[auto_1fr] lg:gap-6"
              onMouseEnter={() => setActive(i)}
              data-reveal
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              {/* móvil / tablet: glifo al lado; escritorio: nodo de la espina */}
              <span
                aria-hidden="true"
                className={`glifo relative z-[1] flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-0 text-purple-500 transition-opacity duration-300 [&>svg]:h-10 [&>svg]:w-10 lg:hidden ${
                  on ? "opacity-100" : "opacity-70"
                }`}
              >
                {criterioGlyphs[i]}
              </span>
              <span
                aria-hidden="true"
                className={`mt-[0.55em] hidden h-3 w-3 shrink-0 rounded-[3px] border-[1.5px] transition-colors duration-300 lg:block ${
                  on ? "border-purple-700 bg-purple-500" : "border-purple-500 bg-neutral-0"
                }`}
              />
              <div className="flex flex-col gap-2.5">
                <span className={`text-label uppercase ${on ? "text-purple-700" : "text-neutral-500"}`}>
                  {item.stage}
                </span>
                <h3 className="text-h2-sm md:text-h2">
                  <button
                    type="button"
                    aria-pressed={on}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className={`rounded-sm text-left transition-colors duration-300 ${
                      on ? "text-purple-900" : "text-neutral-700 hover:text-purple-900"
                    }`}
                  >
                    {item.title}
                  </button>
                </h3>
                <p className="text-body max-w-[34rem] text-neutral-700">{item.body}</p>
              </div>
            </li>
          );
        })}
      </ol>

      {/* panel dominante: la misma secuencia como recorrido hacia la decisión */}
      <div className="hidden lg:col-span-5 lg:col-start-8 lg:block" data-reveal="scale">
        <svg
          viewBox="0 0 480 620"
          aria-hidden="true"
          className="criterio glifo sticky top-28 h-auto w-full overflow-visible"
          data-decided={decided ? "" : undefined}
        >
          {STATIONS.map((s, i) => {
            const next = i < STATIONS.length - 1 ? STATIONS[i + 1] : DECISION;
            return (
              <path
                key={i}
                d={segment(s, next)}
                fill="none"
                strokeLinecap="round"
                data-seg
                data-on={i < active ? "" : undefined}
                data-live={i === active ? "" : undefined}
              />
            );
          })}
          {STATIONS.map((s, i) => (
            <g key={i} data-station data-on={i === active ? "" : undefined} onMouseEnter={() => setActive(i)}>
              <circle cx={s.x} cy={s.y} r="62" fill="var(--color-neutral-0)" />
              <circle
                cx={s.x}
                cy={s.y}
                r="62"
                fill="none"
                stroke="var(--color-purple-500)"
                data-station-ring
              />
              <svg x={s.x - 44} y={s.y - 44} width="88" height="88" viewBox="0 0 40 40">
                {criterioGlyphs[i].props.children}
              </svg>
            </g>
          ))}
          <g data-decision>
            <circle
              cx={DECISION.x}
              cy={DECISION.y}
              r="28"
              fill="none"
              stroke="var(--color-green-500)"
              data-halo
            />
            <circle cx={DECISION.x} cy={DECISION.y} r="14" fill="var(--color-green-500)" />
            <text
              x={DECISION.x - 44}
              y={DECISION.y + 5}
              textAnchor="end"
              fontSize="12"
              fontWeight="700"
              letterSpacing="2.2"
              fill="var(--color-green-700)"
            >
              DECISIÓN
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}

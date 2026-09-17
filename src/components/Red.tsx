"use client";

import { useRef, useState } from "react";
import { useLectura } from "@/components/useLectura";

export type Servicio = { title: string; body: string };

/** Geometría de la red (viewBox 52 30 596 460): NOVUM al centro y seis nodos en anillo. */
const CORE = { x: 350, y: 260, s: 72, r: 18 };
const RING = 168;
const NODE_R = 9;

/** Etiquetas de hasta dos líneas, partidas por palabras de forma equilibrada. */
function lines(title: string) {
  if (title.length <= 15) return [title];
  const words = title.split(" ");
  let best = [title, ""];
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(" ");
    const b = words.slice(i).join(" ");
    const diff = Math.abs(a.length - b.length);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = [a, b];
    }
  }
  return best;
}

/**
 * Acompañamiento como red (B1.5, recompuesto): TECNOLOGÍA + PERSONAS. Seis
 * servicios como nodos alrededor del núcleo Novum, en el mismo lenguaje del
 * ecosistema; la lista de la derecha es la información completa y siempre
 * visible. Hover, foco, clic o la propia lectura (scroll) activan un servicio
 * y la red responde: nodo relleno, conexión encendida. Sin tarjetas.
 */
export function Red({ items }: { items: Servicio[] }) {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);
  useLectura(listRef, ":scope > li", setActive);

  const nodes = items.map((item, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / items.length;
    const cos = Math.cos(a);
    const sin = Math.sin(a);
    const x = CORE.x + RING * cos;
    const y = CORE.y + RING * sin;
    const side = Math.abs(cos) < 0.3 ? (sin < 0 ? "top" : "bottom") : cos > 0 ? "right" : "left";
    const label = lines(item.title);
    const anchor: "start" | "end" | "middle" =
      side === "right" ? "start" : side === "left" ? "end" : "middle";
    const lx = side === "right" ? x + NODE_R + 10 : side === "left" ? x - NODE_R - 10 : x;
    const ly =
      side === "top"
        ? y - NODE_R - 10 - (label.length - 1) * 15
        : side === "bottom"
          ? y + NODE_R + 20
          : y - ((label.length - 1) * 15) / 2 + 4;
    return { x, y, label, anchor, lx, ly };
  });

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-8">
      <div className="hidden lg:sticky lg:top-24 lg:col-span-6 lg:block" data-reveal="scale">
        <svg
          viewBox="52 30 596 460"
          aria-hidden="true"
          className="red h-auto w-full overflow-visible font-sans"
        >
          <defs>
            <radialGradient id="redField" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" style={{ stopColor: "var(--color-purple-500)", stopOpacity: 0.16 }} />
              <stop offset="1" style={{ stopColor: "var(--color-purple-500)", stopOpacity: 0 }} />
            </radialGradient>
          </defs>
          <circle cx={CORE.x} cy={CORE.y} r={RING + 60} fill="url(#redField)" />
          <circle
            cx={CORE.x}
            cy={CORE.y}
            r={RING}
            fill="none"
            stroke="var(--color-purple-500)"
            strokeOpacity="0.22"
            strokeDasharray="2 6"
          />
          {nodes.map((n, i) => (
            <line
              key={`l-${i}`}
              x1={CORE.x}
              y1={CORE.y}
              x2={n.x}
              y2={n.y}
              strokeLinecap="round"
              data-link
              data-on={i === active ? "" : undefined}
            />
          ))}
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
          </g>
          {nodes.map((n, i) => (
            <g
              key={n.label.join(" ")}
              data-node
              data-on={i === active ? "" : undefined}
              onMouseEnter={() => setActive(i)}
              onClick={() => setActive(i)}
            >
              <circle cx={n.x} cy={n.y} r={NODE_R} data-node-ring />
              <text
                x={n.lx}
                y={n.ly}
                textAnchor={n.anchor}
                fontSize="12.5"
                fontWeight="600"
                letterSpacing="0.2"
              >
                {n.label.map((l, li) => (
                  <tspan key={l} x={n.lx} dy={li === 0 ? 0 : 15}>
                    {l}
                  </tspan>
                ))}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <ol ref={listRef} className="relative flex flex-col gap-9 lg:col-span-6 lg:gap-10">
        <span
          aria-hidden="true"
          className="absolute bottom-6 left-[0.3125rem] top-6 w-px bg-neutral-300/70"
        />
        {items.map((item, i) => {
          const on = i === active;
          return (
            <li
              key={item.title}
              className="relative grid grid-cols-[auto_1fr] gap-5 lg:gap-6"
              onMouseEnter={() => setActive(i)}
              data-reveal
              style={{ transitionDelay: `${(i % 3) * 60}ms` }}
            >
              <span
                aria-hidden="true"
                className={`relative z-[1] mt-[0.5em] h-3 w-3 shrink-0 rounded-sm border-[1.5px] transition-colors duration-300 ${
                  on ? "border-purple-700 bg-purple-500" : "border-purple-500 bg-neutral-0"
                }`}
              />
              <div className="flex flex-col gap-2">
                <h3 className="text-h3-sm md:text-h3">
                  <button
                    type="button"
                    aria-pressed={on}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className={`-my-1 min-h-11 rounded-sm py-1 text-left transition-colors duration-300 ${
                      on ? "text-purple-900" : "text-neutral-700 hover:text-purple-900"
                    }`}
                  >
                    {item.title}
                  </button>
                </h3>
                <p className="text-body-sm max-w-[32rem] text-neutral-700">{item.body}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

import type { CSSProperties } from "react";
import { DESK, GROUPS, MOB, deskLink, deskTileY, mobLink, type TileGroup } from "@/components/heroAssembly";

/**
 * "Sistema que conecta" — el objeto visual del hero (B0).
 *
 * Una placa morada (el sistema, eco de la ficha del isotipo) sobre la que se
 * ensamblan los módulos de SOFTWARE (rellenos) y los servicios de
 * ACOMPAÑAMIENTO (delineados); todos convergen en el núcleo SU ENTIDAD y de
 * ahí sale DECISIÓN, el único elemento verde, montado sobre el borde de la
 * placa: el resultado sale del sistema hacia el mundo de la entidad.
 *
 * Cada módulo es un <g class="nodo"> enfocable que contiene su propia conexión;
 * hover/focus lo eleva, intensifica su línea y hace responder al núcleo y a
 * DECISIÓN (CSS en globals.css, sin JavaScript). Las animaciones de entrada son
 * finitas; en reposo nada se mueve. Geometría en heroAssembly.ts.
 */

const ARIA_LABEL =
  "Diagrama: el software de Novum — Novum Riesgos, Novum Presupuesto, Novum Planeación Estratégica y más soluciones — y el acompañamiento — diagnóstico, implementación, capacitación y cumplimiento — convergen en su entidad y en sus decisiones.";

const linkStyle = {
  fill: "none",
  stroke: "#ffffff",
  strokeOpacity: 0.34,
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
};

const caption = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: 2.2,
  fill: "var(--color-purple-100)",
  fillOpacity: 0.72,
};

function Defs({ id, x1, y1, x2, y2 }: { id: string; x1: number; y1: number; x2: number; y2: number }) {
  return (
    <defs>
      <linearGradient id={`${id}-plate`} x1="0" y1="1" x2="1" y2="0">
        <stop offset="0" style={{ stopColor: "var(--color-purple-900)" }} />
        <stop offset="0.55" style={{ stopColor: "var(--color-purple-900)" }} />
        <stop offset="1" style={{ stopColor: "var(--color-purple-700)" }} />
      </linearGradient>
      <pattern id={`${id}-dots`} width="22" height="22" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r="1" fill="#ffffff" fillOpacity="0.16" />
      </pattern>
      <radialGradient id={`${id}-maskGrad`} cx="0.62" cy="0.5" r="0.62">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor="#000000" />
      </radialGradient>
      <mask id={`${id}-mask`}>
        <rect x="0" y="0" width="100%" height="100%" fill={`url(#${id}-maskGrad)`} />
      </mask>
      <radialGradient id={`${id}-field`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" style={{ stopColor: "var(--color-purple-500)", stopOpacity: 0.5 }} />
        <stop offset="1" style={{ stopColor: "var(--color-purple-500)", stopOpacity: 0 }} />
      </radialGradient>
      <linearGradient id={`${id}-out`} x1={x1} y1={y1} x2={x2} y2={y2} gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" style={{ stopColor: "var(--color-green-500)" }} />
      </linearGradient>
      <filter id={`${id}-lift`} x="-20%" y="-40%" width="140%" height="200%">
        <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#17141f" floodOpacity="0.28" />
      </filter>
    </defs>
  );
}

function Plate({
  id,
  x,
  y,
  w,
  h,
  rx,
}: {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rx: number;
}) {
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={`url(#${id}-plate)`} data-plate />
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={`url(#${id}-dots)`} mask={`url(#${id}-mask)`} />
      <rect
        x={x + 0.5}
        y={y + 0.5}
        width={w - 1}
        height={h - 1}
        rx={rx}
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.09"
      />
    </>
  );
}

function TileShape({
  x,
  y,
  w,
  h,
  rx,
  group,
  dashed,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  rx: number;
  group: TileGroup["key"];
  dashed?: boolean;
}) {
  if (dashed) {
    return (
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={rx}
        fill="none"
        stroke="var(--color-purple-100)"
        strokeOpacity="0.55"
        strokeWidth="1.25"
        strokeDasharray="3 4"
        data-tile
      />
    );
  }
  if (group === "software") {
    return <rect x={x} y={y} width={w} height={h} rx={rx} fill="var(--color-purple-500)" data-tile />;
  }
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={rx}
      fill="#ffffff"
      fillOpacity="0.06"
      stroke="#ffffff"
      strokeOpacity="0.34"
      strokeWidth="1.25"
      data-tile
    />
  );
}

function Core({
  x,
  y,
  r,
  label,
  scale = 1,
}: {
  x: number;
  y: number;
  r: number;
  label: string;
  scale?: number;
}) {
  return (
    <g data-node="center">
      <circle
        cx={x}
        cy={y}
        r={r * 2}
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.12"
        strokeDasharray="2 6"
      />
      <circle cx={x} cy={y} r={r * 1.45} fill="none" stroke="#ffffff" strokeOpacity="0.26" data-core-ring />
      <circle cx={x} cy={y} r={r} fill="#ffffff" />
      <circle cx={x} cy={y} r={r * 0.39} fill="var(--color-purple-700)" />
      <text
        x={x}
        y={y + r + 26 * scale}
        textAnchor="middle"
        fontSize={12 * scale}
        fontWeight="700"
        letterSpacing={2.2 * scale}
        fill="#ffffff"
        fillOpacity="0.88"
      >
        {label}
      </text>
    </g>
  );
}

function Decision({
  id,
  x,
  y,
  w,
  h,
  rx,
  label,
  scale = 1,
}: {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rx: number;
  label: string;
  scale?: number;
}) {
  const pad = 8;
  return (
    <g data-node="decision">
      {/* Halo estable en reposo (sin bucle); responde solo cuando un módulo está activo. */}
      <rect
        x={x - pad}
        y={y - pad}
        width={w + pad * 2}
        height={h + pad * 2}
        rx={rx + pad * 0.6}
        fill="none"
        stroke="var(--color-green-500)"
        strokeOpacity="0.45"
        strokeWidth="1.5"
        data-halo
      />
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={rx}
        fill="var(--color-green-500)"
        filter={`url(#${id}-lift)`}
      />
      <text
        x={x + w / 2}
        y={y + h / 2 + 4.5 * scale}
        textAnchor="middle"
        fontSize={13 * scale}
        fontWeight="700"
        letterSpacing={2.2 * scale}
        fill="var(--color-purple-900)"
      >
        {label}
      </text>
    </g>
  );
}

export function HeroSystem() {
  const D = DESK;
  const M = MOB;
  let i = 0;
  let j = 0;
  return (
    <>
      {/* ---------- escritorio / tablet ---------- */}
      <svg
        viewBox={D.viewBox}
        role="group"
        aria-label={ARIA_LABEL}
        className="hero-system sistema-nodos hidden h-auto w-full overflow-visible font-sans sm:block"
        data-hero-system
      >
        <title>{ARIA_LABEL}</title>
        <Defs id="d" x1={D.core.x + D.core.r} y1={D.core.y} x2={D.output.x} y2={D.core.y} />
        <Plate id="d" {...D.plate} />
        <circle cx={D.core.x} cy={D.core.y} r={150} fill="url(#d-field)" />

        {GROUPS.map((g) => (
          <g key={g.key} data-group={g.key}>
            <text x={D.tile.x} y={D.groupTop[g.key]} {...caption}>
              {g.label}
            </text>
            {g.tiles.map((t, ti) => {
              const y = deskTileY(g.key, ti);
              const order = i++;
              return (
                <g
                  key={t.label}
                  className="nodo"
                  tabIndex={0}
                  role="img"
                  aria-label={`${g.label}: ${t.label}`}
                  data-tile-group
                  style={{ "--i": order } as CSSProperties}
                >
                  <path d={deskLink(y + D.tile.h / 2)} {...linkStyle} data-line />
                  <TileShape
                    x={D.tile.x}
                    y={y}
                    w={D.tile.w}
                    h={D.tile.h}
                    rx={D.tile.rx}
                    group={g.key}
                    dashed={t.dashed}
                  />
                  <text
                    x={D.tile.x + 16}
                    y={y + D.tile.h / 2 + 4.5}
                    fontSize="12.5"
                    fontWeight="600"
                    letterSpacing="1.4"
                    fill={t.dashed ? "var(--color-purple-100)" : "#ffffff"}
                    fillOpacity={t.dashed ? 0.85 : g.key === "software" ? 1 : 0.92}
                  >
                    {t.label}
                  </text>
                </g>
              );
            })}
          </g>
        ))}

        <Core x={D.core.x} y={D.core.y} r={D.core.r} label={D.core.label} />

        {/* núcleo → decisión: la salida cruza el borde de la placa */}
        <path
          d={`M ${D.core.x + D.core.r} ${D.core.y} L ${D.output.x} ${D.core.y}`}
          fill="none"
          stroke="url(#d-out)"
          strokeWidth="2"
          strokeLinecap="round"
          data-line
          data-line-out
        />
        <Decision id="d" {...D.output} />
      </svg>

      {/* ---------- móvil ---------- */}
      <svg
        viewBox={M.viewBox}
        role="group"
        aria-label={ARIA_LABEL}
        className="hero-system sistema-nodos mx-auto block h-auto w-full max-w-[342px] overflow-visible font-sans sm:hidden"
        data-hero-system-mobile
      >
        <title>{ARIA_LABEL}</title>
        <Defs id="m" x1={M.core.x} y1={M.core.y + M.core.r} x2={M.core.x} y2={M.output.y} />
        <Plate id="m" {...M.plate} />
        <circle cx={M.core.x} cy={M.core.y} r={110} fill="url(#m-field)" />

        {GROUPS.map((g) => {
          const x = M.columns[g.key];
          return (
            <g key={g.key} data-group={g.key}>
              <text x={x} y={M.captionY} {...caption} fontSize="9.5" letterSpacing="1.8">
                {g.label}
              </text>
              {g.tiles.map((t, ti) => {
                const y = M.tile.top + ti * M.tile.step;
                const order = j++;
                return (
                  <g
                    key={t.label}
                    className="nodo"
                    tabIndex={0}
                    role="img"
                    aria-label={`${g.label}: ${t.label}`}
                    data-tile-group
                    style={{ "--i": order } as CSSProperties}
                  >
                    <path d={mobLink(x + M.tile.w / 2, y + M.tile.h)} {...linkStyle} data-line />
                    <TileShape
                      x={x}
                      y={y}
                      w={M.tile.w}
                      h={M.tile.h}
                      rx={M.tile.rx}
                      group={g.key}
                      dashed={t.dashed}
                    />
                    <text
                      x={x + 12}
                      y={y + M.tile.h / 2 + 3.5}
                      fontSize="9.5"
                      fontWeight="600"
                      letterSpacing="0.9"
                      fill={t.dashed ? "var(--color-purple-100)" : "#ffffff"}
                      fillOpacity={t.dashed ? 0.85 : g.key === "software" ? 1 : 0.92}
                    >
                      {t.label}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}

        <Core x={M.core.x} y={M.core.y} r={M.core.r} label={M.core.label} scale={0.85} />
        <path
          d={`M ${M.core.x} ${M.core.y + M.core.r} L ${M.core.x} ${M.output.y}`}
          fill="none"
          stroke="url(#m-out)"
          strokeWidth="2"
          strokeLinecap="round"
          data-line
          data-line-out
        />
        <Decision id="m" {...M.output} scale={0.85} />
      </svg>
    </>
  );
}

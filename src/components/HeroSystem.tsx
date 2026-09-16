import { DESKTOP, MOBILE, inputPath, mobilePath, outputPath } from "@/components/systemGeometry";

/**
 * "Un solo aliado, todas las dimensiones" — composición del hero.
 * Productos independientes y servicios de acompañamiento convergen en la
 * entidad, que es quien decide. Geometría compartida en systemGeometry.ts.
 * La animación vive en globals.css y solo corre con <html class="js">.
 *
 * Fase A: cada nodo de entrada es un <g class="nodo"> enfocable que contiene su
 * propia conexión; al pasar el cursor o recibir foco, el nodo crece y su línea
 * gana intensidad (CSS en globals.css, sin JavaScript). La geometría no cambia.
 */

const ARIA_LABEL =
  "Diagrama: el software de Novum — SIAR, presupuesto, planeación y más módulos — y el acompañamiento — diagnóstico, implementación, capacitación y cumplimiento — convergen en su entidad y en sus decisiones.";

const line = {
  fill: "none",
  stroke: "var(--color-purple-500)",
  strokeOpacity: 0.55,
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
};

const label = {
  fontSize: 13.5,
  fontWeight: 600,
  letterSpacing: 1.2,
  fill: "var(--color-neutral-700)",
};

const groupLabel = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: 2,
  fill: "var(--color-purple-700)",
};

function Fields({
  cx,
  cy,
  ox,
  oy,
  scale = 1,
}: {
  cx: number;
  cy: number;
  ox?: number;
  oy?: number;
  scale?: number;
}) {
  return (
    <>
      <circle cx={cx} cy={cy} r={120 * scale} fill="url(#fieldPurple)" />
      {ox !== undefined && oy !== undefined ? (
        <circle cx={ox} cy={oy} r={70 * scale} fill="url(#fieldGreen)" />
      ) : null}
      <circle cx={cx} cy={cy} r={66 * scale} fill="none" stroke="var(--color-purple-100)" strokeWidth="1" />
      <circle
        cx={cx}
        cy={cy}
        r={98 * scale}
        fill="none"
        stroke="var(--color-purple-100)"
        strokeWidth="1"
        strokeDasharray="2 6"
      />
    </>
  );
}

function Defs({
  gradId,
  x1,
  x2,
  vertical = false,
}: {
  gradId: string;
  x1: number;
  x2: number;
  vertical?: boolean;
}) {
  const g = vertical ? { x1: 0, x2: 0, y1: x1, y2: x2 } : { x1, x2, y1: 0, y2: 0 };
  return (
    <defs>
      <linearGradient id={gradId} {...g} gradientUnits="userSpaceOnUse">
        <stop offset="0.45" style={{ stopColor: "var(--color-purple-500)" }} />
        <stop offset="1" style={{ stopColor: "var(--color-green-500)" }} />
      </linearGradient>
      <radialGradient id="fieldPurple" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" style={{ stopColor: "var(--color-purple-500)", stopOpacity: 0.16 }} />
        <stop offset="1" style={{ stopColor: "var(--color-purple-500)", stopOpacity: 0 }} />
      </radialGradient>
      <radialGradient id="fieldGreen" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" style={{ stopColor: "var(--color-green-500)", stopOpacity: 0.22 }} />
        <stop offset="1" style={{ stopColor: "var(--color-green-500)", stopOpacity: 0 }} />
      </radialGradient>
    </defs>
  );
}

function CenterNode({ x, y, text, r = 32 }: { x: number; y: number; text: string; r?: number }) {
  return (
    <g data-node="center">
      <circle
        cx={x}
        cy={y}
        r={r}
        fill="var(--color-neutral-0)"
        stroke="var(--color-purple-100)"
        strokeWidth="2"
      />
      <circle cx={x} cy={y} r={r * 0.5} fill="var(--color-purple-700)" />
      <text
        x={x}
        y={y + r + 24}
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        letterSpacing="2.2"
        fill="var(--color-purple-900)"
      >
        {text}
      </text>
    </g>
  );
}

function OutputNode({ x, y, text, below = true }: { x: number; y: number; text: string; below?: boolean }) {
  return (
    <g data-node="decision">
      <circle
        cx={x}
        cy={y}
        r="19"
        fill="none"
        stroke="var(--color-green-500)"
        strokeOpacity="0.35"
        strokeWidth="1.5"
        data-pulse
      />
      <circle cx={x} cy={y} r="11" fill="var(--color-green-500)" />
      <text
        x={below ? x : x + 24}
        y={below ? y + 40 : y + 4}
        textAnchor={below ? "middle" : "start"}
        {...label}
        fill="var(--color-green-700)"
      >
        {text}
      </text>
    </g>
  );
}

export function HeroSystem() {
  const D = DESKTOP;
  const M = MOBILE;
  return (
    <>
      {/* ---------- escritorio / tablet ---------- */}
      <svg
        viewBox={D.viewBox}
        role="group"
        aria-label={ARIA_LABEL}
        className="hero-system sistema-nodos hidden h-auto w-full font-sans sm:block"
        data-hero-system
      >
        <title>{ARIA_LABEL}</title>
        <Defs gradId="toDecision" x1={D.center.x + 32} x2={D.output.x - 12} />
        <Fields cx={D.center.x} cy={D.center.y} ox={D.output.x} oy={D.output.y} />

        {/* entidad → decisión */}
        <path
          d={outputPath(D.center.x, D.center.y, D.output.x, D.output.y)}
          {...line}
          stroke="url(#toDecision)"
          strokeOpacity={0.95}
          data-line
          data-line-out
          style={{ animationDelay: "0.9s" }}
        />

        {/* grupos de entrada: cada nodo lleva su conexión → entidad */}
        {D.groups.map((g, gi) => (
          <g key={g.key} data-node={g.key} style={{ animationDelay: `${gi * 0.25}s` }}>
            <text x={g.labelAt.x} y={g.labelAt.y} textAnchor="end" {...groupLabel}>
              {g.label}
            </text>
            {g.nodes.map((n, ni) => (
              <g key={n.label} className="nodo" tabIndex={0} role="img" aria-label={`${g.label}: ${n.label}`}>
                <path
                  d={inputPath(n, D.center.x, D.center.y)}
                  {...line}
                  data-line
                  style={{ animationDelay: `${(gi * 4 + ni) * 0.08}s` }}
                />
                <circle
                  cx={n.x}
                  cy={n.y}
                  r="6.5"
                  fill="var(--color-neutral-50)"
                  stroke={n.dashed ? "var(--color-neutral-500)" : "var(--color-purple-500)"}
                  strokeWidth="1.5"
                  strokeDasharray={n.dashed ? "2 2.5" : undefined}
                  data-ring
                />
                <text
                  x={n.x - 18}
                  y={n.y + 4}
                  textAnchor="end"
                  {...label}
                  fill={n.dashed ? "var(--color-neutral-500)" : label.fill}
                >
                  {n.label}
                </text>
              </g>
            ))}
          </g>
        ))}

        <CenterNode x={D.center.x} y={D.center.y} text={D.center.label} />
        <OutputNode x={D.output.x} y={D.output.y} text={D.output.label} />
      </svg>

      {/* ---------- móvil ---------- */}
      <svg
        viewBox={M.viewBox}
        role="group"
        aria-label={ARIA_LABEL}
        className="hero-system sistema-nodos mx-auto block h-auto w-full max-w-[320px] font-sans sm:hidden"
        data-hero-system-mobile
      >
        <title>{ARIA_LABEL}</title>
        <Defs gradId="toDecisionM" x1={M.center.y + 24} x2={M.output.y - 12} vertical />
        <Fields cx={M.center.x} cy={M.center.y} scale={0.55} />

        <path
          d={`M ${M.center.x} ${M.center.y + 24} L ${M.center.x} ${M.output.y - 12}`}
          {...line}
          stroke="url(#toDecisionM)"
          strokeOpacity={0.95}
          data-line
          data-line-out
          style={{ animationDelay: "0.7s" }}
        />

        {M.rows.map((r, ri) => (
          <g key={r.key} data-node={r.key} style={{ animationDelay: `${ri * 0.25}s` }}>
            <text x="160" y={r.y - 26} textAnchor="middle" {...groupLabel}>
              {r.label}
            </text>
            {r.nodes.map((n, ni) => (
              <g key={n.label} className="nodo" tabIndex={0} role="img" aria-label={`${r.label}: ${n.label}`}>
                <path
                  d={mobilePath(n, M.center.x, M.center.y)}
                  {...line}
                  data-line
                  style={{ animationDelay: `${(ri * 3 + ni) * 0.08}s` }}
                />
                <circle
                  cx={n.x}
                  cy={n.y}
                  r="6"
                  fill="var(--color-neutral-50)"
                  stroke="var(--color-purple-500)"
                  strokeWidth="1.5"
                  data-ring
                />
                <text x={n.x} y={n.y + 22} textAnchor="middle" {...label} fontSize="9.5" letterSpacing="0.8">
                  {n.label}
                </text>
              </g>
            ))}
          </g>
        ))}

        <CenterNode x={M.center.x} y={M.center.y} text={M.center.label} r={24} />
        <OutputNode x={M.output.x} y={M.output.y} text={M.output.label} below={false} />
      </svg>
    </>
  );
}

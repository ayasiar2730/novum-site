/**
 * "El sistema que conecta las decisiones" — composición del hero.
 * Especificación: docs/novum-design-system-v1.md §6.
 * SVG inline, colores por token, sin animación en el Corte 1
 * (los hooks data-* quedan para el motion del Corte 2).
 * El estado inicial es el estado final: se ve completa sin JavaScript.
 */

const ARIA_LABEL =
  "Diagrama del sistema Novum: cartera, datos y entorno macro alimentan SIAR, que conecta presupuesto y planeación con la decisión.";

const line = {
  fill: "none",
  stroke: "var(--color-purple-500)",
  strokeOpacity: 0.6,
  strokeWidth: 1.25,
  strokeLinecap: "round" as const,
};

const label = {
  fontSize: 11.5,
  fontWeight: 600,
  letterSpacing: 1.1,
  fill: "var(--color-neutral-500)",
};

function Gradient({ id, x1, x2 }: { id: string; x1: number; x2: number }) {
  return (
    <linearGradient id={id} x1={x1} x2={x2} y1="0" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0.55" style={{ stopColor: "var(--color-purple-500)" }} />
      <stop offset="1" style={{ stopColor: "var(--color-green-500)" }} />
    </linearGradient>
  );
}

export function HeroSystem() {
  return (
    <>
      {/* ---------- escritorio ---------- */}
      <svg
        viewBox="0 0 800 600"
        role="img"
        aria-label={ARIA_LABEL}
        className="hidden h-auto w-full font-sans sm:block"
        data-hero-system
      >
        <title>{ARIA_LABEL}</title>
        <defs>
          <Gradient id="toDecisionA" x1={598} x2={720} />
          <Gradient id="toDecisionB" x1={598} x2={720} />
        </defs>

        {/* conexiones de entrada → SIAR */}
        <path d="M 148 190 C 270 190 270 300 376 300" {...line} data-line="1" />
        <path d="M 148 300 C 262 300 262 300 376 300" {...line} data-line="2" />
        <path d="M 148 410 C 270 410 270 300 376 300" {...line} data-line="3" />

        {/* SIAR → módulos */}
        <path d="M 424 300 C 500 300 500 225 582 225" {...line} data-line="4" />
        <path d="M 424 300 C 500 300 500 375 582 375" {...line} data-line="5" />

        {/* módulos → DECISIÓN (último tercio se vuelve verde) */}
        <path
          d="M 598 225 C 670 225 670 300 720 300"
          {...line}
          stroke="url(#toDecisionA)"
          strokeOpacity={0.9}
          data-line="6"
        />
        <path
          d="M 598 375 C 670 375 670 300 720 300"
          {...line}
          stroke="url(#toDecisionB)"
          strokeOpacity={0.9}
          data-line="7"
        />

        {/* nodos de entrada */}
        <g data-node="inputs">
          <circle
            cx="140"
            cy="190"
            r="6"
            fill="var(--color-neutral-50)"
            stroke="var(--color-purple-500)"
            strokeWidth="1.5"
          />
          <circle
            cx="140"
            cy="300"
            r="6"
            fill="var(--color-neutral-50)"
            stroke="var(--color-purple-500)"
            strokeWidth="1.5"
          />
          <circle
            cx="140"
            cy="410"
            r="6"
            fill="var(--color-neutral-50)"
            stroke="var(--color-purple-500)"
            strokeWidth="1.5"
          />
          <text x="122" y="194" textAnchor="end" {...label}>
            CARTERA
          </text>
          <text x="122" y="304" textAnchor="end" {...label}>
            DATOS
          </text>
          <text x="122" y="414" textAnchor="end" {...label}>
            MACRO
          </text>
        </g>

        {/* SIAR — nodo central */}
        <g data-node="siar">
          <circle cx="400" cy="300" r="24" fill="none" stroke="var(--color-purple-100)" strokeWidth="2" />
          <circle cx="400" cy="300" r="14" fill="var(--color-purple-700)" />
          <text
            x="400"
            y="352"
            textAnchor="middle"
            fontSize="13"
            fontWeight="600"
            letterSpacing="1.5"
            fill="var(--color-purple-900)"
          >
            SIAR
          </text>
        </g>

        {/* módulos */}
        <g data-node="modules">
          <circle
            cx="590"
            cy="225"
            r="8"
            fill="var(--color-neutral-50)"
            stroke="var(--color-purple-700)"
            strokeWidth="1.5"
          />
          <circle
            cx="590"
            cy="375"
            r="8"
            fill="var(--color-neutral-50)"
            stroke="var(--color-purple-700)"
            strokeWidth="1.5"
          />
          <text x="590" y="205" textAnchor="middle" {...label} fill="var(--color-neutral-700)">
            PRESUPUESTO
          </text>
          <text x="590" y="403" textAnchor="middle" {...label} fill="var(--color-neutral-700)">
            PLANEACIÓN
          </text>
        </g>

        {/* DECISIÓN — único nodo verde */}
        <g data-node="decision">
          <circle
            cx="730"
            cy="300"
            r="17"
            fill="none"
            stroke="var(--color-green-500)"
            strokeOpacity="0.35"
            strokeWidth="1.5"
          />
          <circle cx="730" cy="300" r="10" fill="var(--color-green-500)" />
          <text x="730" y="336" textAnchor="middle" {...label} fill="var(--color-green-700)">
            DECISIÓN
          </text>
        </g>
      </svg>

      {/* ---------- móvil: cuatro nodos en vertical ---------- */}
      <svg
        viewBox="0 0 320 320"
        role="img"
        aria-label={ARIA_LABEL}
        className="mx-auto block h-auto w-full max-w-[320px] font-sans sm:hidden"
        data-hero-system-mobile
      >
        <title>{ARIA_LABEL}</title>
        <defs>
          <linearGradient id="toDecisionM" x1="0" x2="0" y1="228" y2="290" gradientUnits="userSpaceOnUse">
            <stop offset="0.5" style={{ stopColor: "var(--color-purple-500)" }} />
            <stop offset="1" style={{ stopColor: "var(--color-green-500)" }} />
          </linearGradient>
        </defs>

        <path d="M 160 42 L 160 90" {...line} />
        <path d="M 160 126 C 160 170 100 170 100 206" {...line} />
        <path d="M 160 126 C 160 170 220 170 220 206" {...line} />
        <path
          d="M 100 228 C 100 262 160 262 160 290"
          {...line}
          stroke="url(#toDecisionM)"
          strokeOpacity={0.9}
        />
        <path
          d="M 220 228 C 220 262 160 262 160 290"
          {...line}
          stroke="url(#toDecisionM)"
          strokeOpacity={0.9}
        />

        <circle
          cx="160"
          cy="34"
          r="6"
          fill="var(--color-neutral-50)"
          stroke="var(--color-purple-500)"
          strokeWidth="1.5"
        />
        <text x="176" y="38" {...label}>
          DATOS
        </text>

        <circle cx="160" cy="108" r="18" fill="none" stroke="var(--color-purple-100)" strokeWidth="2" />
        <circle cx="160" cy="108" r="11" fill="var(--color-purple-700)" />
        <text
          x="186"
          y="112"
          fontSize="13"
          fontWeight="600"
          letterSpacing="1.5"
          fill="var(--color-purple-900)"
        >
          SIAR
        </text>

        <circle
          cx="100"
          cy="217"
          r="7"
          fill="var(--color-neutral-50)"
          stroke="var(--color-purple-700)"
          strokeWidth="1.5"
        />
        <text x="100" y="243" textAnchor="middle" {...label} fill="var(--color-neutral-700)">
          PRESUPUESTO
        </text>
        <circle
          cx="220"
          cy="217"
          r="7"
          fill="var(--color-neutral-50)"
          stroke="var(--color-purple-700)"
          strokeWidth="1.5"
        />
        <text x="220" y="243" textAnchor="middle" {...label} fill="var(--color-neutral-700)">
          PLANEACIÓN
        </text>

        <circle
          cx="160"
          cy="298"
          r="14"
          fill="none"
          stroke="var(--color-green-500)"
          strokeOpacity="0.35"
          strokeWidth="1.5"
        />
        <circle cx="160" cy="298" r="8" fill="var(--color-green-500)" />
        <text x="182" y="302" {...label} fill="var(--color-green-700)">
          DECISIÓN
        </text>
      </svg>
    </>
  );
}

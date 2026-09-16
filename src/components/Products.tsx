import { products } from "@/content/site";
import { SectionHeading } from "@/components/SectionHeading";

/**
 * Portafolio de soluciones. Sin estados de desarrollo, sin roadmap, sin
 * mockups de interfaz: SIAR mantiene la jerarquía por composición y por una
 * pieza abstracta en el lenguaje de nodos del sitio (sus componentes
 * metodológicos), y las demás soluciones van como portafolio en tres columnas.
 */

/** Constelación metodológica: el nodo SIAR al centro y sus siete componentes alrededor. */
function SiarConstellation({ pillars }: { pillars: readonly string[] }) {
  const ARIA = `Componentes metodológicos de SIAR: ${pillars.map((x) => x.toLowerCase()).join(", ")}.`;
  const cx = 260;
  const cy = 230;
  const ring = 148;
  const labelRing = 182;
  const nodes = pillars.map((label, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / pillars.length;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const anchor: "start" | "middle" | "end" = Math.abs(cos) < 0.25 ? "middle" : cos > 0 ? "start" : "end";
    return {
      label,
      x: cx + ring * cos,
      y: cy + ring * sin,
      lx: cx + labelRing * cos,
      ly: cy + labelRing * sin + (Math.abs(cos) < 0.25 ? (sin < 0 ? -6 : 14) : 4),
      anchor,
    };
  });

  return (
    <svg
      viewBox="-56 0 632 460"
      role="group"
      aria-label={ARIA}
      className="sistema-nodos mx-auto block h-auto w-full max-w-[520px] font-sans"
    >
      <title>{ARIA}</title>
      <defs>
        <radialGradient id="siarField" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" style={{ stopColor: "var(--color-purple-500)", stopOpacity: 0.16 }} />
          <stop offset="1" style={{ stopColor: "var(--color-purple-500)", stopOpacity: 0 }} />
        </radialGradient>
      </defs>

      <circle cx={cx} cy={cy} r={ring + 40} fill="url(#siarField)" />
      <circle
        cx={cx}
        cy={cy}
        r={ring}
        fill="none"
        stroke="var(--color-purple-100)"
        strokeWidth="1"
        strokeDasharray="2 6"
      />
      <circle cx={cx} cy={cy} r={ring * 0.55} fill="none" stroke="var(--color-purple-100)" strokeWidth="1" />

      <circle
        cx={cx}
        cy={cy}
        r="34"
        fill="var(--color-neutral-0)"
        stroke="var(--color-purple-100)"
        strokeWidth="2"
      />
      <circle cx={cx} cy={cy} r="17" fill="var(--color-purple-700)" />
      <text
        x={cx}
        y={cy + 60}
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        letterSpacing="2.2"
        fill="var(--color-purple-900)"
      >
        SIAR
      </text>

      {/* Cada componente es un nodo enfocable con su línea al núcleo (respuesta visual, Fase A). */}
      {nodes.map((n) => (
        <g
          key={n.label}
          className="nodo"
          tabIndex={0}
          role="img"
          aria-label={`Componente de SIAR: ${n.label}`}
        >
          <line
            x1={cx}
            y1={cy}
            x2={n.x}
            y2={n.y}
            stroke="var(--color-purple-500)"
            strokeOpacity="0.35"
            strokeWidth="1.25"
            data-line
          />
          <circle
            cx={n.x}
            cy={n.y}
            r="7"
            fill="var(--color-neutral-0)"
            stroke="var(--color-purple-500)"
            strokeWidth="1.5"
            data-ring
          />
          <text
            x={n.lx}
            y={n.ly}
            textAnchor={n.anchor}
            fontSize="12.5"
            fontWeight="600"
            letterSpacing="1.2"
            fill="var(--color-neutral-700)"
          >
            {n.label.toUpperCase()}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function Products() {
  const { siar, others } = products;

  return (
    <section id="soluciones" className="section-y" aria-labelledby="soluciones-title">
      <div className="container-site">
        <div data-reveal>
          <SectionHeading
            id="soluciones-title"
            eyebrow={products.eyebrow}
            title={products.title}
            intro={products.intro}
            size="lg"
          />
        </div>

        {/* SIAR — solución principal */}
        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
          <div className="flex min-w-0 flex-col gap-6 lg:col-span-6" data-reveal>
            <p className="flex items-center gap-3 text-label uppercase text-purple-700">
              <span aria-hidden="true" className="h-px w-6 bg-purple-500" />
              {siar.name} — {siar.fullName}
            </p>
            <h3 className="text-h2-sm md:text-h1 text-neutral-950">
              <span className="text-purple-700">{siar.name}.</span> {siar.tagline}
            </h3>
            <p className="text-body measure text-neutral-700">{siar.description}</p>
            <p className="border-l-2 border-purple-500 pl-4 text-body-sm measure text-neutral-700">
              {siar.basis}
            </p>
          </div>
          <div className="min-w-0 lg:col-span-6" data-reveal="scale" style={{ transitionDelay: "120ms" }}>
            <div className="px-2 py-4 md:px-6 md:py-8">
              <SiarConstellation pillars={siar.pillars} />
            </div>
          </div>
        </div>

        {/* Portafolio */}
        <div className="mt-20 grid gap-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-neutral-300/60">
          {others.map((product, i) => (
            <div
              key={product.name}
              className={`flex flex-col gap-4 ${i === 0 ? "md:pr-10" : i === others.length - 1 ? "md:pl-10" : "md:px-10"}`}
              data-reveal
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <span
                aria-hidden="true"
                className={`h-2.5 w-2.5 rounded-full border-[1.5px] ${
                  product.open
                    ? "border-dashed border-neutral-500 bg-neutral-0"
                    : "border-purple-500 bg-purple-100"
                }`}
              />
              <h3
                className={`text-h3-sm md:text-h3 ${product.open ? "text-neutral-700" : "text-neutral-950"}`}
              >
                {product.name}
              </h3>
              <p className="text-body-sm text-neutral-700">{product.tagline}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

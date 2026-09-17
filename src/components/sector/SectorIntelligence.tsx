import { sector } from "@/content/sector";
import { getSectorSnapshot } from "@/lib/sector/source";
import { selectCabecera, selectContexto, selectHistorias, selectKpis } from "@/lib/sector/select";
import type { SectorSnapshot } from "@/lib/sector/types";
import { SectionHeading } from "@/components/SectionHeading";
import { SectorKpis } from "@/components/sector/SectorKpis";
import { SectorStory } from "@/components/sector/SectorStory";
import { SectorContext } from "@/components/sector/SectorContext";
import { SectorSource } from "@/components/sector/SectorSource";

/**
 * «Inteligencia del sector» (Bloque 2). Server Component: lee el snapshot en
 * build/servidor (source.ts) y decide entre dos versiones:
 *  - con snapshot aprobado: KPIs, tres historias con visualización y lectura,
 *    rangos de contexto, corte y cobertura;
 *  - sin snapshot: versión editorial — narrativa, tres capítulos, geometría
 *    propia, «Su entidad en contexto» y fuente conceptual. Nada de KPI vacíos,
 *    gráficas, ceros, «sin datos» ni «próximamente».
 * Regla: ninguna cifra sectorial se publica sin un snapshot aprobado y trazable.
 */

/** Composición geométrica propia de la sección: anillos y nodos, en el lenguaje del hero. Decorativa. */
function SectorMark({ className = "" }: { className?: string }) {
  const nodes = [
    { r: 150, a: -70, tone: "line" },
    { r: 150, a: 20, tone: "fill" },
    { r: 105, a: -30, tone: "line" },
    { r: 105, a: 65, tone: "accent" },
    { r: 60, a: -110, tone: "line" },
    { r: 60, a: 40, tone: "fill" },
  ] as const;
  const pt = (r: number, a: number) => ({
    x: 200 + r * Math.cos((a * Math.PI) / 180),
    y: 200 + r * Math.sin((a * Math.PI) / 180),
  });
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true" className={className}>
      <defs>
        <radialGradient id="sectorField" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" style={{ stopColor: "var(--color-purple-500)", stopOpacity: 0.12 }} />
          <stop offset="1" style={{ stopColor: "var(--color-purple-500)", stopOpacity: 0 }} />
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="190" fill="url(#sectorField)" />
      {[60, 105, 150].map((r, i) => (
        <circle
          key={r}
          cx="200"
          cy="200"
          r={r}
          fill="none"
          stroke="var(--color-purple-500)"
          strokeOpacity={0.35 - i * 0.08}
          strokeWidth="1"
          strokeDasharray={i === 1 ? "2 6" : undefined}
        />
      ))}
      {nodes.map((n) => {
        const p = pt(n.r, n.a);
        if (n.tone === "fill")
          return <circle key={`${n.r}-${n.a}`} cx={p.x} cy={p.y} r="5" fill="var(--color-purple-700)" />;
        if (n.tone === "accent")
          return <circle key={`${n.r}-${n.a}`} cx={p.x} cy={p.y} r="6" fill="var(--color-purple-500)" />;
        return (
          <circle
            key={`${n.r}-${n.a}`}
            cx={p.x}
            cy={p.y}
            r="5"
            fill="var(--color-neutral-0)"
            stroke="var(--color-purple-500)"
            strokeWidth="1.5"
          />
        );
      })}
      <circle cx="200" cy="200" r="9" fill="var(--color-purple-900)" />
    </svg>
  );
}

function FixtureBanner() {
  return (
    <div className="bg-purple-900 text-white">
      <p className="container-site py-2 text-label uppercase">{sector.fixtureBanner}</p>
    </div>
  );
}

/**
 * Versión editorial (B1.4): sin snapshot no hay cifras, solo el marco
 * analítico, compuesto como un reportaje del observatorio: numeración
 * editorial grande, capítulos asimétricos y una línea de lectura que los
 * recorre. Cuando llegue el snapshot, ConDatos ocupa este mismo lugar con la
 * misma cabecera y columna de contexto: nada de esto se destruye.
 */
const sangria = ["lg:pl-0", "lg:pl-16", "lg:pl-8"];

function Editorial() {
  return (
    <div className="relative mt-2 flex flex-col gap-14 lg:gap-16">
      {/* línea de lectura: recorre los tres capítulos, como la conexión del sistema */}
      <span
        aria-hidden="true"
        className="absolute bottom-10 left-[0.3125rem] top-10 hidden w-px bg-neutral-300/70 lg:block"
      />
      {sector.capitulos.map((c, i) => (
        <article
          key={c.numero}
          className={`relative grid gap-5 md:grid-cols-12 md:gap-8 ${sangria[i]}`}
          aria-labelledby={`capitulo-${c.numero}`}
          data-reveal
          style={{ transitionDelay: `${i * 60}ms` }}
        >
          <span
            aria-hidden="true"
            className="absolute left-0 top-[2.1rem] hidden h-3 w-3 rounded-[3px] border-[1.5px] border-purple-500 bg-neutral-0 lg:block"
          />
          <div className="flex items-start gap-5 md:col-span-5 md:flex-col md:gap-1 md:pl-8">
            <p className="tnum text-[3.5rem] font-bold leading-none tracking-[-0.03em] text-purple-100 md:text-[5rem]">
              <span className="sr-only">Capítulo </span>
              {c.numero}
            </p>
            <h3
              id={`capitulo-${c.numero}`}
              className="text-h3 md:text-h2-sm text-neutral-950 md:-mt-3 md:max-w-[14rem]"
            >
              {c.titulo}
            </h3>
          </div>
          <div className="flex flex-col gap-3 md:col-span-7 md:pt-4">
            <p className="text-lead max-w-[30rem] text-purple-900">{c.pregunta}</p>
            <p className="text-body-sm max-w-[30rem] text-neutral-700">{c.texto}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

/** Versión con snapshot aprobado. */
function ConDatos({ snapshot }: { snapshot: SectorSnapshot }) {
  const historias = selectHistorias(snapshot);
  return (
    <>
      <div className="mt-14">
        <SectorKpis kpis={selectKpis(snapshot)} />
      </div>
      <div className="mt-6 divide-y divide-neutral-100 border-y border-neutral-100">
        {historias.map((vm, i) => (
          <SectorStory key={vm.historia.id} vm={vm} index={i} />
        ))}
      </div>
      <div className="mt-10 flex flex-col gap-2 text-small text-neutral-500" data-reveal>
        <p className="text-label uppercase text-neutral-500">{sector.conDatos.limitacionesLabel}</p>
        <p className="measure text-neutral-700">{snapshot.metodologia.resumen}</p>
        {snapshot.metodologia.limitaciones.length > 0 ? (
          <ul className="list-disc pl-5">
            {snapshot.metodologia.limitaciones.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </>
  );
}

export async function SectorIntelligence() {
  const snapshot = await getSectorSnapshot();
  const cabecera = snapshot ? selectCabecera(snapshot) : null;
  const rangos = snapshot ? selectContexto(snapshot) : null;

  return (
    <section
      id={sector.id}
      className="relative overflow-hidden bg-neutral-0"
      aria-labelledby="inteligencia-title"
    >
      {snapshot?.origen === "fixture" ? <FixtureBanner /> : null}
      {/* entrega desde el sistema: la trama se disuelve en el observatorio */}
      <div aria-hidden="true" className="trama-sale pointer-events-none absolute inset-x-0 top-0 h-40" />
      <div className="container-site relative py-20 md:py-24">
        <SectorMark className="pointer-events-none absolute -top-20 right-[-11rem] hidden h-[340px] w-[340px] opacity-60 lg:block" />

        {snapshot ? (
          <>
            {/* con snapshot: cabecera a lo ancho y la versión con datos completa (2B.2 la compondrá) */}
            <div className="relative grid gap-8 lg:grid-cols-12" data-reveal>
              <div className="lg:col-span-8">
                <SectionHeading
                  id="inteligencia-title"
                  eyebrow={sector.eyebrow}
                  title={sector.title}
                  intro={sector.intro}
                />
              </div>
              <p className="text-body measure text-neutral-900 lg:col-span-8">{sector.capacidad}</p>
            </div>
            <ConDatos snapshot={snapshot} />
          </>
        ) : (
          /* observatorio: columna de contexto (cómo piensa Novum) y, al lado, los capítulos */
          <div className="relative grid gap-14 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-4">
              <div className="flex flex-col gap-8 lg:sticky lg:top-28" data-reveal>
                <SectionHeading
                  id="inteligencia-title"
                  eyebrow={sector.eyebrow}
                  title={sector.title}
                  intro={sector.intro}
                />
                <p className="border-l-2 border-purple-500 pl-5 text-body text-neutral-900">
                  {sector.capacidad}
                </p>
              </div>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <Editorial />
            </div>
          </div>
        )}

        <div className="mt-14 md:mt-16">
          <SectorContext rangos={rangos} />
        </div>

        <div className="mt-12 border-t border-neutral-100 pt-6" data-reveal>
          <SectorSource cabecera={cabecera} />
        </div>
      </div>
    </section>
  );
}

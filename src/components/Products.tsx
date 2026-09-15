import { products, roadmap, statusLabel, type ProductStatus } from "@/content/site";
import { SectionHeading } from "@/components/SectionHeading";
import { StatusTag } from "@/components/StatusTag";
import { ProductFrame } from "@/components/ProductFrame";

/**
 * SIAR a ancho completo con esqueleto de interfaz; después, la hoja de ruta
 * que conecta los tres módulos con el lenguaje de nodos del hero
 * (es una secuencia real, así que la línea que los une es legítima),
 * y Presupuesto / Planeación compactos debajo.
 */

function RoadmapNode({ status }: { status: ProductStatus }) {
  if (status === "pruebas") {
    return (
      <span className="relative flex h-5 w-5 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-green-500/25" />
        <span className="relative h-3 w-3 rounded-full bg-green-500" />
      </span>
    );
  }
  if (status === "desarrollo") {
    return (
      <span className="flex h-5 w-5 items-center justify-center">
        <span className="h-3.5 w-3.5 rounded-full border-[1.5px] border-purple-700 bg-neutral-0 [background:linear-gradient(90deg,var(--color-purple-700)_50%,transparent_50%)]" />
      </span>
    );
  }
  return (
    <span className="flex h-5 w-5 items-center justify-center">
      <span className="h-3.5 w-3.5 rounded-full border-[1.5px] border-neutral-500 bg-neutral-0" />
    </span>
  );
}

export function Products() {
  const { siar, others } = products;
  const steps = [
    { name: siar.name, status: siar.status },
    ...others.map((p) => ({ name: p.name, status: p.status })),
  ];

  return (
    <section
      id="soluciones"
      className="section-y border-t border-neutral-100 bg-neutral-0"
      aria-labelledby="soluciones-title"
    >
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

        {/* SIAR — protagonista */}
        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
          <div className="flex min-w-0 flex-col gap-6 lg:col-span-5" data-reveal>
            <StatusTag status={siar.status} />
            <h3 className="text-h2-sm md:text-h2 text-neutral-950">
              <span className="text-purple-700">{siar.name}</span> — {siar.fullName}
            </h3>
            <ul className="flex flex-col divide-y divide-neutral-100 border-y border-neutral-100">
              {siar.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 py-3 text-body-sm text-neutral-900">
                  <span
                    aria-hidden="true"
                    className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500"
                  />
                  {feature}
                </li>
              ))}
            </ul>
            <p className="border-l-2 border-purple-500 pl-4 text-body-sm text-neutral-700">
              {siar.paragraphs[1]}
            </p>
            <p className="text-small text-neutral-500">{siar.roadmap}</p>
          </div>
          <div className="min-w-0 lg:col-span-7" data-reveal style={{ transitionDelay: "120ms" }}>
            <ProductFrame caption={siar.frameCaption} />
          </div>
        </div>

        {/* Hoja de ruta */}
        <div className="mt-20 border-t border-neutral-100 pt-10" data-reveal>
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h3 className="flex items-center gap-3 text-label uppercase text-purple-700">
                <span aria-hidden="true" className="h-px w-6 bg-purple-500" />
                {roadmap.title}
              </h3>
              <p className="mt-4 text-body-sm text-neutral-700">{roadmap.intro}</p>
            </div>
            <ol
              className="relative grid gap-6 sm:grid-cols-3 lg:col-span-8"
              aria-label="Estado de los módulos"
            >
              <span
                aria-hidden="true"
                className="absolute top-[10px] left-2 right-2 hidden h-px bg-neutral-100 sm:block"
              />
              {steps.map((step) => (
                <li key={step.name} className="relative flex flex-col gap-3 sm:pr-6">
                  <RoadmapNode status={step.status} />
                  <p className="text-body-sm font-semibold text-neutral-950">{step.name}</p>
                  <p className="text-small text-neutral-500">{statusLabel[step.status]}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Presupuesto y Planeación */}
        <div className="mt-12 grid gap-10 border-t border-neutral-100 pt-10 md:grid-cols-2 md:gap-0 md:divide-x md:divide-neutral-100">
          {others.map((product, i) => (
            <div
              key={product.name}
              className={`flex flex-col gap-4 ${i === 0 ? "md:pr-12" : "md:pl-12"}`}
              data-reveal
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <StatusTag status={product.status} />
              <h3 className="text-h3-sm md:text-h3 text-neutral-950">{product.name}</h3>
              <p className="text-body-sm text-neutral-700">{product.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

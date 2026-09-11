import { products } from "@/content/site";
import { SectionHeading } from "@/components/SectionHeading";
import { StatusTag } from "@/components/StatusTag";
import { ProductFrame } from "@/components/ProductFrame";

/**
 * SIAR a ancho completo; Presupuesto y Planeación compactos debajo.
 * La jerarquía visual dice la verdad del producto: uno existe, dos vienen.
 */
export function Products() {
  const { siar, others } = products;
  return (
    <section
      id="soluciones"
      className="section-y border-t border-neutral-100"
      aria-labelledby="soluciones-title"
    >
      <div className="container-site">
        <SectionHeading
          id="soluciones-title"
          eyebrow={products.eyebrow}
          title={products.title}
          intro={products.intro}
        />

        {/* SIAR — protagonista */}
        <div className="mt-14 grid gap-10 md:grid-cols-12 md:items-center md:gap-12">
          <div className="flex flex-col gap-5 md:col-span-5">
            <StatusTag status={siar.status} />
            <h3 className="text-h2-sm md:text-h2 text-neutral-950">
              <span className="text-purple-700">{siar.name}</span> — {siar.fullName}
            </h3>
            {siar.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="text-body-sm text-neutral-700">
                {p}
              </p>
            ))}
            <p className="text-small text-neutral-500">{siar.roadmap}</p>
          </div>
          <div className="md:col-span-7">
            <ProductFrame caption={siar.frameCaption} />
          </div>
        </div>

        {/* Presupuesto y Planeación */}
        <div className="mt-16 grid gap-10 border-t border-neutral-100 pt-10 md:grid-cols-2 md:gap-0 md:divide-x md:divide-neutral-100">
          {others.map((product, i) => (
            <div key={product.name} className={`flex flex-col gap-4 ${i === 0 ? "md:pr-12" : "md:pl-12"}`}>
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

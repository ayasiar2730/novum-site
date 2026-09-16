import { cta, hero, site } from "@/content/site";
import { chatLink, demoLink } from "@/lib/links";
import { ButtonLink } from "@/components/ButtonLink";
import { HeroSystem } from "@/components/HeroSystem";

function Title() {
  const { title, titleAccent } = hero;
  if (!title.startsWith(titleAccent)) return <>{title}</>;
  return (
    <>
      <span className="text-purple-700">{titleAccent}</span>
      {title.slice(titleAccent.length)}
    </>
  );
}

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden" aria-labelledby="hero-title">
      {/* luz ambiental: atmósfera, no color de fondo */}
      <div aria-hidden="true" className="glow-hero pointer-events-none absolute inset-0" />

      <div className="container-wide relative grid gap-14 py-16 md:py-24 xl:grid-cols-12 xl:items-center xl:gap-8 xl:py-28">
        <div className="flex flex-col gap-7 xl:col-span-6" data-reveal>
          <p className="flex items-center gap-3 text-label uppercase text-purple-700">
            <span aria-hidden="true" className="h-px w-6 bg-purple-500" />
            {hero.eyebrow}
          </p>
          <h1
            id="hero-title"
            className="text-display-sm md:text-display-md 2xl:text-display text-neutral-950"
          >
            <Title />
          </h1>
          <p className="text-body md:text-lead measure text-neutral-700">{hero.subtitle}</p>
          <div className="flex flex-col gap-3 pt-1 sm:flex-row">
            <ButtonLink href={demoLink} external arrow>
              {cta.primary}
            </ButtonLink>
            <ButtonLink href={chatLink} external variant="secondary">
              {cta.secondary}
            </ButtonLink>
          </div>
          <p className="flex items-center gap-3 pt-3 text-small text-neutral-500">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-green-500" />
            {site.tagline}
          </p>
        </div>

        <div
          className="mx-auto w-full max-w-[640px] xl:col-span-6 xl:max-w-none"
          data-reveal="scale"
          style={{ transitionDelay: "120ms" }}
        >
          <div className="relative px-2 py-4 md:px-4 md:py-6">
            <HeroSystem />
          </div>
        </div>
      </div>

      {/*
        Cinta de hechos — solo afirmaciones respaldadas por el documento.
        Se desplaza muy despacio (36 s por vuelta, CSS puro) y se detiene al pasar
        el cursor o al recibir foco; en pantallas estrechas y con reduced-motion es
        una fila estática. La copia duplicada solo cierra el bucle y es invisible
        para tecnologías de apoyo.
      */}
      <div className="container-wide relative" data-reveal style={{ transitionDelay: "200ms" }}>
        <div
          className="cinta py-6 outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-4 focus-visible:ring-offset-neutral-50"
          tabIndex={0}
          role="region"
          aria-label="Hechos de Novum: sector, referentes y enfoque"
        >
          <dl className="cinta-track">
            {hero.facts.map((fact) => (
              <div key={fact.label} className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 shrink-0 rounded-full border-[1.5px] border-purple-500 bg-purple-100"
                />
                <dt className="text-label uppercase text-neutral-500">{fact.label}</dt>
                <dd className="whitespace-nowrap text-small font-medium text-neutral-900">{fact.value}</dd>
              </div>
            ))}
          </dl>
          <div className="cinta-track cinta-clone" aria-hidden="true">
            {hero.facts.map((fact) => (
              <div key={fact.label} className="flex items-center gap-4">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full border-[1.5px] border-purple-500 bg-purple-100" />
                <span className="text-label uppercase text-neutral-500">{fact.label}</span>
                <span className="whitespace-nowrap text-small font-medium text-neutral-900">
                  {fact.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

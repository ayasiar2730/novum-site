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

/**
 * Primera pantalla (B0 — "Sistema que conecta"). Tres planos y no más:
 *   1. el mensaje (eyebrow, H1 editorial, subtítulo, CTA, señal);
 *   2. el sistema visual (HeroSystem: la placa morada con los módulos);
 *   3. luz y trama ambiental (hero-field), concentradas alrededor del sistema.
 * La composición es 55/45 sin división rígida: el sistema invade el centro y
 * la luz del plano 3 pasa por detrás del mensaje. El copy no cambia.
 */
export function Hero() {
  return (
    <section id="inicio" className="hero-surface relative overflow-hidden" aria-labelledby="hero-title">
      {/* plano 3: luz ambiental y trama, alrededor del sistema */}
      <div aria-hidden="true" className="hero-field pointer-events-none absolute inset-0" />

      <div className="container-wide relative grid gap-10 pb-6 pt-7 md:gap-14 md:pt-14 xl:grid-cols-12 xl:items-center xl:gap-x-6 xl:pb-8 xl:pt-8">
        {/* plano 1: el mensaje */}
        <div className="flex max-w-[36rem] flex-col gap-5 md:gap-6 xl:col-span-6 xl:pr-4" data-reveal>
          <p className="flex items-center gap-3 text-label uppercase text-purple-700">
            <span aria-hidden="true" className="hidden h-px w-6 bg-purple-500 sm:block" />
            {hero.eyebrow}
          </p>
          <h1
            id="hero-title"
            className="text-[2rem] leading-[1.1] tracking-[-0.02em] text-neutral-950 sm:text-display-sm md:text-display-md xl:text-[2.625rem] xl:leading-[1.1] xl:tracking-[-0.022em] 2xl:text-[3rem]"
          >
            <Title />
          </h1>
          <p className="text-body-sm md:text-lead max-w-[30rem] text-neutral-700">{hero.subtitle}</p>
          <div className="flex flex-col gap-3 pt-1 sm:flex-row md:pt-2">
            <ButtonLink href={demoLink} external arrow>
              {cta.primary}
            </ButtonLink>
            <ButtonLink href={chatLink} external variant="secondary">
              {cta.secondary}
            </ButtonLink>
          </div>
          <p className="flex items-start gap-3 pt-1 text-small text-neutral-500 md:pt-2">
            <span aria-hidden="true" className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
            {site.tagline}
          </p>
        </div>

        {/* plano 2: el sistema; en escritorio ocupa seis columnas y se asoma al margen derecho */}
        <div
          className="mx-auto w-full max-w-[640px] xl:col-span-6 xl:col-start-7 xl:-mr-6 xl:max-w-none"
          data-reveal="scale"
          style={{ transitionDelay: "120ms" }}
        >
          <HeroSystem />
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

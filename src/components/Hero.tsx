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
    <section className="relative overflow-hidden" aria-labelledby="hero-title">
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
          data-reveal
          style={{ transitionDelay: "120ms" }}
        >
          <div className="relative">
            <div
              aria-hidden="true"
              className="bg-dotgrid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_75%)]"
            />
            <div className="relative px-2 py-4 md:px-4 md:py-6">
              <HeroSystem />
            </div>
          </div>
        </div>
      </div>

      {/* franja de hechos — solo afirmaciones respaldadas por el documento */}
      <div className="container-wide relative" data-reveal style={{ transitionDelay: "200ms" }}>
        <dl className="grid divide-y divide-neutral-100 border-y border-neutral-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {hero.facts.map((fact) => (
            <div key={fact.label} className="flex flex-col gap-1 px-1 py-5 sm:px-6 sm:py-6">
              <dt className="text-label uppercase text-neutral-500">{fact.label}</dt>
              <dd className="text-small font-medium text-neutral-900">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

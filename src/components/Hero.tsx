import { cta, hero, site } from "@/content/site";
import { chatLink, demoLink } from "@/lib/links";
import { ButtonLink } from "@/components/ButtonLink";
import { HeroSystem } from "@/components/HeroSystem";

export function Hero() {
  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-title">
      <div className="container-wide grid gap-12 py-14 md:py-20 xl:grid-cols-12 xl:items-center xl:gap-10 xl:py-28">
        <div className="flex flex-col gap-6 xl:col-span-7">
          <p className="text-label uppercase text-purple-700">{hero.eyebrow}</p>
          <h1 id="hero-title" className="text-display-sm md:text-display-md xl:text-display text-neutral-950">
            {hero.title}
          </h1>
          <p className="text-body md:text-lead measure text-neutral-700">{hero.subtitle}</p>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <ButtonLink href={demoLink} external>
              {cta.primary}
            </ButtonLink>
            <ButtonLink href={chatLink} external variant="secondary">
              {cta.secondary}
            </ButtonLink>
          </div>
          <p className="pt-2 text-small text-neutral-500">{site.tagline}</p>
        </div>

        <div className="mx-auto w-full max-w-[640px] xl:col-span-5 xl:max-w-none">
          <div className="bg-dotgrid [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_100%)] px-2 py-6 md:px-6 md:py-10">
            <HeroSystem />
          </div>
        </div>
      </div>
    </section>
  );
}

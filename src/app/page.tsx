import { Header } from "@/components/Header";
import { Logo } from "@/components/Logo";
import { Hero } from "@/components/Hero";
import { Problem } from "@/components/Problem";
import { About } from "@/components/About";
import { Products } from "@/components/Products";
import { Differentiators } from "@/components/Differentiators";
import { SectorIntelligence } from "@/components/sector/SectorIntelligence";
import { Services } from "@/components/Services";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";

/**
 * Orden definitivo (Master Prompt v2 §4):
 * header → hero → problema → soluciones → por qué es distinto →
 * inteligencia del sector → cómo acompañamos → nosotros → CTA → footer.
 */
export default function Home() {
  return (
    <>
      <Header logo={<Logo variant="light" />} />
      <main id="contenido" tabIndex={-1} className="flex-1 outline-none">
        <Hero />
        <Problem />
        <Products />
        <Differentiators />
        <SectorIntelligence />
        <Services />
        <About />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}

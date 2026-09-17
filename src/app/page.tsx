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
import { Convergence } from "@/components/Convergence";
import { Footer } from "@/components/Footer";

/**
 * Orden definitivo (Master Prompt v2 §4):
 * header → hero → problema → soluciones → por qué es distinto →
 * inteligencia del sector → cómo acompañamos → nosotros → CTA → footer.
 * Las secciones se agrupan en cinco actos con superficie propia (Fase A) y
 * cada acto tiene composición propia (B1): promesa, tensión, sistema,
 * criterio, inteligencia, acompañamiento y decisión. El ritmo lo dan las
 * superficies, el aire y la variación de alturas, no los bordes.
 */
export default function Home() {
  return (
    <>
      <Header logo={<Logo variant="light" />} />
      <main id="contenido" tabIndex={-1} className="flex-1 outline-none">
        {/* Acto I — apertura: neutral-50 con luz ambiental */}
        <Hero />
        {/* Acto II — tensión: blanco limpio */}
        <Problem />
        {/* Acto III — el sistema: única superficie tintada con retícula (design system §7) */}
        <div className="surface-sistema">
          <Products />
          <Differentiators />
        </div>
        {/* Acto IV — contexto: blanco */}
        <SectorIntelligence />
        {/* Acto V — cierre: blanco que desemboca en la banda oscura */}
        <div className="bg-neutral-0">
          <Services />
          <About />
          <Convergence />
          <FinalCta />
        </div>
      </main>
      <Footer />
    </>
  );
}

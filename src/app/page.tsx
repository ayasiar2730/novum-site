import { Header } from "@/components/Header";
import { Logo } from "@/components/Logo";
import { Hero } from "@/components/Hero";
import { Problem } from "@/components/Problem";
import { About } from "@/components/About";
import { Products } from "@/components/Products";
import { Differentiators } from "@/components/Differentiators";
import { Services } from "@/components/Services";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";

/**
 * Orden definitivo (Master Prompt v2 §4):
 * header → hero → problema → nosotros → lo que construimos →
 * por qué es distinto → cómo acompañamos → CTA → footer.
 */
export default function Home() {
  return (
    <>
      <Header logo={<Logo variant="light" />} />
      <main id="contenido" className="flex-1">
        <Hero />
        <Problem />
        <Products />
        <Differentiators />
        {/* Bloque 2: Inteligencia del sector irá aquí */}
        <Services />
        <About />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}

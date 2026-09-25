import { Hero } from "@/components/Hero";
import { Problem } from "@/components/Problem";
import { ResumenLineas } from "@/components/lineas/ResumenLineas";
import { ResumenTecnologia } from "@/components/tecnologia/ResumenTecnologia";
import { SectorIntelligence } from "@/components/sector/SectorIntelligence";
import { InformeDestacado } from "@/components/informes/InformeDestacado";
import { ComoTrabajamos } from "@/components/nosotros/ComoTrabajamos";
import { FinalCta } from "@/components/FinalCta";
import { informeDestacado } from "@/lib/informes/catalogo";

/**
 * El Home es la puerta de entrada (fase 2, portafolio del 24 sep 2026): cada
 * tema aparece resumido y enlaza a su página, donde está completo; nada se
 * repite entero. Conserva los actos y superficies de la Fase A:
 *   I   apertura — hero (neutral-50 con luz ambiental)
 *   II  tensión — el problema del sector (blanco)
 *   III el sistema — las siete líneas y la tecnología Novum (única superficie
 *       tintada con retícula) → /soluciones, /soluciones/<línea>, /tecnologia
 *   IV  contexto — el informe sectorial destacado: el corte completo más
 *       reciente (sin informes, la versión editorial de «Inteligencia del
 *       sector») → /informes
 *   V   decisión — cómo trabajamos → /nosotros, y la banda de contacto
 */
export default function Home() {
  const destacado = informeDestacado();
  return (
    <main id="contenido" tabIndex={-1} className="flex-1 outline-none">
      <Hero />
      <Problem />
      <div className="surface-sistema">
        <ResumenLineas />
        <ResumenTecnologia />
      </div>
      {destacado ? <InformeDestacado informe={destacado} /> : <SectorIntelligence />}
      <div className="bg-neutral-0">
        <ComoTrabajamos compacto />
        <FinalCta />
      </div>
    </main>
  );
}

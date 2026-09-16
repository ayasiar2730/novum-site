import type { Historia } from "@/lib/sector/types";
import { ComparisonBars } from "@/components/sector/charts/ComparisonBars";
import { DistributionBars } from "@/components/sector/charts/DistributionBars";
import { CompositionBar } from "@/components/sector/charts/CompositionBar";

/**
 * Despachador: elige la familia visual según `historia.visualizacion`.
 * No sabe qué métrica dibuja: eso viaja en el snapshot.
 */
export function SectorChart({ historia }: { historia: Historia }) {
  const id = `historia-${historia.id}`;
  const desc = `${historia.titulo}. ${historia.subtitulo}. ${historia.universo.descripcion}.`;
  switch (historia.visualizacion) {
    case "comparacion":
      return <ComparisonBars id={id} series={historia.series} desc={desc} />;
    case "distribucion":
      return <DistributionBars id={id} series={historia.series} desc={desc} />;
    case "composicion":
      return <CompositionBar id={id} series={historia.series} desc={desc} />;
  }
}

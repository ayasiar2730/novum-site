import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { paginas } from "@/content/site";
import { inteligencia } from "@/content/inteligencia";
import { cortesPublicados, corteDestacado, datosDelCorte } from "@/lib/inteligencia/datos";
import type { InformeId } from "@/lib/inteligencia/estado";
import { lector } from "@/lib/inteligencia/panorama";
import { pesos, porcentaje } from "@/lib/inteligencia/formato";
import { metadatosDePagina } from "@/lib/metadatos";
import { Migas } from "@/components/Migas";
import { InformeInteractivo } from "@/components/inteligencia/InformeInteractivo";

const t = inteligencia;
const INFORMES = Object.keys(t.informes) as InformeId[];

export const dynamicParams = false;
export function generateStaticParams() {
  return INFORMES.map((informe) => ({ informe }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ informe: string }>;
}): Promise<Metadata> {
  const { informe } = await params;
  const inf = t.informes[informe as InformeId];
  if (!inf) return {};
  return metadatosDePagina({
    titulo: `${inf.titulo} · ${t.titulo}`,
    descripcion: inf.descripcion,
    ruta: `${t.ruta}/${informe}`,
  });
}

/**
 * Un informe interactivo. El servidor pinta el título, la pregunta y un
 * resumen del corte en texto (se lee sin JavaScript y lo indexan los
 * buscadores); el shell interactivo descarga el archivo del corte y hace el
 * resto en el navegador.
 */
export default async function InformePage({ params }: { params: Promise<{ informe: string }> }) {
  const { informe } = await params;
  const id = informe as InformeId;
  const inf = t.informes[id];
  if (!inf) notFound();
  const cortes = cortesPublicados();
  const destacado = corteDestacado();
  const d = destacado ? datosDelCorte(destacado.id) : null;
  const rutas = Object.fromEntries(INFORMES.map((x) => [x, `${t.ruta}/${x}`])) as Record<InformeId, string>;

  let resumen: string | null = null;
  if (d) {
    if (id === "panorama-financiero") {
      const l = lector(d.panorama);
      const v = (k: string) => l.de(d.panorama.total.v, k);
      resumen = `${d.corte.etiqueta}: ${d.panorama.entidades.length.toLocaleString("es-CO")} entidades. Activo total ${pesos(v("activo"))} (${porcentaje(v("crecimiento_activo"))} en un año), cartera de créditos ${pesos(v("cartera_creditos"))} (${porcentaje(v("crecimiento_cartera"))}), ICM ${porcentaje(v("icm"))}, liquidez ${porcentaje(v("liquidez"))}, ROE simple ${porcentaje(v("roe_simple"))}.`;
    } else {
      const e = d.cartera.estadisticas;
      resumen = `${d.corte.etiqueta}: ${e.entidades} cooperativas de ahorro y crédito y asociaciones mutuales con cartera. ICM ponderado ${porcentaje(e.icm_ponderado)}; promedio entre entidades ${porcentaje(e.icm_promedio)} y mediana ${porcentaje(e.icm_mediana)}.`;
    }
  }

  return (
    <main id="contenido" tabIndex={-1} className="relative flex-1 overflow-x-clip bg-neutral-50 outline-none">
      <div className="bg-neutral-0">
        <div className="container-wide pt-4 md:pt-6">
          <Migas
            items={[
              { nombre: paginas.inteligencia.titulo, href: t.ruta },
              { nombre: inf.titulo, href: `${t.ruta}/${id}` },
            ]}
          />
        </div>
        <header className="container-wide flex flex-col gap-3 pb-8 pt-6 md:pb-10 md:pt-8">
          <p className="flex items-center gap-3 text-label uppercase text-purple-700">
            <span aria-hidden="true" className="h-px w-6 bg-purple-500" />
            {t.titulo}
          </p>
          <h1 className="text-h1-sm text-neutral-950 md:text-h1">{inf.titulo}</h1>
          <p className="measure text-body text-neutral-700">{inf.pregunta}</p>
          {resumen ? <p className="measure text-small text-neutral-700">{resumen}</p> : null}
        </header>
      </div>
      <div className="container-wide py-6 md:py-8">
        {destacado ? (
          <Suspense fallback={<p className="text-small text-neutral-700">{t.cargando}</p>}>
            <InformeInteractivo
              informe={id}
              cortes={cortes.map((c) => ({ id: c.id, etiqueta: c.etiqueta, estado: c.estado, url: c.url }))}
              corteInicial={destacado.id}
              rutas={rutas}
            />
          </Suspense>
        ) : (
          <p className="text-body-sm text-neutral-700">{t.sinDatos}</p>
        )}
      </div>
    </main>
  );
}

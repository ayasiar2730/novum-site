"use client";

import { useMemo } from "react";
import { inteligencia } from "@/content/inteligencia";
import type { EntidadCarteraPublica, ZonaRiesgo } from "@/lib/inteligencia/contrato";
import {
  composicionMora,
  estadisticas,
  mediana,
  filtrar,
  fronteras,
  histograma,
  pares,
  percentil,
  porDepartamento,
  rankPorCartera,
  resumen,
  senales,
  terciles,
  ZONAS,
  type FiltrosCartera,
} from "@/lib/inteligencia/cartera";
import { entero, nombreLegible, pesos, porcentaje, puntos } from "@/lib/inteligencia/formato";
import { segmentoDeTipo } from "@/lib/inteligencia/tipos";
import { BarrasH, Composicion, Dispersion, Histograma, Kpi, type FilaBarra } from "../graficos";
import type { ContextoSeccion } from "../InformeInteractivo";
import { Bloque, Nota } from "../piezas";
import { Tabla, type Columna } from "../Tabla";

/**
 * «Cartera y riesgo»: el informe original del sector (Resumen ejecutivo, Vista
 * sector, Posicionamiento, Análisis de mora, Benchmarking de pares y
 * Recomendaciones), con los datos del motor (regla `historico-marzo-2026`).
 * El ICM, μ, σ y la zona de cada entidad llegan en el archivo; las lecturas de
 * grupo (sumas, mediana, percentiles, pares) son las mismas de SIAR.
 */

const ZONA_CLASE: Record<ZonaRiesgo, { barra: string; punto: string }> = {
  Bajo: { barra: "bg-green-300", punto: "fill-green-300" },
  Moderado: { barra: "bg-neutral-300", punto: "fill-neutral-300" },
  Elevado: { barra: "bg-purple-500", punto: "fill-purple-500" },
  Alto: { barra: "bg-purple-900", punto: "fill-purple-900" },
};
const CATEGORIA_CLASE = {
  B: "bg-purple-100",
  C: "bg-purple-500",
  D: "bg-purple-700",
  E: "bg-purple-900",
} as const;

function useCartera(ctx: ContextoSeccion) {
  const c = ctx.datos.cartera;
  const segmento = segmentoDeTipo(ctx.estado.tipo);
  const departamento = ctx.estado.departamento;
  const filtros: FiltrosCartera = { segmento, departamento };
  const ents = useMemo(() => filtrar(c, filtros), [c, segmento, departamento]); // eslint-disable-line react-hooks/exhaustive-deps
  const r = useMemo(() => resumen(ents), [ents]);
  const entidad = ctx.estado.entidad
    ? (c.entidades.find((e) => e.codigo === ctx.estado.entidad) ?? null)
    : null;
  const mu = c.estadisticas.icm_promedio;
  const sigma = c.estadisticas.icm_desv;
  const etiquetaGrupo = [segmento ? inteligencia.filtros.segmentos[segmento] : "Consolidado", departamento]
    .filter(Boolean)
    .join(" · ");
  return {
    c,
    ents,
    r,
    entidad,
    mu,
    sigma,
    fr: fronteras(mu, sigma),
    etiquetaGrupo,
    propia: !!ctx.entidadPropia && entidad?.codigo === ctx.entidadPropia,
    fueraDelGrupo: !!entidad && !ents.some((e) => e.codigo === entidad.codigo),
    corte: ctx.datos.corte,
    cambiar: ctx.cambiar,
  };
}
type LecturaCartera = ReturnType<typeof useCartera>;

export function SeccionesCartera({ seccion, ctx }: { seccion: string; ctx: ContextoSeccion }) {
  const lec = useCartera(ctx);
  if (!lec.ents.length) return <Nota>{inteligencia.vacios.grupo}</Nota>;
  switch (seccion) {
    case "sector":
      return <VistaSector lec={lec} />;
    case "posicionamiento":
      return <Posicionamiento lec={lec} />;
    case "mora":
      return <Mora lec={lec} />;
    case "pares":
      return <Benchmarking lec={lec} />;
    case "recomendaciones":
      return <Recomendaciones lec={lec} />;
    default:
      return <Resumen lec={lec} />;
  }
}

const nombreDe = (e: EntidadCarteraPublica, max = 40) => e.sigla ?? nombreLegible(e.nombre, max);

function Encabezado({ lec }: { lec: LecturaCartera }) {
  return (
    <p className="text-body-sm text-neutral-700">
      <span className="font-semibold text-neutral-950">{lec.etiquetaGrupo}</span> · {lec.r.entidades}{" "}
      entidades con cartera · {lec.corte.etiqueta} · μ del ICM {porcentaje(lec.mu)}, σ{" "}
      {puntos(lec.sigma).replace("+", "")}
    </p>
  );
}

function AvisoFuera({ lec }: { lec: LecturaCartera }) {
  if (!lec.fueraDelGrupo || !lec.entidad) return null;
  return (
    <Nota>{`${nombreDe(lec.entidad)} no está en el grupo filtrado (${lec.etiquetaGrupo}): se muestra su ficha, pero no aparece en las gráficas del grupo.`}</Nota>
  );
}

/** La barra de zonas con las fronteras donde de verdad caen (no repartidas). */
function BarraZonas({ lec, icm }: { lec: LecturaCartera; icm: number | null }) {
  const fr = lec.fr;
  if (!fr) return null;
  const max = Math.max(fr[2] + (lec.sigma ?? 0), (icm ?? 0) * 1.1);
  const pos = (v: number) => `${Math.min((v / max) * 100, 100)}%`;
  const tramos: [ZonaRiesgo, number, number][] = [
    ["Bajo", 0, fr[0]],
    ["Moderado", fr[0], fr[1]],
    ["Elevado", fr[1], fr[2]],
    ["Alto", fr[2], max],
  ];
  return (
    <figure className="flex flex-col gap-2">
      <div className="relative h-4 w-full overflow-hidden rounded-sm" aria-hidden="true">
        {tramos.map(([z, a, b]) => (
          <span
            key={z}
            className={`absolute inset-y-0 ${ZONA_CLASE[z].barra}`}
            style={{ left: pos(a), width: `calc(${pos(b)} - ${pos(a)})` }}
          />
        ))}
      </div>
      <div className="relative h-5 text-[0.6875rem] text-neutral-700 md:text-small" aria-hidden="true">
        {fr.map((v, i) => (
          <span key={i} className="tnum absolute -translate-x-1/2 whitespace-nowrap" style={{ left: pos(v) }}>
            {porcentaje(v, 1)}
          </span>
        ))}
      </div>
      {icm !== null ? (
        <div className="relative h-6" aria-hidden="true">
          <span
            className="absolute top-0 flex -translate-x-1/2 flex-col items-center"
            style={{ left: pos(icm) }}
          >
            <span className="h-2 w-0.5 bg-neutral-950" />
            <span className="tnum whitespace-nowrap text-small font-semibold text-neutral-950">
              {porcentaje(icm)}
            </span>
          </span>
        </div>
      ) : null}
      <figcaption className="sr-only">
        Zonas: Bajo por debajo de {porcentaje(fr[0])}, Moderado hasta {porcentaje(fr[1])}, Elevado hasta{" "}
        {porcentaje(fr[2])}, Alto desde {porcentaje(fr[2])}.
        {icm !== null ? ` ICM de la entidad: ${porcentaje(icm)}.` : ""}
      </figcaption>
      <ul className="flex flex-wrap gap-x-4 gap-y-1">
        {ZONAS.map((z) => (
          <li key={z} className="flex items-center gap-2 text-small text-neutral-700">
            <span aria-hidden="true" className={`inline-block size-3 rounded-sm ${ZONA_CLASE[z].barra}`} />
            {z}
          </li>
        ))}
      </ul>
    </figure>
  );
}

function FichaEntidad({ lec }: { lec: LecturaCartera }) {
  const e = lec.entidad;
  if (!e) return null;
  const todos = lec.c.entidades;
  const f = inteligencia.filtros;
  return (
    <section
      aria-label={`${lec.propia ? f.miEntidad : f.entidad}: ${nombreDe(e)}`}
      className="flex flex-col gap-4 rounded-lg border border-green-500/40 bg-green-100/50 p-4 md:p-5"
    >
      <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-label uppercase text-green-700">{lec.propia ? f.miEntidad : f.entidad}</span>
        <span className="text-body-sm font-semibold text-neutral-950">{nombreDe(e)}</span>
        <span className="text-small text-neutral-700">
          {nombreLegible(e.nombre)} · {f.segmentos[e.segmento]}
          {e.departamento ? ` · ${e.departamento}` : ""}
        </span>
      </p>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Kpi
          acento
          etiqueta="Cartera total"
          valor={pesos(e.cartera_total)}
          contexto={`Puesto ${rankPorCartera(todos, e)} de ${todos.length}`}
        />
        <Kpi
          acento
          etiqueta="ICM"
          valor={porcentaje(e.icm)}
          contexto={e.icm !== null && lec.mu !== null ? `${puntos(e.icm - lec.mu)} frente a μ` : undefined}
        />
        <Kpi acento etiqueta="Zona" valor={e.riesgo ?? "—"} contexto="Por μ y σ del corte" />
        <Kpi acento etiqueta="ICV (C a E)" valor={porcentaje(e.icv)} />
        <Kpi acento etiqueta="Categoría E / cartera" valor={porcentaje(e.cat_e_total)} />
      </div>
      <BarraZonas lec={lec} icm={e.icm} />
    </section>
  );
}

function Resumen({ lec }: { lec: LecturaCartera }) {
  const { r, ents, entidad } = lec;
  const top = [...ents].sort((a, b) => b.cartera_total - a.cartera_total).slice(0, 10);
  if (
    entidad &&
    !top.some((e) => e.codigo === entidad.codigo) &&
    ents.some((e) => e.codigo === entidad.codigo)
  )
    top.push(entidad);
  const filas: FilaBarra[] = top.map((e) => ({
    id: e.codigo,
    etiqueta: `${rankPorCartera(ents, e)}. ${nombreDe(e, 32)}`,
    detalle: nombreLegible(e.nombre),
    valor: e.cartera_total,
    texto: pesos(e.cartera_total),
    destacada: e.codigo === entidad?.codigo,
  }));
  return (
    <>
      <Encabezado lec={lec} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Kpi
          etiqueta="Entidades"
          valor={entero(r.entidades)}
          contexto={`${lec.c.entidades.filter((e) => e.segmento === "COOPERATIVAS").length} cooperativas · ${lec.c.entidades.filter((e) => e.segmento === "MUTUALES").length} mutuales en el corte`}
        />
        <Kpi etiqueta="Cartera total" valor={pesos(r.cartera)} contexto="Capital de consumo y comercial" />
        <Kpi etiqueta="Cartera en mora" valor={pesos(r.mora)} contexto="Categorías B a E" />
        <Kpi
          etiqueta="ICM del grupo"
          valor={porcentaje(r.icmPonderado)}
          contexto={`Ponderado · μ ${porcentaje(lec.mu)} · mediana ${porcentaje(r.icmMediana)}`}
        />
        <Kpi etiqueta="Asociados" valor={entero(r.asociados)} />
      </div>
      <AvisoFuera lec={lec} />
      {entidad ? <FichaEntidad lec={lec} /> : <Nota>{inteligencia.vacios.entidad}</Nota>}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.3fr_1fr]">
        <Bloque
          titulo="Ranking por tamaño de cartera"
          subtitulo="Las 10 entidades de mayor cartera total del grupo."
        >
          <BarrasH filas={filas} />
        </Bloque>
        <Bloque titulo="Entidades por zona de riesgo" subtitulo="Zonas por μ y σ del ICM del corte.">
          <Composicion
            partes={ZONAS.map((z) => ({
              etiqueta: z,
              valor: r.porZona[z],
              clase: ZONA_CLASE[z].barra,
              texto: `${r.porZona[z]} entidades`,
            }))}
            formato={(v) => entero(v)}
          />
          <BarraZonas lec={lec} icm={null} />
        </Bloque>
      </div>
    </>
  );
}

function VistaSector({ lec }: { lec: LecturaCartera }) {
  const { ents } = lec;
  const bins = histograma(ents);
  const deptos = porDepartamento(ents).slice(0, 10);
  const segmentos = (["COOPERATIVAS", "MUTUALES"] as const)
    .map((s) => ({ s, r: resumen(ents.filter((e) => e.segmento === s)) }))
    .filter((x) => x.r.entidades);
  const stats = (["icm", "icv", "cat_e_total"] as const).map((k) => ({ k, ...estadisticas(ents, k) }));
  const nombres = { icm: "ICM", icv: "ICV (C a E)", cat_e_total: "Categoría E / cartera" };
  return (
    <>
      <Encabezado lec={lec} />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Bloque titulo="Distribución del ICM" subtitulo="Número de entidades por tramo de ICM.">
          <Histograma cubos={bins.map((b) => ({ etiqueta: b.etiqueta, n: b.n }))} />
        </Bloque>
        <Bloque
          titulo="Cartera por departamento"
          subtitulo="Los 10 departamentos con más cartera; el ICM ponderado va en el detalle."
        >
          <BarrasH
            filas={deptos.map((d) => ({
              id: d.departamento,
              etiqueta: `${d.departamento} (${d.entidades})`,
              valor: d.cartera,
              texto: `${pesos(d.cartera)} · ICM ${porcentaje(d.icmPonderado)}`,
              destacada: d.departamento === lec.entidad?.departamento,
            }))}
          />
        </Bloque>
      </div>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Bloque titulo="Cooperativas frente a mutuales">
          <Tabla
            filas={segmentos}
            clave={(x) => x.s}
            titulo="ICM por segmento"
            columnas={[
              { id: "s", etiqueta: "Segmento", celda: (x) => inteligencia.filtros.segmentos[x.s] },
              { id: "n", etiqueta: "Entidades", celda: (x) => entero(x.r.entidades), numerica: true },
              { id: "c", etiqueta: "Cartera", celda: (x) => pesos(x.r.cartera), numerica: true },
              {
                id: "i",
                etiqueta: "ICM ponderado",
                celda: (x) => porcentaje(x.r.icmPonderado),
                numerica: true,
              },
              { id: "m", etiqueta: "Mediana", celda: (x) => porcentaje(x.r.icmMediana), numerica: true },
            ]}
          />
        </Bloque>
        <Bloque titulo="Estadísticas del grupo" subtitulo="Entre entidades: cada entidad cuenta una vez.">
          <Tabla
            filas={stats}
            clave={(x) => x.k}
            titulo="Estadísticas del grupo"
            columnas={[
              { id: "k", etiqueta: "Indicador", celda: (x) => nombres[x.k] },
              { id: "p", etiqueta: "Promedio", celda: (x) => porcentaje(x.promedio), numerica: true },
              { id: "m", etiqueta: "Mediana", celda: (x) => porcentaje(x.mediana), numerica: true },
              { id: "a", etiqueta: "Mínimo", celda: (x) => porcentaje(x.minimo), numerica: true },
              { id: "b", etiqueta: "Máximo", celda: (x) => porcentaje(x.maximo), numerica: true },
            ]}
          />
        </Bloque>
      </div>
    </>
  );
}

function columnasEntidad(): Columna<EntidadCarteraPublica>[] {
  return [
    {
      id: "entidad",
      etiqueta: "Entidad",
      valor: (e) => nombreDe(e),
      celda: (e) => (
        <span className="flex min-w-0 flex-col">
          <span className="truncate font-semibold text-neutral-950" title={e.nombre}>
            {nombreDe(e)}
          </span>
          {e.sigla ? <span className="truncate text-neutral-700">{nombreLegible(e.nombre, 44)}</span> : null}
        </span>
      ),
    },
    {
      id: "seg",
      etiqueta: "Segmento",
      valor: (e) => e.segmento,
      celda: (e) => (e.segmento === "COOPERATIVAS" ? "Cooperativa" : "Mutual"),
      secundaria: true,
    },
    {
      id: "depto",
      etiqueta: "Departamento",
      valor: (e) => e.departamento,
      celda: (e) => e.departamento ?? "—",
      secundaria: true,
    },
    {
      id: "cartera",
      etiqueta: "Cartera total",
      valor: (e) => e.cartera_total,
      celda: (e) => pesos(e.cartera_total),
      numerica: true,
    },
    { id: "icm", etiqueta: "ICM", valor: (e) => e.icm, celda: (e) => porcentaje(e.icm), numerica: true },
    { id: "icv", etiqueta: "ICV", valor: (e) => e.icv, celda: (e) => porcentaje(e.icv), numerica: true },
    {
      id: "zona",
      etiqueta: "Zona",
      valor: (e) => (e.riesgo ? ZONAS.indexOf(e.riesgo) : null),
      celda: (e) =>
        e.riesgo ? (
          <span className="inline-flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className={`inline-block size-2.5 rounded-sm ${ZONA_CLASE[e.riesgo].barra}`}
            />
            {e.riesgo}
          </span>
        ) : (
          "—"
        ),
    },
  ];
}

function Posicionamiento({ lec }: { lec: LecturaCartera }) {
  const { ents, entidad } = lec;
  const carteras = ents.map((e) => e.cartera_total);
  const icms = ents.map((e) => e.icm).filter((v): v is number => v !== null);
  const pTam = entidad ? percentil(carteras, entidad.cartera_total) : null;
  const pMora = entidad && entidad.icm !== null ? percentil(icms, entidad.icm) : null;
  return (
    <>
      <Encabezado lec={lec} />
      <AvisoFuera lec={lec} />
      {entidad ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi
            acento
            etiqueta="Posición por tamaño"
            valor={pTam !== null ? `Top ${Math.max(Math.round(100 - pTam), 1)} %` : "—"}
            contexto={`${nombreDe(entidad)} · ${pesos(entidad.cartera_total)}`}
          />
          <Kpi
            acento
            etiqueta="Posición por mora"
            valor={pMora !== null ? `Mejor que ${Math.round(100 - pMora)} %` : "—"}
            contexto="Entidades con más ICM que la suya"
          />
          <Kpi
            acento
            etiqueta="ICM frente al promedio"
            valor={entidad.icm !== null && lec.mu !== null ? puntos(entidad.icm - lec.mu) : "—"}
            contexto={`ICM ${porcentaje(entidad.icm)} · μ ${porcentaje(lec.mu)}`}
          />
          <Kpi acento etiqueta="Zona" valor={entidad.riesgo ?? "—"} />
        </div>
      ) : (
        <Nota>{inteligencia.vacios.entidad}</Nota>
      )}
      <Bloque
        titulo="Cartera frente a ICM"
        subtitulo="Cada punto es una entidad, coloreada por su zona. Eje de cartera en escala logarítmica. La línea punteada es μ."
      >
        <Dispersion
          puntos={ents
            .filter((e) => e.icm !== null)
            .map((e) => ({
              id: e.codigo,
              x: e.cartera_total,
              y: e.icm as number,
              etiqueta: nombreDe(e, 28),
              clase: e.riesgo ? ZONA_CLASE[e.riesgo].punto : "fill-neutral-500",
              destacado: e.codigo === entidad?.codigo,
            }))}
          referenciaY={lec.mu}
          etiquetaReferencia={`μ del ICM: ${porcentaje(lec.mu)}`}
          formatoX={(v) => pesos(v).replace(",0 ", " ")}
          formatoY={(v) => porcentaje(v, 1)}
          tituloX="Cartera total"
          tituloY="ICM"
          techoY={lec.mu !== null && lec.sigma !== null ? lec.mu + 4 * lec.sigma : null}
          leyenda={ZONAS.map((z) => ({ etiqueta: z, clase: ZONA_CLASE[z].barra }))}
        />
      </Bloque>
      <Bloque titulo="Tabla de posicionamiento" subtitulo="Ordene por cualquier columna.">
        <Tabla
          filas={ents}
          columnas={columnasEntidad()}
          clave={(e) => e.codigo}
          destacada={entidad?.codigo}
          ordenInicial={{ id: "cartera", sentido: "desc" }}
          titulo="Posicionamiento por entidad"
        />
      </Bloque>
    </>
  );
}

function Mora({ lec }: { lec: LecturaCartera }) {
  const { ents, entidad } = lec;
  const comp = composicionMora(ents);
  const peores = [...ents]
    .filter((e) => e.icm !== null)
    .sort((a, b) => (b.icm as number) - (a.icm as number))
    .slice(0, 10);
  const topE = [...ents]
    .filter((e) => (e.cat_e ?? 0) > 0)
    .sort((a, b) => (b.cat_e ?? 0) - (a.cat_e ?? 0))
    .slice(0, 10);
  return (
    <>
      <Encabezado lec={lec} />
      <AvisoFuera lec={lec} />
      <Bloque
        titulo="Cartera en mora por categoría"
        subtitulo={`ICM del grupo ${porcentaje(lec.r.icmPonderado)}: capital, intereses y pagos por cuenta en categorías B a E.`}
      >
        <Composicion
          partes={comp.map((x) => ({
            etiqueta: `Categoría ${x.categoria}`,
            valor: x.valor,
            clase: CATEGORIA_CLASE[x.categoria],
          }))}
          formato={pesos}
        />
      </Bloque>
      {entidad ? <FichaEntidad lec={lec} /> : null}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Bloque titulo="Mayor ICM del grupo" subtitulo="Las 10 entidades con el ICM más alto. La línea es μ.">
          <BarrasH
            filas={peores.map((e) => ({
              id: e.codigo,
              etiqueta: nombreDe(e, 32),
              detalle: nombreLegible(e.nombre),
              valor: e.icm,
              texto: porcentaje(e.icm),
              destacada: e.codigo === entidad?.codigo,
            }))}
            referencia={lec.mu}
            etiquetaReferencia={`μ: ${porcentaje(lec.mu)}`}
          />
        </Bloque>
        <Bloque
          titulo="Mayor cartera en categoría E"
          subtitulo="Las 10 entidades con más saldo en riesgo de incobrabilidad."
        >
          <BarrasH
            filas={topE.map((e) => ({
              id: e.codigo,
              etiqueta: nombreDe(e, 32),
              detalle: nombreLegible(e.nombre),
              valor: e.cat_e,
              texto: `${pesos(e.cat_e)} · ${porcentaje(e.cat_e_total)}`,
              destacada: e.codigo === entidad?.codigo,
            }))}
          />
        </Bloque>
      </div>
      <Bloque
        titulo="Calificación de la cartera por entidad"
        subtitulo="Saldos en categorías B a E. Ordene por cualquier columna."
      >
        <Tabla
          filas={ents}
          clave={(e) => e.codigo}
          destacada={entidad?.codigo}
          ordenInicial={{ id: "icm", sentido: "desc" }}
          titulo="Calificación de la cartera por entidad"
          columnas={[
            columnasEntidad()[0],
            {
              id: "b",
              etiqueta: "Categoría B",
              valor: (e) => e.cat_b,
              celda: (e) => pesos(e.cat_b),
              numerica: true,
            },
            {
              id: "c",
              etiqueta: "Categoría C",
              valor: (e) => e.cat_c,
              celda: (e) => pesos(e.cat_c),
              numerica: true,
            },
            {
              id: "d",
              etiqueta: "Categoría D",
              valor: (e) => e.cat_d,
              celda: (e) => pesos(e.cat_d),
              numerica: true,
            },
            {
              id: "e",
              etiqueta: "Categoría E",
              valor: (e) => e.cat_e,
              celda: (e) => pesos(e.cat_e),
              numerica: true,
            },
            {
              id: "icm",
              etiqueta: "ICM",
              valor: (e) => e.icm,
              celda: (e) => porcentaje(e.icm),
              numerica: true,
            },
          ]}
        />
      </Bloque>
    </>
  );
}

function Benchmarking({ lec }: { lec: LecturaCartera }) {
  const { entidad } = lec;
  if (!entidad) {
    const t = terciles(lec.ents);
    return (
      <>
        <Encabezado lec={lec} />
        <Nota>
          Busque una entidad en los filtros para compararla con sus pares: mismo segmento y una cartera entre
          el 40 % y el 160 % de la suya.
        </Nota>
        <Bloque
          titulo="El grupo por tamaño de cartera"
          subtitulo="Sin entidad elegida, la comparación es entre tercios de tamaño."
        >
          <Tabla
            filas={t}
            clave={(x) => x.nombre}
            titulo="Grupos por tamaño"
            columnas={[
              { id: "g", etiqueta: "Grupo", celda: (x) => x.nombre },
              { id: "n", etiqueta: "Entidades", celda: (x) => entero(x.entidades), numerica: true },
              {
                id: "r",
                etiqueta: "Cartera",
                celda: (x) => `${pesos(x.desde)} – ${pesos(x.hasta)}`,
                numerica: true,
              },
              {
                id: "i",
                etiqueta: "ICM ponderado",
                celda: (x) => porcentaje(x.icmPonderado),
                numerica: true,
              },
            ]}
          />
        </Bloque>
      </>
    );
  }
  const ps = pares(lec.c.entidades, entidad);
  const icmsPares = ps.map((p) => p.icm).filter((v): v is number => v !== null);
  const med = mediana(icmsPares);
  const mejores =
    entidad.icm !== null ? ps.filter((p) => p.icm !== null && p.icm < (entidad.icm as number)).length : 0;
  const filas: FilaBarra[] = [entidad, ...ps]
    .filter((e) => e.icm !== null)
    .sort((a, b) => (a.icm as number) - (b.icm as number))
    .map((e) => ({
      id: e.codigo,
      etiqueta: nombreDe(e, 32),
      detalle: nombreLegible(e.nombre),
      valor: e.icm,
      texto: porcentaje(e.icm),
      destacada: e.codigo === entidad.codigo,
    }));
  return (
    <>
      <Encabezado lec={lec} />
      <Nota>{`Pares de ${nombreDe(entidad)}: ${inteligencia.filtros.segmentos[entidad.segmento].toLowerCase()} con una cartera entre ${pesos(entidad.cartera_total * 0.4)} y ${pesos(entidad.cartera_total * 1.6)} (40 % a 160 % de la suya). Es la banda del informe original.`}</Nota>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi acento etiqueta="Pares comparables" valor={entero(ps.length)} />
        <Kpi
          acento
          etiqueta="ICM de la entidad"
          valor={porcentaje(entidad.icm)}
          contexto={entidad.riesgo ? `Zona ${entidad.riesgo}` : undefined}
        />
        <Kpi
          acento
          etiqueta="Mediana de los pares"
          valor={porcentaje(med)}
          contexto={
            med !== null && entidad.icm !== null
              ? `${puntos(entidad.icm - med)} la entidad frente a la mediana`
              : undefined
          }
        />
        <Kpi acento etiqueta="Pares con menor ICM" valor={`${mejores} de ${ps.length}`} />
      </div>
      {ps.length === 0 ? (
        <Nota>{inteligencia.vacios.sinPares}</Nota>
      ) : (
        <>
          <Bloque
            titulo="ICM de la entidad y sus pares"
            subtitulo="De menor a mayor ICM. La línea es la mediana de los pares."
          >
            <BarrasH
              filas={filas}
              referencia={med}
              etiquetaReferencia={`Mediana de los pares: ${porcentaje(med)}`}
            />
          </Bloque>
          <Bloque titulo="Pares comparables">
            <Tabla
              filas={ps}
              clave={(e) => e.codigo}
              titulo="Pares comparables"
              ordenInicial={{ id: "cartera", sentido: "desc" }}
              columnas={[
                ...columnasEntidad().filter((c) =>
                  ["entidad", "depto", "cartera", "icm", "zona"].includes(c.id),
                ),
                {
                  id: "dif",
                  etiqueta: "ICM frente a la entidad",
                  valor: (e) => (e.icm !== null && entidad.icm !== null ? e.icm - entidad.icm : null),
                  celda: (e) => (e.icm !== null && entidad.icm !== null ? puntos(e.icm - entidad.icm) : "—"),
                  numerica: true,
                },
              ]}
            />
          </Bloque>
        </>
      )}
    </>
  );
}

function Recomendaciones({ lec }: { lec: LecturaCartera }) {
  const s = senales(lec.ents, lec.c, (v) => porcentaje(v));
  const e = lec.entidad;
  return (
    <>
      <Encabezado lec={lec} />
      <Bloque
        titulo={`Señales del corte · ${lec.etiquetaGrupo}`}
        subtitulo="Hechos del grupo con su cifra. Qué hacer con cada uno depende de la entidad: son puntos de partida para una revisión, no juicios."
      >
        <ol className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {s.map((x, i) => (
            <li key={x.id} className="flex gap-3 border-t border-neutral-100 pt-4">
              <span aria-hidden="true" className="tnum text-label text-purple-700">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex flex-col gap-1">
                <span className="text-body-sm font-semibold text-neutral-950">{x.titulo}</span>
                <span className="text-small text-neutral-700">{x.texto}</span>
              </span>
            </li>
          ))}
        </ol>
      </Bloque>
      {e ? <LecturaEntidad lec={lec} /> : <Nota>{inteligencia.vacios.entidad}</Nota>}
    </>
  );
}

/** Lectura de la entidad elegida: reglas fijas del informe original, con su cifra y sin lenguaje absoluto. */
function LecturaEntidad({ lec }: { lec: LecturaCartera }) {
  const e = lec.entidad as EntidadCarteraPublica;
  const todos = lec.c.entidades;
  const mu = lec.mu;
  const fortalezas: string[] = [];
  const atencion: string[] = [];
  const rank = rankPorCartera(todos, e);
  if (rank <= Math.ceil(todos.length / 2))
    fortalezas.push(`Está en la mitad de mayor cartera del corte (puesto ${rank} de ${todos.length}).`);
  if (e.icm !== null && mu !== null && e.icm < mu)
    fortalezas.push(
      `Su ICM (${porcentaje(e.icm)}) está ${puntos(mu - e.icm).replace("+", "")} por debajo del promedio del corte (${porcentaje(mu)}).`,
    );
  if (e.icm !== null && 1 - e.icm >= 0.85)
    fortalezas.push(
      `El ${porcentaje(1 - e.icm, 1)} de su cartera total está fuera de mora (fuera de las categorías B a E).`,
    );
  if (e.icm !== null && mu !== null && e.icm >= mu)
    atencion.push(
      `Su ICM (${porcentaje(e.icm)}) está ${puntos(e.icm - mu).replace("+", "")} por encima del promedio del corte; su zona es ${e.riesgo ?? "—"}.`,
    );
  if (e.cat_e_total !== null && e.cat_e_total > 0.03)
    atencion.push(`La categoría E pesa ${porcentaje(e.cat_e_total)} de su cartera total (más del 3 %).`);
  const promedioIcv = todos.map((x) => x.icv).filter((v): v is number => v !== null);
  const muIcv = promedioIcv.length ? promedioIcv.reduce((a, b) => a + b, 0) / promedioIcv.length : null;
  if (e.icv !== null && muIcv !== null && e.icv > muIcv)
    atencion.push(`Su ICV (C a E) es ${porcentaje(e.icv)}, por encima del promedio de ${porcentaje(muIcv)}.`);
  const referentes = pares(todos, e)
    .filter((p) => p.icm !== null && e.icm !== null && p.icm < e.icm)
    .slice(0, 3);
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      <Bloque titulo="Fortalezas" subtitulo={nombreDe(e)}>
        {fortalezas.length ? (
          <ul className="flex list-disc flex-col gap-2 pl-5 text-small text-neutral-900">
            {fortalezas.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        ) : (
          <p className="text-small text-neutral-700">
            Con las reglas del informe no aparece una fortaleza destacada en este corte.
          </p>
        )}
      </Bloque>
      <Bloque titulo="Áreas de atención" subtitulo={nombreDe(e)}>
        {atencion.length ? (
          <ul className="flex list-disc flex-col gap-2 pl-5 text-small text-neutral-900">
            {atencion.map((x) => (
              <li key={x}>{x}</li>
            ))}
            {referentes.length ? (
              <li>{`Pares comparables con menor ICM, como referencia: ${referentes.map((p) => `${nombreDe(p, 28)} (${porcentaje(p.icm)})`).join(", ")}.`}</li>
            ) : null}
          </ul>
        ) : (
          <p className="text-small text-neutral-700">
            Con las reglas del informe no aparece un área de atención en este corte.
          </p>
        )}
      </Bloque>
    </div>
  );
}

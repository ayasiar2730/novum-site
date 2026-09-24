import type { ReactNode } from "react";
import { sector } from "@/content/sector";
import type { SectorSnapshotV2 } from "@/lib/sector/types";
import {
  CAPITULOS,
  selectDimension,
  selectEstructura,
  selectEvolucion,
  selectHallazgos,
  selectMetodologia,
  selectPortada,
  selectRiesgo,
} from "@/lib/sector/selectV2";
import { Bar } from "@/components/sector/charts/Bar";
import { BandaDistribucion } from "@/components/sector/charts/BandaDistribucion";
import { Capitulo, Rotulo } from "@/components/sector/informe/Capitulo";
import { Metodologia } from "@/components/sector/informe/Metodologia";

const t = sector.informe;

/**
 * El Observatorio Novum con un snapshot v2: portada editorial, resumen
 * ejecutivo, capítulos (dimensión, riesgo, estructura y —solo con datos—
 * evolución) y metodología. Publicación analítica, no dashboard: una cifra
 * dominante por capítulo, barras y bandas simples, mucho aire. Todo lo que se
 * muestra viene del snapshot ya calculado y ya redactado.
 */
export function Informe({
  snapshot,
  titleId,
  nivel = 2,
  acciones,
}: {
  snapshot: SectorSnapshotV2;
  titleId: string;
  /** 1 en la página del informe (fase 2): la portada es el h1 de la página. */
  nivel?: 1 | 2;
  /** Acciones de la portada (p. ej. descargar el PDF). */
  acciones?: ReactNode;
}) {
  const Titulo = nivel === 1 ? "h1" : "h2";
  // Los niveles internos siguen a la portada: sin saltos de h1 a h3.
  const nivelCapitulo = nivel === 1 ? 2 : 3;
  const Seccion = nivel === 1 ? "h2" : "h3";
  const Hallazgo = nivel === 1 ? "h3" : "h4";
  const portada = selectPortada(snapshot);
  const hallazgos = selectHallazgos(snapshot);
  const dimension = selectDimension(snapshot);
  const riesgo = selectRiesgo(snapshot);
  const estructura = selectEstructura(snapshot);
  const evolucion = selectEvolucion(snapshot);
  const metodologia = selectMetodologia(snapshot);

  const indice = [
    { href: "#informe-resumen", etiqueta: t.resumenLabel },
    ...(dimension.principal
      ? [
          {
            href: "#informe-dimension",
            etiqueta: `${CAPITULOS.dimension.numero} · ${CAPITULOS.dimension.etiqueta}`,
          },
        ]
      : []),
    ...(riesgo.principal
      ? [{ href: "#informe-riesgo", etiqueta: `${CAPITULOS.riesgo.numero} · ${CAPITULOS.riesgo.etiqueta}` }]
      : []),
    ...(estructura.length
      ? [
          {
            href: "#informe-estructura",
            etiqueta: `${CAPITULOS.estructura.numero} · ${CAPITULOS.estructura.etiqueta}`,
          },
        ]
      : []),
    ...(evolucion
      ? [
          {
            href: "#informe-evolucion",
            etiqueta: `${CAPITULOS.evolucion.numero} · ${CAPITULOS.evolucion.etiqueta}`,
          },
        ]
      : []),
    { href: "#informe-metodologia", etiqueta: t.metodologia.label },
  ];

  return (
    <div className="flex flex-col gap-20 lg:gap-24">
      {/* ── Portada: cabecera editorial con los metadatos integrados ── */}
      <header className="grid gap-10 lg:grid-cols-12 lg:gap-8" data-reveal>
        <div className="flex flex-col gap-5 lg:col-span-7">
          <p className="flex items-center gap-3 text-label uppercase text-purple-700">
            <span aria-hidden="true" className="h-px w-6 bg-purple-500" />
            {sector.eyebrow}
          </p>
          <Titulo id={titleId} className="text-h1-sm md:text-display-md text-neutral-950">
            {t.titulo}
            <span className="block text-purple-700">
              {t.cortePrefijo}: {portada.corteEtiqueta}
            </span>
          </Titulo>
          <p className="text-body max-w-[34rem] text-neutral-700">{sector.intro}</p>
          {acciones ? <div className="mt-2">{acciones}</div> : null}
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 text-small lg:col-span-4 lg:col-start-9 lg:self-end">
          <div>
            <dt className="text-label uppercase text-neutral-700">Entidades analizadas</dt>
            <dd className="tnum mt-1 text-h3 text-neutral-950">
              {portada.nUniverso}
              <span className="text-small font-normal text-neutral-700">
                {" "}
                de {portada.nReportantes} reportantes
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-label uppercase text-neutral-700">{t.metodologia.fechaCorteLabel}</dt>
            <dd className="mt-1 text-body text-neutral-950">
              <time dateTime={portada.fechaCorteIso}>{portada.fechaCorte}</time>
            </dd>
          </div>
          <div>
            <dt className="text-label uppercase text-neutral-700">Estado del corte</dt>
            <dd className="mt-1 flex items-center gap-2 text-body text-neutral-950">
              <span
                aria-hidden="true"
                className={`h-2.5 w-2.5 rounded-sm border-[1.5px] ${
                  portada.estado === "completo"
                    ? "border-purple-700 bg-purple-500"
                    : "border-purple-500 bg-neutral-0"
                }`}
              />
              {portada.estadoEtiqueta}
            </dd>
          </div>
          <div>
            <dt className="text-label uppercase text-neutral-700">{t.metodologia.fuenteDatosLabel}</dt>
            <dd className="mt-1 text-body text-neutral-950">{portada.fuenteDatos}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-label uppercase text-neutral-700">Cobertura</dt>
            <dd className="mt-1 text-small text-neutral-700">{portada.cobertura}</dd>
          </div>
        </dl>
      </header>

      <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
        {/* ── Índice del informe ── */}
        <nav aria-label={t.indiceLabel} className="lg:col-span-3" data-reveal>
          <div className="lg:sticky lg:top-28">
            <Rotulo>{t.indiceLabel}</Rotulo>
            <ol className="mt-4 flex flex-wrap gap-x-5 gap-y-2 lg:flex-col lg:gap-y-3">
              {indice.map((i) => (
                <li key={i.href}>
                  <a
                    href={i.href}
                    className="text-small text-neutral-700 transition-colors duration-200 hover:text-purple-900"
                  >
                    {i.etiqueta}
                  </a>
                </li>
              ))}
            </ol>
            {portada.modo === "foto" ? (
              <p className="mt-8 hidden border-l-2 border-purple-500 pl-4 text-small text-neutral-700 lg:block">
                <span className="block text-label uppercase text-purple-700">{t.fotoLabel}</span>
                <span className="mt-2 block">{t.fotoNota}</span>
              </p>
            ) : null}
          </div>
        </nav>

        <div className="flex min-w-0 flex-col gap-20 lg:col-span-8 lg:col-start-5 lg:gap-24">
          {/* ── Resumen ejecutivo ── */}
          <section
            id="informe-resumen"
            className="scroll-mt-28"
            aria-labelledby="informe-resumen-title"
            data-reveal
          >
            <Rotulo>{t.resumenLabel}</Rotulo>
            <Seccion id="informe-resumen-title" className="sr-only">
              {t.resumenLabel}
            </Seccion>
            <p className="mt-3 text-body max-w-[34rem] text-neutral-700">{t.resumenIntro}</p>
            <ol className="mt-10 flex flex-col gap-12">
              {hallazgos.map((h) => (
                <li key={h.id} className="grid gap-5 md:grid-cols-12 md:gap-8">
                  <div className="md:col-span-5">
                    <p className="flex items-center gap-2 text-label uppercase text-neutral-700">
                      <span aria-hidden="true" className="h-2 w-2 rounded-full bg-green-500" />
                      {h.clasificacionEtiqueta}
                    </p>
                    <p className="tnum mt-3 text-display-sm text-neutral-950 md:text-display-md">
                      {h.cifra.valor}
                      <span className="ml-2 text-h3-sm font-medium text-neutral-700">{h.cifra.unidad}</span>
                    </p>
                    <p className="mt-1 text-small text-neutral-700">
                      {h.cifra.etiqueta} · <span className="text-neutral-500">{t.datoLabel}</span>
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 md:col-span-7">
                    <Hallazgo className="text-h3-sm md:text-h3 text-neutral-950">{h.titulo}</Hallazgo>
                    <div className="border-l-2 border-purple-500 pl-4">
                      <p className="text-label uppercase text-purple-700">{t.lecturaLabel}</p>
                      <p className="mt-2 text-body text-neutral-900">{h.lectura}</p>
                    </div>
                    <p className="text-small text-neutral-700">
                      {h.universo} ·{" "}
                      <a
                        href={`#informe-${h.capitulo}`}
                        className="text-purple-700 underline-offset-4 transition-colors duration-200 hover:text-purple-900 hover:underline"
                      >
                        {t.verCapitulo} {h.capituloEtiqueta}
                      </a>
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* ── 01 Dimensión ── */}
          {dimension.principal ? (
            <Capitulo
              nivel={nivelCapitulo}
              id="informe-dimension"
              numero={CAPITULOS.dimension.numero}
              titulo={CAPITULOS.dimension.etiqueta}
              pregunta={t.dimension.pregunta}
            >
              <div className="grid gap-10 md:grid-cols-12 md:gap-8">
                <div className="md:col-span-6">
                  <p className="text-label uppercase text-neutral-700">{dimension.principal.etiqueta}</p>
                  <p className="tnum mt-3 text-[3.5rem] font-bold leading-none tracking-[-0.03em] text-purple-900 md:text-[4.5rem]">
                    {dimension.principal.valor}
                  </p>
                  <p className="mt-2 text-h3-sm text-neutral-700">{dimension.principal.unidad}</p>
                  {dimension.principal.definicion ? (
                    <p className="mt-4 max-w-[26rem] text-small text-neutral-700">
                      {dimension.principal.definicion}
                    </p>
                  ) : null}
                </div>
                {dimension.secundarias.length ? (
                  <dl className="flex flex-col gap-5 md:col-span-6 md:pt-2">
                    <p className="text-label uppercase text-neutral-700">{t.dimension.secundariasLabel}</p>
                    {dimension.secundarias.map((c) => (
                      <div key={c.clave} className="flex flex-col gap-1.5">
                        <div className="flex items-baseline justify-between gap-4">
                          <dt className="text-small text-neutral-700">{c.etiqueta}</dt>
                          <dd className="tnum text-body font-semibold text-neutral-950">
                            {c.valor}{" "}
                            <span className="text-small font-normal text-neutral-700">{c.unidad}</span>
                          </dd>
                        </div>
                        {c.pctDePrincipal !== undefined ? (
                          <Bar
                            pct={c.pctDePrincipal}
                            tono="medio"
                            title={`${c.etiqueta}: ${c.valor} ${c.unidad} ${t.dimension.respectoLabel}`}
                            height="h-1.5"
                          />
                        ) : null}
                        {c.nota ? <dd className="text-small text-neutral-500">{c.nota}</dd> : null}
                      </div>
                    ))}
                  </dl>
                ) : null}
              </div>
            </Capitulo>
          ) : null}

          {/* ── 02 Riesgo ── */}
          {riesgo.principal ? (
            <Capitulo
              nivel={nivelCapitulo}
              id="informe-riesgo"
              numero={CAPITULOS.riesgo.numero}
              titulo={CAPITULOS.riesgo.etiqueta}
              pregunta={t.riesgo.pregunta}
            >
              <div className="flex flex-col gap-12">
                <div className="grid gap-8 md:grid-cols-12">
                  <div className="md:col-span-5">
                    <p className="text-label uppercase text-neutral-700">{riesgo.principal.etiqueta}</p>
                    {riesgo.principal.ponderado ? (
                      <>
                        <p className="tnum mt-3 text-[3.5rem] font-bold leading-none tracking-[-0.03em] text-purple-900 md:text-[4.5rem]">
                          {riesgo.principal.ponderado.valor}
                          <span className="ml-1 text-h2-sm font-semibold text-neutral-700">
                            {riesgo.principal.ponderado.unidad}
                          </span>
                        </p>
                        <p className="mt-2 text-small text-neutral-700">
                          {t.riesgo.ponderadoLabel} · {t.riesgo.ponderadoNota}
                        </p>
                      </>
                    ) : (
                      <p className="mt-3 text-body text-neutral-700">{t.riesgo.sinDenominador}</p>
                    )}
                    <p className="mt-4 max-w-[26rem] text-small text-neutral-700">
                      {riesgo.principal.definicion}
                    </p>
                    {riesgo.principal.direccion ? (
                      <p className="mt-2 text-label uppercase text-neutral-500">
                        {t.riesgo.direccion[riesgo.principal.direccion]}
                      </p>
                    ) : null}
                  </div>
                  {riesgo.principal.distribucion ? (
                    <div className="flex flex-col gap-5 md:col-span-7 md:pt-2">
                      <p className="text-label uppercase text-neutral-700">
                        {t.riesgo.distribucionLabel} · {riesgo.principal.distribucion.n} {t.riesgo.nLabel}
                      </p>
                      <BandaDistribucion
                        d={riesgo.principal.distribucion}
                        id="banda-principal"
                        etiqueta={riesgo.principal.etiqueta}
                      />
                      <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
                        {[
                          [t.riesgo.p25Label, riesgo.principal.distribucion.p25],
                          [t.riesgo.medianaLabel, riesgo.principal.distribucion.mediana],
                          [t.riesgo.p75Label, riesgo.principal.distribucion.p75],
                          [t.riesgo.mediaLabel, riesgo.principal.distribucion.media],
                        ].map(([k, v]) => (
                          <div key={k}>
                            <dt className="text-label uppercase text-neutral-700">{k}</dt>
                            <dd className="tnum mt-1 text-body font-semibold text-neutral-950">{v}</dd>
                          </div>
                        ))}
                      </dl>
                      {riesgo.principal.nota ? (
                        <p className="text-small text-neutral-500">{riesgo.principal.nota}</p>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                {riesgo.otros.length ? (
                  <div className="flex flex-col gap-6">
                    <Rotulo tono="neutral">{t.riesgo.otrosLabel}</Rotulo>
                    <ul className="flex flex-col divide-y divide-neutral-100">
                      {riesgo.otros.map((i) => (
                        <li
                          key={i.clave}
                          className="grid gap-3 py-5 md:grid-cols-12 md:items-center md:gap-6"
                        >
                          <div className="md:col-span-4">
                            <p className="text-body font-semibold text-neutral-950">{i.etiqueta}</p>
                            <p className="mt-1 text-small text-neutral-700">{i.definicion}</p>
                          </div>
                          <p className="tnum text-h3 text-purple-900 md:col-span-2">
                            {i.ponderado ? (
                              <>
                                {i.ponderado.valor}
                                <span className="ml-1 text-small font-normal text-neutral-700">
                                  {i.ponderado.unidad}
                                </span>
                              </>
                            ) : (
                              <span className="text-small font-normal text-neutral-500">
                                {t.riesgo.sinDenominador}
                              </span>
                            )}
                          </p>
                          <div className="md:col-span-6">
                            {i.distribucion ? (
                              <>
                                <BandaDistribucion
                                  d={i.distribucion}
                                  id={`banda-${i.clave}`}
                                  etiqueta={i.etiqueta}
                                  compacta
                                />
                                <p className="mt-2 text-small text-neutral-700">
                                  {t.riesgo.medianaLabel}{" "}
                                  <span className="tnum font-semibold text-neutral-950">
                                    {i.distribucion.mediana}
                                  </span>{" "}
                                  · {t.riesgo.p25Label}–{t.riesgo.p75Label}{" "}
                                  <span className="tnum font-semibold text-neutral-950">
                                    {i.distribucion.p25} – {i.distribucion.p75}
                                  </span>{" "}
                                  · {i.distribucion.n} {t.riesgo.nLabel}
                                </p>
                              </>
                            ) : null}
                            {i.nota ? <p className="mt-1 text-small text-neutral-500">{i.nota}</p> : null}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </Capitulo>
          ) : null}

          {/* ── 03 Estructura ── */}
          {estructura.length ? (
            <Capitulo
              nivel={nivelCapitulo}
              id="informe-estructura"
              numero={CAPITULOS.estructura.numero}
              titulo={CAPITULOS.estructura.etiqueta}
              pregunta={t.estructura.pregunta}
            >
              <div className="flex flex-col gap-14">
                {estructura.map((seg) => (
                  <figure key={seg.clave} className="flex flex-col gap-6">
                    <figcaption className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="text-body font-semibold text-neutral-950">{seg.etiqueta}</span>
                      <span className="text-small text-neutral-700">{seg.medida}</span>
                    </figcaption>
                    <ul className="flex flex-col gap-4">
                      {seg.categorias.map((c, i) => (
                        <li
                          key={c.etiqueta}
                          className="grid gap-1.5 sm:grid-cols-12 sm:items-center sm:gap-4"
                        >
                          <span className="text-small font-semibold text-neutral-900 sm:col-span-3">
                            {c.etiqueta}
                          </span>
                          <div className="grid grid-cols-[1fr_auto] items-center gap-3 sm:col-span-9">
                            <Bar
                              pct={c.pct}
                              tono={i === 0 ? "fuerte" : "medio"}
                              title={`${c.etiqueta}: ${c.participacion} de ${seg.medida}, ${c.entidades} ${t.estructura.entidadesLabel}`}
                            />
                            <span className="tnum text-small text-neutral-900">
                              <span className="font-semibold">{c.participacion}</span>
                              <span className="ml-2 text-neutral-700">
                                {c.entidades} {t.estructura.entidadesLabel}
                              </span>
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                    {seg.concentracion ? (
                      <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-l-2 border-purple-500 pl-4 text-small text-neutral-700">
                        <span className="text-label uppercase text-purple-700">
                          {t.estructura.concentracionLabel}
                        </span>
                        <span>
                          {seg.concentracion.descripcion} ({seg.concentracion.entidades}{" "}
                          {t.estructura.entidadesLabel}):{" "}
                          <span className="tnum font-semibold text-neutral-950">
                            {seg.concentracion.participacion}
                          </span>{" "}
                          de {seg.medida}.
                        </span>
                      </p>
                    ) : null}
                    {seg.nota ? <p className="text-small text-neutral-500">{seg.nota}</p> : null}
                  </figure>
                ))}
              </div>
            </Capitulo>
          ) : null}

          {/* ── 04 Evolución: solo con dos o más cortes comparables ── */}
          {evolucion ? (
            <Capitulo
              nivel={nivelCapitulo}
              id="informe-evolucion"
              numero={CAPITULOS.evolucion.numero}
              titulo={CAPITULOS.evolucion.etiqueta}
              pregunta={t.evolucion.pregunta}
            >
              <div className="flex flex-col gap-10">
                <p className="border-l-2 border-purple-500 pl-4 text-body text-neutral-900">
                  {evolucion.leyenda}
                </p>
                {/* En pantallas estrechas la tabla se apila: una fila por variación, sin scroll lateral */}
                <ul className="flex flex-col divide-y divide-neutral-100 text-small sm:hidden">
                  {evolucion.variaciones.map((v) => (
                    <li key={v.clave} className="flex flex-col gap-1 py-4">
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="font-semibold text-neutral-950">{v.etiqueta}</span>
                        <span className="tnum shrink-0 font-semibold text-purple-900">{v.variacion}</span>
                      </div>
                      <p className="text-neutral-700">
                        {t.evolucion.baseLabel} <span className="tnum whitespace-nowrap">{v.base}</span> ·{" "}
                        {t.evolucion.actualLabel}{" "}
                        <span className="tnum whitespace-nowrap text-neutral-950">{v.actual}</span>
                      </p>
                    </li>
                  ))}
                </ul>
                <div className="hidden min-w-0 sm:block">
                  <table className="w-full text-small">
                    <thead>
                      <tr className="text-left text-label uppercase text-neutral-700">
                        <th scope="col" className="pb-3 font-semibold">
                          &nbsp;
                        </th>
                        <th scope="col" className="pb-3 font-semibold">
                          {t.evolucion.baseLabel} · {evolucion.baseEtiqueta}
                        </th>
                        <th scope="col" className="pb-3 font-semibold">
                          {t.evolucion.actualLabel} · {evolucion.actualEtiqueta}
                        </th>
                        <th scope="col" className="pb-3 text-right font-semibold">
                          {t.evolucion.variacionLabel}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {evolucion.variaciones.map((v) => (
                        <tr key={v.clave}>
                          <th scope="row" className="py-3 pr-4 text-left font-semibold text-neutral-950">
                            {v.etiqueta}
                          </th>
                          <td className="tnum whitespace-nowrap py-3 pr-4 text-neutral-700">{v.base}</td>
                          <td className="tnum whitespace-nowrap py-3 pr-4 text-neutral-950">{v.actual}</td>
                          <td className="tnum whitespace-nowrap py-3 text-right font-semibold text-purple-900">
                            {v.variacion}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {evolucion.series.length ? (
                  <div className="flex flex-col gap-8">
                    <Rotulo tono="neutral">{t.evolucion.serieLabel}</Rotulo>
                    {evolucion.series.map((s) => (
                      <figure key={s.clave} className="flex flex-col gap-3">
                        <figcaption className="text-body font-semibold text-neutral-950">
                          {s.etiqueta}
                        </figcaption>
                        <ul className="flex flex-col gap-2.5">
                          {s.puntos.map((p, i) => (
                            <li
                              key={p.etiqueta}
                              className="grid grid-cols-[6rem_1fr_auto] items-center gap-3"
                            >
                              <span className="text-small text-neutral-700">{p.etiqueta}</span>
                              <Bar
                                pct={p.pct}
                                tono={i === s.puntos.length - 1 ? "fuerte" : "medio"}
                                title={`${s.etiqueta}, ${p.etiqueta}: ${p.valor}`}
                                height="h-2"
                              />
                              <span className="tnum text-small font-semibold text-neutral-950">
                                {p.valor}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </figure>
                    ))}
                  </div>
                ) : null}
                {evolucion.lectura ? (
                  <div className="border-l-2 border-purple-500 pl-4">
                    <p className="text-label uppercase text-purple-700">{t.lecturaLabel}</p>
                    <p className="mt-2 text-body text-neutral-900">{evolucion.lectura}</p>
                  </div>
                ) : null}
                <dl className="grid gap-4 text-small text-neutral-700 sm:grid-cols-3">
                  <div>
                    <dt className="text-label uppercase text-neutral-700">{t.evolucion.comparablesLabel}</dt>
                    <dd className="tnum mt-1 text-neutral-950">
                      {evolucion.nComparables}{" "}
                      <span className="text-neutral-700">
                        (base: {evolucion.nBase} · actual: {evolucion.nActual})
                      </span>
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-label uppercase text-neutral-700">{t.evolucion.criterioLabel}</dt>
                    <dd className="mt-1">{evolucion.criterio}</dd>
                  </div>
                  {evolucion.exclusiones.length ? (
                    <div className="sm:col-span-3">
                      <dt className="text-label uppercase text-neutral-700">
                        {t.evolucion.exclusionesLabel}
                      </dt>
                      <dd className="mt-1">{evolucion.exclusiones.join(" · ")}</dd>
                    </div>
                  ) : null}
                </dl>
              </div>
            </Capitulo>
          ) : null}

          {/* ── Metodología y fuentes ── */}
          <Metodologia m={metodologia} nivel={nivelCapitulo} />
        </div>
      </div>
    </div>
  );
}

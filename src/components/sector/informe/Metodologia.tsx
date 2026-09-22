import type { ReactNode } from "react";
import { sector } from "@/content/sector";
import type { MetodologiaVM } from "@/lib/sector/selectV2";
import { Rotulo } from "@/components/sector/informe/Capitulo";

const t = sector.informe.metodologia;

/**
 * Metodología y fuentes: serio pero legible. Arriba, la distinción que importa
 * —quién publica los DATOS y quién los PROCESA y LEE— en dos bloques distintos;
 * debajo, fechas, universo y cobertura siempre visibles, y los detalles largos
 * (exclusiones, definiciones, comparabilidad, limitaciones) en disclosures
 * nativos <details>, accesibles por teclado y sin JavaScript.
 */
function Detalle({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <details className="group border-t border-neutral-100 py-4 open:pb-6">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-body font-semibold text-neutral-950 marker:content-none [&::-webkit-details-marker]:hidden">
        {titulo}
        <span
          aria-hidden="true"
          className="relative h-3 w-3 shrink-0 rounded-sm border-[1.5px] border-purple-500 bg-neutral-0 transition-colors duration-200 group-open:bg-purple-500"
        />
      </summary>
      <div className="mt-4 text-small text-neutral-700">{children}</div>
    </details>
  );
}

export function Metodologia({ m }: { m: MetodologiaVM }) {
  return (
    <section
      id="informe-metodologia"
      className="scroll-mt-28"
      aria-labelledby="informe-metodologia-title"
      data-reveal
    >
      <Rotulo>{t.label}</Rotulo>
      <h3 id="informe-metodologia-title" className="mt-3 text-h2-sm md:text-h2 text-neutral-950">
        {t.pregunta}
      </h3>

      {/* Fuente de datos ≠ procesamiento y análisis */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2 border-l-2 border-neutral-300 pl-5">
          <p className="text-label uppercase text-neutral-700">{t.fuenteDatosLabel}</p>
          <p className="text-h3-sm text-neutral-950">
            {m.fuenteDatos.url ? (
              <a
                href={m.fuenteDatos.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 transition-colors duration-200 hover:text-purple-900 hover:underline"
              >
                {m.fuenteDatos.entidad}
              </a>
            ) : (
              m.fuenteDatos.entidad
            )}
          </p>
          {m.fuenteDatos.descripcion ? (
            <p className="text-small text-neutral-700">{m.fuenteDatos.descripcion}</p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2 rounded-lg bg-purple-100/60 p-5">
          <p className="text-label uppercase text-purple-700">{t.procesamientoLabel}</p>
          <p className="text-h3-sm text-purple-900">{m.procesamiento.entidad}</p>
          {m.procesamiento.descripcion ? (
            <p className="text-small text-neutral-700">{m.procesamiento.descripcion}</p>
          ) : null}
          <p className="text-small text-neutral-700">
            {t.metodologiaLabel}: {m.nombre} · {m.codigo} {m.version}
            {m.evaluador ? ` · ${t.evaluadorLabel} ${m.evaluador}` : ""}
          </p>
        </div>
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 text-small sm:grid-cols-4">
        <div>
          <dt className="text-label uppercase text-neutral-700">{t.fechaCorteLabel}</dt>
          <dd className="mt-1 text-body text-neutral-950">{m.fechaCorte}</dd>
        </div>
        <div>
          <dt className="text-label uppercase text-neutral-700">{t.fechaProcesamientoLabel}</dt>
          <dd className="mt-1 text-body text-neutral-950">{m.fechaProcesamiento}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-label uppercase text-neutral-700">{t.universoLabel}</dt>
          <dd className="mt-1 text-body text-neutral-950">
            <span className="tnum">{m.universo.n}</span> de{" "}
            <span className="tnum">{m.universo.nReportantes}</span> reportantes
          </dd>
          <dd className="mt-1 text-small text-neutral-700">{m.universo.definicion}</dd>
        </div>
      </dl>
      <p className="mt-4 text-small text-neutral-700">{m.cobertura}</p>
      <p className="mt-6 text-body max-w-[40rem] text-neutral-700">{m.descripcion}</p>

      <div className="mt-8 border-b border-neutral-100">
        <Detalle titulo={`${t.universoLabel} — criterio`}>
          <p>{m.universo.criterio}</p>
        </Detalle>
        {m.exclusiones.length ? (
          <Detalle titulo={t.exclusionesLabel}>
            <ul className="list-disc pl-5">
              {m.exclusiones.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </Detalle>
        ) : null}
        {m.definiciones.length ? (
          <Detalle titulo={t.definicionesLabel}>
            <dl className="flex flex-col gap-4">
              {m.definiciones.map((d) => (
                <div key={d.etiqueta}>
                  <dt className="font-semibold text-neutral-950">{d.etiqueta}</dt>
                  <dd className="mt-1">
                    {d.definicion}
                    {d.formula ? (
                      <>
                        {" "}
                        · {t.formulaLabel}: <span className="tnum">{d.formula}</span>
                      </>
                    ) : null}{" "}
                    · {t.unidadLabel}: {d.unidad}
                  </dd>
                </div>
              ))}
            </dl>
          </Detalle>
        ) : null}
        <Detalle titulo={t.comparabilidadLabel}>
          <p className="font-semibold text-neutral-950">{m.comparabilidad.criterio}</p>
          <p className="mt-1">{m.comparabilidad.descripcion}</p>
        </Detalle>
        {m.limitaciones.length ? (
          <Detalle titulo={t.limitacionesLabel}>
            <ul className="list-disc pl-5">
              {m.limitaciones.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </Detalle>
        ) : null}
        <Detalle titulo={t.privacidadLabel}>
          <p>{t.privacidadTexto.replace("{k}", m.k)}</p>
        </Detalle>
      </div>
    </section>
  );
}

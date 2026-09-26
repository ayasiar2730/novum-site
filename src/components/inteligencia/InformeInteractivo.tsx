"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { inteligencia } from "@/content/inteligencia";
import type { InteligenciaSectorial } from "@/lib/inteligencia/contrato";
import { validarInteligencia } from "@/lib/inteligencia/contrato";
import {
  escribirEstado,
  estadoAlCambiarDeInforme,
  leerEstado,
  seccionValida,
  type EstadoModulo,
  type InformeId,
} from "@/lib/inteligencia/estado";
import { etiquetaDeTipo, tipoDeSegmento, segmentoDeTipo } from "@/lib/inteligencia/tipos";
import { buscar as buscarPanorama } from "@/lib/inteligencia/panorama";
import { clave, nombreLegible } from "@/lib/inteligencia/formato";
import { BarraFiltros, type OpcionEntidad } from "./Filtros";
import { CambioDeInforme, NavSecciones } from "./Navegacion";
import { SeccionesCartera } from "./cartera/Secciones";
import { SeccionesPanorama } from "./panorama/Secciones";

export interface CorteMenu {
  id: string;
  etiqueta: string;
  estado: "completo" | "parcial";
  url: string;
}

/** Lo que cada sección recibe: los datos del corte, los filtros y cómo cambiarlos. */
export interface ContextoSeccion {
  datos: InteligenciaSectorial;
  estado: EstadoModulo;
  cambiar: (e: Partial<EstadoModulo>) => void;
  /** Código de la entidad propia (SIAR autenticado); null en la web pública. */
  entidadPropia: string | null;
}

const cache = new Map<string, Promise<InteligenciaSectorial>>();
function cargar(url: string): Promise<InteligenciaSectorial> {
  let p = cache.get(url);
  if (!p) {
    p = fetch(url, { cache: "force-cache" }).then(async (r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const d = (await r.json()) as InteligenciaSectorial;
      const problemas = validarInteligencia(d);
      if (problemas.length) throw new Error(problemas.join(" · "));
      return d;
    });
    p.catch(() => cache.delete(url));
    cache.set(url, p);
  }
  return p;
}

/**
 * El shell común de los dos informes: cambio de informe, corte, filtros,
 * secciones y la lectura activa. El estado vive en la URL (se comparte y
 * sobrevive al cambio de pestaña o de informe). Los datos se descargan del
 * archivo público del corte; ninguna cifra se calcula aquí.
 */
export function InformeInteractivo({
  informe,
  cortes,
  corteInicial,
  rutas,
  entidadPropia = null,
}: {
  informe: InformeId;
  cortes: CorteMenu[];
  corteInicial: string;
  rutas: Record<InformeId, string>;
  entidadPropia?: string | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const estadoUrl = useMemo(() => leerEstado(params), [params]);
  const estado: EstadoModulo = useMemo(
    () => ({ ...estadoUrl, entidad: estadoUrl.entidad ?? entidadPropia }),
    [estadoUrl, entidadPropia],
  );
  const corteId = cortes.some((c) => c.id === estado.corte) ? (estado.corte as string) : corteInicial;
  const corte = cortes.find((c) => c.id === corteId) ?? cortes[0];
  const contenido = inteligencia.informes[informe];
  const secciones = contenido.secciones;
  const seccion = seccionValida(estado.seccion, secciones);
  const panelId = useId();

  const [datos, setDatos] = useState<{ url: string; d: InteligenciaSectorial } | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let vivo = true;
    cargar(corte.url)
      .then((d) => vivo && (setDatos({ url: corte.url, d }), setError(null)))
      .catch((e: unknown) => vivo && setError(e instanceof Error ? e.message : String(e)));
    return () => {
      vivo = false;
    };
  }, [corte.url]);

  const cambiar = useCallback(
    (cambio: Partial<EstadoModulo>) => {
      const nuevo = { ...estadoUrl, ...cambio };
      if (nuevo.corte === corteInicial) nuevo.corte = null;
      if (nuevo.entidad === entidadPropia) nuevo.entidad = null;
      router.replace(`${pathname}${escribirEstado(nuevo)}`, { scroll: false });
    },
    [estadoUrl, corteInicial, entidadPropia, pathname, router],
  );

  const d = datos && datos.url === corte.url ? datos.d : null;

  const hrefs = useMemo(() => {
    const tiposDestino = (id: InformeId) =>
      !d
        ? []
        : id === "panorama-financiero"
          ? d.panorama.tipos
          : [tipoDeSegmento("COOPERATIVAS"), tipoDeSegmento("MUTUALES")];
    return Object.fromEntries(
      (Object.keys(rutas) as InformeId[]).map((id) => {
        const e = id === informe ? estadoUrl : estadoAlCambiarDeInforme(estadoUrl, tiposDestino(id));
        return [id, `${rutas[id]}${escribirEstado(e)}`];
      }),
    ) as Record<InformeId, string>;
  }, [rutas, informe, estadoUrl, d]);

  return (
    <div className="flex flex-col gap-5 md:gap-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <CambioDeInforme activo={informe} hrefs={hrefs} />
        <SelectorCorte
          cortes={cortes}
          valor={corteId}
          onCambio={(id) => cambiar({ corte: id })}
          base={d?.corte.base?.etiqueta ?? null}
        />
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-purple-100 bg-neutral-0 p-5 text-body-sm text-neutral-900"
        >
          {inteligencia.errorCarga}
        </p>
      ) : !d ? (
        <Esqueleto />
      ) : (
        <>
          <Filtros
            informe={informe}
            datos={d}
            estado={estado}
            cambiar={cambiar}
            entidadPropia={entidadPropia}
          />
          <NavSecciones
            secciones={secciones}
            activa={seccion}
            onCambio={(id) => cambiar({ seccion: id === secciones[0].id ? null : id, variable: null })}
            panelId={panelId}
          />
          <div
            id={panelId}
            role="tabpanel"
            aria-labelledby={`tab-${seccion}`}
            className="flex flex-col gap-5 md:gap-6"
          >
            {/* El título de la sección (h2) para la jerarquía y los lectores de pantalla; a la vista ya está en el menú. */}
            <h2 className="sr-only">{secciones.find((s) => s.id === seccion)?.label}</h2>
            {informe === "panorama-financiero" ? (
              <SeccionesPanorama seccion={seccion} ctx={{ datos: d, estado, cambiar, entidadPropia }} />
            ) : (
              <SeccionesCartera seccion={seccion} ctx={{ datos: d, estado, cambiar, entidadPropia }} />
            )}
          </div>
          <Fuente datos={d} informe={informe} />
        </>
      )}
    </div>
  );
}

function SelectorCorte({
  cortes,
  valor,
  onCambio,
  base,
}: {
  cortes: CorteMenu[];
  valor: string;
  onCambio: (id: string) => void;
  base: string | null;
}) {
  const id = useId();
  const t = inteligencia;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-label uppercase text-neutral-700">
        {t.corteLabel}
      </label>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {cortes.length > 1 ? (
          <select
            id={id}
            value={valor}
            onChange={(e) => onCambio(e.target.value)}
            className="min-h-11 rounded-md border border-neutral-300 bg-neutral-0 px-3 text-small text-neutral-950 focus-visible:border-purple-500"
          >
            {cortes.map((c) => (
              <option key={c.id} value={c.id}>
                {`${c.etiqueta}${c.estado === "parcial" ? " (parcial)" : ""}`}
              </option>
            ))}
          </select>
        ) : (
          <output id={id} className="text-body-sm font-semibold text-neutral-950">
            {cortes[0]?.etiqueta}
          </output>
        )}
        {base ? (
          <span className="text-small text-neutral-700">
            {t.baseLabel} {base}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function Filtros({
  informe,
  datos,
  estado,
  cambiar,
  entidadPropia,
}: {
  informe: InformeId;
  datos: InteligenciaSectorial;
  estado: EstadoModulo;
  cambiar: (e: Partial<EstadoModulo>) => void;
  entidadPropia: string | null;
}) {
  const t = inteligencia.filtros;
  const p = datos.panorama;
  const esPanorama = informe === "panorama-financiero";

  const opcionesTipo = esPanorama
    ? p.tipos.map((tipo) => ({ valor: tipo, etiqueta: etiquetaDeTipo(tipo), n: p.porTipo[tipo]?.entidades }))
    : (["COOPERATIVAS", "MUTUALES"] as const).map((s) => ({
        valor: tipoDeSegmento(s),
        etiqueta: t.segmentos[s],
        n: datos.cartera.entidades.filter((e) => e.segmento === s).length,
      }));
  const tipoValor = estado.tipo && opcionesTipo.some((o) => o.valor === estado.tipo) ? estado.tipo : null;

  const deptos = esPanorama
    ? p.departamentos.map((valor) => ({
        valor,
        n:
          (tipoValor ? p.porTipoYDepartamento[tipoValor]?.[valor] : p.porDepartamento[valor])?.entidades ?? 0,
      }))
    : [...new Set(datos.cartera.entidades.map((e) => e.departamento).filter((x): x is string => !!x))]
        .sort((a, b) => a.localeCompare(b, "es"))
        .map((valor) => ({
          valor,
          n: datos.cartera.entidades.filter(
            (e) => e.departamento === valor && (!tipoValor || e.segmento === segmentoDeTipo(tipoValor)),
          ).length,
        }));

  const opcionDe = (codigo: string | null): OpcionEntidad | null => {
    if (!codigo) return null;
    if (esPanorama) {
      const e = p.entidades.find((x) => x.codigo === codigo);
      return e
        ? {
            codigo,
            nombre: nombreLegible(e.nombre),
            sigla: e.sigla,
            detalle: etiquetaDeTipo(p.tipos[e.tipo]),
          }
        : null;
    }
    const e = datos.cartera.entidades.find((x) => x.codigo === codigo);
    return e
      ? { codigo, nombre: nombreLegible(e.nombre), sigla: e.sigla, detalle: t.segmentos[e.segmento] }
      : null;
  };

  const buscar = (q: string): OpcionEntidad[] => {
    if (esPanorama) {
      return buscarPanorama(p.entidades, q).map((e) => ({
        codigo: e.codigo,
        nombre: nombreLegible(e.nombre),
        sigla: e.sigla,
        detalle: `${etiquetaDeTipo(p.tipos[e.tipo])}${e.departamento !== null ? ` · ${p.departamentos[e.departamento]}` : ""}`,
      }));
    }
    const k = clave(q);
    if (!k) return [];
    return datos.cartera.entidades
      .filter(
        (e) =>
          clave(e.nombre).includes(k) || (e.sigla && clave(e.sigla).includes(k)) || e.codigo === q.trim(),
      )
      .slice(0, 12)
      .map((e) => ({
        codigo: e.codigo,
        nombre: nombreLegible(e.nombre),
        sigla: e.sigla,
        detalle: `${t.segmentos[e.segmento]}${e.departamento ? ` · ${e.departamento}` : ""}`,
      }));
  };

  const elegida = opcionDe(estado.entidad);

  return (
    <BarraFiltros
      tipo={{
        etiqueta: esPanorama ? t.tipo : t.segmento,
        todos: esPanorama ? t.tipoTodos : t.segmentoTodos,
        opciones: opcionesTipo,
        valor: tipoValor,
        onCambio: (v) => cambiar({ tipo: v }),
      }}
      departamento={{
        opciones: deptos,
        valor: estado.departamento,
        onCambio: (v) => cambiar({ departamento: v }),
      }}
      entidad={{
        buscar,
        elegida: elegida,
        onCambio: (codigo) => cambiar({ entidad: codigo }),
        esPropia: !!entidadPropia && estado.entidad === entidadPropia,
      }}
    />
  );
}

function Fuente({ datos, informe }: { datos: InteligenciaSectorial; informe: InformeId }) {
  const f = inteligencia.fuente;
  const met = informe === "panorama-financiero" ? datos.panorama.metodologia : datos.cartera.metodologia;
  const a = datos.fuente.archivos;
  return (
    <footer className="flex flex-col gap-3 border-t border-neutral-100 pt-5 text-small text-neutral-700">
      <p>{f.datos}</p>
      <p>{f.procesamiento}</p>
      <p>{f.unidades}</p>
      <details className="group">
        <summary className="inline-flex min-h-10 cursor-pointer items-center gap-2 text-purple-700 hover:text-purple-900">
          {f.metodologiaLabel}: {met.nombre}
        </summary>
        <div className="mt-2 flex flex-col gap-2 measure">
          <p>{met.descripcion}</p>
          {informe === "cartera-riesgo" ? <p>{datos.cartera.alcance}</p> : null}
          {informe === "panorama-financiero" && datos.panorama.metodologia.diferencia ? (
            <p>{datos.panorama.metodologia.diferencia}</p>
          ) : null}
          <p className="font-semibold text-neutral-900">{f.archivosLabel}</p>
          <ul className="flex flex-col gap-1 break-all">
            {[
              a.actual.cuentas,
              a.actual.seisDigitos,
              ...(a.base ? [a.base.cuentas, a.base.seisDigitos] : []),
            ].map((x) => (
              <li key={x.sha256}>
                {x.nombre} · SHA-256 {x.sha256.slice(0, 16)}…
              </li>
            ))}
          </ul>
        </div>
      </details>
    </footer>
  );
}

function Esqueleto() {
  return (
    <div aria-busy="true" aria-live="polite" className="flex flex-col gap-4">
      <p className="sr-only">{inteligencia.cargando}</p>
      <div className="h-28 animate-pulse rounded-lg bg-neutral-0" />
      <div className="h-12 animate-pulse rounded-lg bg-neutral-0" />
      <div className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-lg bg-neutral-0" />
        ))}
      </div>
    </div>
  );
}

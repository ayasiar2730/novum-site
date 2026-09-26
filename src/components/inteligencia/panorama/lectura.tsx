"use client";

import { useMemo } from "react";
import { inteligencia } from "@/content/inteligencia";
import type { EntidadPanoramaPublica, GrupoInteligencia } from "@/lib/inteligencia/contrato";
import { cifra, nombreLegible } from "@/lib/inteligencia/formato";
import {
  entidadesDe,
  etiquetaDeGrupo,
  grupoDe,
  lector,
  type FiltrosPanorama,
  type Lector,
} from "@/lib/inteligencia/panorama";
import { etiquetaDeTipo } from "@/lib/inteligencia/tipos";
import type { FilaBarra } from "../graficos";
import type { ContextoSeccion } from "../InformeInteractivo";
import { Ficha } from "../piezas";
import type { Columna } from "../Tabla";

/*
 * Lectura del panorama (hooks y funciones, sin componentes): qué grupo, qué
 * entidades y qué columnas muestra cada sección según los filtros. Vive aparte
 * de los componentes (comunes.tsx) para que cada archivo exporte una sola cosa.
 */

/** Todo lo que una sección del panorama necesita, ya elegido según los filtros. */
export function useLectura(ctx: ContextoSeccion) {
  const p = ctx.datos.panorama;
  const l = useMemo(() => lector(p), [p]);
  const tipo = ctx.estado.tipo && p.tipos.includes(ctx.estado.tipo) ? ctx.estado.tipo : null;
  const departamento =
    ctx.estado.departamento && p.departamentos.includes(ctx.estado.departamento)
      ? ctx.estado.departamento
      : null;
  const filtros: FiltrosPanorama = { tipo, departamento };
  const grupo = grupoDe(p, filtros);
  const entidades = useMemo(() => entidadesDe(p, filtros), [p, tipo, departamento]); // eslint-disable-line react-hooks/exhaustive-deps
  const entidad = ctx.estado.entidad
    ? (p.entidades.find((e) => e.codigo === ctx.estado.entidad) ?? null)
    : null;
  const corte = ctx.datos.corte;
  const periodo = corte.base ? `${corte.etiqueta} frente a ${corte.base.etiqueta}` : corte.etiqueta;
  const universo = `${etiquetaDeGrupo({ tipo: tipo ? etiquetaDeTipo(tipo) : null, departamento })}: ${grupo?.entidades ?? 0} entidades de los nueve tipos del Seguimiento sector (cooperativas, fondos de empleados y mutuales), que reportaron el corte.`;
  const ficha = (clave: string, compacta = false) => (
    <Ficha
      ficha={l.ficha[clave]}
      fuente={inteligencia.fuente.datos}
      universo={universo}
      periodo={periodo}
      compacta={compacta}
    />
  );
  const propia = !!ctx.entidadPropia && entidad?.codigo === ctx.entidadPropia;
  return {
    p,
    l,
    filtros,
    grupo,
    etiquetaGrupo: etiquetaDeGrupo({ tipo: tipo ? etiquetaDeTipo(tipo) : null, departamento }),
    entidades,
    entidad,
    propia,
    corte,
    ficha,
    cambiar: ctx.cambiar,
  };
}
export type Lectura = ReturnType<typeof useLectura>;

export function valorDeGrupo(l: Lector, g: GrupoInteligencia | null, k: string): number | null {
  return g ? l.de(g.v, k) : null;
}

/** Una fila por tipo de entidad con la cifra `k`, para BarrasH (respeta el filtro de departamento). */
export function barrasPorTipo(lec: Lectura, k: string): FilaBarra[] {
  const { p, l, filtros } = lec;
  const f = l.ficha[k];
  return p.tipos
    .map((t) => {
      const g = filtros.departamento ? p.porTipoYDepartamento[t]?.[filtros.departamento] : p.porTipo[t];
      const v = g ? l.de(g.v, k) : null;
      return {
        id: t,
        etiqueta: etiquetaDeTipo(t),
        detalle: g ? `${g.entidades} entidades` : undefined,
        valor: v,
        texto: cifra(v, f?.unidad ?? "porcentaje"),
        destacada: t === filtros.tipo,
      };
    })
    .filter((x) => x.detalle)
    .sort((a, b) => (b.valor ?? -Infinity) - (a.valor ?? -Infinity));
}

/** Referencia para las barras por tipo: el total del sector o del departamento elegido. */
export function referenciaTipos(lec: Lectura, k: string): { valor: number | null; etiqueta: string } {
  const g = lec.filtros.departamento ? lec.p.porDepartamento[lec.filtros.departamento] : lec.p.total;
  const f = lec.l.ficha[k];
  const v = g ? lec.l.de(g.v, k) : null;
  return {
    valor: v,
    etiqueta: `${lec.filtros.departamento ?? "Sector"}: ${cifra(v, f?.unidad ?? "porcentaje")}`,
  };
}

/** Columnas de cifras para las tablas del panorama. */
export function columnasDe(
  lec: Lectura,
  claves: string[],
  opciones: { tipo?: boolean; departamento?: boolean } = {},
): Columna<EntidadPanoramaPublica>[] {
  const t = inteligencia.tabla;
  const cols: Columna<EntidadPanoramaPublica>[] = [
    {
      id: "entidad",
      etiqueta: t.entidad,
      valor: (e) => e.sigla ?? e.nombre,
      celda: (e) => (
        <span className="flex min-w-0 flex-col">
          <span className="truncate font-semibold text-neutral-950" title={e.nombre}>
            {e.sigla ?? nombreLegible(e.nombre, 40)}
          </span>
          {e.sigla ? (
            <span className="truncate text-neutral-700" title={e.nombre}>
              {nombreLegible(e.nombre, 44)}
            </span>
          ) : null}
        </span>
      ),
    },
  ];
  if (opciones.tipo)
    cols.push({
      id: "tipo",
      etiqueta: t.tipo,
      valor: (e) => etiquetaDeTipo(lec.p.tipos[e.tipo]),
      celda: (e) => etiquetaDeTipo(lec.p.tipos[e.tipo]),
      secundaria: true,
    });
  if (opciones.departamento)
    cols.push({
      id: "depto",
      etiqueta: t.departamento,
      valor: (e) => (e.departamento !== null ? lec.p.departamentos[e.departamento] : null),
      celda: (e) => (e.departamento !== null ? lec.p.departamentos[e.departamento] : "—"),
      secundaria: true,
    });
  for (const k of claves) {
    const f = lec.l.ficha[k];
    cols.push({
      id: k,
      etiqueta: inteligencia.cortos[k] ?? f?.nombre ?? k,
      titulo: f?.nombre,
      valor: (e) => lec.l.de(e.v, k),
      celda: (e) => cifra(lec.l.de(e.v, k), f?.unidad ?? "porcentaje"),
      numerica: true,
    });
  }
  return cols;
}

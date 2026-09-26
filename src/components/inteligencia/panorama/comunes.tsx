"use client";

import { useState } from "react";
import { inteligencia } from "@/content/inteligencia";
import type { GrupoInteligencia } from "@/lib/inteligencia/contrato";
import { cifra, nombreLegible, porcentaje, puntos } from "@/lib/inteligencia/formato";
import { etiquetaDeTipo } from "@/lib/inteligencia/tipos";
import { Kpi } from "../graficos";
import { Tabla, type Columna } from "../Tabla";
import { columnasDe, valorDeGrupo, type Lectura } from "./lectura";

/** Tarjeta de una cifra del grupo, con su ficha y, si hay, la comparación con el año anterior. */
export function KpiCifra({
  lec,
  clave,
  anterior,
  contexto,
}: {
  lec: Lectura;
  clave: string;
  anterior?: string;
  contexto?: string;
}) {
  const f = lec.l.ficha[clave];
  const v = valorDeGrupo(lec.l, lec.grupo, clave);
  const a = anterior ? valorDeGrupo(lec.l, lec.grupo, anterior) : null;
  const ctxTexto =
    contexto ??
    (anterior && a !== null && v !== null
      ? f?.unidad === "porcentaje"
        ? `${puntos(v - a)} frente a ${lec.corte.base?.etiqueta ?? "el año anterior"} (${porcentaje(a)})`
        : `${cifra(a, f?.unidad ?? "pesos")} en ${lec.corte.base?.etiqueta ?? "el año anterior"}`
      : undefined);
  return (
    <Kpi
      etiqueta={f?.nombre ?? clave}
      valor={cifra(v, f?.unidad ?? "porcentaje")}
      contexto={ctxTexto}
      accion={lec.ficha(clave, true)}
    />
  );
}

/** La entidad elegida frente a su grupo, en las cifras de la sección. */
export function FilaEntidad({ lec, claves }: { lec: Lectura; claves: string[] }) {
  const e = lec.entidad;
  if (!e) return null;
  const f = inteligencia.filtros;
  return (
    <section
      aria-label={`${lec.propia ? f.miEntidad : f.entidad}: ${e.sigla ?? e.nombre}`}
      className="flex flex-col gap-3 rounded-lg border border-green-500/40 bg-green-100/50 p-4 md:p-5"
    >
      <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-label uppercase text-green-700">{lec.propia ? f.miEntidad : f.entidad}</span>
        <span className="text-body-sm font-semibold text-neutral-950">
          {e.sigla ?? nombreLegible(e.nombre)}
        </span>
        <span className="text-small text-neutral-700">
          {nombreLegible(e.nombre)} · {etiquetaDeTipo(lec.p.tipos[e.tipo])}
          {e.departamento !== null ? ` · ${lec.p.departamentos[e.departamento]}` : ""}
        </span>
      </p>
      <dl className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {claves.map((k) => {
          const ficha = lec.l.ficha[k];
          const v = lec.l.de(e.v, k);
          const g = valorDeGrupo(lec.l, lec.grupo, k);
          return (
            <div key={k} className="flex min-w-0 flex-col gap-0.5">
              <dt className="truncate text-small text-neutral-700" title={ficha?.nombre}>
                {ficha?.nombre ?? k}
              </dt>
              <dd className="tnum text-body-sm font-semibold text-neutral-950">
                {cifra(v, ficha?.unidad ?? "porcentaje")}
              </dd>
              <dd className="tnum text-small text-neutral-700">
                {lec.etiquetaGrupo}: {cifra(g, ficha?.unidad ?? "porcentaje")}
              </dd>
            </div>
          );
        })}
      </dl>
      {!e.enBase && lec.corte.base ? (
        <p className="text-small text-neutral-700">{inteligencia.vacios.sinBase}</p>
      ) : null}
    </section>
  );
}

export function TablaEntidades({
  lec,
  claves,
  orden,
  titulo,
  opciones,
}: {
  lec: Lectura;
  claves: string[];
  orden: string;
  titulo: string;
  opciones?: { tipo?: boolean; departamento?: boolean };
}) {
  return (
    <Tabla
      filas={lec.entidades}
      columnas={columnasDe(lec, claves, opciones ?? { tipo: true })}
      clave={(e) => e.codigo}
      destacada={lec.entidad?.codigo ?? null}
      ordenInicial={{ id: orden, sentido: "desc" }}
      titulo={titulo}
    />
  );
}

/** Tabla por tipo de entidad (como las tablas por tipo del Power BI), con el total del grupo al final. */
export function TablaPorTipo({
  lec,
  claves,
  titulo,
  conEntidades = true,
}: {
  lec: Lectura;
  claves: string[];
  titulo: string;
  conEntidades?: boolean;
}) {
  const { p, l, filtros } = lec;
  const filas = p.tipos
    .map((t) => ({
      id: t,
      g: filtros.departamento ? p.porTipoYDepartamento[t]?.[filtros.departamento] : p.porTipo[t],
    }))
    .filter((x): x is { id: string; g: GrupoInteligencia } => !!x.g);
  const total = {
    id: "__total",
    g: filtros.departamento ? p.porDepartamento[filtros.departamento] : p.total,
  };
  const cols: Columna<{ id: string; g: GrupoInteligencia }>[] = [
    {
      id: "tipo",
      etiqueta: inteligencia.tabla.tipo,
      valor: (x) => (x.id === "__total" ? null : etiquetaDeTipo(x.id)),
      celda: (x) =>
        x.id === "__total" ? <strong>{filtros.departamento ?? "Sector"}</strong> : etiquetaDeTipo(x.id),
    },
  ];
  if (conEntidades)
    cols.push({
      id: "n",
      etiqueta: "Entidades",
      valor: (x) => x.g.entidades,
      celda: (x) => x.g.entidades.toLocaleString("es-CO"),
      numerica: true,
    });
  for (const k of claves) {
    const f = l.ficha[k];
    cols.push({
      id: k,
      etiqueta: inteligencia.cortos[k] ?? f?.nombre ?? k,
      titulo: f?.nombre,
      valor: (x) => l.de(x.g.v, k),
      celda: (x) => cifra(l.de(x.g.v, k), f?.unidad ?? "porcentaje"),
      numerica: true,
    });
  }
  return (
    <Tabla
      filas={filas}
      pie={total.g ? total : undefined}
      columnas={cols}
      clave={(x) => x.id}
      destacada={filtros.tipo}
      titulo={titulo}
      porPagina={20}
    />
  );
}

/** Lista-filtro de departamentos con su número de entidades (la tabla de conteo del Power BI). */
export function ListaDepartamentos({ lec }: { lec: Lectura }) {
  const { p, filtros } = lec;
  const [todos, setTodos] = useState(false);
  const fuente = filtros.tipo ? (p.porTipoYDepartamento[filtros.tipo] ?? {}) : p.porDepartamento;
  const filas = Object.entries(fuente)
    .filter(([d]) => d !== "Sin departamento")
    .sort((a, b) => b[1].entidades - a[1].entidades);
  const visibles = todos ? filas : filas.filter(([d], i) => i < 9 || d === filtros.departamento);
  return (
    <div className="flex flex-col gap-2">
      <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3">
        {visibles.map(([d, g]) => {
          const activo = filtros.departamento === d;
          return (
            <li key={d}>
              <button
                type="button"
                aria-pressed={activo}
                onClick={() => lec.cambiar({ departamento: activo ? null : d })}
                className={`flex min-h-10 w-full items-center justify-between gap-3 rounded-md px-3 text-left text-small transition-colors ${
                  activo ? "bg-purple-900 text-white" : "text-neutral-900 hover:bg-purple-100"
                }`}
              >
                <span className="truncate">{d}</span>
                <span className={`tnum ${activo ? "text-white" : "text-neutral-700"}`}>{g.entidades}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {filas.length > 9 ? (
        <button
          type="button"
          onClick={() => setTodos(!todos)}
          aria-expanded={todos}
          className="self-start min-h-10 rounded-md px-2 text-small text-purple-700 hover:bg-purple-100 hover:text-purple-900"
        >
          {todos ? "Ver menos" : `Ver los ${filas.length} departamentos`}
        </button>
      ) : null}
    </div>
  );
}

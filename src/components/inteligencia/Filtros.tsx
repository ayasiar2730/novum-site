"use client";

import { useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { inteligencia } from "@/content/inteligencia";

const t = inteligencia.filtros;

export interface OpcionEntidad {
  codigo: string;
  nombre: string;
  sigla: string | null;
  detalle: string;
}

/**
 * Barra de filtros común a los dos informes: tipo (o segmento), departamento y
 * entidad. En móvil los controles se apilan a ancho completo (no se comprimen);
 * desde 768 px van en una fila. Todos son controles nativos o un combobox con
 * el patrón ARIA (flechas, Enter, Escape).
 */
export function BarraFiltros({
  tipo,
  departamento,
  entidad,
}: {
  tipo: {
    etiqueta: string;
    todos: string;
    opciones: { valor: string; etiqueta: string; n?: number }[];
    valor: string | null;
    onCambio: (v: string | null) => void;
  };
  departamento: {
    opciones: { valor: string; n?: number }[];
    valor: string | null;
    onCambio: (v: string | null) => void;
  };
  entidad: {
    buscar: (q: string) => OpcionEntidad[];
    elegida: OpcionEntidad | null;
    onCambio: (codigo: string | null) => void;
    esPropia?: boolean;
  };
}) {
  const idTipo = useId();
  const idDepto = useId();
  const hayFiltros = !!(tipo.valor || departamento.valor || entidad.elegida);
  return (
    <div
      role="group"
      aria-label={t.etiqueta}
      className="flex flex-col gap-3 rounded-lg border border-neutral-100 bg-neutral-0 p-4 md:p-5"
    >
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1.4fr]">
        <label
          htmlFor={idTipo}
          className="flex min-w-0 flex-col gap-1.5 text-label uppercase text-neutral-700"
        >
          {tipo.etiqueta}
          <select
            id={idTipo}
            value={tipo.valor ?? ""}
            onChange={(e) => tipo.onCambio(e.target.value || null)}
            className="min-h-11 w-full rounded-md border border-neutral-300 bg-neutral-0 px-3 text-small normal-case tracking-normal text-neutral-950 focus-visible:border-purple-500"
          >
            <option value="">{tipo.todos}</option>
            {tipo.opciones.map((o) => (
              <option key={o.valor} value={o.valor}>
                {o.n !== undefined ? `${o.etiqueta} (${o.n})` : o.etiqueta}
              </option>
            ))}
          </select>
        </label>
        <label
          htmlFor={idDepto}
          className="flex min-w-0 flex-col gap-1.5 text-label uppercase text-neutral-700"
        >
          {t.departamento}
          <select
            id={idDepto}
            value={departamento.valor ?? ""}
            onChange={(e) => departamento.onCambio(e.target.value || null)}
            className="min-h-11 w-full rounded-md border border-neutral-300 bg-neutral-0 px-3 text-small normal-case tracking-normal text-neutral-950 focus-visible:border-purple-500"
          >
            <option value="">{t.departamentoTodos}</option>
            {departamento.opciones.map((o) => (
              <option key={o.valor} value={o.valor}>
                {o.n !== undefined ? `${o.valor} (${o.n})` : o.valor}
              </option>
            ))}
          </select>
        </label>
        <BuscadorEntidad {...entidad} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-small text-neutral-700">{t.aplica}</p>
        {hayFiltros ? (
          <button
            type="button"
            onClick={() => {
              tipo.onCambio(null);
              departamento.onCambio(null);
              if (!entidad.esPropia) entidad.onCambio(null);
            }}
            className="min-h-10 rounded-md px-2 text-small text-purple-700 hover:bg-purple-100 hover:text-purple-900"
          >
            {t.limpiar}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function BuscadorEntidad({
  buscar,
  elegida,
  onCambio,
  esPropia,
}: {
  buscar: (q: string) => OpcionEntidad[];
  elegida: OpcionEntidad | null;
  onCambio: (codigo: string | null) => void;
  esPropia?: boolean;
}) {
  const id = useId();
  const listaId = `${id}-lista`;
  const [texto, setTexto] = useState("");
  const [abierto, setAbierto] = useState(false);
  const [activo, setActivo] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const opciones = useMemo(() => (abierto ? buscar(texto) : []), [abierto, buscar, texto]);

  const elegir = (o: OpcionEntidad) => {
    onCambio(o.codigo);
    setTexto("");
    setAbierto(false);
  };
  const teclado = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setAbierto(true);
      setActivo((a) => Math.min(a + 1, Math.max(opciones.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActivo((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && abierto && opciones[activo]) {
      e.preventDefault();
      elegir(opciones[activo]);
    } else if (e.key === "Escape") {
      setAbierto(false);
    }
  };

  if (elegida) {
    return (
      <div className="flex min-w-0 flex-col gap-1.5">
        <span className="text-label uppercase text-neutral-700">{esPropia ? t.miEntidad : t.entidad}</span>
        <div className="flex min-h-11 items-center justify-between gap-2 rounded-md border border-green-500/60 bg-green-100 px-3">
          <span className="flex min-w-0 items-center gap-2 text-small text-neutral-950">
            <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-green-500" />
            <span className="truncate font-semibold" title={elegida.nombre}>
              {elegida.sigla ?? elegida.nombre}
            </span>
            {elegida.sigla ? (
              <span className="hidden truncate text-neutral-700 sm:inline">{elegida.detalle}</span>
            ) : null}
          </span>
          {!esPropia ? (
            <button
              type="button"
              onClick={() => {
                onCambio(null);
                requestAnimationFrame(() => input.current?.focus());
              }}
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-neutral-700 hover:bg-neutral-0"
            >
              <span className="sr-only">{t.entidadQuitar}</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
              </svg>
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className="text-label uppercase text-neutral-700">
        {t.entidad}
      </label>
      <input
        ref={input}
        id={id}
        type="search"
        role="combobox"
        aria-expanded={abierto && opciones.length > 0}
        aria-controls={listaId}
        aria-autocomplete="list"
        aria-activedescendant={
          abierto && opciones[activo] ? `${listaId}-${opciones[activo].codigo}` : undefined
        }
        autoComplete="off"
        placeholder={t.entidadPlaceholder}
        value={texto}
        onChange={(e) => {
          setTexto(e.target.value);
          setAbierto(true);
          setActivo(0);
        }}
        onFocus={() => texto && setAbierto(true)}
        onBlur={() => setTimeout(() => setAbierto(false), 120)}
        onKeyDown={teclado}
        className="min-h-11 w-full rounded-md border border-neutral-300 bg-neutral-0 px-3 text-small text-neutral-950 placeholder:text-neutral-500 focus-visible:border-purple-500"
      />
      {abierto && texto.trim() ? (
        <ul
          id={listaId}
          role="listbox"
          className="absolute inset-x-0 top-full z-30 mt-1 max-h-72 overflow-y-auto rounded-md border border-neutral-100 bg-neutral-0 p-1 shadow-lift"
        >
          {opciones.length === 0 ? (
            <li className="px-3 py-2 text-small text-neutral-700">{t.sinResultados}</li>
          ) : (
            opciones.map((o, i) => (
              <li
                key={o.codigo}
                id={`${listaId}-${o.codigo}`}
                role="option"
                aria-selected={i === activo}
                onMouseDown={(e) => {
                  e.preventDefault();
                  elegir(o);
                }}
                onMouseEnter={() => setActivo(i)}
                className={`flex cursor-pointer flex-col rounded-sm px-3 py-2 ${i === activo ? "bg-purple-100" : ""}`}
              >
                <span className="text-small font-semibold text-neutral-950">{o.sigla ?? o.nombre}</span>
                <span className="truncate text-small text-neutral-700">
                  {o.sigla ? `${o.nombre} · ${o.detalle}` : o.detalle}
                </span>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}

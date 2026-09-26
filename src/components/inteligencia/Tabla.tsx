"use client";

import { useMemo, useState, type ReactNode } from "react";
import { inteligencia } from "@/content/inteligencia";

const t = inteligencia.tabla;

export interface Columna<F> {
  id: string;
  etiqueta: string;
  /** Texto completo del encabezado (si la etiqueta es corta). */
  titulo?: string;
  /** Valor para ordenar (null = sin dato, va al final). */
  valor?: (f: F) => number | string | null;
  celda: (f: F) => ReactNode;
  numerica?: boolean;
  /** Se oculta por debajo de 768 px (la tabla sigue desplazable para verla). */
  secundaria?: boolean;
}

/**
 * Tabla de entidades: primera columna fija (el nombre no se pierde al
 * desplazar), encabezados que ordenan (botones, con aria-sort), paginación y
 * la fila de la entidad elegida destacada. En móvil se desplaza en horizontal
 * dentro de su marco, con una pista visible; la página nunca se desborda.
 */
export function Tabla<F>({
  filas,
  columnas,
  clave,
  destacada,
  ordenInicial,
  porPagina = 15,
  titulo,
  pie,
}: {
  filas: F[];
  columnas: Columna<F>[];
  clave: (f: F) => string;
  destacada?: string | null;
  ordenInicial?: { id: string; sentido: "asc" | "desc" };
  porPagina?: number;
  titulo: string;
  /** Fila de total: siempre al final, fuera del orden y de la paginación. */
  pie?: F;
}) {
  const [orden, setOrden] = useState(ordenInicial ?? null);
  const [pagina, setPagina] = useState(0);

  const ordenadas = useMemo(() => {
    if (!orden) return filas;
    const col = columnas.find((c) => c.id === orden.id);
    if (!col?.valor) return filas;
    const f = col.valor;
    return [...filas].sort((a, b) => {
      const x = f(a);
      const y = f(b);
      if (x === null && y === null) return 0;
      if (x === null) return 1;
      if (y === null) return -1;
      const c =
        typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y), "es");
      return orden.sentido === "asc" ? c : -c;
    });
  }, [filas, columnas, orden]);

  const paginas = Math.max(1, Math.ceil(ordenadas.length / porPagina));
  // Si la entidad elegida existe, se abre la página donde está.
  const indiceDestacada = destacada ? ordenadas.findIndex((f) => clave(f) === destacada) : -1;
  const [ultimaDestacada, setUltima] = useState<string | null>(null);
  if ((destacada ?? null) !== ultimaDestacada) {
    setUltima(destacada ?? null);
    if (indiceDestacada >= 0) setPagina(Math.floor(indiceDestacada / porPagina));
  }
  const p = Math.min(pagina, paginas - 1);
  const visibles = ordenadas.slice(p * porPagina, (p + 1) * porPagina);

  const ordenarPor = (id: string) => {
    setPagina(0);
    setOrden((o) =>
      o?.id === id ? { id, sentido: o.sentido === "desc" ? "asc" : "desc" } : { id, sentido: "desc" },
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-small text-neutral-700 md:hidden">{t.pista}</p>
      <div
        className="relative overflow-x-auto rounded-md border border-neutral-100"
        tabIndex={0}
        role="region"
        aria-label={titulo}
      >
        <table className="w-full min-w-[36rem] border-collapse text-small">
          <caption className="sr-only">{titulo}</caption>
          <thead className="bg-neutral-50">
            <tr>
              {columnas.map((c, i) => {
                const activa = orden?.id === c.id;
                return (
                  <th
                    key={c.id}
                    scope="col"
                    aria-sort={activa ? (orden.sentido === "asc" ? "ascending" : "descending") : undefined}
                    title={c.titulo}
                    className={`whitespace-nowrap px-3 py-2.5 font-semibold text-neutral-900 ${c.numerica ? "text-right" : "text-left"} ${i === 0 ? "sticky left-0 z-10 bg-neutral-50" : ""} ${c.secundaria ? "hidden md:table-cell" : ""}`}
                  >
                    {c.valor ? (
                      <button
                        type="button"
                        onClick={() => ordenarPor(c.id)}
                        className={`inline-flex min-h-8 items-center gap-1 rounded-sm hover:text-purple-900 ${c.numerica ? "flex-row-reverse" : ""}`}
                      >
                        {c.etiqueta}
                        <span aria-hidden="true" className={activa ? "text-purple-700" : "text-neutral-300"}>
                          {activa && orden.sentido === "asc" ? "↑" : "↓"}
                        </span>
                      </button>
                    ) : (
                      c.etiqueta
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {visibles.map((f) => {
              const k = clave(f);
              const esta = k === destacada;
              return (
                <tr
                  key={k}
                  className={`border-t border-neutral-100 ${esta ? "bg-green-100" : "bg-neutral-0"}`}
                  aria-current={esta ? "true" : undefined}
                >
                  {columnas.map((c, i) => (
                    <td
                      key={c.id}
                      className={`px-3 py-2 align-top ${c.numerica ? "tnum whitespace-nowrap text-right" : ""} ${i === 0 ? `sticky left-0 z-[1] max-w-[14rem] md:max-w-[22rem] ${esta ? "bg-green-100 font-semibold" : "bg-neutral-0"}` : ""} ${c.secundaria ? "hidden md:table-cell" : ""}`}
                    >
                      {c.celda(f)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
          {pie ? (
            <tfoot>
              <tr className="border-t-2 border-neutral-300 bg-neutral-50 font-semibold">
                {columnas.map((c, i) => (
                  <td
                    key={c.id}
                    className={`px-3 py-2.5 ${c.numerica ? "tnum whitespace-nowrap text-right" : ""} ${i === 0 ? "sticky left-0 z-[1] bg-neutral-50" : ""} ${c.secundaria ? "hidden md:table-cell" : ""}`}
                  >
                    {c.celda(pie)}
                  </td>
                ))}
              </tr>
            </tfoot>
          ) : null}
        </table>
      </div>
      {paginas > 1 ? (
        <nav
          aria-label={`Páginas de ${titulo}`}
          className="flex flex-wrap items-center justify-between gap-2 text-small text-neutral-700"
        >
          <span className="tnum">
            {p * porPagina + 1}–{Math.min((p + 1) * porPagina, ordenadas.length)} {t.de} {ordenadas.length}
          </span>
          <span className="flex gap-2">
            <button
              type="button"
              disabled={p === 0}
              onClick={() => setPagina(p - 1)}
              className="min-h-10 rounded-md border border-neutral-300 px-3 text-neutral-900 hover:border-purple-500 disabled:opacity-40"
            >
              {t.anteriores}
            </button>
            <button
              type="button"
              disabled={p >= paginas - 1}
              onClick={() => setPagina(p + 1)}
              className="min-h-10 rounded-md border border-neutral-300 px-3 text-neutral-900 hover:border-purple-500 disabled:opacity-40"
            >
              {t.siguientes}
            </button>
          </span>
        </nav>
      ) : null}
    </div>
  );
}

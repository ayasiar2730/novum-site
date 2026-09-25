import type { ReactNode } from "react";
import { redes, site } from "@/content/site";

type Red = (typeof redes)[number]["red"];

/** Glifos monocromos (currentColor) de cada red, en una retícula de 24. Decorativos: el nombre va en aria-label. */
const GLIFOS: Record<Red, ReactNode> = {
  linkedin: (
    <>
      <rect
        x="2.5"
        y="2.5"
        width="19"
        height="19"
        rx="4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="8.2" cy="8.3" r="1.3" fill="currentColor" />
      <path
        d="M7 10.6h2.4v6.9H7zM11.2 10.6h2.3v1c.45-.72 1.3-1.2 2.4-1.2 1.9 0 2.9 1.2 2.9 3.4v3.7h-2.4v-3.4c0-1-.36-1.6-1.25-1.6-.86 0-1.55.57-1.55 1.65v3.35h-2.4z"
        fill="currentColor"
      />
    </>
  ),
  instagram: (
    <>
      <rect
        x="2.5"
        y="2.5"
        width="19"
        height="19"
        rx="5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="12" r="4.3" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.3" cy="6.7" r="1.15" fill="currentColor" />
    </>
  ),
  facebook: (
    <>
      <circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M13.1 21.4v-7.2h2.3l.35-2.7H13.1V9.8c0-.78.22-1.3 1.34-1.3h1.43V6.1a19 19 0 0 0-2.08-.1c-2.06 0-3.47 1.26-3.47 3.57v1.93H8v2.7h2.32v7.2"
        fill="currentColor"
      />
    </>
  ),
};

/**
 * Las redes de Novum como botones de 44 px con su glifo (el nombre, en
 * aria-label). `tono="oscuro"` para la banda de contacto.
 */
export function RedesSociales({ tono = "claro" }: { tono?: "claro" | "oscuro" }) {
  const clase =
    tono === "oscuro"
      ? "border-white/20 text-white hover:border-green-300 hover:text-green-300"
      : "border-neutral-100 bg-neutral-0 text-neutral-700 hover:border-purple-500 hover:text-purple-900";
  return (
    <ul className="flex flex-wrap gap-2">
      {redes.map((r) => (
        <li key={r.red}>
          <a
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${site.name} en ${r.nombre}`}
            title={r.nombre}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-md border transition-colors duration-200 ${clase}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              {GLIFOS[r.red]}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}

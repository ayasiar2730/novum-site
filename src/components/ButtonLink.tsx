import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "onDark" | "onDarkSecondary";
type Size = "md" | "sm";

const base =
  "group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold transition-[background-color,border-color,color,box-shadow,transform] duration-200 active:translate-y-px";

const sizes: Record<Size, string> = {
  md: "h-12 px-5 text-small",
  sm: "h-11 px-4 text-small",
};

const variants: Record<Variant, string> = {
  primary: "bg-purple-700 text-white shadow-button hover:bg-purple-900 hover:shadow-button-hover",
  secondary:
    "border border-neutral-300 bg-neutral-0 text-neutral-900 hover:border-purple-500 hover:text-purple-900",
  onDark: "bg-green-500 text-purple-900 shadow-button-result hover:bg-green-300",
  onDarkSecondary: "border border-white/30 text-white hover:border-white/70 hover:bg-white/5",
};

function Arrow() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="transition-transform duration-200 group-hover:translate-x-0.5"
    >
      <path
        d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  external = false,
  arrow = false,
  download,
  className = "",
  ariaLabel,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  external?: boolean;
  arrow?: boolean;
  /** Nombre con el que se guarda el archivo (p. ej. el PDF de un informe). */
  download?: string;
  className?: string;
  /** Nombre accesible cuando el texto visible es una forma corta. */
  ariaLabel?: string;
}) {
  const clases = `${base} ${sizes[size]} ${variants[variant]} ${className}`;
  const contenido = (
    <>
      {children}
      {arrow ? <Arrow /> : null}
    </>
  );
  // Rutas propias: navegación de cliente entre páginas (fase 2). Descargas y enlaces externos: <a>.
  if (href.startsWith("/") && !external && !download) {
    return (
      <Link href={href} className={clases} aria-label={ariaLabel}>
        {contenido}
      </Link>
    );
  }
  const externalProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <a href={href} className={clases} download={download} aria-label={ariaLabel} {...externalProps}>
      {contenido}
    </a>
  );
}

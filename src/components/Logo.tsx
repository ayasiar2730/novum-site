import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import { site } from "@/content/site";

type Variant = "light" | "dark" | "mark";

/**
 * Marca (Brand Master v1, public/brand/README.md). Para cada pieza se prefiere
 * el SVG definitivo y, mientras no exista, el PNG provisional; reemplazar uno
 * por otro es cambiar archivos: el tamaño lo fija la altura en CSS y el ancho
 * sigue la proporción intrínseca del archivo, así que nada se deforma.
 *
 *  - light: logo.svg (imagotipo horizontal) o, si no existe, isotipo + wordmark.
 *  - dark:  logo-dark.svg sobre superficies morado oscuro; sin él, marcador tipográfico.
 *  - mark:  isotipo solo.
 *
 * Nunca se recrea el logo en código.
 */
const candidates = {
  logo: ["logo.svg", "logo.png"],
  logoDark: ["logo-dark.svg", "logo-dark.png"],
  isotipo: ["isotipo.svg", "isotipo.png"],
  wordmark: ["wordmark.svg", "wordmark.png"],
} as const;

/** Dimensiones intrínsecas de los PNG provisionales (proporción para evitar saltos de layout). */
const intrinsicPng: Record<string, { width: number; height: number }> = {
  "isotipo.png": { width: 939, height: 904 },
  "wordmark.png": { width: 1119, height: 343 },
};

const brandDir = () => path.join(process.cwd(), "public", "brand");

function pick(files: readonly string[]) {
  return files.find((f) => existsSync(path.join(brandDir(), f))) ?? null;
}

/** Proporción del archivo: el viewBox del SVG o la tabla de los PNG. */
function dims(file: string) {
  if (file.endsWith(".svg")) {
    const svg = readFileSync(path.join(brandDir(), file), "utf8");
    const m = svg.match(/viewBox\s*=\s*"[\s,]*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
    if (m) return { width: Math.round(Number(m[1])), height: Math.round(Number(m[2])) };
  }
  return intrinsicPng[file] ?? { width: 160, height: 40 };
}

function Asset({ file, className, sizes }: { file: string; className: string; sizes: string }) {
  const d = dims(file);
  return (
    <Image
      src={`/brand/${file}`}
      alt=""
      width={d.width}
      height={d.height}
      priority
      sizes={sizes}
      unoptimized={file.endsWith(".svg")}
      className={className}
    />
  );
}

export function Logo({ variant = "light", className = "" }: { variant?: Variant; className?: string }) {
  const isotipo = pick(candidates.isotipo);
  const wordmark = pick(candidates.wordmark);
  const logo = pick(candidates.logo);
  const logoDark = pick(candidates.logoDark);

  if (variant === "mark" && isotipo) {
    return (
      <span role="img" aria-label={site.name} className={`inline-flex ${className}`}>
        <Asset file={isotipo} className="h-10 w-auto" sizes="40px" />
      </span>
    );
  }

  if (variant === "dark" && logoDark) {
    return (
      <span role="img" aria-label={site.name} className={`inline-flex ${className}`}>
        <Asset file={logoDark} className="h-9 w-auto lg:h-10" sizes="180px" />
      </span>
    );
  }

  if (variant === "light" && logo) {
    return (
      <span role="img" aria-label={site.name} className={`inline-flex ${className}`}>
        <Asset file={logo} className="h-9 w-auto lg:h-10" sizes="180px" />
      </span>
    );
  }

  if (variant === "light" && isotipo && wordmark) {
    // Imagotipo horizontal compuesto: isotipo + «novúm INTEGRAL», sin eslogan.
    return (
      <span role="img" aria-label={site.name} className={`inline-flex items-center gap-2.5 ${className}`}>
        <Asset file={isotipo} className="h-9 w-auto lg:h-10" sizes="40px" />
        <Asset file={wordmark} className="h-[1.5rem] w-auto lg:h-[1.75rem]" sizes="96px" />
      </span>
    );
  }

  const onDark = variant === "dark";
  return (
    <span
      role="img"
      aria-label={site.name}
      className={`inline-flex flex-col items-start leading-none ${className}`}
    >
      <span
        className={`text-[1.375rem] font-bold tracking-[-0.02em] ${onDark ? "text-white" : "text-purple-900"}`}
      >
        novum
      </span>
      <span className={`mt-1 text-label uppercase ${onDark ? "text-green-300" : "text-green-700"}`}>
        Integral
      </span>
    </span>
  );
}

import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import { site } from "@/content/site";

type Variant = "light" | "dark" | "mark";

/**
 * Rutas canónicas del logo (docs/NOVUM-WEB-MASTER-PROMPT-v2.md §9 y public/brand/README.md).
 * Para cada pieza se prefiere el SVG y, si no existe, el PNG provisional. Reemplazar
 * PNG → SVG es cambiar archivos: el layout lo fija la altura en CSS, no el archivo.
 * Sobre fondo oscuro no hay versión del logo todavía: se mantiene el marcador tipográfico.
 * Nunca se recrea el logo en código.
 */
const candidates = {
  logo: ["logo.svg", "logo.png"],
  isotipo: ["isotipo.svg", "isotipo.png"],
  wordmark: ["wordmark.svg", "wordmark.png"],
} as const;

/** Dimensiones intrínsecas de los PNG provisionales (relación de aspecto para evitar saltos de layout). */
const intrinsic: Record<string, { width: number; height: number }> = {
  "isotipo.png": { width: 939, height: 904 },
  "wordmark.png": { width: 1119, height: 343 },
};

function pick(files: readonly string[]) {
  return files.find((f) => existsSync(path.join(process.cwd(), "public", "brand", f))) ?? null;
}

function Asset({ file, className, sizes }: { file: string; className: string; sizes: string }) {
  const dims = intrinsic[file] ?? { width: 160, height: 40 };
  return (
    <Image
      src={`/brand/${file}`}
      alt=""
      width={dims.width}
      height={dims.height}
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

  if (variant === "mark" && isotipo) {
    return (
      <span role="img" aria-label={site.name} className={`inline-flex ${className}`}>
        <Asset file={isotipo} className="h-10 w-auto" sizes="40px" />
      </span>
    );
  }

  if (variant === "light" && logo) {
    return (
      <span role="img" aria-label={site.name} className={`inline-flex ${className}`}>
        <Asset file={logo} className="h-10 w-auto" sizes="200px" />
      </span>
    );
  }

  if (variant === "light" && isotipo && wordmark) {
    // Imagotipo horizontal: isotipo + «novúm INTEGRAL», sin eslogan.
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

import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import { site } from "@/content/site";

type Variant = "light" | "dark" | "mark";

/**
 * Rutas canónicas del logo (docs/NOVUM-WEB-MASTER-PROMPT-v2.md §9).
 * Cuando el SVG oficial exista en public/brand/, este componente lo usa
 * automáticamente: el reemplazo es cambiar archivos, no código.
 * Mientras tanto muestra un marcador tipográfico. Nunca recrea el logo.
 */
const files: Record<Variant, string> = {
  light: "logo.svg",
  dark: "logo-dark.svg",
  mark: "isotipo.svg",
};

function assetExists(file: string) {
  return existsSync(path.join(process.cwd(), "public", "brand", file));
}

export function Logo({ variant = "light", className = "" }: { variant?: Variant; className?: string }) {
  const file = files[variant];

  if (assetExists(file)) {
    const isMark = variant === "mark";
    return (
      <Image
        src={`/brand/${file}`}
        alt={site.name}
        width={isMark ? 40 : 160}
        height={40}
        priority={variant !== "mark"}
        unoptimized
        className={`h-10 w-auto ${className}`}
      />
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

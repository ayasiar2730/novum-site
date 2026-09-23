/* Hooks de resolución para correr el TypeScript de `src/` desde Node, sin compilar
   ni dependencias: el alias `@/` → `src/`, importar sin extensión (`x` → `x.ts`)
   y tratar los `.ts` como módulos ES (Node ≥ 22.18 quita los tipos por sí mismo).
   Lo registra `scripts/_ts.mjs`. */
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(RAIZ, "src");

const esArchivo = (p) => existsSync(p) && statSync(p).isFile();

function aArchivo(base) {
  if (esArchivo(base)) return base;
  for (const ext of [".ts", ".tsx", ".mjs", ".js"]) if (esArchivo(base + ext)) return base + ext;
  for (const idx of ["index.ts", "index.js"])
    if (esArchivo(path.join(base, idx))) return path.join(base, idx);
  return null;
}

export async function resolve(especificador, contexto, siguiente) {
  let base = null;
  if (especificador.startsWith("@/")) base = path.join(SRC, especificador.slice(2));
  else if (
    (especificador.startsWith("./") || especificador.startsWith("../")) &&
    contexto.parentURL?.startsWith("file:")
  )
    base = path.resolve(path.dirname(fileURLToPath(contexto.parentURL)), especificador);
  if (base) {
    const archivo = aArchivo(base);
    if (archivo) return siguiente(pathToFileURL(archivo).href, contexto);
  }
  return siguiente(especificador, contexto);
}

export async function load(url, contexto, siguiente) {
  if (url.startsWith("file:") && url.endsWith(".ts"))
    return siguiente(url, { ...contexto, format: "module-typescript" });
  return siguiente(url, contexto);
}

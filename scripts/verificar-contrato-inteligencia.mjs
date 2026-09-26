// Compara la copia del contrato de Inteligencia sectorial con el original de SIAR-AYA (repositorio hermano).
// Uso: node scripts/verificar-contrato-inteligencia.mjs [ruta-a-SIAR-AYA]   (por defecto ../SIAR-AYA)
// Sale con 1 si difieren; si el repo de SIAR no está en la máquina, lo dice y sale con 0 (no es un error del sitio).
import fs from "node:fs";
import path from "node:path";

const siar = path.resolve(process.argv[2] ?? path.join(process.cwd(), "..", "SIAR-AYA"));
const original = path.join(siar, "src/lib/motor-sectorial/inteligencia-contrato.ts");
const copia = path.join(process.cwd(), "src/lib/inteligencia/contrato.ts");
if (!fs.existsSync(original)) {
  console.log(`(sin SIAR-AYA en ${siar}: no se compara)`);
  process.exit(0);
}
const limpiar = (s) => s.replace(/\r\n/g, "\n").trim();
const a = limpiar(fs.readFileSync(original, "utf8"));
// La copia lleva dos líneas de cabecera que dicen de dónde viene.
const b = limpiar(fs.readFileSync(copia, "utf8").split("\n").slice(2).join("\n"));
if (a !== b) {
  console.error("✗ El contrato de novum-site NO es la copia literal del de SIAR. Copie el de SIAR (ver cabecera).");
  process.exit(1);
}
console.log("✓ contrato idéntico al de SIAR-AYA");

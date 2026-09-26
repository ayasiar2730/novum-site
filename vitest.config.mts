import path from "node:path";
import { defineConfig } from "vitest/config";

// Pruebas de lógica pura (sin navegador): src/**/__tests__/*.test.ts. Las pruebas de pantalla y responsive se
// corren con Chrome sin ventana (ver docs/inteligencia-sectorial.md §Verificación).
export default defineConfig({
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
  test: { include: ["src/**/__tests__/*.test.ts"], environment: "node" },
});

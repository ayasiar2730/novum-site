/* Cargador: `node --import ./scripts/_ts.mjs <script>` corre el TypeScript de `src/`
   (alias `@/`, imports sin extensión) con el desmontaje de tipos nativo de Node. */
const [mayor, menor] = process.versions.node.split(".").map(Number);
if (mayor < 22 || (mayor === 22 && menor < 18)) {
  console.error(
    `Hace falta Node ≥ 22.18 para correr TypeScript sin compilar (este es ${process.versions.node}).`,
  );
  process.exit(1);
}
const { register } = await import("node:module");
register("./_ts-hooks.mjs", import.meta.url);

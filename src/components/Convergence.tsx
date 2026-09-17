/**
 * Transición al cierre (B1.7): todo el recorrido conduce aquí. Varias líneas
 * del sistema convergen en un único nodo verde —el eco de DECISIÓN del hero—
 * que se monta sobre el borde de la banda oscura. Decorativo; sin bucles.
 */
export function Convergence() {
  const W = 1200;
  const H = 140;
  const target = { x: W / 2, y: H };
  /* seis orígenes = los seis nodos de capacidades de Nosotros (rejilla de seis columnas) */
  const origins = [0, 1, 2, 3, 4, 5].map((i) => (i * W) / 6 + 6);
  return (
    <div aria-hidden="true" className="container-site relative z-[1] -mb-3 lg:-mt-10">
      <div className="mx-auto flex h-24 w-3 flex-col items-center lg:hidden">
        <span className="w-px flex-1 bg-purple-500/40" />
        <span className="h-3 w-3 rounded-full bg-green-500 ring-[6px] ring-green-500/25" />
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="hidden h-auto w-full overflow-visible lg:block"
        data-reveal="scale"
      >
        <defs>
          <linearGradient id="convergencia" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: "var(--color-purple-500)", stopOpacity: 0 }} />
            <stop offset="0.5" style={{ stopColor: "var(--color-purple-500)", stopOpacity: 0.45 }} />
            <stop offset="1" style={{ stopColor: "var(--color-purple-700)", stopOpacity: 0.7 }} />
          </linearGradient>
        </defs>
        {origins.map((x) => (
          <path
            key={x}
            d={`M ${x} 0 C ${x} ${H * 0.6} ${target.x} ${H * 0.35} ${target.x} ${target.y}`}
            fill="none"
            stroke="url(#convergencia)"
            strokeWidth="1.25"
          />
        ))}
        <circle
          cx={target.x}
          cy={target.y}
          r="22"
          fill="none"
          stroke="var(--color-green-500)"
          strokeOpacity="0.45"
          strokeWidth="1.5"
        />
        <circle cx={target.x} cy={target.y} r="11" fill="var(--color-green-500)" />
      </svg>
    </div>
  );
}

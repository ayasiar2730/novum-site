/**
 * Transición al cierre (B1.7): todo el recorrido conduce aquí. Varias líneas
 * del sistema convergen en un único nodo verde —el eco de DECISIÓN del hero—
 * que se monta sobre el borde de la banda oscura. Decorativo; sin bucles.
 */
export function Convergence() {
  const W = 1200;
  const H = 140;
  const target = { x: W / 2, y: H };
  const origins = [80, 300, 480, 720, 900, 1120];
  return (
    <div aria-hidden="true" className="container-site relative z-[1] -mb-3 pt-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full overflow-visible" data-reveal="scale">
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

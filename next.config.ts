import type { NextConfig } from "next";

/**
 * Sitio corporativo público — DEBE ser indexable.
 * Estas cabeceras son de seguridad; ninguna bloquea rastreo ni indexación.
 * No copiar aquí la configuración de la aplicación (app.novumintegral.com).
 */
const cabecerasSeguridad = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Fase 2: «Acompañamiento» se repartió en las siete líneas de /soluciones; los enlaces viejos no se rompen.
  async redirects() {
    return [{ source: "/acompanamiento", destination: "/soluciones", permanent: true }];
  },
  async headers() {
    return [{ source: "/(.*)", headers: cabecerasSeguridad }];
  },
};

export default nextConfig;

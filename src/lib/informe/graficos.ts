import type { DistribucionInf } from "@/lib/informe/modelo";

/**
 * Gráficos del informe en HTML + CSS (sin librería de gráficas): barras y
 * posiciones como `div` con anchos y offsets en porcentaje. Se imprimen como
 * vectores, el texto es texto real (seleccionable, con la tipografía del
 * informe) y no hay nada que medir en tiempo de ejecución. Solo dibujan cifras
 * que ya vienen formateadas en el modelo; el único número propio es la escala
 * del eje, que se rotula como escala y nunca como mínimo o máximo observado.
 */

export const esc = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const pct = (v: number) => `${Math.max(0, Math.min(100, v * 100)).toFixed(3)}%`;

/** Un tope «redondo» para la escala y su paso (1, 2, 2,5, 5 × 10ⁿ), con ~5 marcas. */
export function escala(maximo: number, marcas = 5): { tope: number; paso: number } {
  if (!(maximo > 0)) return { tope: 1, paso: 0.2 };
  const bruto = maximo / marcas;
  const potencia = 10 ** Math.floor(Math.log10(bruto));
  const paso = [1, 2, 2.5, 5, 10].map((m) => m * potencia).find((p) => p >= bruto) ?? 10 * potencia;
  return { tope: Math.ceil(maximo / paso) * paso, paso };
}

const nfEje = (decimales: number) =>
  new Intl.NumberFormat("es-CO", { minimumFractionDigits: decimales, maximumFractionDigits: decimales });

/** Barra horizontal apilada (una composición que suma 100 %), con leyenda debajo. */
export function barraApilada(
  segmentos: Array<{
    etiqueta: string;
    valor: number;
    texto: string;
    detalle?: string;
    tono: "fuerte" | "medio" | "suave" | "neutro";
  }>,
  descripcion: string,
): string {
  const partes = segmentos
    .map(
      (s) => `<span class="apilada__parte apilada__parte--${s.tono}" style="width:${pct(s.valor)}"></span>`,
    )
    .join("");
  const leyenda = segmentos
    .map(
      (s) =>
        `<li><span class="muestra muestra--${s.tono}" aria-hidden="true"></span><span class="leyenda__etiqueta">${esc(s.etiqueta)}</span><span class="leyenda__valor">${esc(s.texto)}</span>${s.detalle ? `<span class="leyenda__detalle">${esc(s.detalle)}</span>` : ""}</li>`,
    )
    .join("");
  return `<figure class="apilada" role="img" aria-label="${esc(descripcion)}"><div class="apilada__barra">${partes}</div><ul class="leyenda">${leyenda}</ul></figure>`;
}

/** El 100 % de una participación ocupa el 80 % de la pista: siempre queda sitio para el rótulo. */
const ESCALA_CATEGORIAS = 0.8;

/**
 * Barras por categoría: participación en la medida (morado) y, opcionalmente,
 * participación en entidades (neutro), en la misma escala 0–100 %.
 */
export function barrasPorCategoria(
  filas: Array<{
    etiqueta: string;
    valor: number;
    texto: string;
    entidades: string;
    valorEntidades?: number;
    textoEntidades?: string;
    esOtros?: boolean;
  }>,
  opciones: { rotuloMedida: string; rotuloEntidades?: string },
): string {
  const conEntidades = filas.some((f) => f.valorEntidades !== undefined);
  const cabecera = `<div class="categorias__cabecera"><span></span><span class="categorias__rotulo"><span class="muestra muestra--fuerte" aria-hidden="true"></span>${esc(opciones.rotuloMedida)}${
    conEntidades && opciones.rotuloEntidades
      ? ` <span class="muestra muestra--neutro" aria-hidden="true"></span>${esc(opciones.rotuloEntidades)}`
      : ""
  }</span><span class="categorias__rotulo categorias__rotulo--der">Entidades</span></div>`;
  const cuerpo = filas
    .map(
      (f) => `<div class="categorias__fila${f.esOtros ? " categorias__fila--otros" : ""}">
  <span class="categorias__etiqueta">${esc(f.etiqueta)}</span>
  <span class="categorias__barras">
    <span class="categorias__linea"><span class="categorias__barra categorias__barra--fuerte" style="width:${pct(f.valor * ESCALA_CATEGORIAS)}"></span><span class="categorias__valor">${esc(f.texto)}</span></span>
    ${
      f.valorEntidades !== undefined
        ? `<span class="categorias__linea categorias__linea--sec"><span class="categorias__barra categorias__barra--neutro" style="width:${pct(f.valorEntidades * ESCALA_CATEGORIAS)}"></span><span class="categorias__valor categorias__valor--sec">${esc(f.textoEntidades ?? "")}</span></span>`
        : ""
    }
  </span>
  <span class="categorias__entidades">${esc(f.entidades)}</span>
</div>`,
    )
    .join("");
  return `<div class="categorias">${cabecera}${cuerpo}</div>`;
}

/** Dos o tres barras en una misma escala (p. ej. deterioro frente a cartera vencida). */
export function barrasSimples(
  filas: Array<{ etiqueta: string; valor: number; texto: string; tono: "fuerte" | "medio" | "neutro" }>,
): string {
  // La barra más larga no llena la pista: se lee como cantidad, no como 100 %.
  const maximo = (Math.max(...filas.map((f) => f.valor), 0) || 1) * 1.15;
  return `<div class="simples">${filas
    .map(
      (f) =>
        `<div class="simples__fila"><span class="simples__etiqueta">${esc(f.etiqueta)}</span><span class="simples__pista"><span class="simples__barra simples__barra--${f.tono}" style="width:${pct(f.valor / maximo)}"></span></span><span class="simples__valor">${esc(f.texto)}</span></div>`,
    )
    .join("")}</div>`;
}

/**
 * La distribución de un indicador entre entidades: caja P25–P75, mediana,
 * media simple y el indicador agregado sobre un eje con escala. No hay mínimo
 * ni máximo (el snapshot no los publica: cada extremo es una sola entidad); los
 * rótulos del eje son de la ESCALA y se presentan como tal.
 */
export function distribucion(
  d: DistribucionInf,
  opciones: { compacta?: boolean; titulo?: string } = {},
): string {
  const v = d.valores;
  const maximo = Math.max(v.p75, v.media, v.agregado ?? 0) * 1.08;
  const { tope, paso } = escala(maximo, opciones.compacta ? 4 : 5);
  const x = (valor: number) => pct(valor / tope);
  const decimales = paso * 100 < 1 ? 1 : 0;
  const marcas: string[] = [];
  const cuantas = Math.round(tope / paso);
  for (let i = 0; i <= cuantas; i++) {
    const m = i * paso;
    // La primera y la última marca se alinean hacia dentro: el rótulo no sale del gráfico.
    const extremo = i === 0 ? " dist__marca--inicio" : i === cuantas ? " dist__marca--fin" : "";
    marcas.push(
      `<span class="dist__marca${extremo}" style="left:${x(m)}"><span class="dist__marca-texto">${nfEje(decimales).format(m * 100)} %</span></span>`,
    );
  }
  const elementos = [
    `<span class="dist__caja" style="left:${x(v.p25)};width:${pct((v.p75 - v.p25) / tope)}"></span>`,
    `<span class="dist__mediana" style="left:${x(v.mediana)}"></span>`,
    `<span class="dist__media" style="left:${x(v.media)}"></span>`,
    ...(v.agregado !== null ? [`<span class="dist__agregado" style="left:${x(v.agregado)}"></span>`] : []),
  ].join("");
  const leyenda = [
    ...(d.textos.agregado
      ? [
          `<li><span class="simbolo simbolo--agregado" aria-hidden="true"></span>Agregado <b>${esc(d.textos.agregado)}</b></li>`,
        ]
      : []),
    `<li><span class="simbolo simbolo--mediana" aria-hidden="true"></span>Mediana <b>${esc(d.textos.mediana)}</b></li>`,
    `<li><span class="simbolo simbolo--caja" aria-hidden="true"></span>P25–P75 <b>${esc(d.textos.p25)} – ${esc(d.textos.p75)}</b></li>`,
    `<li><span class="simbolo simbolo--media" aria-hidden="true"></span>Media simple <b>${esc(d.textos.media)}</b></li>`,
  ].join("");
  return `<figure class="dist${opciones.compacta ? " dist--compacta" : ""}">
  ${opciones.titulo ? `<figcaption class="dist__titulo">${esc(opciones.titulo)}</figcaption>` : ""}
  <div class="dist__area"><span class="dist__pista"></span>${elementos}</div>
  <div class="dist__eje" aria-hidden="true">${marcas.join("")}</div>
  <ul class="dist__leyenda">${leyenda}</ul>
  ${opciones.compacta ? "" : `<p class="dist__nota">Distribución entre ${esc(d.n)} entidades con dato. La escala del eje es de referencia; no se publican mínimo ni máximo porque cada extremo corresponde a una sola entidad.</p>`}
</figure>`;
}

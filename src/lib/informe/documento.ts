import { barraApilada, barrasPorCategoria, barrasSimples, distribucion, esc } from "@/lib/informe/graficos";
import type { HallazgoInf, IndicadorInf, InformeModelo, SeccionId } from "@/lib/informe/modelo";
import { SECCIONES } from "@/lib/informe/modelo";

/**
 * El informe como un documento HTML de páginas A4 FIJAS: cada `.pagina` mide
 * 210 × 297 mm, lleva su propio encabezado, pie y número, y el cuerpo tiene
 * una altura fija. El generador comprueba en Chrome que ningún cuerpo se
 * desborda antes de imprimir: un informe no se corta en silencio.
 *
 * Todo el texto viene del modelo (y el modelo, del snapshot). Aquí solo hay
 * estructura, rótulos y las frases fijas del propio informe (cómo leerlo, la
 * nota de suficiencia, el cierre), que no contienen cifras.
 */

export interface Recursos {
  /** CSS del informe (con las fuentes ya embebidas). */
  css: string;
  /** `data:` URIs de la marca. */
  logo: string;
  isotipo: string;
}

interface Pagina {
  seccion: SeccionId;
  marco: boolean;
  clase?: string;
  cuerpo: string;
}

const fragmentos = <T>(xs: T[], n: number): T[][] =>
  xs.reduce<T[][]>((a, x, i) => (i % n ? a[a.length - 1].push(x) : a.push([x]), a), []);

function cabeceraDeSeccion(id: SeccionId): string {
  const s = SECCIONES[id];
  return `<header class="seccion">
  <p class="seccion__numero" aria-hidden="true">${s.numero}</p>
  <div class="seccion__textos">
    <h2 class="seccion__titulo">${esc(s.titulo)}</h2>
    ${s.pregunta ? `<p class="seccion__pregunta">${esc(s.pregunta)}</p>` : ""}
  </div>
</header>`;
}

const rotulo = (texto: string, tono: "morado" | "neutro" | "verde" = "morado") =>
  `<p class="rotulo rotulo--${tono}"><span class="rotulo__nodo" aria-hidden="true"></span>${esc(texto)}</p>`;

const parrafos = (xs: string[]) => xs.map((p) => `<p class="texto">${esc(p)}</p>`).join("");

function lectura(h: HallazgoInf | undefined): string {
  if (!h) return "";
  return `<aside class="lectura"><p class="lectura__rotulo">Lectura Novum</p><p class="lectura__titulo">${esc(h.titulo)}</p><p class="lectura__texto">${esc(h.lectura)}</p></aside>`;
}

function cifraGrande(texto: string, unidad: string, etiqueta: string, pie?: string): string {
  return `<div class="cifra">
  <p class="cifra__etiqueta">${esc(etiqueta)}</p>
  <p class="cifra__valor">${esc(texto)}${unidad ? `<span class="cifra__unidad">${esc(unidad)}</span>` : ""}</p>
  ${pie ? `<p class="cifra__pie">${esc(pie)}</p>` : ""}
</div>`;
}

function definicionIndicador(i: IndicadorInf): string {
  return `<dl class="definicion">
  <div><dt>Definición</dt><dd>${esc(i.definicion)}</dd></div>
  ${i.formula ? `<div><dt>Fórmula</dt><dd>${esc(i.formula)}</dd></div>` : ""}
  ${i.nota && !i.definicion.includes(i.nota) ? `<div><dt>Nota</dt><dd>${esc(i.nota.replace(i.definicion, "").trim())}</dd></div>` : ""}
</dl>`;
}

function filaIndicador(i: IndicadorInf): string {
  const d = i.distribucion;
  return `<tr><th scope="row">${esc(i.etiqueta)}</th><td class="num fuerte">${esc(i.agregado ?? "—")}</td><td class="num">${esc(d?.textos.p25 ?? "—")}</td><td class="num">${esc(d?.textos.mediana ?? "—")}</td><td class="num">${esc(d?.textos.p75 ?? "—")}</td><td class="num">${esc(d?.textos.media ?? "—")}</td><td class="num">${esc(d?.n ?? "—")}</td></tr>`;
}

function tablaIndicadores(xs: IndicadorInf[]): string {
  return `<table class="tabla">
  <thead><tr><th scope="col">Indicador</th><th scope="col" class="num">Agregado</th><th scope="col" class="num">P25</th><th scope="col" class="num">Mediana</th><th scope="col" class="num">P75</th><th scope="col" class="num">Media</th><th scope="col" class="num">Entidades</th></tr></thead>
  <tbody>${xs.map(filaIndicador).join("")}</tbody>
</table>`;
}

/** Construye el HTML completo del informe. */
export function documento(m: InformeModelo, r: Recursos): { html: string; paginas: number } {
  const hallazgoDe = (id: SeccionId) => m.hallazgos.find((h) => h.seccion === id);
  const paginas: Pagina[] = [];

  // 01 Portada ───────────────────────────────────────────────────────────────
  paginas.push({
    seccion: "portada",
    marco: false,
    clase: "pagina--portada",
    cuerpo: `<div class="portada">
  <div class="portada__arriba">
    <img class="portada__logo" src="${r.logo}" alt="Novum Integral" />
    <p class="portada__fecha">Publicación: ${esc(m.publicado)}</p>
  </div>
  <svg class="portada__red" viewBox="0 0 400 400" aria-hidden="true" data-sangrado>
    <g fill="none" stroke="currentColor" stroke-width="1.2">
      <circle cx="200" cy="200" r="150" opacity=".35" />
      <circle cx="200" cy="200" r="92" opacity=".55" />
      <path d="M200 50 L200 108 M350 200 L292 200 M200 350 L200 292 M50 200 L108 200 M306 94 L265 135 M94 306 L135 265" opacity=".55" />
    </g>
    <g class="portada__nodos">
      <rect x="180" y="180" width="40" height="40" rx="8" />
      <circle cx="200" cy="50" r="7" /><circle cx="350" cy="200" r="7" /><circle cx="200" cy="350" r="7" /><circle cx="50" cy="200" r="7" /><circle cx="306" cy="94" r="5" /><circle cx="94" cy="306" r="5" />
    </g>
  </svg>
  <div class="portada__titulos">
    <p class="portada__rotulo">${esc(m.titulo)}</p>
    <h1 class="portada__titulo">${esc(m.subtitulo)}<span>${esc(m.corteEtiqueta)}</span></h1>
    <p class="portada__alcance">Dimensión, calidad de cartera, deterioro y estructura del universo analizado</p>
  </div>
  <dl class="portada__datos">
    <div><dt>Universo analizado</dt><dd>${esc(m.corte.nUniverso)} de ${esc(m.corte.nReportantes)} entidades reportantes</dd></div>
    <div><dt>Cobertura</dt><dd>${esc(m.corte.estadoEtiqueta)}</dd></div>
    <div><dt>Fuente de datos</dt><dd>${esc(m.fuente.datos)}</dd></div>
    <div><dt>Procesamiento y lectura</dt><dd>${esc(m.fuente.procesamiento)}</dd></div>
  </dl>
</div>`,
  });

  // 02 Alcance ───────────────────────────────────────────────────────────────
  const indiceMarcador = "%%INDICE%%";
  paginas.push({
    seccion: "alcance",
    marco: true,
    cuerpo: `${cabeceraDeSeccion("alcance")}
<div class="alcance">
  <dl class="ficha">
    <div><dt>Fecha de corte</dt><dd>${esc(m.corte.fecha)}</dd></div>
    <div><dt>Fecha de procesamiento</dt><dd>${esc(m.corte.procesado)}</dd></div>
    <div><dt>Universo</dt><dd><b>${esc(m.corte.nUniverso)}</b> entidades de <b>${esc(m.corte.nReportantes)}</b> reportantes</dd><dd class="ficha__nota">${esc(m.metodologia.universoDefinicion)}</dd></div>
    <div><dt>Cobertura</dt><dd><span class="estado estado--${m.corte.estado}">${esc(m.corte.estadoEtiqueta)}</span></dd><dd class="ficha__nota">${esc(m.corte.cobertura)}</dd></div>
    <div><dt>Fuente de datos</dt><dd>${esc(m.fuente.datos)}</dd>${m.fuente.datosDescripcion ? `<dd class="ficha__nota">${esc(m.fuente.datosDescripcion)}</dd>` : ""}</div>
    <div><dt>Procesamiento y lectura</dt><dd>${esc(m.fuente.procesamiento)}</dd>${m.fuente.procesamientoDescripcion ? `<dd class="ficha__nota">${esc(m.fuente.procesamientoDescripcion)}</dd>` : ""}</div>
    <div><dt>Metodología</dt><dd>${esc(m.metodologia.nombre)}</dd><dd class="ficha__nota">Versión ${esc(m.metodologia.version)}</dd></div>
  </dl>
  <div class="alcance__lateral">
    ${rotulo("Contenido")}
    ${indiceMarcador}
    <div class="como-leer">
      ${rotulo("Cómo leer este informe", "neutro")}
      <p><span class="clave clave--dato">Dato del corte</span> Cifra calculada por el motor sectorial sobre los archivos oficiales. No lleva interpretación.</p>
      <p><span class="clave clave--lectura">Lectura Novum</span> Interpretación de Novum Integral sobre el dato. No es una posición de la Supersolidaria.</p>
      <p><span class="clave clave--hallazgo"><span class="punto" aria-hidden="true"></span>Hallazgo</span> Lo que el resumen ejecutivo destaca del corte.</p>
    </div>
  </div>
</div>`,
  });

  // 03 Resumen ejecutivo ─────────────────────────────────────────────────────
  // Cifras clave del corte (todas ya formateadas y trazadas en el modelo), al pie del resumen.
  const clave: Array<{ etiqueta: string; valor: string; seccion: SeccionId }> = [
    {
      etiqueta: "Entidades en el universo",
      valor: `${m.corte.nUniverso} de ${m.corte.nReportantes} reportantes`,
      seccion: "alcance",
    },
    {
      etiqueta: m.dimension.bruta.etiqueta,
      valor: `${m.dimension.bruta.texto} billones de pesos`,
      seccion: "dimension",
    },
    ...m.dimension.secundarias
      .filter((c) => /vencida/i.test(c.etiqueta))
      .map((c) => ({
        etiqueta: c.etiqueta,
        valor: `${c.texto} billones de pesos`,
        seccion: "dimension" as SeccionId,
      })),
    ...(m.calidad.icm?.agregado
      ? [
          {
            etiqueta: `${m.calidad.icm.etiqueta} agregado`,
            valor: m.calidad.icm.agregado,
            seccion: "calidad" as SeccionId,
          },
        ]
      : []),
    ...(m.calidad.icm?.distribucion
      ? [
          {
            etiqueta: `${m.calidad.icm.etiqueta}: mediana entre entidades`,
            valor: m.calidad.icm.distribucion.textos.mediana,
            seccion: "calidad" as SeccionId,
          },
        ]
      : []),
    ...(m.calidad.icv?.agregado
      ? [
          {
            etiqueta: `${m.calidad.icv.etiqueta} agregado`,
            valor: m.calidad.icv.agregado,
            seccion: "calidad" as SeccionId,
          },
        ]
      : []),
    ...(m.cobertura.cobertura?.agregado
      ? [
          {
            etiqueta: `${m.cobertura.cobertura.etiqueta} agregada`,
            valor: m.cobertura.cobertura.agregado,
            seccion: "cobertura" as SeccionId,
          },
        ]
      : []),
    ...(m.territorio?.concentracion
      ? [
          {
            etiqueta: "Tres departamentos con más cartera",
            valor: m.territorio.concentracion.texto,
            seccion: "territorio" as SeccionId,
          },
        ]
      : []),
  ];
  const tablaClave = `<section class="clave-cifras">${rotulo("Cifras clave del corte", "neutro")}<table class="tabla"><thead><tr><th scope="col">Cifra</th><th scope="col" class="num">Valor</th><th scope="col" class="num">Sección</th></tr></thead><tbody>${clave
    .map(
      (c) =>
        `<tr><th scope="row">${esc(c.etiqueta)}</th><td class="num fuerte">${esc(c.valor)}</td><td class="num"><span class="ref" data-ref="${c.seccion}">${SECCIONES[c.seccion].numero}</span></td></tr>`,
    )
    .join("")}</tbody></table></section>`;
  const grupos = fragmentos(m.hallazgos, 3);
  grupos.forEach((grupo, gi) => {
    paginas.push({
      seccion: "resumen",
      marco: true,
      cuerpo: `${gi === 0 ? `${cabeceraDeSeccion("resumen")}<p class="entrada">El dato sale del motor sectorial; la lectura es de Novum. Cada hallazgo remite a la sección donde se desarrolla.</p>` : `<p class="continuacion">${esc(SECCIONES.resumen.titulo)} · continuación</p>`}
<ol class="hallazgos" start="${gi * 3 + 1}">
${grupo
  .map(
    (h) => `<li class="hallazgo">
  <div class="hallazgo__dato">
    <p class="hallazgo__clase"><span class="punto" aria-hidden="true"></span>${esc(h.clasificacion)}</p>
    <p class="hallazgo__cifra">${esc(h.cifraTexto)}${h.cifraUnidad ? `<span>${esc(h.cifraUnidad)}</span>` : ""}</p>
    <p class="hallazgo__etiqueta">${esc(h.cifraEtiqueta)}</p>
    <p class="hallazgo__tipo">Dato del corte</p>
  </div>
  <div class="hallazgo__lectura">
    <h3 class="hallazgo__titulo">${esc(h.titulo)}</h3>
    <div class="lectura lectura--resumen"><p class="lectura__rotulo">Lectura Novum</p><p class="lectura__texto">${esc(h.lectura)}</p></div>
    <p class="hallazgo__universo">${esc(h.universo)} · <span class="ref" data-ref="${h.seccion}">Sección ${SECCIONES[h.seccion].numero}</span></p>
  </div>
</li>`,
  )
  .join("")}
</ol>
${gi === grupos.length - 1 && grupo.length < 3 ? tablaClave : ""}`,
    });
  });
  if (grupos.length && grupos[grupos.length - 1].length === 3) {
    paginas.push({
      seccion: "resumen",
      marco: true,
      cuerpo: `<p class="continuacion">${esc(SECCIONES.resumen.titulo)} · continuación</p>${tablaClave}`,
    });
  }

  // 04 Dimensión ─────────────────────────────────────────────────────────────
  const dm = m.dimension;
  paginas.push({
    seccion: "dimension",
    marco: true,
    cuerpo: `${cabeceraDeSeccion("dimension")}
<div class="doble">
  ${cifraGrande(dm.bruta.texto, dm.bruta.unidad, dm.bruta.etiqueta, dm.bruta.definicion)}
  <div class="secundarias">
    ${rotulo("Otras magnitudes del corte", "neutro")}
    <dl class="magnitudes">
      ${dm.secundarias.map((c) => `<div><dt>${esc(c.etiqueta)}</dt><dd><b>${esc(c.texto)}</b> ${esc(c.unidad)}</dd>${c.nota ? `<dd class="magnitudes__nota">${esc(c.nota)}</dd>` : ""}</div>`).join("")}
      ${dm.asociados ? `<div><dt>${esc(dm.asociados.etiqueta)}</dt><dd><b>${esc(dm.asociados.texto)}</b></dd>${dm.asociados.nota ? `<dd class="magnitudes__nota">${esc(dm.asociados.nota)}</dd>` : ""}</div>` : ""}
    </dl>
  </div>
</div>
${parrafos(dm.parrafos)}
${
  dm.calificacion
    ? `<section class="bloque">${rotulo("La cartera bruta por calificación")}${barraApilada(
        dm.calificacion.map((c, i) => ({
          etiqueta: c.etiqueta,
          valor: c.valor,
          texto: c.participacion,
          detalle: `${c.texto} billones`,
          tono: (["suave", "medio", "fuerte"] as const)[i] ?? "neutro",
        })),
        "Composición de la cartera bruta por calificación",
      )}<p class="nota">A = cartera bruta − cartera vencida; B = cartera vencida − cartera en C–E. Restas exactas entre cifras del corte.</p></section>`
    : ""
}
${lectura(hallazgoDe("dimension"))}`,
  });

  // 05 Calidad de cartera ────────────────────────────────────────────────────
  const { icm, icv } = m.calidad;
  paginas.push({
    seccion: "calidad",
    marco: true,
    cuerpo: `${cabeceraDeSeccion("calidad")}
${
  icm
    ? `<div class="doble doble--indicador">
  ${cifraGrande(icm.agregado ?? "—", "", `${icm.etiqueta} agregado`, "Cartera vencida sobre cartera bruta, sumando todas las entidades del universo.")}
  ${icm.distribucion ? distribucion(icm.distribucion, { titulo: `Distribución del ${icm.etiqueta} entre entidades` }) : ""}
</div>
${definicionIndicador(icm)}`
    : ""
}
${parrafos(m.calidad.parrafos)}
${
  icv?.distribucion
    ? `<section class="bloque">${rotulo(`${icv.etiqueta}: la cartera en las categorías de mayor riesgo`)}<div class="doble doble--compacta">${cifraGrande(icv.agregado ?? "—", "", `${icv.etiqueta} agregado`)}${distribucion(icv.distribucion, { compacta: true })}</div>${definicionIndicador(icv)}</section>`
    : ""
}
${lectura(hallazgoDe("calidad"))}`,
  });

  // 06 Deterioro y cobertura ─────────────────────────────────────────────────
  const cb = m.cobertura;
  paginas.push({
    seccion: "cobertura",
    marco: true,
    cuerpo: `${cabeceraDeSeccion("cobertura")}
${
  cb.cobertura
    ? `<div class="doble doble--indicador">
  ${cifraGrande(cb.cobertura.agregado ?? "—", "", `${cb.cobertura.etiqueta} agregada`, cb.cobertura.definicion)}
  ${cb.cobertura.distribucion ? distribucion(cb.cobertura.distribucion, { titulo: "Distribución entre entidades con cartera vencida" }) : ""}
</div>
${definicionIndicador(cb.cobertura)}
${
  cb.comparacion && cb.deterioro && cb.vencida
    ? `<section class="bloque">${rotulo("Deterioro frente a cartera vencida")}${barrasSimples([
        {
          etiqueta: cb.vencida.etiqueta,
          valor: cb.comparacion.vencidaValor,
          texto: `${cb.vencida.texto} billones`,
          tono: "neutro",
        },
        {
          etiqueta: cb.deterioro.etiqueta,
          valor: cb.comparacion.deterioroValor,
          texto: `${cb.deterioro.texto} billones`,
          tono: "fuerte",
        },
      ])}${cb.deterioro.nota ? `<p class="nota">${esc(cb.deterioro.nota)}</p>` : ""}</section>`
    : ""
}`
    : ""
}
${parrafos(cb.parrafos)}
${lectura(hallazgoDe("cobertura"))}`,
  });

  // 07 Tipo de organización ──────────────────────────────────────────────────
  if (m.tipo) {
    const t = m.tipo;
    paginas.push({
      seccion: "tipo",
      marco: true,
      cuerpo: `${cabeceraDeSeccion("tipo")}
${parrafos(t.parrafos)}
<section class="bloque">${rotulo(`${t.etiqueta}: participación en la ${t.medida.toLowerCase()} y en el número de entidades`)}
${barrasPorCategoria(
  t.categorias.map((c) => ({
    etiqueta: c.etiqueta,
    valor: c.participacionValor,
    texto: c.participacion,
    entidades: c.entidades,
    valorEntidades: c.participacionEntidadesValor,
    textoEntidades: c.participacionEntidades,
    esOtros: c.esOtros,
  })),
  { rotuloMedida: t.medida, rotuloEntidades: "Entidades del universo" },
)}
${t.nota ? `<p class="nota">${esc(t.nota)}</p>` : ""}
</section>
${lectura(hallazgoDe("tipo"))}`,
    });
  }

  // 08 Territorio ────────────────────────────────────────────────────────────
  if (m.territorio) {
    const t = m.territorio;
    paginas.push({
      seccion: "territorio",
      marco: true,
      cuerpo: `${cabeceraDeSeccion("territorio")}
${parrafos(t.parrafos)}
${
  t.concentracion
    ? `<section class="bloque">${rotulo("Concentración geográfica")}${barraApilada(
        [
          {
            etiqueta: t.concentracion.etiquetas.join(", "),
            valor: t.concentracion.valor,
            texto: t.concentracion.texto,
            tono: "fuerte",
          },
          { etiqueta: "Resto del universo", valor: 1 - t.concentracion.valor, texto: "", tono: "neutro" },
        ],
        "Participación de los tres departamentos con más cartera",
      )}</section>`
    : ""
}
<section class="bloque">${rotulo(`${t.etiqueta}: participación en la ${t.medida.toLowerCase()}`)}
${barrasPorCategoria(
  t.categorias.map((c) => ({
    etiqueta: c.etiqueta,
    valor: c.participacionValor,
    texto: c.participacion,
    entidades: c.entidades,
    esOtros: c.esOtros,
  })),
  { rotuloMedida: t.medida },
)}
${t.nota ? `<p class="nota">${esc(t.nota)}</p>` : ""}
</section>
${lectura(hallazgoDe("territorio"))}`,
    });
  }

  // 09 Otros indicadores ─────────────────────────────────────────────────────
  const o = m.otros;
  const bloquesOtros = [
    o.moraDias.length
      ? `<section class="bloque">${rotulo("Mora por días de atraso (grupo 84)")}
${barrasSimples(o.moraDias.map((i, j) => ({ etiqueta: i.etiqueta, valor: i.agregadoValor ?? 0, texto: i.agregado ?? "—", tono: j === 0 ? "fuerte" : "medio" })))}
${tablaIndicadores(o.moraDias)}
<p class="nota">${esc(o.moraDias[0].definicion)} ${
          o.moraDias[0].nota
            ? esc(
                o.moraDias[0].nota
                  .replace(o.moraDias[0].definicion, "")
                  .trim()
                  .replace(/30 días/g, "el umbral"),
              )
            : ""
        }</p>
</section>`
      : "",
    o.libranza || o.intereses
      ? `<section class="bloque">${rotulo("Libranza e intereses vencidos")}
${tablaIndicadores([o.libranza, o.intereses].filter((x): x is IndicadorInf => x !== null))}
<dl class="definicion definicion--lista">${[o.libranza, o.intereses]
          .filter((x): x is IndicadorInf => x !== null)
          .map(
            (i) =>
              `<div><dt>${esc(i.etiqueta)}</dt><dd>${esc(i.definicion)}${i.formula && !i.definicion.includes(i.formula) ? ` Fórmula: ${esc(i.formula)}.` : ""}</dd></div>`,
          )
          .join("")}</dl>
${o.libranza?.distribucion ? distribucion(o.libranza.distribucion, { compacta: true, titulo: `${o.libranza.etiqueta}: distribución entre entidades` }) : ""}
</section>`
      : "",
  ].join("");
  paginas.push({ seccion: "otros", marco: true, cuerpo: `${cabeceraDeSeccion("otros")}${bloquesOtros}` });

  // 10 Metodología y fuentes ─────────────────────────────────────────────────
  const mt = m.metodologia;
  paginas.push({
    seccion: "metodologia",
    marco: true,
    cuerpo: `${cabeceraDeSeccion("metodologia")}
<div class="fuentes">
  <div class="fuentes__bloque">${rotulo("Fuente de datos", "neutro")}<p class="fuentes__nombre">${esc(m.fuente.datos)}</p>${m.fuente.datosDescripcion ? `<p class="texto">${esc(m.fuente.datosDescripcion)}</p>` : ""}${m.fuente.datosUrl ? `<p class="nota">${esc(m.fuente.datosUrl)}</p>` : ""}</div>
  <div class="fuentes__bloque fuentes__bloque--novum">${rotulo("Procesamiento y análisis")}<p class="fuentes__nombre">${esc(m.fuente.procesamiento)}</p>${m.fuente.procesamientoDescripcion ? `<p class="texto">${esc(m.fuente.procesamientoDescripcion)}</p>` : ""}</div>
</div>
<section class="bloque">${rotulo("Metodología")}<p class="texto"><b>${esc(mt.nombre)}.</b> ${esc(mt.descripcion)}</p></section>
<section class="bloque bloque--dos">
  <div>${rotulo("Universo y cobertura")}<p class="texto">${esc(mt.universoDefinicion)}${mt.universoDefinicion.includes(mt.universoCriterio) ? "" : ` Criterio: ${esc(mt.universoCriterio)}.`}</p><p class="texto">${esc(m.corte.nUniverso)} de ${esc(m.corte.nReportantes)} entidades reportantes; ${esc(m.corte.nExcluidas)} quedan fuera del universo.</p><p class="texto"><span class="estado estado--${m.corte.estado}">${esc(m.corte.estadoEtiqueta)}</span></p><p class="texto">${esc(m.corte.cobertura)}</p></div>
  <div>${rotulo("Anonimización")}<p class="texto">Solo se publican agregados. Ninguna categoría, distribución ni hallazgo se muestra con menos de ${esc(mt.k)} entidades.</p><ul class="lista">${mt.exclusiones.map((e) => `<li>${esc(e)}</li>`).join("")}</ul><p class="texto">Las distribuciones se presentan con P25, mediana, P75 y media simple. No se publican mínimos ni máximos: cada extremo corresponde a una sola entidad. No se publican nombres, NIT ni cifras de una entidad identificable.</p></div>
</section>
<section class="bloque">${rotulo("Dato y lectura")}<p class="texto">Las cifras las calcula el motor sectorial de SIAR con la metodología versionada y no se ajustan a mano. La Lectura Novum es la interpretación de Novum Integral sobre esas cifras: se presenta separada del dato y no es una posición de la Superintendencia de la Economía Solidaria.</p></section>`,
  });
  paginas.push({
    seccion: "metodologia",
    marco: true,
    cuerpo: `<p class="continuacion">${esc(SECCIONES.metodologia.titulo)} · continuación</p>
<section class="bloque">${rotulo("Definiciones")}
<table class="tabla tabla--definiciones"><thead><tr><th scope="col">Cifra o indicador</th><th scope="col">Definición</th><th scope="col">Fórmula</th></tr></thead><tbody>${mt.definiciones
      .map(
        (d) =>
          `<tr><th scope="row">${esc(d.etiqueta)}</th><td>${esc(d.definicion)}</td><td>${esc(d.formula && !d.definicion.includes(d.formula) ? d.formula : "—")}</td></tr>`,
      )
      .join("")}</tbody></table>
</section>
<section class="bloque bloque--dos">
  <div>${rotulo("Limitaciones")}<ul class="lista">${mt.limitaciones.map((l) => `<li>${esc(l)}</li>`).join("")}</ul></div>
  <div>${rotulo("Comparabilidad")}<p class="texto">${esc(mt.comparabilidad)}</p>${rotulo("Versión", "neutro")}<p class="nota">${esc(mt.nombre)} · ${esc(mt.version)}. Procesado el ${esc(m.corte.procesado)}.</p></div>
</section>`,
  });

  // 11 Cierre ────────────────────────────────────────────────────────────────
  paginas.push({
    seccion: "cierre",
    marco: false,
    clase: "pagina--cierre",
    cuerpo: `<div class="cierre">
  <p class="cierre__frase">No vea solamente el sector.<span>Entienda su posición dentro de él.</span></p>
  <p class="cierre__texto">La plataforma SIAR de Novum Integral ubica a cada entidad frente a este mismo universo, con la misma metodología.</p>
  <div class="cierre__marca">
    <img class="cierre__logo" src="${r.logo}" alt="Novum Integral" />
    <p class="cierre__contacto">${esc(m.contacto.correo)} · ${esc(m.contacto.web.replace(/^https?:\/\//, ""))}</p>
  </div>
</div>`,
  });

  // Numeración, índice y referencias ─────────────────────────────────────────
  const total = paginas.length;
  const primeraPagina = new Map<SeccionId, number>();
  paginas.forEach((p, i) => {
    if (!primeraPagina.has(p.seccion)) primeraPagina.set(p.seccion, i + 1);
  });
  const indice = `<ol class="indice">${(Object.keys(SECCIONES) as SeccionId[])
    .filter((id) => id !== "portada" && primeraPagina.has(id))
    .map(
      (id) =>
        `<li><span class="indice__numero">${SECCIONES[id].numero}</span><span class="indice__titulo">${esc(SECCIONES[id].titulo)}</span><span class="indice__pagina">${primeraPagina.get(id)}</span></li>`,
    )
    .join("")}</ol>`;

  const cuerpo = paginas
    .map((p, i) => {
      let html = p.cuerpo.replace(indiceMarcador, indice);
      html = html.replace(
        /<span class="ref" data-ref="([a-z]+)">([^<]*)<\/span>/g,
        (_, id: SeccionId, texto: string) =>
          `<span class="ref">${texto} · pág. ${primeraPagina.get(id) ?? "—"}</span>`,
      );
      const marco = p.marco
        ? `<header class="pagina__cabecera"><img src="${r.isotipo}" alt="" /><span>Novum Integral · ${esc(m.titulo)}</span><span class="pagina__cabecera-der">${esc(m.subtitulo)} · ${esc(m.corteEtiqueta)}</span></header>
<footer class="pagina__pie"><span>Fuente: ${esc(m.fuente.datos)} · Procesamiento y lectura: ${esc(m.fuente.procesamiento)}</span><span class="pagina__numero">${i + 1} / ${total}</span></footer>`
        : "";
      return `<section class="pagina${p.clase ? ` ${p.clase}` : ""}" data-pagina="${i + 1}" data-seccion="${p.seccion}">${marco}<div class="pagina__cuerpo">${html}</div></section>`;
    })
    .join("\n");

  const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<title>${esc(`${m.titulo} · ${m.subtitulo} · ${m.corteEtiqueta}`)}</title>
<meta name="author" content="Novum Integral" />
<style>${r.css}</style>
</head>
<body>
${cuerpo}
</body>
</html>`;
  return { html, paginas: total };
}

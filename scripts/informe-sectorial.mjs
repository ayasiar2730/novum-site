#!/usr/bin/env node
/* =============================================================================
   INFORME SECTORIAL EN PDF — SectorSnapshot v2 → HTML A4 → Chrome → PDF
   ---------------------------------------------------------------------------
   Genera el informe público de un corte a partir del MISMO snapshot que lee el
   sitio (contrato v2). No consulta ninguna base, no recalcula indicadores y no
   escribe cifras propias: el modelo (`src/lib/informe/modelo.ts`) formatea lo
   que trae el snapshot y registra la trazabilidad de cada número.

   Uso:
     node --import ./scripts/_ts.mjs scripts/informe-sectorial.mjs \
       [--corte AAAA-MM | --snapshot <sector-snapshot.json>] [--salida .informes]
       [--publicar] [--capturas] [--chrome <ruta>]
     (sin --corte ni --snapshot usa el corte más reciente de src/data/sector/informes/,
     el que publica el sitio; --publicar copia el PDF a public/informes/, de donde lo
     sirve la página del informe, y solo se acepta con el snapshot publicado del corte)

   Requisitos: `npm install` (la tipografía Plus Jakarta Sans estática sale de
   `@fontsource/plus-jakarta-sans`, la misma familia del sitio) y Chrome o Edge instalados
   (o `--chrome` / CHROME_PATH). Sin librerías de PDF ni de navegador: Chrome se maneja por
   el protocolo DevTools con el WebSocket nativo de Node.

   Antes de imprimir comprueba, y si algo falla NO escribe el PDF:
     · el snapshot pasa el validador del sitio (estructura + k-anonimato);
     · la tipografía cargó;
     · ninguna página se desborda (páginas A4 fijas: nada se corta en silencio);
     · el texto del informe no contiene NIT, uuid ni el código interno de la
       metodología fuera de la línea de versión;
     · toda cifra con decimales del texto está en la trazabilidad.

   Salida (en --salida, ignorada por git): el PDF, el HTML imprimible, la
   trazabilidad de cifras (JSON), un manifiesto (hashes, peso, páginas) y, con
   --capturas, una imagen por página.
   ==========================================================================*/

import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { DIR_INFORMES, cortesPublicados, validarV2 } from "@/lib/sector/source";
import { construirModelo } from "@/lib/informe/modelo";
import { documento } from "@/lib/informe/documento";
import { contact, site } from "@/content/site";

const RAIZ = process.cwd();
const args = process.argv.slice(2);
const valor = (n) => {
  const i = args.indexOf(n);
  return i >= 0 && i + 1 < args.length ? args[i + 1] : null;
};
const bandera = (n) => args.includes(n);
const salir = (codigo, mensaje) => {
  if (mensaje) console.error(mensaje);
  process.exit(codigo);
};
const sha256 = (b) => createHash("sha256").update(b).digest("hex");

// ── 1) Snapshot ──────────────────────────────────────────────────────────────
// Por defecto, el corte más reciente que publica el sitio (src/data/sector/informes/<AAAA-MM>.json).
const cortePedido = valor("--corte");
if (cortePedido && !/^\d{4}-\d{2}$/.test(cortePedido)) salir(1, "--corte va como AAAA-MM (p. ej. 2026-07).");
const corteDefecto = cortePedido ?? cortesPublicados()[0];
const rutaSnapshot =
  valor("--snapshot") ?? (corteDefecto ? path.join(DIR_INFORMES, `${corteDefecto}.json`) : null);
if (!rutaSnapshot || !fs.existsSync(rutaSnapshot))
  salir(1, "Hace falta un snapshot: --corte AAAA-MM (publicado) o --snapshot <ruta a un SectorSnapshot v2>.");
const crudo = fs.readFileSync(rutaSnapshot);
const snapshot = JSON.parse(crudo.toString("utf8"));
if (!validarV2(snapshot)) salir(1, "El snapshot no pasa el validador del sitio (estructura o k-anonimato).");
if (snapshot.origen !== "siar")
  salir(1, `El informe solo se genera con un snapshot de origen «siar» (llegó «${snapshot.origen}»).`);
const modelo = construirModelo(snapshot, { contacto: { web: site.url, correo: contact.emails[0] } });

// --publicar: el PDF que sirve la web tiene que salir del MISMO snapshot que la web muestra.
const publicar = bandera("--publicar");
const rutaPublicada = path.join(DIR_INFORMES, `${modelo.corteId}.json`);
if (publicar && path.resolve(rutaSnapshot) !== path.resolve(rutaPublicada))
  salir(
    1,
    `--publicar solo se acepta con el snapshot publicado del corte (${path.relative(RAIZ, rutaPublicada)}); llegó ${rutaSnapshot}.`,
  );

// ── 2) Recursos: tipografía y marca ─────────────────────────────────────────
// Plus Jakarta Sans en instancias ESTÁTICAS (@fontsource, OFL-1.1). La variable
// del sitio (next/font) Chrome la incrusta en el PDF como fuentes Type 3, glifo
// por glifo (≈ 1 MB y peor extracción de texto); las estáticas van como
// subconjunto compacto. Solo los pesos y subconjuntos que usa el informe.
const PESOS = [400, 500, 600, 700, 800];
function fuentesEstaticas() {
  const dir = path.join(RAIZ, "node_modules/@fontsource/plus-jakarta-sans");
  const reglas = [];
  for (const peso of PESOS) {
    const archivoCss = path.join(dir, `${peso}.css`);
    if (!fs.existsSync(archivoCss)) return [];
    for (const m of fs.readFileSync(archivoCss, "utf8").matchAll(/@font-face\s*\{([^}]*)\}/g)) {
      const url = m[1].match(/url\(\.\/files\/(plus-jakarta-sans-(latin|latin-ext)-\d+-normal\.woff2)\)/);
      if (!url) continue;
      const rango = m[1].match(/unicode-range:\s*([^;}]*)/)?.[1];
      const datos = fs.readFileSync(path.join(dir, "files", url[1])).toString("base64");
      reglas.push(
        `@font-face{font-family:"Plus Jakarta Sans";font-style:normal;font-weight:${peso};src:url(data:font/woff2;base64,${datos}) format("woff2");${rango ? `unicode-range:${rango};` : ""}}`,
      );
    }
  }
  return reglas;
}
const fuentes = fuentesEstaticas();
if (fuentes.length === 0) salir(1, "No encuentro @fontsource/plus-jakarta-sans: corre «npm install».");
const png = (rel) => `data:image/png;base64,${fs.readFileSync(path.join(RAIZ, rel)).toString("base64")}`;
const css = fs
  .readFileSync(path.join(RAIZ, "src/lib/informe/informe.css"), "utf8")
  .replace("/* @@FUENTES@@ */", fuentes.join("\n"));
const { html, paginas } = documento(modelo, {
  css,
  logo: png("public/brand/logo.png"),
  isotipo: png("public/brand/isotipo.png"),
});

const salida = path.resolve(valor("--salida") ?? ".informes");
fs.mkdirSync(salida, { recursive: true });
const nombre = `informe-sectorial-${modelo.corteId}`;
const rutaHtml = path.join(salida, `${nombre}.html`);
const rutaPdf = path.join(salida, `${nombre}.pdf`);
for (const f of [rutaPdf]) fs.rmSync(f, { force: true });
fs.writeFileSync(rutaHtml, html);
fs.writeFileSync(
  path.join(salida, `${nombre}.trazabilidad.json`),
  JSON.stringify({ snapshot: path.basename(rutaSnapshot), cifras: modelo.trazabilidad }, null, 2) + "\n",
);

// ── 3) Chrome por el protocolo DevTools ──────────────────────────────────────
function rutaChrome() {
  const candidatos = [
    valor("--chrome"),
    process.env.CHROME_PATH,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ].filter(Boolean);
  return candidatos.find((c) => fs.existsSync(c)) ?? null;
}
const chrome = rutaChrome();
if (!chrome) salir(1, "No encuentro Chrome ni Edge: indícalo con --chrome <ruta> o CHROME_PATH.");

const puerto = 9400 + Math.floor(Math.random() * 400);
const perfil = fs.mkdtempSync(path.join(os.tmpdir(), "novum-informe-"));
const proceso = spawn(
  chrome,
  [
    "--headless=new",
    `--remote-debugging-port=${puerto}`,
    `--user-data-dir=${perfil}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-gpu",
    "about:blank",
  ],
  { stdio: "ignore" },
);
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
const cerrar = () => {
  try {
    proceso.kill();
  } catch {}
};

let codigo = 0;
try {
  let objetivo = null;
  for (let i = 0; i < 60 && !objetivo; i++) {
    await esperar(200);
    try {
      objetivo =
        (await (await fetch(`http://127.0.0.1:${puerto}/json`)).json()).find((t) => t.type === "page") ??
        null;
    } catch {}
  }
  if (!objetivo) throw new Error("Chrome no abrió el puerto de depuración.");
  const ws = new WebSocket(objetivo.webSocketDebuggerUrl);
  await new Promise((r, x) => ((ws.onopen = r), (ws.onerror = x)));
  let id = 0;
  const pendientes = new Map();
  ws.onmessage = (m) => {
    const msg = JSON.parse(m.data);
    if (msg.id && pendientes.has(msg.id)) {
      pendientes.get(msg.id)(msg);
      pendientes.delete(msg.id);
    }
  };
  const enviar = (method, params = {}) =>
    new Promise((r, x) => {
      const i = ++id;
      pendientes.set(i, (msg) =>
        msg.error ? x(new Error(`${method}: ${msg.error.message}`)) : r(msg.result),
      );
      ws.send(JSON.stringify({ id: i, method, params }));
    });
  const evaluar = async (expression) => {
    const r = await enviar("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails)
      throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text);
    return r.result.value;
  };

  await enviar("Page.enable");
  await enviar("Emulation.setEmulatedMedia", { media: "print" });
  await enviar("Page.navigate", { url: pathToFileURL(rutaHtml).href });
  for (let i = 0; i < 100; i++) {
    await esperar(100);
    if ((await evaluar("document.readyState")) === "complete") break;
  }
  await evaluar("document.fonts.ready.then(() => true)");

  // ── 4) Comprobaciones antes de imprimir ───────────────────────────────────
  const revision = await evaluar(`(() => {
    const fuente = document.fonts.check('600 12px "Plus Jakarta Sans"');
    const desbordes = [...document.querySelectorAll('.pagina')].map((p) => {
      const cuerpo = p.querySelector('.pagina__cuerpo');
      const limite = cuerpo.getBoundingClientRect();
      let peor = 0;
      for (const el of cuerpo.querySelectorAll('*')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        if (el.closest('[data-sangrado]')) continue; // adorno que sangra a propósito (portada)
        peor = Math.max(peor, r.bottom - limite.bottom, r.right - limite.right);
      }
      return { pagina: Number(p.dataset.pagina), seccion: p.dataset.seccion, exceso: Math.round(Math.max(peor, cuerpo.scrollHeight - cuerpo.clientHeight)) };
    }).filter((d) => d.exceso > 1);
    // Los rótulos de escala de los ejes no son cifras del corte: fuera del texto que se revisa.
    const ejes = [...document.querySelectorAll('.dist__eje')];
    ejes.forEach((e) => (e.style.display = 'none'));
    const texto = document.body.innerText;
    ejes.forEach((e) => (e.style.display = ''));
    return { fuente, desbordes, texto, paginas: document.querySelectorAll('.pagina').length };
  })()`);
  const problemas = [];
  if (!revision.fuente) problemas.push("la tipografía Plus Jakarta Sans no cargó");
  for (const d of revision.desbordes)
    problemas.push(`la página ${d.pagina} (${d.seccion}) se desborda ${d.exceso} px`);
  const texto = revision.texto;
  if (/\b\d{3}\.?\d{3}\.?\d{3}\s?-\s?\d\b/.test(texto))
    problemas.push("el texto contiene algo con forma de NIT");
  if (/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i.test(texto))
    problemas.push("el texto contiene un uuid");
  const codigoMetodologia = snapshot.metodologia.codigo;
  const apariciones = texto.split(codigoMetodologia).length - 1;
  const permitidas = modelo.metodologia.version.includes(codigoMetodologia) ? 2 : 0; // alcance y versión (metadata técnica)
  if (apariciones > permitidas)
    problemas.push(
      `el código interno «${codigoMetodologia}» aparece ${apariciones} veces (se permite solo en la versión)`,
    );
  // Una cifra del texto vale si es una cifra trazada o su redondeo exacto a 1 o 2 decimales (la lectura redondea).
  const nf = (d) => new Intl.NumberFormat("es-CO", { minimumFractionDigits: d, maximumFractionDigits: d });
  const conocidas = new Set();
  for (const t of modelo.trazabilidad) {
    const txt = t.texto.replace(/\u00a0/g, " ");
    conocidas.add(txt);
    // Un porcentaje también se lee sin el signo («85,9 pesos por cada 100»).
    if (txt.endsWith("%"))
      for (const d of [1, 2])
        conocidas.add(`${nf(d).format(t.valor * 100)} %`).add(nf(d).format(t.valor * 100));
    else if (Math.abs(t.valor) >= 1e9) for (const d of [1, 2]) conocidas.add(nf(d).format(t.valor / 1e12));
  }
  const decimales = [
    ...new Set(texto.replace(/\u00a0/g, " ").match(/\d{1,3}(?:\.\d{3})*,\d+(?: %)?/g) ?? []),
  ];
  const sinFuente = decimales.filter((d) => !conocidas.has(d));
  if (sinFuente.length) problemas.push(`cifras con decimales sin trazabilidad: ${sinFuente.join(", ")}`);

  // Una imagen por página (también si algo falla: sirven para ver qué se desborda).
  if (bandera("--capturas")) {
    const dir = path.join(salida, `${nombre}-paginas`);
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
    const cajas = await evaluar(
      `[...document.querySelectorAll('.pagina')].map((p) => { const r = p.getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height }; })`,
    );
    for (const [i, c] of cajas.entries()) {
      const cap = await enviar("Page.captureScreenshot", {
        format: "png",
        captureBeyondViewport: true,
        clip: { x: c.x, y: c.y, width: c.w, height: c.h, scale: 1.5 },
      });
      fs.writeFileSync(
        path.join(dir, `pagina-${String(i + 1).padStart(2, "0")}.png`),
        Buffer.from(cap.data, "base64"),
      );
    }
  }

  if (problemas.length) {
    console.error(`✗ El informe NO se imprimió:\n   · ${problemas.join("\n   · ")}`);
    codigo = 1;
  } else {
    // Marca a la resolución de impresión (300 ppp) para no inflar el PDF con los PNG maestros.
    await evaluar(`Promise.all([...document.images].map(async (img) => {
      await img.decode().catch(() => {});
      const r = img.getBoundingClientRect();
      const escala = 300 / 96;
      const w = Math.max(1, Math.round(r.width * escala)), h = Math.max(1, Math.round(r.height * escala));
      if (!w || w >= img.naturalWidth) return;
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      const ctx = c.getContext('2d'); ctx.imageSmoothingQuality = 'high'; ctx.drawImage(img, 0, 0, w, h);
      img.src = c.toDataURL('image/png'); await img.decode().catch(() => {});
    }))`);
    const pdf = await enviar("Page.printToPDF", {
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: false,
      generateTaggedPDF: true,
      generateDocumentOutline: true,
    });
    const bytes = Buffer.from(pdf.data, "base64");
    fs.writeFileSync(rutaPdf, bytes);

    const manifiesto = {
      informe: `${modelo.titulo} · ${modelo.subtitulo} · ${modelo.corteEtiqueta}`,
      corte: modelo.corteId,
      paginas,
      pdf: { archivo: path.basename(rutaPdf), bytes: bytes.length, sha256: sha256(bytes) },
      snapshot: {
        archivo: path.basename(rutaSnapshot),
        sha256: sha256(crudo),
        generadoEl: snapshot.generadoEl,
        metodologia: `${snapshot.metodologia.codigo} ${snapshot.metodologia.version}`,
      },
      comprobaciones: {
        tipografia: true,
        desbordes: 0,
        nit: 0,
        uuid: 0,
        codigoInterno: apariciones,
        cifrasConDecimales: decimales.length,
        cifrasSinTrazabilidad: 0,
      },
      generadoEl: new Date().toISOString(),
    };
    fs.writeFileSync(
      path.join(salida, `${nombre}.manifiesto.json`),
      JSON.stringify(manifiesto, null, 2) + "\n",
    );
    console.log(
      `✓ ${path.relative(RAIZ, rutaPdf)} · ${paginas} páginas · ${(bytes.length / 1024).toFixed(0)} KB · sha256 ${manifiesto.pdf.sha256.slice(0, 16)}…`,
    );
    console.log(
      `  comprobado: tipografía, 0 desbordes, sin NIT ni uuid, ${decimales.length} cifras con decimales todas trazadas, código interno solo en la versión (${apariciones})`,
    );
    if (publicar) {
      // Nombre fijo por corte: es la URL que enlaza la página del informe (lib/informes/catalogo.ts).
      const destino = path.join(RAIZ, "public", "informes", `${nombre}.pdf`);
      fs.mkdirSync(path.dirname(destino), { recursive: true });
      fs.copyFileSync(rutaPdf, destino);
      console.log(`  publicado: ${path.relative(RAIZ, destino)} (revise el PDF antes del commit)`);
    }
  }
  ws.close();
} catch (e) {
  console.error(`✗ El generador no pudo terminar: ${e instanceof Error ? e.message : String(e)}`);
  codigo = 1;
} finally {
  cerrar();
  await esperar(300);
  try {
    fs.rmSync(perfil, { recursive: true, force: true });
  } catch {}
}
process.exit(codigo);

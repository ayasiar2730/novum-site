import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { validarInteligencia, type EntidadCarteraPublica, type InteligenciaSectorial } from "../contrato";
import {
  filtrar,
  histograma,
  pares,
  percentil,
  rankPorCartera,
  resumen,
  senales,
  terciles,
} from "../cartera";
import { escribirEstado, estadoAlCambiarDeInforme, leerEstado, seccionValida } from "../estado";
import { clave, pesos, porcentaje, puntos } from "../formato";
import { buscar, entidadesDe, grupoDe, lector, ordenar } from "../panorama";
import { etiquetaDeTipo, segmentoDeTipo, tipoDeSegmento } from "../tipos";

/* =============================================================================
   Inteligencia sectorial (web) — lo que se fija
   · el archivo publicado del corte es válido (contrato, sin NaN ni campos no
     públicos) y sus conteos cuadran;
   · los filtros ELIGEN el grupo que el motor ya calculó (nunca recalculan);
   · el estado en la URL sobrevive al cambio de sección y de informe;
   · las lecturas de cartera son las de SIAR (percentil estricto, pares ±60 %);
   · el formato no inventa ceros: sin dato es «—».
   ==========================================================================*/

const archivo = path.resolve(process.cwd(), "public/datos/inteligencia/2026-06.json");
const d = JSON.parse(fs.readFileSync(archivo, "utf8")) as InteligenciaSectorial;
const p = d.panorama;
const l = lector(p);

describe("⭐ el archivo publicado de junio 2026", () => {
  it("valida contra el contrato y no trae campos no públicos", () => {
    expect(validarInteligencia(d)).toEqual([]);
    expect(JSON.stringify(d)).not.toMatch(/"nit"|representante|telefono|"email"/i);
  });
  it("cuadra: el total del panorama cuenta las entidades de la lista y la suma de los tipos", () => {
    expect(p.total.entidades).toBe(p.entidades.length);
    expect(Object.values(p.porTipo).reduce((s, g) => s + g.entidades, 0)).toBe(p.total.entidades);
    expect(d.cartera.estadisticas.entidades).toBe(d.cartera.entidades.length);
  });
  it("trae las cifras del Power BI replicadas (paridad del motor): crecimiento del activo e ICM del sector", () => {
    expect(l.de(p.total.v, "crecimiento_activo")).toBeCloseTo(0.106237, 5);
    expect(l.de(p.total.v, "icm")).toBeCloseTo(0.06851, 5);
    expect(l.de(p.total.v, "icm_anterior")).toBeCloseTo(0.075451, 5);
    expect(l.de(p.total.v, "roe_simple")).toBeCloseTo(0.026641, 5);
  });
  it("ninguna cifra es NaN ni infinita, en grupos ni en entidades", () => {
    const todas = [
      p.total,
      ...Object.values(p.porTipo),
      ...Object.values(p.porDepartamento),
      ...p.entidades,
    ].flatMap((g) => g.v);
    expect(todas.every((v) => v === null || Number.isFinite(v))).toBe(true);
  });
});

describe("⭐ filtros del panorama: eligen el grupo calculado, no recalculan", () => {
  it("sin filtros = total; tipo = porTipo; departamento = porDepartamento; ambos = tipo × departamento", () => {
    expect(grupoDe(p, { tipo: null, departamento: null })).toBe(p.total);
    expect(grupoDe(p, { tipo: "Fondos de empleados", departamento: null })).toBe(
      p.porTipo["Fondos de empleados"],
    );
    expect(grupoDe(p, { tipo: null, departamento: "Antioquia" })).toBe(p.porDepartamento["Antioquia"]);
    expect(grupoDe(p, { tipo: "Fondos de empleados", departamento: "Antioquia" })).toBe(
      p.porTipoYDepartamento["Fondos de empleados"]["Antioquia"],
    );
    expect(grupoDe(p, { tipo: "Fondos de empleados", departamento: "No existe" })).toBeNull();
  });
  it("las entidades del grupo son las del filtro, y su número es el que dice el grupo", () => {
    const f = { tipo: "Fondos de empleados", departamento: "Antioquia" };
    expect(entidadesDe(p, f).length).toBe(grupoDe(p, f)?.entidades);
  });
  it("ordenar deja las entidades sin dato al final, y la búsqueda encuentra por sigla sin acentos", () => {
    const o = ordenar(p.entidades, l, "crecimiento_activo");
    const primeraNula = o.findIndex((e) => l.de(e.v, "crecimiento_activo") === null);
    expect(o.slice(primeraNula).every((e) => l.de(e.v, "crecimiento_activo") === null)).toBe(true);
    const e = p.entidades.find((x) => x.sigla && /[A-Z]{4,}/.test(x.sigla));
    expect(buscar(p.entidades, e!.sigla!.toLowerCase())[0].codigo).toBe(e!.codigo);
  });
});

describe("estado en la URL", () => {
  it("se escribe y se lee igual; lo vacío no viaja", () => {
    const e = {
      seccion: "crecimiento",
      tipo: "Fondos de empleados",
      departamento: null,
      entidad: "8024",
      corte: null,
      variable: "crecimiento_cartera",
    };
    const q = escribirEstado(e);
    expect(q).toBe("?seccion=crecimiento&tipo=Fondos+de+empleados&entidad=8024&ver=crecimiento_cartera");
    expect(leerEstado(new URLSearchParams(q))).toEqual(e);
  });
  it("⭐ al cambiar de informe se conservan departamento y entidad; el tipo solo si el otro informe lo tiene", () => {
    const e = {
      seccion: "calidad",
      tipo: "Fondos de empleados",
      departamento: "Antioquia",
      entidad: "8024",
      corte: "2026-06",
      variable: "x",
    };
    expect(estadoAlCambiarDeInforme(e, [tipoDeSegmento("COOPERATIVAS")])).toEqual({
      seccion: null,
      variable: null,
      tipo: null,
      departamento: "Antioquia",
      entidad: "8024",
      corte: "2026-06",
    });
    const coop = { ...e, tipo: tipoDeSegmento("COOPERATIVAS") };
    expect(estadoAlCambiarDeInforme(coop, [tipoDeSegmento("COOPERATIVAS")]).tipo).toBe(
      tipoDeSegmento("COOPERATIVAS"),
    );
  });
  it("una sección desconocida abre la primera", () => {
    expect(seccionValida("no-existe", [{ id: "resumen" }, { id: "b" }])).toBe("resumen");
    expect(seccionValida("b", [{ id: "resumen" }, { id: "b" }])).toBe("b");
  });
});

describe("⭐ cartera y riesgo: las lecturas de SIAR", () => {
  const c = d.cartera;
  it("el segmento sale del tipo, y el filtro recorta el grupo", () => {
    expect(segmentoDeTipo(tipoDeSegmento("MUTUALES"))).toBe("MUTUALES");
    expect(
      filtrar(c, { segmento: "MUTUALES", departamento: null }).every((e) => e.segmento === "MUTUALES"),
    ).toBe(true);
  });
  it("el ICM ponderado del consolidado es el del archivo, y la zona de cada entidad respeta μ y σ", () => {
    expect(resumen(c.entidades).icmPonderado).toBeCloseTo(c.estadisticas.icm_ponderado as number, 6);
    const mu = c.estadisticas.icm_promedio as number;
    const s = c.estadisticas.icm_desv as number;
    for (const e of c.entidades) {
      if (e.icm === null) continue;
      const z = e.icm < mu ? "Bajo" : e.icm < mu + s ? "Moderado" : e.icm < mu + 2 * s ? "Elevado" : "Alto";
      expect(e.riesgo).toBe(z);
    }
  });
  it("percentil estricto, ranking y pares ±60 % del mismo segmento sin la propia entidad", () => {
    expect(percentil([1, 2, 3, 4], 3)).toBe(50);
    const mia = c.entidades[0];
    expect(rankPorCartera(c.entidades, mia)).toBe(1);
    const ps = pares(c.entidades, mia);
    expect(ps.every((x) => x.segmento === mia.segmento && x.codigo !== mia.codigo)).toBe(true);
    expect(
      ps.every(
        (x) => x.cartera_total >= mia.cartera_total * 0.4 && x.cartera_total <= mia.cartera_total * 1.6,
      ),
    ).toBe(true);
  });
  it("el histograma cuenta a todas las entidades con ICM; los terciles también", () => {
    const n = c.entidades.filter((e) => e.icm !== null).length;
    expect(histograma(c.entidades).reduce((s, b) => s + b.n, 0)).toBe(n);
    expect(terciles(c.entidades).reduce((s, t) => s + t.entidades, 0)).toBe(c.entidades.length);
  });
  it("las señales son hechos con cifra (sin «siempre», «nunca» ni «debe»)", () => {
    const s = senales(c.entidades, c, (v) => porcentaje(v));
    expect(s.length).toBeGreaterThanOrEqual(4);
    for (const x of s) expect(`${x.titulo} ${x.texto}`).not.toMatch(/\b(siempre|nunca|debe|deben)\b/i);
  });
  it("un grupo vacío no rompe: sin señales y resumen en cero", () => {
    const vacio: EntidadCarteraPublica[] = [];
    expect(senales(vacio, c, (v) => porcentaje(v))).toEqual([]);
    expect(resumen(vacio).icmPonderado).toBeNull();
  });
});

describe("formato", () => {
  it("sin dato es «—», nunca 0", () => {
    expect(porcentaje(null)).toBe("—");
    expect(pesos(undefined)).toBe("—");
    expect(puntos(Number.NaN)).toBe("—");
  });
  it("escalas de pesos y puntos con signo", () => {
    expect(pesos(62_969_361_138_110)).toBe("$62,97 bn");
    expect(pesos(926_600_000_000)).toBe("$926,6 mm");
    expect(puntos(0.0169)).toBe("+1,69 pp");
    expect(puntos(-0.0069)).toBe("−0,69 pp");
  });
  it("búsqueda sin acentos ni mayúsculas; tipos legibles", () => {
    expect(clave("Crédito  Ñandú")).toBe("credito nandu");
    expect(etiquetaDeTipo("Especializada de ahorro y credito")).toBe("Especializada de ahorro y crédito");
  });
});

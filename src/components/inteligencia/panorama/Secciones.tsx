"use client";

import { inteligencia } from "@/content/inteligencia";
import { cifra, porcentaje } from "@/lib/inteligencia/formato";
import { etiquetaDeTipo } from "@/lib/inteligencia/tipos";
import { BarrasH, BarrasPareadas, Kpi } from "../graficos";
import type { ContextoSeccion } from "../InformeInteractivo";
import { Bloque, Nota, Selector } from "../piezas";
import {
  barrasPorTipo,
  FilaEntidad,
  KpiCifra,
  ListaDepartamentos,
  referenciaTipos,
  TablaEntidades,
  TablaPorTipo,
  useLectura,
  valorDeGrupo,
  type Lectura,
} from "./comunes";

/**
 * Panorama financiero: las 18 páginas del Power BI «Seguimiento sector»,
 * agrupadas en ocho lecturas. Cada cifra sale del archivo del corte (motor
 * sectorial, versión `seguimiento-sector-2026-06`); aquí solo se elige y se
 * dibuja.
 *
 *   Resumen ............ cifras clave + cuadro consolidado de crecimientos (pág. 16)
 *   Crecimiento ........ activo, cartera, pasivo, depósitos, patrimonio y aportes (pág. 1–5 y 14)
 *   Calidad de cartera . ICM, ICM con castigos y coberturas (pág. 6, 7 y 9)
 *   Liquidez y estructura liquidez y activo productivo (pág. 8 y 10)
 *   Rentabilidad ....... márgenes, eficiencia, excedentes y ROE (pág. 11, 13 y 15)
 *   Intermediación ..... tasa de colocación, costo de depósitos y margen (pág. 17)
 *   CAMEL .............. cuadro consolidado (pág. 12)
 *   Saldos ............. principales cifras (pág. 18)
 */
export function SeccionesPanorama({ seccion, ctx }: { seccion: string; ctx: ContextoSeccion }) {
  const lec = useLectura(ctx);
  if (!lec.grupo) return <Nota>{inteligencia.vacios.grupo}</Nota>;
  switch (seccion) {
    case "crecimiento":
      return <Crecimiento lec={lec} variable={ctx.estado.variable} />;
    case "calidad":
      return <Calidad lec={lec} />;
    case "liquidez":
      return <Liquidez lec={lec} />;
    case "rentabilidad":
      return <Rentabilidad lec={lec} variable={ctx.estado.variable} />;
    case "intermediacion":
      return <Intermediacion lec={lec} />;
    case "camel":
      return <Camel lec={lec} />;
    case "saldos":
      return <Saldos lec={lec} />;
    default:
      return <Resumen lec={lec} />;
  }
}

function Encabezado({ lec, texto }: { lec: Lectura; texto?: string }) {
  const c = lec.corte;
  return (
    <p className="text-body-sm text-neutral-700">
      <span className="font-semibold text-neutral-950">{lec.etiquetaGrupo}</span> ·{" "}
      {lec.grupo?.entidades.toLocaleString("es-CO")} entidades · {c.etiqueta}
      {c.base ? ` frente a ${c.base.etiqueta}` : ""}
      {texto ? ` · ${texto}` : ""}
    </p>
  );
}

const CRECIMIENTOS = [
  { id: "crecimiento_activo", saldo: "activo", label: "Activo" },
  { id: "crecimiento_cartera", saldo: "cartera_creditos", label: "Cartera de créditos" },
  { id: "crecimiento_pasivo", saldo: "pasivo", label: "Pasivo" },
  { id: "crecimiento_depositos", saldo: "depositos", label: "Depósitos" },
  { id: "crecimiento_patrimonio", saldo: "patrimonio", label: "Patrimonio" },
  { id: "crecimiento_aportes", saldo: "aportes_sociales", label: "Aportes sociales" },
] as const;

function Resumen({ lec }: { lec: Lectura }) {
  const { l, grupo } = lec;
  const g = (k: string) => valorDeGrupo(l, grupo, k);
  const tarjetas = [
    { k: "activo", c: "crecimiento_activo" },
    { k: "cartera_creditos", c: "crecimiento_cartera" },
    { k: "depositos", c: "crecimiento_depositos" },
    { k: "patrimonio", c: "crecimiento_patrimonio" },
  ];
  return (
    <>
      <Encabezado lec={lec} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tarjetas.map(({ k, c }) => (
          <KpiCifra key={k} lec={lec} clave={k} contexto={`${porcentaje(g(c))} en un año`} />
        ))}
        <KpiCifra lec={lec} clave="icm" anterior="icm_anterior" />
        <KpiCifra lec={lec} clave="liquidez" />
        <KpiCifra lec={lec} clave="margen_neto" />
        <KpiCifra lec={lec} clave="roe_simple" />
      </div>
      <FilaEntidad lec={lec} claves={["activo", "crecimiento_activo", "icm", "liquidez", "roe_simple"]} />
      <Bloque
        titulo="Crecimientos por tipo de entidad"
        subtitulo={`Variación anual de las principales cuentas y excedente del ejercicio. ${lec.filtros.departamento ? `Departamento: ${lec.filtros.departamento}.` : ""}`}
        accion={lec.ficha("crecimiento_activo")}
      >
        <TablaPorTipo
          lec={lec}
          claves={[
            "crecimiento_activo",
            "crecimiento_cartera",
            "crecimiento_pasivo",
            "crecimiento_depositos",
            "crecimiento_patrimonio",
            "crecimiento_aportes",
            "excedente",
          ]}
          titulo="Crecimientos por tipo de entidad"
        />
      </Bloque>
    </>
  );
}

function Crecimiento({ lec, variable }: { lec: Lectura; variable: string | null }) {
  const v = CRECIMIENTOS.find((x) => x.id === variable) ?? CRECIMIENTOS[0];
  const ref = referenciaTipos(lec, v.id);
  return (
    <>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <Encabezado lec={lec} />
        <div className="md:w-72">
          <Selector
            etiqueta="Cuenta"
            valor={v.id}
            opciones={CRECIMIENTOS.map((x) => ({ id: x.id, label: x.label }))}
            onCambio={(id) => lec.cambiar({ variable: id === CRECIMIENTOS[0].id ? null : id })}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiCifra
          lec={lec}
          clave={v.id}
          contexto={`${lec.etiquetaGrupo}, ${lec.corte.etiqueta} frente a ${lec.corte.base?.etiqueta ?? "el año anterior"}`}
        />
        <KpiCifra lec={lec} clave={v.saldo} contexto={`Saldo a ${lec.corte.etiqueta}`} />
        <Kpi
          etiqueta="Entidades comparables"
          valor={`${(lec.grupo?.enBase ?? 0).toLocaleString("es-CO")} de ${(lec.grupo?.entidades ?? 0).toLocaleString("es-CO")}`}
          contexto={`Reportaron ${lec.corte.etiqueta} y ${lec.corte.base?.etiqueta ?? "el año anterior"}. Las demás no tienen crecimiento.`}
        />
      </div>
      <FilaEntidad lec={lec} claves={[v.saldo, v.id]} />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.2fr_1fr]">
        <Bloque
          titulo={`Crecimiento de ${v.label.toLowerCase()} por tipo de entidad`}
          subtitulo="La línea oscura es la referencia del sector o del departamento elegido."
          accion={lec.ficha(v.id)}
        >
          <BarrasH
            filas={barrasPorTipo(lec, v.id)}
            referencia={ref.valor}
            etiquetaReferencia={ref.etiqueta}
            titulo={`Crecimiento de ${v.label} por tipo`}
          />
        </Bloque>
        <Bloque
          titulo="Entidades por departamento"
          subtitulo="Elija un departamento para filtrar todo el informe."
        >
          <ListaDepartamentos lec={lec} />
        </Bloque>
      </div>
      <Bloque
        titulo={`Ranking de entidades · crecimiento de ${v.label.toLowerCase()}`}
        subtitulo="Ordene por cualquier columna. Las entidades sin corte del año anterior aparecen al final, sin crecimiento."
      >
        <TablaEntidades
          lec={lec}
          claves={[v.saldo, v.id]}
          orden={v.id}
          titulo={`Crecimiento de ${v.label} por entidad`}
          opciones={{ tipo: true, departamento: true }}
        />
      </Bloque>
    </>
  );
}

function Calidad({ lec }: { lec: Lectura }) {
  const { p, l, filtros } = lec;
  const filas = p.tipos
    .map((t) => ({
      t,
      g: filtros.departamento ? p.porTipoYDepartamento[t]?.[filtros.departamento] : p.porTipo[t],
    }))
    .filter((x) => x.g)
    .map((x) => ({
      id: x.t,
      etiqueta: etiquetaDeTipo(x.t),
      a: l.de(x.g!.v, "icm_anterior"),
      b: l.de(x.g!.v, "icm"),
    }));
  const castigos = p.tipos
    .map((t) => ({
      t,
      g: filtros.departamento ? p.porTipoYDepartamento[t]?.[filtros.departamento] : p.porTipo[t],
    }))
    .filter((x) => x.g)
    .map((x) => ({
      id: x.t,
      etiqueta: etiquetaDeTipo(x.t),
      a: l.de(x.g!.v, "icm"),
      b: l.de(x.g!.v, "icm_con_castigos"),
    }));
  const base = lec.corte.base?.etiqueta ?? "Año anterior";
  return (
    <>
      <Encabezado lec={lec} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCifra lec={lec} clave="icm" anterior="icm_anterior" />
        <KpiCifra lec={lec} clave="icm_con_castigos" />
        <KpiCifra lec={lec} clave="cobertura_cde" />
        <KpiCifra
          lec={lec}
          clave="cobertura_general_base"
          contexto={`Calculada con ${base}, como el Power BI.`}
        />
      </div>
      <FilaEntidad
        lec={lec}
        claves={["icm", "icm_anterior", "icm_con_castigos", "cobertura_cde", "cobertura_general_base"]}
      />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Bloque
          titulo="ICM por tipo de entidad"
          subtitulo={`${base} frente a ${lec.corte.etiqueta}.`}
          accion={lec.ficha("icm")}
        >
          <BarrasPareadas
            filas={filas}
            etiquetas={[base, lec.corte.etiqueta]}
            formato={(v) => porcentaje(v)}
          />
        </Bloque>
        <Bloque
          titulo="ICM e ICM con castigos"
          subtitulo="La cartera castigada (831015) suma al numerador."
          accion={lec.ficha("icm_con_castigos")}
        >
          <BarrasPareadas
            filas={castigos}
            etiquetas={["ICM", "ICM con castigos"]}
            formato={(v) => porcentaje(v)}
          />
        </Bloque>
      </div>
      <Bloque titulo="Cobertura de la cartera C, D y E por tipo" accion={lec.ficha("cobertura_cde")}>
        <BarrasH filas={barrasPorTipo(lec, "cobertura_cde")} {...refProps(lec, "cobertura_cde")} />
      </Bloque>
      <Bloque titulo="Calidad de cartera por entidad" subtitulo="Ordene por cualquier indicador.">
        <TablaEntidades
          lec={lec}
          claves={["icm", "icm_anterior", "icm_con_castigos", "cobertura_cde", "cobertura_general_base"]}
          orden="icm"
          titulo="Calidad de cartera por entidad"
        />
      </Bloque>
    </>
  );
}

function refProps(lec: Lectura, k: string) {
  const r = referenciaTipos(lec, k);
  return { referencia: r.valor, etiquetaReferencia: r.etiqueta };
}

function Liquidez({ lec }: { lec: Lectura }) {
  const base = lec.corte.base?.etiqueta ?? "el año anterior";
  const actual = valorDeGrupo(lec.l, lec.grupo, "activo_productivo");
  return (
    <>
      <Encabezado lec={lec} />
      <Nota>
        El Power BI calcula el activo productivo con el corte de {base}. Se muestra igual para conservar la
        réplica; con el corte de {lec.corte.etiqueta} el mismo indicador es {porcentaje(actual)}.
      </Nota>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiCifra lec={lec} clave="liquidez" />
        <KpiCifra lec={lec} clave="activo_productivo_base" contexto={`Calculado con ${base}.`} />
        <KpiCifra lec={lec} clave="excedente" />
      </div>
      <FilaEntidad
        lec={lec}
        claves={["liquidez", "activo_productivo_base", "activo_productivo", "excedente"]}
      />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Bloque
          titulo="Liquidez por tipo de entidad"
          subtitulo="Activos líquidos netos sobre depósitos de corto plazo."
          accion={lec.ficha("liquidez")}
        >
          <BarrasH filas={barrasPorTipo(lec, "liquidez")} {...refProps(lec, "liquidez")} />
        </Bloque>
        <Bloque
          titulo="Activo productivo por tipo de entidad"
          subtitulo={`Con el corte de ${base}.`}
          accion={lec.ficha("activo_productivo_base")}
        >
          <BarrasH
            filas={barrasPorTipo(lec, "activo_productivo_base")}
            {...refProps(lec, "activo_productivo_base")}
          />
        </Bloque>
      </div>
      <Bloque titulo="Liquidez y estructura por entidad">
        <TablaEntidades
          lec={lec}
          claves={["liquidez", "activo_productivo_base", "activo_productivo", "excedente"]}
          orden="liquidez"
          titulo="Liquidez y estructura por entidad"
        />
      </Bloque>
    </>
  );
}

const RENTABILIDAD = [
  { id: "margen_operacional", label: "Margen operacional" },
  { id: "margen_neto", label: "Margen neto" },
  { id: "eficiencia_operativa", label: "Eficiencia operativa" },
  { id: "roe_simple", label: "ROE simple" },
] as const;

function Rentabilidad({ lec, variable }: { lec: Lectura; variable: string | null }) {
  const v = RENTABILIDAD.find((x) => x.id === variable) ?? RENTABILIDAD[0];
  return (
    <>
      <Encabezado lec={lec} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCifra lec={lec} clave="excedente" />
        <KpiCifra lec={lec} clave="margen_operacional" />
        <KpiCifra lec={lec} clave="eficiencia_operativa" contexto="Menor es mejor." />
        <KpiCifra lec={lec} clave="margen_neto" />
        <KpiCifra lec={lec} clave="roe_simple" contexto="Sin anualizar." />
      </div>
      <FilaEntidad
        lec={lec}
        claves={["excedente", "margen_operacional", "eficiencia_operativa", "margen_neto", "roe_simple"]}
      />
      <Bloque
        titulo={`${v.label} por tipo de entidad`}
        accion={
          <div className="flex items-end gap-2">
            <div className="w-56">
              <Selector
                etiqueta="Indicador"
                valor={v.id}
                opciones={RENTABILIDAD}
                onCambio={(id) => lec.cambiar({ variable: id === RENTABILIDAD[0].id ? null : id })}
              />
            </div>
            {lec.ficha(v.id, true)}
          </div>
        }
      >
        <BarrasH filas={barrasPorTipo(lec, v.id)} {...refProps(lec, v.id)} />
      </Bloque>
      <Bloque
        titulo="Rentabilidad por entidad"
        subtitulo="Excedente del ejercicio y márgenes sobre los ingresos operacionales (410000 + 422500)."
      >
        <TablaEntidades
          lec={lec}
          claves={["excedente", "margen_operacional", "eficiencia_operativa", "margen_neto", "roe_simple"]}
          orden="excedente"
          titulo="Rentabilidad por entidad"
        />
      </Bloque>
    </>
  );
}

function Intermediacion({ lec }: { lec: Lectura }) {
  const { p, l, filtros } = lec;
  const base = lec.corte.base?.etiqueta ?? "Año anterior";
  const filas = p.tipos
    .map((t) => ({
      t,
      g: filtros.departamento ? p.porTipoYDepartamento[t]?.[filtros.departamento] : p.porTipo[t],
    }))
    .filter((x) => x.g)
    .map((x) => ({
      id: x.t,
      etiqueta: etiquetaDeTipo(x.t),
      a: l.de(x.g!.v, "margen_intermediacion_anterior"),
      b: l.de(x.g!.v, "margen_intermediacion"),
    }));
  return (
    <>
      <Encabezado lec={lec} />
      <Nota>
        Réplica del Power BI: la tasa de colocación divide entre 4 los ingresos (410000) acumulados del año, y
        el costo de los depósitos, el costo de ventas (610000). Con un corte de junio el acumulado es de seis
        meses: es un supuesto del tablero, pendiente de validar. Sin depósitos, el margen no se calcula.
      </Nota>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiCifra lec={lec} clave="tasa_colocacion_bruta" anterior="tasa_colocacion_bruta_anterior" />
        <KpiCifra lec={lec} clave="costo_depositos" anterior="costo_depositos_anterior" />
        <KpiCifra lec={lec} clave="margen_intermediacion" anterior="margen_intermediacion_anterior" />
      </div>
      <FilaEntidad
        lec={lec}
        claves={[
          "tasa_colocacion_bruta",
          "costo_depositos",
          "margen_intermediacion",
          "margen_intermediacion_anterior",
        ]}
      />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Bloque
          titulo="Margen de intermediación por tipo"
          subtitulo={`${base} frente a ${lec.corte.etiqueta}.`}
          accion={lec.ficha("margen_intermediacion")}
        >
          <BarrasPareadas
            filas={filas}
            etiquetas={[base, lec.corte.etiqueta]}
            formato={(v) => porcentaje(v)}
          />
        </Bloque>
        <Bloque titulo="Tasa, costo y margen por tipo" subtitulo={lec.corte.etiqueta}>
          <TablaPorTipo
            lec={lec}
            claves={["tasa_colocacion_bruta", "costo_depositos", "margen_intermediacion"]}
            titulo="Intermediación por tipo"
            conEntidades={false}
          />
        </Bloque>
      </div>
      <Bloque titulo="Intermediación por entidad">
        <TablaEntidades
          lec={lec}
          claves={[
            "tasa_colocacion_bruta",
            "costo_depositos",
            "margen_intermediacion",
            "margen_intermediacion_anterior",
          ]}
          orden="margen_intermediacion"
          titulo="Intermediación por entidad"
        />
      </Bloque>
    </>
  );
}

const CAMEL = [
  "excedente",
  "cobertura_cde",
  "liquidez",
  "margen_operacional",
  "eficiencia_operativa",
  "margen_neto",
];

function Camel({ lec }: { lec: Lectura }) {
  return (
    <>
      <Encabezado lec={lec} texto="los seis indicadores del cuadro CAMEL del Power BI" />
      <FilaEntidad lec={lec} claves={CAMEL.slice(1).concat("excedente")} />
      <Bloque
        titulo="CAMEL por tipo de entidad"
        subtitulo="Excedente, cobertura CDE, liquidez, margen operacional, eficiencia y margen neto."
        accion={lec.ficha("cobertura_cde")}
      >
        <TablaPorTipo lec={lec} claves={CAMEL} titulo="CAMEL por tipo de entidad" />
      </Bloque>
      <Bloque titulo="CAMEL por entidad">
        <TablaEntidades lec={lec} claves={CAMEL} orden="excedente" titulo="CAMEL por entidad" />
      </Bloque>
    </>
  );
}

const SALDOS = ["activo", "patrimonio", "cartera_bruta", "pasivo", "depositos"];

function Saldos({ lec }: { lec: Lectura }) {
  const { l, grupo } = lec;
  return (
    <>
      <Encabezado lec={lec} texto="principales cifras del balance" />
      <Nota>
        El activo total es la cuenta 100000. El Power BI de referencia sumaba en esta columna la cuenta 140000
        (cartera de créditos); se corrigió por decisión de Novum (26 de septiembre de 2026).
      </Nota>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {SALDOS.map((k) => (
          <KpiCifra
            key={k}
            lec={lec}
            clave={k}
            contexto={
              k === "cartera_bruta"
                ? `Cartera de créditos (neta): ${cifra(valorDeGrupo(l, grupo, "cartera_creditos"), "pesos")}`
                : undefined
            }
          />
        ))}
      </div>
      <FilaEntidad lec={lec} claves={SALDOS} />
      <Bloque titulo="Total principales cifras por tipo" accion={lec.ficha("activo")}>
        <TablaPorTipo lec={lec} claves={SALDOS} titulo="Principales cifras por tipo" />
      </Bloque>
      <Bloque titulo="Total principales cifras por entidad">
        <TablaEntidades
          lec={lec}
          claves={SALDOS}
          orden="activo"
          titulo="Principales cifras por entidad"
          opciones={{ tipo: true, departamento: true }}
        />
      </Bloque>
    </>
  );
}

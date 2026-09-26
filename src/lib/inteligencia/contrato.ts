// COPIA LITERAL de SIAR-AYA/src/lib/motor-sectorial/inteligencia-contrato.ts (no editar aquí: se edita en SIAR y se copia;
// scripts/verificar-contrato-inteligencia.mjs compara ambas). Excluida de Prettier (.prettierignore) para seguir idéntica.
/* =============================================================================
   CONTRATO · Inteligencia sectorial (SIAR → novum-site y SIAR autenticado)
   ---------------------------------------------------------------------------
   Un archivo por corte con los dos informes del módulo:
     · cartera  — «Cartera y riesgo»: el informe original del sector (regla
                  `historico-marzo-2026`), entidad por entidad;
     · panorama — «Panorama financiero»: la réplica del Power BI «Seguimiento
                  sector» (versión `seguimiento-sector-2026-06`), por entidad y
                  por grupo, ya calculado.

   Lo escribe el exportador (`inteligencia-publica.ts`); lo leen la web pública
   y SIAR. La interfaz NO calcula cifras financieras: toma las del archivo. Este
   archivo es la ÚNICA definición del formato y se copia tal cual a novum-site
   (`src/lib/inteligencia/contrato.ts`); una prueba en cada repo lo compara.

   Datos públicos: nombres, siglas y cifras por entidad salen de archivos
   públicos de la Supersolidaria (decisión de Adrian, 26-sep-2026). No viajan
   NIT, representante legal, direcciones, teléfonos ni correos.
   ==========================================================================*/

export const CONTRATO_INTELIGENCIA = 'novum.inteligencia-sectorial/1' as const

export type UnidadCifra = 'porcentaje' | 'pesos' | 'veces'
export type PeriodoCifra = 'actual' | 'base' | 'actual_vs_base'

export interface FichaCifra {
  nombre: string
  definicion: string
  unidad: UnidadCifra
  periodo: PeriodoCifra
  nota?: string
}

export interface ArchivoFuente {
  nombre: string
  sha256: string
  bytes: number
}

export interface CorteInteligencia {
  /** «AAAA-MM». */
  id: string
  /** «AAAA-MM-DD» (último día del mes). */
  fecha: string
  etiqueta: string
  /** completo = junio y diciembre (reporta todo el sector); parcial = los demás meses. */
  estado: 'completo' | 'parcial'
  /** El corte con el que se comparan los crecimientos; null si no se cargó. */
  base: { fecha: string; etiqueta: string } | null
}

/** Un grupo del panorama: cuántas entidades y sus cifras, en el orden de `panorama.claves`. */
export interface GrupoInteligencia {
  entidades: number
  enBase: number
  v: (number | null)[]
}

export interface EntidadPanoramaPublica {
  codigo: string
  nombre: string
  sigla: string | null
  /** Índice en `panorama.tipos`. */
  tipo: number
  /** Índice en `panorama.departamentos`; null si el archivo no lo trae. */
  departamento: number | null
  municipio: string | null
  nivel: number | null
  enBase: boolean
  v: (number | null)[]
}

export interface PanoramaPublico {
  metodologia: { codigo: string; version: string; nombre: string; descripcion: string; diferencia: string | null }
  /** Qué cifra ocupa cada posición de los arreglos `v`. */
  claves: string[]
  ficha: Record<string, FichaCifra>
  tipos: string[]
  departamentos: string[]
  total: GrupoInteligencia
  porTipo: Record<string, GrupoInteligencia>
  porDepartamento: Record<string, GrupoInteligencia>
  porTipoYDepartamento: Record<string, Record<string, GrupoInteligencia>>
  entidades: EntidadPanoramaPublica[]
}

export type ZonaRiesgo = 'Bajo' | 'Moderado' | 'Elevado' | 'Alto'

export interface EntidadCarteraPublica {
  codigo: string
  nombre: string
  sigla: string | null
  segmento: 'COOPERATIVAS' | 'MUTUALES'
  departamento: string | null
  municipio: string | null
  asociados: number | null
  cartera_total: number
  cartera_mora: number
  cat_b: number | null
  cat_c: number | null
  cat_d: number | null
  cat_e: number | null
  icm: number | null
  icv: number | null
  cat_e_total: number | null
  riesgo: ZonaRiesgo | null
}

export interface CarteraPublica {
  metodologia: { codigo: string; version: string; nombre: string; descripcion: string }
  alcance: string
  /** μ y σ (poblacional) del ICM entre las entidades del alcance: las fronteras de las zonas. */
  estadisticas: { entidades: number; icm_promedio: number | null; icm_desv: number | null; icm_ponderado: number | null; icm_mediana: number | null }
  entidades: EntidadCarteraPublica[]
}

export interface InteligenciaSectorial {
  contrato: typeof CONTRATO_INTELIGENCIA
  corte: CorteInteligencia
  fuente: {
    nombre: string
    archivos: { actual: { cuentas: ArchivoFuente; seisDigitos: ArchivoFuente }; base: { cuentas: ArchivoFuente; seisDigitos: ArchivoFuente } | null }
    procesado: { el: string; entorno: string; evaluador: string; panorama: string }
  }
  cartera: CarteraPublica
  panorama: PanoramaPublico
}

/* ---------------------------------------------------------------------------
   Validación (la corren el exportador antes de escribir y la web antes de leer)
   ------------------------------------------------------------------------ */

const CAMPOS_PROHIBIDOS = ['nit', 'representante', 'direccion', 'telefono', 'email', 'correo', 'tenant', 'usuario']

function esCifra(v: unknown): boolean {
  return v === null || (typeof v === 'number' && Number.isFinite(v))
}

/** Problemas del archivo; vacío = válido. No lanza. */
export function validarInteligencia(x: unknown): string[] {
  const p: string[] = []
  const d = x as InteligenciaSectorial
  if (!d || typeof d !== 'object') return ['no es un objeto']
  if (d.contrato !== CONTRATO_INTELIGENCIA) p.push(`contrato «${String(d.contrato)}» desconocido`)
  if (!/^\d{4}-\d{2}$/.test(d.corte?.id ?? '')) p.push('corte.id no es AAAA-MM')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d.corte?.fecha ?? '') || !d.corte.fecha.startsWith(d.corte.id)) p.push('corte.fecha no corresponde a corte.id')
  if (d.corte && !['completo', 'parcial'].includes(d.corte.estado)) p.push('corte.estado inválido')
  const pan = d.panorama
  if (!pan || !Array.isArray(pan.claves) || pan.claves.length === 0) p.push('panorama sin claves')
  else {
    const n = pan.claves.length
    const revisaGrupo = (donde: string, g: GrupoInteligencia | undefined) => {
      if (!g || !Array.isArray(g.v) || g.v.length !== n) return p.push(`${donde}: arreglo de cifras de otro largo`)
      if (!g.v.every(esCifra)) p.push(`${donde}: cifra no finita`)
    }
    revisaGrupo('panorama.total', pan.total)
    for (const [t, g] of Object.entries(pan.porTipo ?? {})) revisaGrupo(`panorama.porTipo.${t}`, g)
    for (const [t, g] of Object.entries(pan.porDepartamento ?? {})) revisaGrupo(`panorama.porDepartamento.${t}`, g)
    for (const [t, m] of Object.entries(pan.porTipoYDepartamento ?? {})) for (const [k, g] of Object.entries(m)) revisaGrupo(`panorama.porTipoYDepartamento.${t}.${k}`, g)
    for (const clave of pan.claves) if (!pan.ficha?.[clave]) p.push(`panorama: la cifra «${clave}» no tiene ficha`)
    let malas = 0
    for (const e of pan.entidades ?? []) {
      if (!Array.isArray(e.v) || e.v.length !== n || !e.v.every(esCifra)) malas++
      if (e.tipo < 0 || e.tipo >= pan.tipos.length) malas++
      if (e.departamento !== null && (e.departamento < 0 || e.departamento >= pan.departamentos.length)) malas++
    }
    if (malas) p.push(`panorama: ${malas} problemas en entidades`)
    if ((pan.entidades ?? []).length !== pan.total?.entidades) p.push('panorama: el total no cuenta las mismas entidades que la lista')
  }
  const car = d.cartera
  if (!car || !Array.isArray(car.entidades)) p.push('cartera sin entidades')
  else {
    if (car.entidades.length !== car.estadisticas?.entidades) p.push('cartera: las estadísticas no cuentan las mismas entidades')
    const numericos: (keyof EntidadCarteraPublica)[] = ['asociados', 'cartera_total', 'cartera_mora', 'cat_b', 'cat_c', 'cat_d', 'cat_e', 'icm', 'icv', 'cat_e_total']
    const malas = car.entidades.filter((e) => !numericos.every((k) => esCifra(e[k])) || !['COOPERATIVAS', 'MUTUALES'].includes(e.segmento)).length
    if (malas) p.push(`cartera: ${malas} entidades con cifras no finitas o segmento inválido`)
  }
  const texto = JSON.stringify(d).toLowerCase()
  for (const campo of CAMPOS_PROHIBIDOS) if (texto.includes(`"${campo}"`)) p.push(`campo prohibido en lo público: «${campo}»`)
  return p
}

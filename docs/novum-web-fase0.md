# Novum Integral — Sitio web corporativo, Fase 0

**Documento de trabajo para revisión.** Versión 1 — 11 de septiembre de 2026.

Este documento reúne todo lo necesario para revisar y luego construir la primera versión pública de `novumintegral.com`: contexto de la empresa, objetivo del sitio, plan por fases, decisiones técnicas y **el texto completo de cada sección**, listo para corregir. Al final está la lista de lo que pedimos a quien lo revise.

---

## 1. Contexto

**Novum Integral SAS** es una empresa colombiana de software y consultoría para el **sector de economía solidaria**: cooperativas de ahorro y crédito, fondos de empleados y asociaciones mutuales. Está en proceso de constitución (solicitud radicada en Cámara de Comercio, CIIU principal 7020 — consultoría de gestión; secundarios 6201 y 6311 — desarrollo de software y procesamiento de datos).

**Qué ofrece.** Productos de software **independientes** — hoy tres, con más en camino; cada uno se contrata por separado y no comparten datos entre sí — más servicios de acompañamiento:

| Línea | Qué es | Estado hoy |
|---|---|---|
| **SIAR** — Sistema Integral de Administración de Riesgos | Riesgo de crédito (SARC) como primer módulo; liquidez, operativo, mercado y LA/FT en fases siguientes | En pruebas con datos reales anonimizados. Aplicación en `app.novumintegral.com` |
| **Presupuesto y ejecución presupuestal** | Formulación, proyección y seguimiento presupuestal por escenarios, pensado para el sector solidario | En desarrollo |
| **Planeación estratégica** | Objetivos, indicadores, responsables y seguimiento | En diseño |
| **Servicios** | Diagnóstico de madurez, consultoría e implementación, capacitación, transformación digital, **oficial de cumplimiento, gestor de riesgos** | Disponibles |

**Modelo de negocio.** Licenciamiento mensual del software + servicios de consultoría, diagnóstico y acompañamiento.

**Diferenciadores definidos por el equipo:**
- Construido sobre los estándares de la Superintendencia Financiera y la norma ISO 31000, no solo sobre el mínimo que exige la Supersolidaria.
- Comités de expertos con calificación individual registrada: la evidencia para auditoría y revisoría fiscal queda creada en el proceso.
- Indicadores macroeconómicos actualizados automáticamente y comparativo de la entidad frente al sector.
- Informe integral de riesgos exportable con un clic.
- Diagnóstico de madurez del sistema de riesgos con comparativo semestral.
- Analítica de datos incluida en cada módulo, no vendida aparte.

**Equipo.** Cinco personas: cuatro socios y una colaboradora. Perfiles financieros y de riesgos con experiencia directa en el sector solidario, más un perfil de sistemas.

**Identidad visual ya definida.** Nombre: Novum Integral. Eslogan: *"Inteligencia que anticipa, análisis que transforma, decisiones que generan valor."* Colores: morado (inteligencia, tecnología), verde (solidaridad, confianza), blanco y gris. Logotipo con piezas de rompecabezas, que representan la composición del portafolio. Tipografía de la aplicación actual: Plus Jakarta Sans.

**Infraestructura ya montada.** Dominio en Cloudflare (DNS), correo corporativo en Microsoft 365 con SPF, DKIM y DMARC configurados, aplicación desplegada en Vercel. El dominio raíz `novumintegral.com` hoy no apunta a nada: eso es lo que esta Fase 0 resuelve.

---

## 2. Objetivo del sitio en esta etapa

**Credibilidad y audiencia antes del lanzamiento comercial.** El producto existe y funciona, pero aún no está en venta. El sitio no debe vender una plataforma que nadie puede comprar todavía; debe demostrar que hay criterio sectorial, producto real e ingeniería detrás.

Por eso:
- Se **muestra** el producto (descripción, y en la Fase 1 capturas reales) pero no se publican precios ni hay registro en línea.
- El llamado a la acción es **"agendar una demostración"**, no "comprar" ni "crear cuenta".
- El tono es el de un equipo que conoce el sector desde adentro, no el de un proveedor de tecnología genérico.

**Audiencia.** Gerentes, directores financieros, oficiales de riesgo y miembros de consejos de administración y juntas directivas de cooperativas, fondos de empleados y mutuales en Colombia. Entidades pequeñas y medianas, con equipos operativos de pocas personas, que hoy resuelven la gestión de riesgos en hojas de cálculo.

**Registro.** Español de Colombia, trato de **usted**, formal pero directo. Vocabulario del sector: *asociados* (no clientes), *consejo de administración*, *junta directiva*, *revisoría fiscal*, *Supersolidaria*, *cartera*, *cierre*.

---

## 3. Plan por fases

El sitio se publica por fases. Cada fase sale sola y no depende de la siguiente. No se abre ninguna sección hasta que tenga contenido real: una sección vacía comunica abandono.

### Fase 0 — "Existimos" (esta semana)
Una sola página en el dominio raíz, completa y bien hecha. Es el objeto de este documento.

Secciones, en el orden en que aparecen en la página: posicionamiento → el problema → soluciones → por qué es distinto → **inteligencia del sector** *(5.9; editorial hasta tener snapshot aprobado)* → acompañamiento → **nosotros** *(institucional, sin nombres; ver 5.6)* → contacto y demostración → pie de página *(con la declaración institucional)*.

*(La numeración 5.x de este documento agrupa el contenido; el orden en la página es el de esta lista y lo fija el Master Prompt v2.)*

Sin blog, sin informes, sin páginas internas.

### Fase 1 — Soluciones (2 a 3 semanas después)
Tres páginas, una por línea de producto, con una misma plantilla: para quién es → qué resuelve → módulos con **capturas reales del software** → marco normativo concreto que cubre (circulares, capítulos, formatos) → cómo se implementa → demostración.

### Fase 2 — Contenido (cuando exista la primera pieza)
- **Informes sectoriales**: publicación trimestral con datos públicos de la Supersolidaria procesados y presentados de forma legible. Cada edición: portada, resumen ejecutivo, 4 a 6 gráficas, nota metodológica con fuente y fecha de corte, PDF descargable. Numerados desde la edición 01. Es el activo de posicionamiento más valioso del sitio: casi nadie procesa esos datos, y un informe serio convierte a la empresa en referencia antes de tener un cliente.
- **Blog**: cadencia mensual, 600–900 palabras, firmado por un socio. Cuatro pilares: normativa y plazos · método (cómo se construye un KRI, una matriz, un presupuesto por escenarios) · lectura de cifras del sector · notas de producto.

---

## 4. Decisiones técnicas

- **Next.js**, desplegado en **Vercel**, como **proyecto separado** de la aplicación. Despliegues independientes: si la app tiene un incidente, el sitio sigue en pie, y viceversa.
- **Sitio estático.** No necesita base de datos ni autenticación.
- **Indexable.** Este sitio sí debe aparecer en Google. La aplicación tiene la cabecera `X-Robots-Tag: noindex, nofollow`; **ese `next.config` no se copia aquí**. Incluir metadatos, Open Graph, `sitemap.xml` y `robots.txt` correctos.
- **Contenido futuro en archivos MDX** dentro del repositorio (blog e informes). Con cadencia mensual no se justifica un CMS para un equipo de cinco personas.
- **Dominio:** `novumintegral.com` y `www.novumintegral.com` → Vercel. Registros en Cloudflare en modo *DNS only*.
- **Sección de equipo detrás de una variable de entorno** (por ejemplo `NEXT_PUBLIC_SHOW_TEAM`): `true` en los despliegues de vista previa, para que el equipo la revise y apruebe; `false` en producción hasta que se decida publicarla.
- **Formulario de contacto**: si se implementa, en Colombia requiere **política de tratamiento de datos personales** (Ley 1581 de 2012) y casilla de autorización. Alternativa para la Fase 0: enlaces directos a WhatsApp y correo, sin formulario, y el formulario entra en la Fase 1 con la política ya redactada.
- **Rendimiento y accesibilidad** como criterio de aceptación: la audiencia abre el sitio desde celulares de gama media y conexiones irregulares.

---

## 5. Contenido de la Fase 0 — texto completo

> **Regla del corte comercial (14 de septiembre de 2026).** Los estados internos de construcción de producto — "en desarrollo", "en diseño", "en pruebas", porcentajes de avance, fechas de lanzamiento, hojas de ruta técnicas — pueden existir como información de gestión del proyecto, pero **no forman parte de la comunicación comercial pública** salvo decisión expresa posterior. La web comunica utilidad, capacidad, experiencia, especialización, tecnología + acompañamiento e información convertida en decisiones. Tampoco se publican nombres, cargos, fotografías ni años de experiencia de personas: la sección Nosotros es institucional.

> Todo lo que sigue es texto redactado para revisar y corregir. Las notas entre corchetes son instrucciones o pendientes, no texto del sitio.

### 5.1 Encabezado y posicionamiento

**Etiqueta superior:** Software y consultoría para el sector solidario

**Título:** Gestión de riesgos, presupuesto y planeación para cooperativas, fondos de empleados y mutuales.

**Subtítulo:** Una plataforma integral y un equipo que conoce el sector, para que su entidad gestione sus riesgos con método y decida con datos.

**Eslogan (en el encabezado o como línea de cierre de la sección):** Inteligencia que anticipa, análisis que transforma, decisiones que generan valor.

**Botón principal:** Agende una demostración
**Botón secundario:** Escribir por WhatsApp

**Enlace discreto en la barra superior:** Ingresar a la plataforma → `https://app.novumintegral.com`

*[Alternativa de título, más corta: "Riesgos, presupuesto y planeación en una sola plataforma." Elegir una.]*

### 5.2 El problema — "Cuando la información existe, pero no se convierte en decisiones"

**Introducción:** Tres situaciones que se repiten en entidades del sector solidario, independientemente de su tamaño.

**Sistemas que no aportan valor estratégico.** Las entidades cuentan con información, aplicativos y reportes, pero con frecuencia funcionan de manera aislada y no se convierten en una visión útil para tomar decisiones.

**Regulación y gestión cada vez más exigentes.** Cumplir no consiste solo en presentar reportes: exige metodologías, evidencia, seguimiento y capacidad de análisis sostenidas en el tiempo.

**Decisiones sin contexto suficiente.** Conocer los indicadores propios es importante. Entender cómo se comporta la entidad frente al sector, su entorno y sus riesgos permite decidir mejor.

*(Se retiró "Cierres a mano": Novum no se posiciona como una solución contra Excel. No se incluye "Planeación, riesgos y presupuesto trabajando por separado" para evitar cualquier lectura de suite integrada.)*

### 5.3 Soluciones — "Tecnología especializada para el sector solidario."

**Introducción:** Cada solución resuelve un frente distinto de la gestión de su entidad y se contrata por separado, con el mismo criterio sectorial y el mismo acompañamiento.

**SIAR — Sistema Integral de Administración de Riesgos**
*Gestión integral de riesgos para el sector solidario.*
Una solución orientada a fortalecer la gestión de riesgos mediante metodologías, medición, control, monitoreo, matrices, indicadores y evidencias.
Diseñado tomando como referencia buenas prácticas de gestión de riesgos, ISO 31000 y referentes técnicos aplicables al sistema financiero, adaptados a las necesidades del sector solidario.
*(Afirmación regulatoria prudente: no promete cumplimiento, no presenta normas de la Superintendencia Financiera como obligación para entidades vigiladas por Supersolidaria. Constelación con los mismos siete conceptos — se sustituyó "seguimiento" por "control" para evitar redundancia con "monitoreo".)*
*(Comunicación metodológica a propósito: no se listan funcionalidades hasta verificarlas contra el producto. Sin "informe integral con un clic", sin "indicadores macro automáticos", sin fases.)*

**Presupuesto** — Planeación, construcción, seguimiento y análisis presupuestal orientado a la toma de decisiones.

**Planeación estratégica** — Objetivos, indicadores, iniciativas, responsables y seguimiento dentro de una metodología estructurada.

**Más soluciones** — Seguimos construyendo herramientas especializadas para las necesidades reales del sector solidario.

*(Sin estados, sin porcentajes, sin fechas, sin hoja de ruta. Sin mockup de interfaz hasta tener capturas reales; SIAR mantiene jerarquía con su constelación metodológica.)*

### 5.4 Por qué es distinto

**Analítica para decidir.** La información adquiere valor cuando permite interpretar, comparar y tomar decisiones con mayor criterio.

**Evidencia para la gestión.** Una gestión sólida requiere metodologías, soportes, trazabilidad y evidencia que permitan entender cómo se toman y se siguen las decisiones.

**Su entidad en contexto.** Los indicadores propios cuentan una parte de la historia. Entender el comportamiento del sector y del entorno aporta contexto para interpretar mejor los resultados.

**Diagnóstico antes que solución.** Antes de recomendar herramientas o acompañamiento, buscamos entender el nivel de madurez, las brechas y las necesidades reales de la entidad.

*(Reescritos como propuesta de enfoque, no como funcionalidades: se retiraron "cada módulo incluye analítica", "calificaciones de comités registradas persona por persona" y el comparativo sectorial automático.)*

### 5.5 Acompañamiento — "Cómo acompañamos"

**Introducción:** El software es la herramienta. El acompañamiento es lo que hace que funcione dentro de la entidad.

**Diagnóstico de madurez.** Evaluación del sistema de riesgos frente a la norma y a las buenas prácticas, con una calificación y un plan de cierre de brechas.

**Implementación y consultoría.** Políticas, manuales, reglamentos de comités y acompañamiento hasta que el sistema opera solo.

**Capacitación.** Para consejos, juntas, comités y equipos operativos. Metodologías activas, no presentaciones de tres horas.

**Auditoría SIAR.** Evaluamos el nivel de implementación y madurez del Sistema Integral de Administración de Riesgos de su entidad, así como su alineación con los requerimientos aplicables, e identificamos fortalezas, brechas y oportunidades de mejora en gobierno, metodologías, documentación, controles, monitoreo y evidencia. *(Es la auditoría del sistema de la entidad, no del software Novum. No implica certificación.)*

**Oficial de cumplimiento.** Acompañamiento especializado para fortalecer la gestión de cumplimiento, el seguimiento y la documentación requerida por la entidad. *[Formulación neutral a propósito: no afirma que Novum asuma el cargo ni reemplace al oficial designado. Se actualizará cuando se defina jurídicamente si Novum puede asumir ese rol en determinadas entidades.]*

**Gestor de riesgos.** Gestión de riesgos tercerizada: comités, indicadores, informes y seguimiento. *[Validar alcance legal.]*

### 5.6 Nosotros — "Experiencia que entiende el sector"

**Texto base:** Novum integra profesionales con experiencia en gestión financiera, riesgos, cumplimiento, tecnología, analítica, planeación, procesos y dirección de organizaciones del sector solidario.

**Complemento:** Nuestro equipo combina experiencia práctica en cooperativas, fondos de empleados, asociaciones mutuales, sistemas de administración de riesgos, transformación de procesos y desarrollo tecnológico.

**Capacidades:** Riesgos · Finanzas · Cumplimiento · Planeación · Analítica · Tecnología.

*(Sin nombres, fotografías, cargos ni años individuales. La palabra "pequeño" se elimina de la comunicación pública: el tamaño no es parte de la propuesta de valor.)*

**Declaración institucional (pública, siempre visible — en el pie de página):**

Novum Integral SAS es una empresa colombiana de software y consultoría especializada en el sector de economía solidaria: cooperativas de ahorro y crédito, fondos de empleados y asociaciones mutuales. Desarrollamos SIAR, un sistema integral de administración de riesgos, y productos independientes para presupuesto y planeación estratégica, y acompañamos a las entidades con diagnóstico, implementación, capacitación y servicios especializados como oficial de cumplimiento y gestor de riesgos. Somos un equipo especializado, con experiencia directa en el sector.

*[Ciudad: agregar "desde [ciudad]" cuando se confirme.]*

**Perfiles del equipo:**

> **Los perfiles individuales NO se publican.** Siguen en código y solo se renderizan con `NEXT_PUBLIC_SHOW_TEAM=true` (nunca en producción). Se conservan por si más adelante se decide presentarlos.

**Yorgi Celiar Ríos Epalza** — Riesgos y sector solidario
Administrador financiero, especialista en riesgos. Ocho años de experiencia en el sector solidario.

**Aura Carolina González Guerrero** — Producto: riesgo de crédito
Ingeniera financiera, especialista en finanzas. Tres años de experiencia en el sector financiero.
*[Confirmar ortografía del apellido: González / Gonzales.]*

**Ingrid Legret Angarita Villamizar** — Riesgo de crédito
Ocho años de experiencia en el sector solidario.
*[Pendiente: formación académica.]*

**Adrián López Aisales** — Producto y desarrollo
Ingeniero financiero, especialista en finanzas. Cinco años de experiencia en el sector real y en Mipymes.

**Andrés Felipe Lozano Arboleda** — Tecnología, seguridad y analítica
Ingeniero de sistemas.
*[Pendiente: especialización y experiencia.]*

### 5.7 Contacto y demostración

**Título:** ¿Quiere ver la plataforma con una cartera como la de su entidad?

**Texto:** Agende una demostración de 45 minutos. La hacemos con información anonimizada de una entidad real, para que vea cómo se comporta el sistema con datos como los suyos.

**Botón principal:** Agende una demostración
**Botón secundario:** Escribir por WhatsApp

**Datos de contacto:**
- contacto@novumintegral.com
- administracion@novumintegral.com
- WhatsApp: +57 301 566 1091 · +57 321 480 9336
- *[Ciudad: pendiente.]*

*[Nota técnica: si el botón "Agendar" abre un formulario, aplica la política de datos personales de la sección 4. Para la Fase 0 puede abrir WhatsApp con un mensaje predefinido: "Hola, quiero agendar una demostración de Novum Integral para mi entidad."]*

### 5.8 Pie de página

- Novum Integral SAS
- Inteligencia que anticipa, análisis que transforma, decisiones que generan valor.
- Ingresar a la plataforma → `app.novumintegral.com`
- Línea institucional corta: "Software y acompañamiento especializado para el sector solidario." *(La declaración institucional completa vive en el JSON-LD y en la descripción de metadatos; el footer no es una sección de contenido.)*
- Política de tratamiento de datos personales *[pendiente de redactar]*
- LinkedIn *[pendiente: la página de empresa aún no existe]*
- © 2026 Novum Integral SAS

---

### 5.9 Inteligencia del sector *(Bloque 2)*

**Eyebrow:** Inteligencia del sector
**Título:** Datos públicos convertidos en información útil para tomar mejores decisiones.
**Intro:** El análisis sectorial permite transformar información pública en contexto para comprender tendencias, comportamiento financiero y dinámicas del sector solidario.
**Capacidad:** En Novum combinamos analítica, conocimiento sectorial y lectura financiera para convertir esa información en una herramienta útil para la gestión.
*(Primero el valor del análisis, después la capacidad de Novum. No se afirma que una experiencia numérica esté operativa.)*

**Regla:** ninguna cifra sectorial se publica sin un snapshot aprobado y trazable (`src/data/sector/snapshot.json`, contrato en `src/lib/sector/types.ts`). Sin snapshot, la sección publica solo su **versión editorial**: cabecera, los tres capítulos siguientes, la geometría propia de la sección, «Su entidad en contexto» y la fuente conceptual. Nunca KPI vacíos, gráficas, ceros, «sin datos» ni «próximamente». La fecha de corte solo aparece cuando la trae el snapshot.

**Tres capítulos (versión editorial):**
- **01 · Crecimiento y evolución.** ¿Cómo está cambiando el sector en el tiempo? El análisis entre cortes permite entender la evolución de activos, cartera, depósitos, patrimonio y otras variables relevantes.
- **02 · Riesgo y calidad financiera.** ¿Qué señales permiten interpretar el comportamiento del riesgo? La lectura de indicadores de cartera, deterioro, cobertura y dispersión permite identificar comportamientos que requieren mayor contexto.
- **03 · Estructura y concentración.** ¿Cómo está compuesto el sector? Tipo de entidad, territorio, tamaño y concentración ayudan a comprender dónde se encuentra la actividad y cómo se distribuye.

**Con snapshot (Bloque 2B.2):** cuatro indicadores (entidades analizadas, activos, cartera, depósitos), tres historias con visualización, lectura ejecutiva (`insight`, redactada en la capa de datos: la UI nunca concluye), universo, metodología y fuente; corte y cobertura; rangos de tamaño en «Su entidad en contexto». La historia de riesgo no está acoplada a ICM: la métrica viaja en el snapshot.

**Su entidad en contexto:**
**Título:** No vea solamente el sector. Entienda su posición dentro de él.
**Texto:** Una lectura sectorial adquiere mayor valor cuando permite contrastar los indicadores de una entidad con organizaciones comparables, su territorio y su tipo de organización. Esa es la dirección de la inteligencia analítica de Novum.
**CTA:** Agende una demostración → el mismo botón (`cta.primary`) y el mismo destino que el resto del sitio. Sin NIT, sin buscador, sin formulario.

**Fuente (siempre):** Fuente de información sectorial: Superintendencia de la Economía Solidaria. Análisis y procesamiento: Novum Integral.

---

## 6. Identidad visual para el sitio

- **Colores:** morado como color principal (inteligencia, tecnología); verde como acento (solidaridad, confianza); blanco y gris como neutros. La combinación busca equilibrar innovación con la identidad del sector solidario.
- **Logotipo:** piezas de rompecabezas con la "n". Debe usarse el **archivo vectorial (SVG)** oficial, nunca una recreación en código. *[Pendiente: el SVG definitivo aún no está en el repositorio; hoy la aplicación usa una versión recreada que no coincide con el original.]*
- **Tipografía:** la aplicación usa Plus Jakarta Sans. El sitio puede usar la misma para mantener coherencia, o la que defina el manual de marca.
- **Criterio general:** sobrio y profesional. Sin lupas, sin íconos de peligro, sin ilustraciones caricaturescas. Un solo elemento gráfico protagonista.

---

## 7. Pendientes e insumos que faltan

| Insumo | Responsable | Bloquea |
|---|---|---|
| Logo en SVG | Aura | La calidad visual de todo el sitio |
| Formación de Ingrid; especialización y experiencia de Andrés | Cada uno | Solo la sección de equipo (oculta) |
| Confirmar ortografía "González" | Aura | Sección de equipo |
| Ciudad para la sección de contacto | Socios | Contacto |
| Política de tratamiento de datos personales | Yorgi | Formulario de contacto (no la Fase 0 si se usa WhatsApp) |
| Página de empresa en LinkedIn | Andrés | Enlace del pie de página |
| Capturas reales del software | Adrián | Fase 1 |
| Portafolio de servicios | Yorgi e Ingrid | Contenido de la Fase 1 |
| Datos para el Informe 01 | Por definir | Fase 2 |

---

## 8. Lo que pedimos de esta revisión

Queremos indicaciones concretas, no un rediseño. En particular:

1. **Estructura.** ¿Las secciones de la Fase 0 son suficientes para el objetivo de credibilidad, o falta o sobra alguna?
2. **Tono y registro.** ¿El trato de usted y el vocabulario son adecuados para gerentes y consejos de cooperativas y fondos de empleados en Colombia? ¿Hay frases que suenen a proveedor genérico de tecnología?
3. **Promesa del producto.** Con el SIAR en pruebas y los otros módulos en desarrollo, ¿los textos prometen de más, de menos, o están en el punto?
4. **Estado de los módulos.** ¿Mostrar "en pruebas" / "en desarrollo" / "en diseño" suma credibilidad (transparencia) o resta (parece inmaduro)?
5. **Llamado a la acción.** ¿"Agendar una demostración" + WhatsApp es el flujo correcto para esta audiencia, o conviene algo distinto?
6. **Técnica.** ¿Qué falta en SEO, accesibilidad, rendimiento o cumplimiento (datos personales) que deba entrar en la Fase 0?
7. **Redacción.** Correcciones y mejoras línea por línea, marcando la sección.
8. **Orden de las secciones.** ¿El orden propuesto (problema antes que producto) es el correcto para esta audiencia?

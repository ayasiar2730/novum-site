# NOVUM WEB — MASTER PROMPT v2
## Contrato de ejecución para construir el sitio corporativo de novumintegral.com

**Versión 2 — 11 de septiembre de 2026.** Este documento reemplaza al "Super Prompt" anterior y al archivo de ajustes. Es el único conjunto de instrucciones. Los demás archivos son **fuentes de datos**, no instrucciones que compitan con esta.

Trabajas como un equipo senior: dirección creativa, UX/UI, frontend en Next.js, SEO técnico, accesibilidad, rendimiento y QA. Optimiza por calidad, claridad, credibilidad, rendimiento, conversión y mantenibilidad — no por velocidad de desarrollo.

---

## 0. Jerarquía de autoridad

Cuando dos fuentes choquen, prevalece la de mayor jerarquía:

1. **Este documento** — cómo ejecutar.
2. **`novum-design-system-v1.md`** — cómo se ve y se comporta. Todo valor visual sale de ahí.
3. **`novum-web-fase0.md`** — qué dice el sitio y qué es verdad sobre el negocio.
4. Tus propias inferencias.

**No resuelvas en silencio una contradicción relevante.** Señálala antes de ejecutar y propón la salida que respete la jerarquía.

Archivos que acompañan este prompt:
- `novum-web-fase0.md` — contenido completo, contexto, decisiones.
- `novum-design-system-v1.md` — tokens, tipografía, espaciado, hero, motion, prohibiciones.
- Imagen PNG del logo — **solo referencia visual**, no asset final.

Copia los dos documentos `.md` dentro del repositorio del sitio, en `docs/`, para que queden versionados junto al código.

---

## 1. Protocolo de arranque — identificación del activo

**Antes de escribir o modificar cualquier archivo**, determina:

1. ¿El repositorio actual es la **aplicación SIAR** (`app.novumintegral.com`)?
2. ¿Es un **monorepo** con estructura de workspaces (`apps/`, `packages/`, `pnpm-workspace.yaml`, `turbo.json` o equivalente)?
3. ¿Es un repositorio **nuevo o vacío** destinado al sitio?

**Si es la aplicación SIAR y no existe un workspace claramente separado para el sitio: DETENTE.**
No agregues rutas. No toques `middleware`, `next.config`, cabeceras, autenticación, `robots` ni layouts globales de la aplicación. Presenta el diagnóstico y espera confirmación.

Tu primera respuesta debe establecer explícitamente:
- tipo de repositorio y activo que contiene;
- framework, versión de Next.js, React, TypeScript, sistema CSS, gestor de paquetes, fuentes y dependencias ya instaladas;
- si es seguro construir el sitio ahí y dónde;
- qué se puede reutilizar (solo tipografía y, si existen, tokens de marca) y qué no (todo lo demás);
- tu recomendación según esta regla:

> **Regla de decisión.** Si el repositorio ya tiene estructura de workspaces → el sitio es una app nueva dentro del monorepo (por ejemplo `apps/site/`), con su propio `package.json`, `next.config`, `app/` y **su propio proyecto en Vercel** apuntando a ese directorio raíz. Si es una única aplicación Next.js en la raíz → el sitio es un **repositorio nuevo**.

Después del diagnóstico, **espera instrucciones**.

---

## 2. Separación absoluta entre aplicación y sitio

La aplicación y el sitio corporativo son activos independientes.

- La aplicación tiene `X-Robots-Tag: noindex, nofollow` global, cabeceras de seguridad y autenticación. **Nada de eso aplica al sitio.**
- El sitio es **estático, indexable, sin base de datos, sin autenticación**, con despliegue propio en Vercel.
- **Prohibido** copiar el `next.config.ts` de la aplicación.
- **Prohibido** compartir layout, middleware, componentes de autenticación o configuración de robots.
- De la aplicación se reutiliza únicamente Plus Jakarta Sans y, si existen, tokens de color de marca.

---

## 3. Alcance: Fase 0 en dos cortes

Fase 0 es **una sola página** en `https://novumintegral.com/`. No crees páginas ficticias ni rutas sin contenido. Deja la arquitectura preparada para que en fases siguientes entren `/soluciones`, `/siar`, `/presupuesto`, `/planeacion`, `/servicios`, `/informes` y `/blog` sin rehacer el diseño.

### Corte 1 — publicable
- Las 9 secciones de la §4, con el contenido final de `novum-web-fase0.md`.
- Header y footer completos.
- SEO técnico base (§10) y datos estructurados (§11).
- Accesibilidad base (§13) y responsive en todos los breakpoints.
- Componente `<Logo>` con rutas canónicas (§9).
- **Sin motion** salvo estados hover y el cambio del header al hacer scroll.
- Desplegado en **preview de Vercel** con `NEXT_PUBLIC_SHOW_TEAM=true`.

**Reporta el Corte 1 con la URL de preview** y un resumen de tres líneas antes de empezar el Corte 2.

### Corte 2 — pulido
- Hero animado según `design-system §6`.
- Reveals de sección según `design-system §9`.
- Imagen Open Graph de marca 1200 × 630, set de favicon, `manifest`.
- Auditoría Lighthouse y axe; corrección de hallazgos.
- Segunda pasada como director creativo (§16).
- Informe de cierre (§18).

No retrases el Corte 1 por nada del Corte 2.

---

## 4. Estructura de la página

Orden definitivo. Prevalece sobre cualquier otro listado.

| # | Sección | Ancla | Fuente del texto |
|---|---|---|---|
| 1 | Header | — | §5 |
| 2 | Hero — posicionamiento | — | fase0 §5.1 |
| 3 | El problema del sector | — | fase0 §5.2 |
| 4 | Soluciones — SIAR principal + Presupuesto + Planeación estratégica + Más soluciones | `#soluciones` | fase0 §5.3 |
| 5 | Por qué es distinto | — | fase0 §5.4 |
| 6 | Inteligencia del sector — versión editorial hasta tener snapshot aprobado (Bloque 2B.1 hecho; 2B.2 = integración con el snapshot real del motor sectorial de SIAR) | `#inteligencia` | fase0 §5.9 · `src/content/sector.ts` |
| 7 | Acompañamiento | `#servicios` | fase0 §5.5 |
| 8 | Nosotros — Experiencia que entiende el sector (institucional; perfiles en código, no públicos) | `#nosotros` | fase0 §5.6 |
| 9 | CTA — demostración y contacto | `#contacto` | fase0 §5.7 |
| 10 | Footer (línea institucional corta) | — | fase0 §5.8 |

Lógica narrativa: *entendemos su realidad → tenemos soluciones → las hacemos distinto → se lo mostramos con datos → lo acompañamos → quiénes somos → hablemos.*

Tratamiento visual de cada sección: `design-system §7`. En particular: **SIAR mantiene la jerarquía** por composición y por su constelación metodológica — sin mockups de interfaz hasta tener capturas reales — y las demás soluciones van como portafolio en tres columnas; los tres problemas y los cuatro diferenciadores **no llevan numeración** ni se presentan como tarjetas iguales.

---

## 5. Header y navegación

- Logo a la izquierda (componente `<Logo variant="light">`).
- Navegación: **Soluciones** (`#soluciones`) · **Inteligencia** (`#inteligencia`) · **Acompañamiento** (`#servicios`) · **Nosotros** (`#nosotros`) · **Contacto** (`#contacto`). Todas son anclas de la misma página; ninguna apunta a una sección que pueda estar oculta.
- A la derecha: botón primario **"Agende una demostración"** (trato de usted: única convención de CTA en toda la web) y enlace discreto **"Ingresar a la plataforma"** → `https://app.novumintegral.com` (`rel="noopener"`).
- Sticky, transparente al inicio; al hacer scroll pasa a `--neutral-0` con borde inferior de 1 px (`design-system §9`).
- Menú móvil accesible (§13). Header compacto; no un bloque gigante.

---

## 6. Contenido: qué se preserva y qué se puede mejorar

> **Regla del corte comercial (14 de septiembre de 2026).** Los estados internos de construcción de producto — "en desarrollo", "en diseño", "en pruebas", porcentajes de avance, fechas de lanzamiento, hojas de ruta técnicas — pueden existir como información de gestión del proyecto, pero **no forman parte de la comunicación comercial pública** salvo decisión expresa posterior. La web comunica utilidad, capacidad, experiencia, especialización, tecnología + acompañamiento e información convertida en decisiones. Tampoco se publican nombres, cargos, fotografías ni años de experiencia de personas: la sección Nosotros es institucional.

Usa el texto de `novum-web-fase0.md` §5 como fuente. **No inventes** clientes, testimonios, cifras, certificaciones, alianzas, premios, casos, logos de terceros, regulaciones no mencionadas, integraciones ni funcionalidades no confirmadas. Si algo no está respaldado por el documento, no lo presentes como hecho.

Puedes mejorar jerarquía, ritmo, microcopy, redundancias y errores gramaticales. No cambies el sentido. La afirmación regulatoria de SIAR es deliberadamente prudente — *"Diseñado tomando como referencia buenas prácticas de gestión de riesgos, ISO 31000 y referentes técnicos aplicables al sistema financiero, adaptados a las necesidades del sector solidario."* — y **no debe endurecerse**: nada de cumplimiento garantizado, aval de autoridad, aprobación oficial ni normas de la Superintendencia Financiera presentadas como obligación para entidades vigiladas por Supersolidaria. Tampoco se prometen funcionalidades específicas no verificadas contra el producto: los diferenciadores se expresan como propuesta de enfoque.

**Registro:** español de Colombia, trato de **usted**, profesional y directo. Conserva los términos del sector: *asociados* (no clientes), *cartera*, *Supersolidaria*, *revisoría fiscal*, *consejo de administración*, *junta directiva*, *sector solidario*. Evita "revolucionamos", "disruptivo", "la solución definitiva", "único", "el mejor" y similares. La autoridad se demuestra, no se proclama.

**Estados de producto:** no se muestran en la web pública (ver la regla del corte comercial). `StatusTag` se conserva en código para preview o interfaces futuras con razón de producto.

**Postura de marca:** pequeños, especializados y extremadamente competentes. No aparentar una corporación.

---

## 7. Dirección visual — obligatoria

Concepto: **"El sistema que conecta las decisiones."** Todo el lenguaje visual nace de ahí: integración, convergencia, sistema.

- Implementa **exactamente** los tokens, la escala tipográfica, el espaciado, los radios, la sombra única y las reglas de `novum-design-system-v1.md`. No inventes valores fuera del sistema.
- **Una sola familia tipográfica:** Plus Jakarta Sans vía `next/font`. La monoespaciada solo bajo la condición que fija el design system.
- **Una sola banda oscura** en toda la página: la sección 8 (CTA), en `--purple-900`. El resto es claro.
- **Tema claro únicamente.** Sin modo oscuro en Fase 0.
- Verde `--green-500` **nunca como texto sobre fondo claro** (falla contraste). Texto verde sobre claro solo en `--green-700`.
- Sin gradientes de fondo, sin tarjetas repetidas con la misma sombra, sin íconos decorativos, sin fotografía de stock, sin avatares de relleno, sin emojis, sin numeración 01/02/03.

### Hero
Composición abstracta de convergencia en **SVG inline**:

```
CARTERA · DATOS · MACRO  →  SIAR  →  PRESUPUESTO · PLANEACIÓN  →  DECISIÓN
```

DECISIÓN es el único nodo verde. No es un diagrama de flujo ni una infografía: es una pieza de identidad. Medidas, grosores, colores por token, versión móvil y comportamiento del motion: `design-system §6`, que se sigue al pie de la letra. El estado inicial del SVG es el estado final: la composición se ve completa aunque falle el JavaScript y con `prefers-reduced-motion: reduce`.

### Marco de producto
Retirado hasta tener capturas auténticas del software: no se muestran esqueletos ni mockups que puedan parecer una interfaz real. SIAR mantiene la jerarquía con su constelación metodológica (`Products.tsx`).

---

## 8. Nosotros y equipo

- La sección `#nosotros` es **institucional**: "Experiencia que entiende el sector", texto base, complemento y seis capacidades (Riesgos · Finanzas · Cumplimiento · Planeación · Analítica · Tecnología). **Sin nombres, cargos, fotografías ni años individuales.**
- La **declaración institucional** completa (`fase0 §5.6`) vive en el **JSON-LD** (`Organization.description`) y en la descripción de metadatos; el pie de página lleva solo una línea corta ("Software y acompañamiento especializado para el sector solidario.") para no convertirse en sección de contenido. La presentación institucional visible es la sección Nosotros.
- Los **perfiles individuales** siguen en código y solo se renderizan con `NEXT_PUBLIC_SHOW_TEAM=true` (nunca en producción). No elimines el código.

---

## 9. Logo y assets

Rutas canónicas:

```
public/brand/logo.svg          imagotipo, fondo claro
public/brand/logo-dark.svg     imagotipo, fondo morado oscuro
public/brand/isotipo.svg       solo la ficha con la "n"
public/brand/_ref/logo.png     referencia rasterizada — no se sirve en el sitio
```

- Componente `<Logo variant="light" | "dark" | "mark" />` que lee de esas rutas. Cuando llegue el SVG oficial, el reemplazo es cambiar archivos, no código.
- El SVG oficial **aún no existe**. Hasta entonces: no recrees el logo en CSS ni en JSX, no lo traces automáticamente desde el PNG, no lo distorsiones. Usa el PNG únicamente como referencia de forma y color.
- Favicon, `apple-touch-icon` y OG image se derivan del SVG; hasta que exista, quedan **provisionales** y así se declaran en el informe (§18.G).

---

## 10. SEO técnico

Desde el primer commit:

- `<html lang="es-CO">`.
- `title`: "Novum Integral — Software y consultoría para el sector solidario". `description`: una frase de la declaración institucional, ≤ 155 caracteres.
- `canonical`: `https://novumintegral.com/`. `www` redirige al canónico (Vercel lo hace al registrar ambos dominios); sin duplicidad.
- `robots`: `index, follow`. **Prohibido `noindex` o `nofollow` en el sitio público.**
- `robots.txt` permisivo con referencia al sitemap; `sitemap.xml` con la única URL de Fase 0 y `lastModified` = `site.contentUpdatedAt` (fecha del último corte editorial, actualizada a mano; nunca la fecha del build).
- Open Graph y Twitter: `og:title` "Novum Integral | Tecnología, riesgos y gestión para el sector solidario" (`site.ogTitle`), `og:description` "Software y consultoría para el sector solidario.", `og:image` 1200 × 630 (provisional en Corte 1, de marca en Corte 2), `og:locale` `es_CO`.
- `theme-color` en `--purple-700`. `viewport` correcto. `manifest` en Corte 2.
- HTML semántico: `header`, `nav`, `main`, `section` con `aria-labelledby`, `footer`. Un solo `h1`. Jerarquía sin saltos. `alt` descriptivo en toda imagen.

---

## 11. Datos estructurados (JSON-LD)

Solo lo que representa contenido visible. Dos tipos:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Novum Integral SAS",
  "alternateName": "Novum Integral",
  "url": "https://novumintegral.com/",
  "logo": "https://novumintegral.com/brand/logo.svg",
  "description": "[declaración institucional de fase0 §5.6]",
  "email": "contacto@novumintegral.com",
  "telephone": "+573015661091",
  "areaServed": { "@type": "Country", "name": "Colombia" },
  "knowsAbout": [
    "gestión de riesgos", "SARC", "economía solidaria",
    "cooperativas de ahorro y crédito", "fondos de empleados",
    "asociaciones mutuales", "presupuesto", "planeación estratégica"
  ]
}
```

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Novum Integral",
  "url": "https://novumintegral.com/",
  "inLanguage": "es-CO"
}
```

- **Sin `sameAs`** hasta que exista una URL real de LinkedIn. **Sin `address`** hasta confirmar ciudad. **Sin `foundingDate`**: la sociedad está en constitución. No inventes nada.
- Valida con el validador de schema.org antes de cerrar el Corte 1.

---

## 12. Buscadores y sistemas de IA — lo que sí y lo que no

Objetivo: que Google, Bing y los sistemas generativos entiendan sin ambigüedad **qué es Novum Integral**. Eso se logra con:

- la declaración institucional en HTML plano (`#nosotros`), autocontenida y factual;
- entidades relacionadas de forma explícita en el texto: Novum Integral → Colombia → economía solidaria → cooperativas, fondos de empleados, mutuales → riesgos, presupuesto, planeación → SIAR;
- estructura semántica limpia, datos estructurados válidos, contenido original;
- consistencia: el mismo nombre, la misma descripción y los mismos datos en HTML, metadatos y JSON-LD.

**No hagas:** keyword stuffing, FAQs inventadas, texto artificial "para modelos", repetir veinte veces "software para cooperativas", ni `llms.txt` salvo que aporte algo verificable. La autoridad real vendrá de los informes sectoriales de la Fase 2, no de trucos.

---

## 13. Accesibilidad — criterios de aceptación (WCAG 2.2 AA)

- Enlace «Saltar al contenido» como primer elemento enfocable (oculto hasta recibir foco) hacia `<main id="contenido" tabindex="-1">`.
- Navegación completa por teclado; foco visible con anillo `--purple-500` (2 px, desplazado 2 px).
- Botones reales para acciones, enlaces reales para navegación.
- Landmarks y jerarquía de encabezados correctos.
- Contraste según la tabla de `design-system §2`; verificar cada combinación de verde.
- Objetivos táctiles ≥ 44 px.
- Menú móvil: `aria-expanded`, cierre con Escape, foco contenido mientras está abierto.
- `prefers-reduced-motion` respetado en todo (§15).
- SVG del hero con `role="img"` y el `aria-label` que fija el design system.

---

## 14. Rendimiento

La audiencia usa celulares de gama media y redes móviles irregulares. Presupuestos:

- LCP < 2.5 s en móvil simulado; CLS < 0.1; INP < 200 ms.
- JavaScript inicial mínimo: sitio estático, componentes de servidor por defecto, `"use client"` solo donde haya interacción real (menú, header al scroll).
- `next/font` con subconjunto latino y `display: swap`. `next/image` para cualquier bitmap. SVG inline para el hero y los elementos gráficos.
- **No instales una librería de animación.** Todo el motion es CSS. Si ya existe una en el proyecto y es ligera, puedes reutilizarla; justifícalo.
- No agregues dependencias que no estén justificadas en el diagnóstico inicial.

---

## 15. Motion

Duraciones, easing, reveals, header y reglas de reposo visible: `design-system §9`. Resumen no negociable:

- El estado de reposo de cualquier elemento es **visible**; nada espera en `opacity: 0`.
- Sin parallax, sin scroll hijacking, sin loaders, sin elementos que reboten.
- Con `prefers-reduced-motion: reduce`, se desactivan transforms y trazados; queda solo el cambio de color en hover.
- El motion refuerza *inteligencia → análisis → decisión*; nunca compite con el contenido.

---

## 16. Segunda pasada — director creativo (Corte 2)

Antes de dar por terminado, revisa la página renderizada y responde con honestidad:

- ¿Parece una plantilla? ¿Parece una empresa de software genérica? ¿Parece un producto barato?
- ¿El hero tiene impacto sin la animación?
- ¿La jerarquía se entiende en menos de cinco segundos?
- ¿Transmite confianza a un gerente de cooperativa?
- ¿Hay demasiadas tarjetas, gradientes o animaciones?
- ¿El color tiene jerarquía — neutros dominan, morado identifica, verde señala?

Si alguna respuesta es la incorrecta, corrige antes de reportar.

---

## 17. Seguridad, analítica, validación

**Seguridad del sitio (no de la aplicación):** `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` restrictiva, `X-Frame-Options: DENY`. Enlaces externos con `rel="noopener"`. CSP solo si no rompe Vercel ni las fuentes. **Ninguna cabecera que bloquee indexación.**

**Analítica:** no agregues tracking ni cookies en Fase 0. Deja un punto único y documentado donde se pueda incorporar después Google Analytics, Tag Manager o equivalente.

**Validación antes de reportar cada corte:**
```
npm run lint
npm run build
npx tsc --noEmit
```
más: validación de metadatos y JSON-LD, revisión de enlaces, consola sin errores, revisión responsive en 320 · 375 · 390 · 430 · 768 · 1024 · 1280 · 1440 · 1920, y — si tienes navegador — la página **realmente renderizada**, no solo el código. En Corte 2, Lighthouse y axe.

---

## 18. Informe de cierre (Corte 2)

Breve, por secciones:

**A. Implementado** · **B. SEO** · **C. Buscadores/IA: qué se hizo realmente** · **D. Accesibilidad: qué se validó** · **E. Rendimiento: qué se optimizó y métricas** · **F. Marca: qué assets se usaron y cuáles son provisionales** · **G. Pendientes que dependen de información externa** (SVG del logo, ciudad, perfiles incompletos, política de datos, LinkedIn) · **H. Riesgos: qué no debe pasar a producción todavía** (perfiles del equipo, OG provisional) · **I. Validación: resultados de build, lint, tipos, Lighthouse, axe** · **J. Contradicciones encontradas entre fuentes y cómo se resolvieron.**

---

## 18-bis. Inteligencia del sector — regla de datos

**Ninguna cifra sectorial se publica sin un snapshot aprobado y trazable.** La sección lee `src/data/sector/snapshot.json` en build (`src/lib/sector/source.ts`, solo servidor): si no existe o no cumple el contrato mínimo, devuelve `null` y la sección publica su versión editorial (sin KPI, gráficas, ceros, «sin datos» ni «próximamente»). La fixture sintética (`src/lib/sector/fixture.dev.ts`, «DEV ONLY · NO PUBLICAR · NO SOURCE OF TRUTH») solo se carga fuera de producción con la variable privada `SECTOR_FIXTURE=true`; no existe en Vercel. La documentación no debe decir que la inteligencia numérica está operativa mientras no haya snapshot. **Bloque 2B.1** (hecho): experiencia pública y contrato preparados. **Bloque 2B.2** (pendiente): integración con el snapshot real generado por el motor sectorial de SIAR — cifras validadas, KPI, historias reales, filtros, fuente, metodología y fecha de corte; solo entonces datos estructurados de dataset y cifras en metadata.

## 19. Prohibiciones finales

No publiques los perfiles del equipo en producción. No inventes información, assets, clientes, testimonios, certificaciones, métricas ni URLs. No construyas el sitio dentro de la aplicación. No copies su `next.config`. No uses `noindex`. No recrees el logo en código. No agregues librerías sin justificación. No pongas gradientes de fondo ni más de una banda oscura. No uses `--green-500` como texto sobre claro. No numeres lo que no es secuencia. No conviertas a Novum Integral en otra empresa de tecnología genérica.

La identidad central es una sola:

**NOVUM INTEGRAL — Inteligencia que anticipa. Análisis que transforma. Decisiones que generan valor.**

---

**Empieza por la §1.** Audita, diagnostica, recomienda monorepo o repositorio nuevo, y espera confirmación. No escribas código de la página en tu primera respuesta.

# Novum Integral — Design System v1 (sitio corporativo)

**Versión 1 — 11 de septiembre de 2026.** Define los tokens y las reglas visuales del sitio público `novumintegral.com`. Toda decisión visual del código se deriva de aquí. Los valores de color son **provisionales hasta confirmarlos contra el SVG oficial del logo**; se tomaron de la identidad definida por el equipo y de la implementación actual de la aplicación.

---

## 1. Concepto y principios

**Concepto:** *El sistema que conecta las decisiones.* Toda la información de una entidad — cartera, datos, entorno macro — converge en un sistema que permite entender, anticipar y decidir. Eso es lo que significa "Integral", y es lo que el rompecabezas del logo representa.

**Postura de marca:** pequeños, especializados y extremadamente competentes. El sitio no aparenta ser una corporación; demuestra criterio.

Tres principios que resuelven la mayoría de las decisiones:

1. **Claro antes que decorado.** Si un elemento no ayuda a entender, sobra.
2. **Un solo protagonista por pantalla.** Cada sección tiene un elemento que manda; todo lo demás lo acompaña en silencio.
3. **Los datos son el único ornamento.** Retículas finas, nodos, líneas de conexión, etiquetas tabulares. Nada de ilustración, iconografía decorativa ni fotografía de stock.

**Referencias de nivel de acabado** (para calibrar calidad, no para copiar): Stripe (jerarquía tipográfica y disciplina de color), Linear (una sola familia tipográfica y motion contenido), Mercury (confianza financiera en interfaz clara con una sola banda oscura).

---

## 2. Color

### Tokens

| Token | Hex | Uso |
|---|---|---|
| `--purple-900` | `#2C0E72` | Morado profundo. Banda oscura del CTA final, texto de máximo peso sobre claro |
| `--purple-700` | `#4B16A8` | **Morado principal.** Títulos destacados, botón primario, líneas del sistema |
| `--purple-500` | `#7A38C0` | Morado tecnológico. Acentos, estados hover, nodos secundarios |
| `--purple-100` | `#EEE6F8` | Tinte. Fondos de etiqueta, superficies suaves |
| `--green-700` | `#43772C` | **Verde para texto** sobre fondo claro (único verde legible en texto) |
| `--green-500` | `#68B04A` | Verde de marca. Rellenos, botón sobre fondo oscuro, nodo DECISIÓN. **Nunca como texto sobre claro** |
| `--green-300` | `#8BCB68` | Verde claro. Texto y detalles sobre la banda morada oscura |
| `--green-100` | `#E8F4E1` | Tinte. Fondo de la etiqueta "en pruebas" |
| `--neutral-0` | `#FFFFFF` | Superficies elevadas |
| `--neutral-50` | `#F7F6FA` | **Fondo de página.** Blanco con sesgo violeta apenas perceptible |
| `--neutral-100` | `#ECEAF1` | Divisores, retícula del hero |
| `--neutral-300` | `#C9C5D4` | Bordes de controles |
| `--neutral-500` | `#8B869C` | Texto terciario, etiquetas |
| `--neutral-700` | `#5B5670` | Texto secundario |
| `--neutral-900` | `#2A2636` | Texto principal |
| `--neutral-950` | `#17141F` | Casi negro. Solo para display sobre claro si el morado satura |

Los neutros llevan un sesgo violeta deliberado: un gris puro se lee como plantilla; un gris con la temperatura del morado se lee como sistema.

### Proporción

70–80 % neutros · 15–20 % morados · 5–10 % verde. El morado es identidad y profundidad; el verde es señal. Si en una pantalla hay tanto verde como morado, algo está mal.

### Dónde va el oscuro

**Una sola banda oscura en toda la página:** la sección final de CTA, en `--purple-900`, con texto blanco, botón `--green-500` y detalles `--green-300`. El resto de la página es clara. Una banda oscura al cierre se recuerda; dos o tres se sienten pesadas.

### Contraste verificado (WCAG)

| Combinación | Ratio | Resultado |
|---|---|---|
| `--purple-700` sobre `--neutral-0` | ≈ 10.5 : 1 | Texto de cualquier tamaño ✓ |
| `--purple-500` sobre `--neutral-0` | ≈ 6.7 : 1 | Texto de cualquier tamaño ✓ |
| `--green-700` sobre `--neutral-0` | ≈ 5.3 : 1 | Texto normal ✓ (AA) |
| `--green-500` sobre `--neutral-0` | ≈ 2.7 : 1 | **Falla.** No usar como texto ni como borde de control sobre claro |
| `--green-500` sobre `--purple-900` | ≈ 5.6 : 1 | Texto y botón sobre la banda oscura ✓ |
| `--neutral-700` sobre `--neutral-50` | ≈ 6.5 : 1 | Texto secundario ✓ |

La regla práctica: **verde sobre claro solo en `--green-700` si es texto**, y `--green-500` solo como relleno, nodo o sobre morado oscuro.

### Semántica de estado de producto

| Estado | Fondo | Texto | Lectura |
|---|---|---|---|
| En pruebas con datos reales | `--green-100` | `--green-700` | Existe y funciona |
| En desarrollo | `--purple-100` | `--purple-700` | Está evolucionando |
| En diseño | `--neutral-100` | `--neutral-700` | Viene |

Misma forma, mismo tamaño, misma posición en los tres productos. La diferencia es solo el color.

---

## 3. Tipografía

**Una sola familia: Plus Jakarta Sans** (400, 500, 600, 700). Es la de la aplicación, y la coherencia entre sitio y producto vale más que cualquier ganancia estética de cambiarla. Cargar con `next/font`, subconjunto latino, `display: swap`.

**Única excepción permitida:** una monoespaciada (IBM Plex Mono o JetBrains Mono) para las etiquetas del sistema en el hero y los datos tabulares, *si y solo si* el presupuesto de rendimiento lo permite. Si hay duda, no se carga: `font-variant-numeric: tabular-nums` y `letter-spacing` en Plus Jakarta Sans consiguen el efecto.

### Escala

| Rol | Escritorio | Móvil | Peso | Interlineado | Tracking |
|---|---|---|---|---|---|
| Display (hero) | 56 px | 36 px | 700 | 1.05 | −0.02 em |
| H1 de sección | 40 px | 30 px | 700 | 1.1 | −0.015 em |
| H2 | 30 px | 24 px | 600 | 1.2 | −0.01 em |
| H3 | 22 px | 20 px | 600 | 1.3 | 0 |
| Cuerpo | 17 px | 16 px | 400 | 1.6 | 0 |
| Cuerpo pequeño | 15 px | 15 px | 400 | 1.55 | 0 |
| Etiqueta | 12 px | 12 px | 600 | 1 | +0.08 em, mayúsculas |
| Dato / cifra | 15–17 px | — | 500 | 1 | `tabular-nums` |

- Medida del texto corrido: **60–70 caracteres**. Ninguna columna de párrafo supera 68 ch.
- Títulos con `text-wrap: balance`.
- Frases clave dentro de un título pueden ir en `--purple-700`; una por título, no tres.

---

## 4. Espaciado, retícula y contenedores

- **Base 4 px.** Escala: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128.
- **Separación entre secciones:** 96 px en escritorio, 64 px en móvil. Constante en toda la página.
- **Contenedores:** contenido 1 200 px máx.; visual del hero hasta 1 440 px; márgenes laterales 24 px en móvil, 40 px desde 1 024 px.
- **Retícula:** 12 columnas en escritorio, 4 en móvil, gutter 24 px.
- Los hermanos se separan con `gap`, no con márgenes sueltos.

### Breakpoints

320 · 375 · 390 · 430 · 768 · 1 024 · 1 280 · 1 440 · 1 920. El diseño se **recompone** en móvil; no se encoge.

---

## 5. Forma, borde, sombra

- **Radio:** 4 px etiquetas · 8 px botones y controles · 12 px superficies grandes. Pastilla (`9999px`) solo en las etiquetas de estado, porque son semánticas. Nada de `rounded-2xl` generalizado.
- **Separación por defecto: línea de 1 px** en `--neutral-100`. La sombra se reserva para **un solo elemento elevado por sección** — el marco del producto en SIAR, el botón primario.
- **Sombra (única):** `0 1px 2px rgba(23,20,31,.06), 0 8px 24px rgba(44,14,114,.08)`. Teñida de morado, no gris.
- **Botón primario:** `--purple-700`, texto blanco, radio 8, alto 48 px, hover `--purple-900`, focus visible con anillo de 2 px `--purple-500` desplazado 2 px.
- **Botón secundario:** borde 1 px `--neutral-300`, texto `--neutral-900`, mismo alto. Sobre la banda oscura: borde `rgba(255,255,255,.35)`, texto blanco.
- **Botón sobre la banda oscura (CTA final):** `--green-500` con texto `--purple-900`.

---

## 6. Hero — "Un solo aliado, todas las dimensiones"

**Lo que representa, y es verdad del negocio:** productos de software independientes — SIAR, Presupuesto, Planeación, y más por venir — más los servicios de acompañamiento, convergen en **la entidad**, que es quien decide. **No representa dependencias de datos entre productos: no las hay.** (Sustituye la composición anterior, que ponía a SIAR en el centro y hacía parecer que presupuesto y planeación salían de él.)

### Composición (escritorio)

Dos columnas (6/6 desde `xl`). Izquierda: etiqueta con regla, título display con la frase clave en morado-700, subtítulo, botones, eslogan. Derecha: SVG inline con viewBox `34 34 766 420`; la geometría vive en `src/components/systemGeometry.ts` y la comparte la marca de agua del CTA.

- **Dos grupos de entrada** a la izquierda, con etiqueta de grupo en 11px mayúsculas morado-700: **SOFTWARE** (SIAR · PRESUPUESTO · PLANEACIÓN · MÁS MÓDULOS, este último con anillo punteado neutral-500) y **ACOMPAÑAMIENTO** (DIAGNÓSTICO · IMPLEMENTACIÓN · CAPACITACIÓN · CUMPLIMIENTO). Nodos: anillos r=6.5 en morado-500 sobre neutral-50; etiquetas 13.5px 600 neutral-700 a la izquierda del nodo.
- **SU ENTIDAD**: nodo central, r=32 blanco con anillo morado-100, núcleo r=16 morado-700; campo radial morado (16 %) y dos anillos de campo (r=66 y r=98 punteado) en morado-100. Etiqueta 13px 700 morado-900.
- **DECISIÓN**: único nodo verde, r=11 con anillo pulsante r=19 al 35 %; campo radial verde (22 %); etiqueta verde-700.
- **Conexiones**: curvas cúbicas con tangentes horizontales, 1.5px, morado-500 al 55 %. La de salida degrada a verde en su último tramo.

### Móvil

viewBox `0 0 320 370`: dos filas de tres nodos (SOFTWARE arriba, ACOMPAÑAMIENTO debajo) con etiquetas de 9.5px bajo cada nodo, que convergen hacia abajo en SU ENTIDAD (r=24), y de ahí en línea recta a DECISIÓN. Alto máximo 370.

### Motion del hero

Solo con `html.js` (lo pone `MotionRoot` tras montar): las conexiones se trazan con `stroke-dashoffset` en 1.3s, con retardo incremental de 80ms en orden de entrada; los grupos aparecen escalonados (0 y 0.25s); el centro a 0.7s y DECISIÓN a 1.5s; el anillo de DECISIÓN pulsa cada 4s a partir de 2.4s. **Sin JavaScript o con `prefers-reduced-motion`, la composición está completa e inmóvil desde el primer fotograma.**

### Fondo

`--neutral-50` con **luz ambiental** (`glow-hero`: radial morado-500 al 11 % y verde-500 al 9 %, muy difusas) y la retícula de puntos enmascarada detrás de la composición. La luz es atmósfera, no color de sección: sigue sin haber gradientes de sección.

## 7. Tratamiento por sección — reglas anti-plantilla

**Problema del sector.** Composición editorial: tres bloques en columnas desiguales (4/4/4 en escritorio con separación de 1 px vertical entre ellos, apilados en móvil). Cada bloque: la frase clave en H3 `--purple-900`, el párrafo en cuerpo `--neutral-700`. Sin cajas, sin sombras, sin numeración.

**Lo que construimos.** **No son tres tarjetas iguales.** SIAR ocupa el ancho completo: texto a la izquierda (5/12), marco de producto a la derecha (7/12). Presupuesto y Planeación van debajo en dos columnas compactas separadas por línea. La jerarquía visual encode la realidad: uno existe, dos vienen.

**Marco de producto (placeholder de captura).** Superficie `--neutral-0`, radio 12, borde 1 px `--neutral-100`, sombra única, proporción 16:10. Adentro: retícula fina, una barra superior de 32 px en `--neutral-50` con tres puntos de ventana, y una etiqueta centrada en 12 px mayúsculas `--neutral-500`: "Captura del módulo SARC · Fase 1". **No se dibujan gráficos falsos** que puedan confundirse con el producto.

**Por qué es distinto.** Cuatro filas en layout alterno: frase clave grande a un lado (H2), explicación al otro; la siguiente fila invierte los lados. Una línea de 1 px separa cada fila. Sin tarjetas.

**Cómo acompañamos.** Lista 2 × 2 con divisores de 1 px, título del servicio en H3 y una línea de descripción. Sin íconos.

**Nosotros.** La declaración institucional en cuerpo grande (20 px) sobre 9/12 columnas. Debajo, si `NEXT_PUBLIC_SHOW_TEAM` está activo, los perfiles como lista: nombre en 600, rol en `--purple-700` pequeño, una línea de perfil. **Sin avatares ni círculos de reemplazo.**

**CTA final.** La banda oscura. Título en blanco 40 px, párrafo `--neutral-100`, botón verde, enlace secundario en blanco. Los datos de contacto en una fila debajo, 15 px, `--green-300` para los enlaces.

**Footer.** Tres columnas compactas sobre `--neutral-50` con borde superior de 1 px: identidad y eslogan · enlaces · legal. 14 px.

---

## 8. Iconografía e imagen

- **Sin iconografía decorativa.** Los únicos íconos son funcionales (flecha, enlace externo, WhatsApp, menú) en trazo de 1.5 px. Lucide está en la aplicación y sirve para esto; no para adornar secciones.
- **Sin fotografía** en Fase 0. Ni de stock, ni de personas, ni de edificios.
- Toda pieza visual es SVG o CSS, en los colores del sistema.

---

## 9. Motion general

| Tipo | Duración | Easing |
|---|---|---|
| Micro (hover, focus) | 200 ms | `ease-out` |
| Reveal de sección | 400 ms | `cubic-bezier(.2,.8,.2,1)` |
| Ambiental (hero) | 800–1 200 ms | `cubic-bezier(.2,.8,.2,1)` |

- Reveal: opacidad 0→1 y desplazamiento de 12 px hacia arriba, una sola vez, al 20 % de visibilidad. Máximo 5 elementos en cascada; paso de 60 ms.
- **El estado de reposo es visible.** Ningún elemento espera en `opacity: 0` a que llegue un observador; si el JavaScript falla, la página se ve completa.
- Header: al hacer scroll, pasa de transparente a `--neutral-0` con borde inferior de 1 px y sombra de 1 px, en 200 ms.
- Con `prefers-reduced-motion: reduce`, se desactivan todos los transforms y trazados; permanecen solo cambios de color en hover.
- Sin parallax, sin scroll hijacking, sin loaders, sin librería de animación nueva.

---

## 10. Accesibilidad — criterios de aceptación

- Teclado completo: todo enlace y botón alcanzable, foco visible (anillo `--purple-500`).
- Landmarks: `header`, `nav`, `main`, `section` con `aria-labelledby`, `footer`.
- Un solo `h1` (el título del hero); jerarquía sin saltos.
- Objetivos táctiles ≥ 44 px.
- Menú móvil: botón real, `aria-expanded`, cierre con Escape, foco atrapado mientras está abierto.
- Los textos en verde sobre claro usan `--green-700`; verificar con la tabla de contraste antes de cerrar.
- El SVG del hero lleva `role="img"` y un `aria-label` descriptivo: "Diagrama del sistema Novum: cartera, datos y entorno macro alimentan SIAR, que conecta presupuesto y planeación con la decisión."

---

## 11. Lo que este sistema prohíbe explícitamente

- Gradientes de color en secciones. (Se permiten: el degradado del último tramo de la línea hacia DECISIÓN, y la **luz ambiental** de baja opacidad de `glow-hero` y `glow-dark`, que es iluminación, no color de fondo.)
- Más de una banda oscura.
- Tarjetas con la misma sombra y el mismo radio repetidas en fila.
- Verde `--green-500` como texto sobre fondo claro.
- Íconos ilustrativos, emojis, fotografías de stock, avatares de relleno.
- Numeración 01/02/03 en listas que no son secuencia.
- Una segunda familia tipográfica sin justificación de rendimiento.
- Animaciones que sean necesarias para entender el contenido.
- Modo oscuro en Fase 0.

---

## 12. Pendientes que afectan al sistema

| Pendiente | Efecto |
|---|---|
| SVG oficial del logo | Confirmar los cuatro hex de morado y verde; regenerar favicon y OG |
| Manual de marca de Aura | Puede ajustar tipografía o proporción de color; este documento se actualiza, no se ignora |
| Ciudad | Footer y JSON-LD |

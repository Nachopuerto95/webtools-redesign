---
description: Genera N variantes de un componente, cada una con un estilo radicalmente distinto. Lanza subagentes en paralelo.
argument-hint: <NombreComponente> [N=4] [brief]
---

Genera variantes del componente indicado en `$ARGUMENTS`.

## Paso 1 — Parseo

- **Primera palabra** = nombre del componente (ej: `Navbar`, `Hero`, `Card`).
- **Segunda palabra** = número de variantes si es un número (ej: `10`). Si no se da, usa `4`.
- **Resto** = brief de uso. Si está vacío, usa "uso general" y avisa al usuario.

## Paso 2 — Verificar design system

Comprueba que existen `design-system/guide.md` y `design-system/tokens.json`. Si falta alguno, detente.

## Paso 3 — Recopilar texto real

El texto del componente NUNCA puede ser inventado. Sigue este orden:

**Fuente 1 — código ya migrado** (`web/src/`): busca con Glob `**/*nav*`, `**/*site*`, `**/*menu*`, `**/*config*`, `**/*content*`. Si existe, extrae los textos literales y URLs.

**Fuente 2 — páginas scrapeadas** (`web/docs/migration-references/markdown/`): si no hay código migrado, busca el archivo .md que corresponda al componente (ej: para un Hero de inicio → `blog.md` o el índice; para una sección de CX → `experiencia-del-cliente.md`). Lee el archivo completo y extrae los textos literales relevantes: títulos, párrafos, items de lista, CTAs, URLs.

**Regla absoluta de texto:**
- Pasa el texto extraído **literalmente** al subagente — sin parafrasear, sin mejorar.
- Si un texto tiene errores ortográficos del scraping (falta de tildes), corrígelos solo ortográficamente.
- Si tras buscar en ambas fuentes no hay texto relevante: usa **solo placeholders semánticos** (`[Título de sección]`, `[Descripción breve]`) — nunca copy de negocio inventado.
- El subagente NO puede añadir frases, estadísticas, claims o copy que no vengan del texto que le pasas.

## Paso 4 — Seleccionar estilos

De la biblioteca de estilos de abajo, selecciona N estilos distintos — cubre el espectro de conservative a atrevido, no elijas N estilos parecidos entre sí. Asigna a cada uno un número de versión (`v01`, `v02`, …, `vNN`) y un nombre de carpeta descriptivo (ej: `v01-stripe-clean`).

### Biblioteca de estilos (20 direcciones)

| Código | Nombre | Descripción |
|---|---|---|
| `stripe-clean` | Stripe Clean | Fondo blanco, tipografía ajustada, mega-menu con iconos pequeños. Referencia: stripe.com |
| `linear-dark` | Linear Dark | Navbar con fondo muy oscuro (#0f1117), texto claro, separaciones sutiles. Referencia: linear.app |
| `vercel-minimal` | Vercel Minimal | Sin bordes ni sombras, solo underline en hover, CTA como pill pequeño. Referencia: vercel.com |
| `enterprise-topbar` | Enterprise Topbar | Banda superior fina con teléfono/email + barra nav principal debajo. Patrón B2B clásico. |
| `glass-floating` | Glass Floating | Pill flotante centrado con glassmorphism sutil. Espacio blanco generoso. |
| `bold-primary` | Bold Primary | Fondo de color de marca, logo y links blancos. Inversión total. |
| `mega-full` | Mega Full | Mega-menu de ancho completo con paneles grandes, descripción y CTA secundario por sección. |
| `sticky-shrink` | Sticky Shrink | Empieza alto (64px), se compacta a 48px con scroll. Transición suave. |
| `centered-logo` | Centered Logo | Logo centrado, navegación dividida a ambos lados. Estética premium/agencia. |
| `underline-only` | Underline Only | Animación de underline que crece desde el centro. Sin backgrounds en hover. Ultra limpio. |
| `card-mega` | Card Mega | Mega-menu con cards visuales, fondo por sección, imagen o color plano. |
| `split-cta` | Split CTA | Mitad izquierda blanca (logo+nav), mitad derecha con color de marca (CTA). Block color. |
| `ultra-minimal` | Ultra Minimal | Logo + un único CTA visible. Todo lo demás en hamburger incluso en desktop. |
| `enterprise-dense` | Enterprise Dense | Máxima información visible. Links de primer y segundo nivel visibles. Para power users. |
| `border-bottom` | Border Bottom | Solo una línea inferior como separador. Sin shadow, sin background. Máxima sobriedad. |
| `sticky-blur` | Sticky Blur | Transparente en top, frosted glass (blur 12px) al hacer scroll. |
| `pill-sections` | Pill Sections | Links agrupados en pill containers por sección (Software · Consultoría · Empresa). |
| `offset-asymmetric` | Offset Asymmetric | Logo muy a la izquierda con mucho aire, nav y CTA pegados a la derecha. |
| `dark-accent` | Dark Accent | Fondo casi negro con un único detalle de color de marca (underline, dot, borde). |
| `saas-modern` | SaaS Modern | Inspirado en Notion/Loom: nav compacta, avatar/search a la derecha, muy horizontal. |

## Paso 5 — Lanzar subagentes en paralelo

Lanza N subagentes `component-variant-generator` EN PARALELO (un único mensaje con N tool_use de Task). A cada uno le pasas:

- Nombre del componente y brief
- Código de estilo y su descripción de la tabla
- Nombre de carpeta destino: `design-system/_variants/<Nombre>/<vNN-codigo-estilo>/`
- Los datos reales del componente (del Paso 3)

## Paso 6 — Resumen

Tabla: versión | estilo | decisiones clave | ruta. Sugiere `/elegir-variante <Nombre>` para elegir, o `/refinar-componente <Nombre> <vNN>` para profundizar en una dirección.

# Guía de diseño — webtools.es

> Principios y tono. Los valores numéricos viven en `tokens.json` / `tokens.css`.

## Marca

- **Tono**: corporativo accesible — profesional sin resultar frío, técnico sin ser críptico
- **Personalidad**: confiado, técnico, cercano
- **No somos**: agencia creativa (no experimentamos con el layout), startup hipster (nada de paletas pasteles ni tipografías display extravagantes), proveedor genérico (siempre hay voz de experto detrás)
- **Concepto de marca**: sistema de datos + velocidad + flexibilidad + modernidad
- **Símbolo**: punto/dot circular — velocidad, datos, conexión. Sistema de dots en onda sobre fondo navy oscuro.

## Reglas de marca

### Hacer
- Usar el azul Webtools (#0092FF) para CTAs, elementos de marca y acentos activos
- Usar navy oscuro (#000F41) como fondo de secciones premium y hero dark
- Combinar Sequel 100 Wide (display) con Sequel Sans (body) — siempre en ese par
- Mantener espacio limpio alrededor del logo (clear space = altura de la "W")
- Usar el patrón dot-wave del identity system para fondos de secciones highlight

### No hacer
- No usar el logo sobre fondos de baja contraste (mínimo ratio 4.5:1)
- No deformar, rotar ni aplicar sombras al símbolo
- No mezclar las fuentes Sequel con otras tipografías de display extravagantes
- No usar el azul primario para texto largo (solo accents, links, CTAs)
- No aplicar gradientes al logotipo — solo versiones sólidas (color, negativo dark, negativo blue)

## Mensajes-marco

- "Del dato a la acción"
- "Nos adaptamos a ti, no tú a nosotros"

## Principios de diseño

1. **Claridad sobre creatividad** — el visitante entiende qué hace Webtools en <5 segundos
2. **Mobile-first** — layouts parten de 375px y escalan
3. **Accesibilidad WCAG AA mínimo** — contraste, foco visible, ARIA donde proceda
4. **SEO-safe** — no sacrificar semántica HTML (h1-h6, landmarks, alt) por estética

## CTAs

- **Primario**: "Solicita una demo" → botón sólido `--color-primary`
- **Secundario**: "Contactar" / teléfono → enlace o botón outline
- **Terciario**: "Saber más" en tarjetas → texto-enlace con chevron

## Tipografía

(Ver `tokens.json > typography` para valores. Aquí sólo intención.)

- **Display / Headings**: Sequel 100 Wide 65 Wide — impacto, modernidad, amplitud. PROPIETARIA — autoalojada en `web/public/fonts/`.
- **Body**: Sequel Sans Light Body / Book Body — legible, limpio, ligero. PROPIETARIA — autoalojada en `web/public/fonts/`.
- **UI labels / semibold**: Sequel Sans Bold Head — distinción sin ruido
- **Fallback**: system-ui, -apple-system, sans-serif

> Pesos disponibles en Sequel 100 Wide: 45–96 Wide (numérico OGJ). Uso recomendado en web: 65 Wide para h1-h2, 55 Wide para h3-h4.
> Pesos disponibles en Sequel Sans: Light / Book / Medium / Bold / Heavy / Black — en variantes Body, Head, Disp + oblicuas.

## Color

(Ver `tokens.json > color` para hex. Aquí sólo uso.)

Paleta oficial Webtools (del Brandbook):
- **Azul 01** = `#0092FF` (RGB 0,146,255 · Pantone 2191C) — color primario de marca
- **Azul 02** = `#000F41` (RGB 0,15,65 · Pantone 2766C) — navy oscuro, fondos premium

Uso en interfaz:
- **Primario** (`--color-primary` `#0092FF`): CTAs, links activos, elementos de marca
- **Primario hover** (`--color-primary-hover` `#007ACC`): estado hover de botones primarios (-15% lightness)
- **Brand dark** (`--color-brand-dark` `#000F41`): fondos hero dark, secciones highlight, footer
- **Texto** (`--color-text` `#0a0a0a`): cuerpo de texto principal
- **Texto muted** (`--color-text-muted` `#6b7280`): metadatos, etiquetas secundarias, placeholders
- **Background** (`--color-background` `#ffffff`): fondo base
- **Surface** (`--color-surface` `#f0f5ff`): fondos de secciones alternadas, cards (tinte azul muy sutil)
- **Border** (`--color-border` `#d1d9e6`): separadores, bordes de inputs
- **Estados**: success `#10b981` / warning `#f59e0b` / error `#ef4444`

## Clientes de referencia (señales de confianza)

Endesa, Lenovo, Orange, Vodafone, Museo del Prado — usar cuando el diseño incluya social proof.

## SEO — restricciones de diseño

- Mantener slugs existentes (39 URLs en sitemap). Cambios de URL requieren 301.
- No eliminar texto visible indexado por Google sin evaluar impacto.
- El `<h1>` visible en cada página es intocable salvo acuerdo explícito.
- Imágenes: mantener `alt` existentes o mejorarlos, nunca vaciarlos.

## Componentes aceptados

> Se llena automáticamente al ejecutar `/elegir-variante`.

- _(ninguno aún)_

---
description: Toma una variante elegida y genera N refinamientos de ella, explorando micro-variaciones dentro de la misma dirección de diseño.
argument-hint: <NombreComponente> <vNN-variante> [N=6]
---

Refinamiento profundo de una variante existente en `$ARGUMENTS`.

## Paso 1 — Parseo

- **Primera palabra** = nombre del componente (ej: `Navbar`).
- **Segunda palabra** = variante base (ej: `v03-linear-dark`).
- **Tercera palabra** = número de refinamientos si es un número. Default: `6`.

## Paso 2 — Leer la variante base

Lee el archivo `design-system/_variants/<Nombre>/<variante>/Component.vue` completo. Este es el punto de partida — todos los refinamientos mantienen su dirección visual pero exploran variaciones específicas.

## Paso 3 — Definir ejes de refinamiento

Selecciona N combinaciones únicas de estos ejes (no repitas la misma combinación):

| Eje | Variaciones posibles |
|---|---|
| **Densidad** | más compacto (–20% padding) / más aireado (+20% padding) |
| **Tipografía** | más peso (500→600) / menos peso / más contraste de tamaños |
| **Radius** | más redondeado (+1 nivel de token) / más cuadrado (–1 nivel) |
| **Elevación** | más sombra (shadow-md→shadow-lg) / más plano / sin sombra |
| **Color accent** | acento más presente / más sutil / solo en hover |
| **Hover** | background en hover / solo color change / underline / scale sutil |
| **CTA** | CTA más prominente (más padding, sombra) / más discreta (outline) |
| **Bordes** | con border visible / sin border / solo border-bottom |
| **Animación** | más lenta/fluida (250ms ease) / más snappy (120ms) / sin animación |
| **Mega-menu** | si hay: más compacto / con sección de CTA / con separadores |

## Paso 4 — Lanzar subagentes en paralelo

Para cada refinamiento, lanza un subagente `component-variant-generator` con:

- El **código completo de la variante base** como punto de partida
- La instrucción exacta: "Parte de este componente. Aplica SOLO estos cambios: [eje 1] + [eje 2]. No cambies la dirección visual general ni la estructura. El resultado debe verse como una versión más pulida/aireada/compacta del original."
- Carpeta destino: `design-system/_variants/<Nombre>/refine-<vNN>-<descriptor>/` donde descriptor es breve (ej: `airy-bold-cta`)

## Paso 5 — Resumen

Tabla: versión | ejes modificados | efecto visual esperado | ruta.

Sugiere `/elegir-variante <Nombre>` para seleccionar la definitiva.

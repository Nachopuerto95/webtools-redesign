---
description: Auditoría inicial estructurada de una web. Guarda el baseline en analisis/.
argument-hint: <URL>
---

Audita la web indicada en `$ARGUMENTS` y guarda el resultado en `analisis/`.

## Paso 1 — Fetch + extracción estructurada

Usa **WebFetch** sobre la URL con un prompt que pida exactamente esta estructura:

1. **Negocio / propuesta** (qué hace, a quién, en 2-3 frases)
2. **Arquitectura de información** (menú principal y subsecciones, en árbol)
3. **Páginas / secciones detectadas** desde la home (lista)
4. **CTAs principales** (primaria, secundaria, terciaria)
5. **Tono y lenguaje** (con 1-2 citas textuales si las hay)
6. **Identidad visual aparente** (colores predominantes, estilo general, tipografía si perceptible, uso de imagen/foto)
7. **Señales técnicas** (CMS detectado por paths/clases, plugins visibles, tracking, idiomas, social links)
8. **Bugs e impresiones críticas** (qué se ve roto, anticuado o confuso)

## Paso 2 — Determinar ruta de salida

- Slug = dominio sin TLD ni `www`. Ej: `https://webtools.es` → `webtools`.
- Busca el siguiente número libre en `analisis/`:
  - Si no existe ningún `NN-<slug>-baseline.md`, usa `00`.
  - Si hay uno o más, usa el siguiente (`01`, `02`, etc.).
- Ruta final: `analisis/<NN>-<slug>-baseline.md`

## Paso 3 — Escribir el archivo

Usa este esqueleto:

```markdown
# Baseline — <dominio>

> Auditoría inicial. Fecha: <YYYY-MM-DD>

## Contexto del proyecto

- **Objetivo del rediseño**: <pedir al usuario al final>
- **Brand assets**: <pedir al usuario al final>
- **Stack actual**: <inferido de señales técnicas>
- **Stack destino**: <pedir al usuario al final>

## Negocio
...

## Arquitectura de información actual
...

## CTAs principales
...

## Tono y lenguaje
...

## Identidad visual aparente
...

## Señales técnicas detectadas
...

## Primeras impresiones críticas

### Fortalezas
- ...

### Áreas de mejora
- ...

## Pendientes para siguientes pasos

- [ ] Lighthouse audit (performance, SEO, a11y)
- [ ] Inventario completo de páginas y URLs
- [ ] Capturar paleta exacta (hex) y tipografías reales
- [ ] Listar plugins/dependencias del CMS actual
- [ ] Confirmar tráfico/SEO actual para no romper URLs en migración
- [ ] Stakeholders y deadline
```

## Paso 4 — Cierre

Termina preguntando al usuario por los 3 datos faltantes del "Contexto del proyecto" (objetivo del rediseño, stack destino, brand assets) y actualiza el archivo con sus respuestas.

Sugiere como siguiente paso uno de los pendientes que más impacto tenga (típicamente Lighthouse o inventario de URLs si va a haber migración).

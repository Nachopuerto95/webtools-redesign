---
description: Revisa las variantes generadas de un componente y promueve la elegida; archiva las descartadas viables.
argument-hint: <NombreComponente>
---

Flujo de selección de variantes para `$ARGUMENTS`.

## Paso 1 — Listado

Lista todas las carpetas en `design-system/_variants/$ARGUMENTS/`. Si está vacía, detente y avisa.

Para cada variante:
1. Lee `Component.vue`.
2. Muestra al usuario:
   - Nombre de la carpeta (ej. `v1-minimal`)
   - 3-4 líneas describiendo qué hace distinta esta variante (analizando el código)

## Paso 2 — Elección de la ganadora

Pregunta al usuario cuál promover a `design-system/accepted/$ARGUMENTS/`.

Cuando lo decida:
- Mueve la carpeta entera de la variante a `design-system/accepted/$ARGUMENTS/`.
- Renombra `Component.vue` a `$ARGUMENTS.vue` (PascalCase respetando el nombre original).

## Paso 3 — Triaje de las descartadas

Para cada variante restante, pregunta al usuario:

- **Borrar**: eliminar carpeta. Se va.
- **Guardar como descartada viable**: pide nombre descriptivo corto (ej: `button-playful-animated`). Mueve la carpeta a `design-system/library/<nombre-descriptivo>/`.

Para las que se guardan, añade un `README.md` corto dentro con 2 líneas:
- "Descartada en proyecto: $(nombre del proyecto actual)"
- "Por qué podría servir: $(pregunta al usuario, 1 línea)"

## Paso 4 — Limpieza

Cuando termines, **borra la carpeta** `design-system/_variants/$ARGUMENTS/` (ya no hace falta).

## Paso 5 — Confirmación

Muestra al usuario el estado final:
- Componente aceptado en: `design-system/accepted/$ARGUMENTS/`
- Variantes archivadas (si las hay) y sus rutas

---
description: Promotes an accepted component from the design system to the production web repo, adapting the format to the project stack.
argument-hint: <ComponentName> [category: layout|sections|ui|forms]
---

Promote `$ARGUMENTS` from the design system to the web repo.

## Step 1 — Parse

- **First word** = component name (PascalCase).
- **Second word** (optional) = destination category (`layout`, `sections`, `ui`, `forms`).

## Step 2 — Read project config

Read `design-system/project.json`. Extract:
- `componentFormat` — `vue` | `astro` | `tsx` | `svelte`
- `componentsPath` — destination base path (e.g. `web/src/components`)

If `project.json` doesn't exist, run `/init-proyecto` first.

## Step 3 — Verify component exists

Check that `design-system/accepted/<Name>/` exists and contains a `.vue` file.
If not → stop: "Accept the component first with `/elegir-variante <Name>`."

## Step 4 — Determine category

If not given as argument, ask:

| Category | When |
|---|---|
| `layout` | Header, Footer, Nav, structural page elements |
| `sections` | Hero, Features, Testimonials, CTA, section blocks |
| `ui` | Button, Card, Badge, Tag, Modal, atomic elements |
| `forms` | ContactForm, inputs, newsletter, multi-field forms |

## Step 5 — Check for existing file

Destination: `<componentsPath>/<category>/<Name>.<ext>` (ext depends on format).

If a file already exists there:
- Show a short diff summary (first 30 lines of each).
- Ask: "Already exists. Overwrite?"
- If no → stop.

## Step 6 — Adapt and write

Read `design-system/accepted/<Name>/Component.vue`. Then, based on `componentFormat`:

### `vue` (Nuxt, Vite+Vue, Astro+Vue)
Direct copy. Save as `<Name>.vue`. No conversion needed.

### `astro`
Convert the `.vue` component to `.astro`:
- `<template>` → Astro template (remove `v-` directives, Vue-specific syntax)
- `defineProps` → Astro `interface Props` + `const { } = Astro.props`
- Reactive state (`ref`, `computed`) → if simple, convert to static; if complex, keep as a Vue island with `client:load` and note it
- `<style scoped>` → `<style>` (Astro scopes by default)
- Remove Vue-specific imports (`ref`, `onMounted`, etc.)
- Preserve all CSS custom property usage (`var(--token)`)

Save as `<Name>.astro`.

### `tsx`
Convert the `.vue` component to a React `.tsx` component:
- `<template>` → JSX `return (...)` inside a functional component
- `defineProps<{}>()` → TypeScript `interface Props` + function parameter destructuring
- `ref()` → `useState()`
- `computed()` → `useMemo()`
- `onMounted/onUnmounted` → `useEffect()`
- `v-if` → ternary or `&&`
- `v-for` → `.map()`
- `v-model` → controlled input pattern
- `<style scoped>` → CSS Modules (`import styles from './<Name>.module.css'`) or inline style object
- Preserve all CSS custom property usage

Save as `<Name>.tsx` (+ `<Name>.module.css` if there are styles).

### `svelte`
Convert the `.vue` component to `.svelte`:
- `<script setup>` → `<script>`
- `defineProps` → `export let propName = defaultValue`
- `ref()` → plain `let` (Svelte is reactive by default)
- `computed()` → `$:` reactive statement
- `v-if` → `{#if}`
- `v-for` → `{#each}`
- `<style scoped>` → `<style>` (Svelte scopes by default)

Save as `<Name>.svelte`.

## Step 7 — Update guide.md

In `design-system/guide.md`, under `## Accepted components`, add:

```
- **<Name>** → `<componentsPath>/<category>/<Name>.<ext>`
```

## Step 8 — Confirm

Show:
- ✓ Final file path
- Format used (and conversion performed if any)
- If interactive component in Astro+Vue: remind to use `client:load` or `client:visible`
- If converted (astro/tsx/svelte): note "Review the conversion — complex reactivity may need manual adjustments"

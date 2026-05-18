---
description: Interactive setup for a new redesign project. Detects the web stack, configures the design system, and guides the first steps.
---

Set up this workspace for a new redesign project.

## Step 1 — Verify web repo

Check if `web/` exists and contains a project. If empty or missing:
> "Clone the client's web repo into `web/` first: `git clone <url> web`"

## Step 2 — Detect stack

Inspect `web/` to determine the stack. Check in this order:

| Signal | Stack |
|---|---|
| `web/astro.config.*` exists | Astro |
| `web/next.config.*` exists | Next.js |
| `web/nuxt.config.*` exists | Nuxt |
| `web/svelte.config.*` exists | SvelteKit |
| `web/package.json` has `"react"` dep | React (Vite/CRA) |
| `web/package.json` has `"vue"` dep | Vue (Vite) |
| Otherwise | Unknown |

If **Astro**: check `web/package.json` for `@astrojs/vue` → `vueInAstro: true/false`.

Report the detected stack to the user.

### Ask: component format

Always ask this explicitly, regardless of the detected stack. Present it as a menu:

> "The playground always generates **Vue** components for previewing. What format do you want for the **final web repo**?
>
> 1. **Vue** `.vue` — direct copy, no conversion (recommended for Nuxt, Vite+Vue, or Astro+Vue)
> 2. **Astro** `.astro` — converted when promoting (recommended for Astro without Vue)
> 3. **React** `.tsx` — converted when promoting (recommended for Next.js, Remix, CRA)
> 4. **Svelte** `.svelte` — converted when promoting (recommended for SvelteKit)
>
> _(Detected stack: **[stack]** — suggested: **[recommended option]**)_"

Wait for the user's answer (1–4 or the format name). Save the choice.

## Step 3 — Save project config

Write `design-system/project.json` with the gathered info:

```json
{
  "name": "[project name]",
  "url": "[current site URL]",
  "stack": "[astro|nextjs|nuxt|svelte|vue|react|unknown]",
  "componentFormat": "[vue|astro|tsx|svelte]",
  "vueInAstro": true,
  "componentsPath": "web/src/components"
}
```

`componentFormat` = the format used **in the final web repo**:
- Astro + Vue → `"vue"`
- Astro without Vue (option B) → `"astro"`
- Next.js / React → `"tsx"`
- Nuxt / Vue → `"vue"`
- SvelteKit → `"svelte"`

## Step 4 — Brand & design system

Ask one at a time:

1. **Project name** (if not already given)
2. **Tone** — brand personality (e.g. "corporate but warm", "technical and precise")
3. **What it is NOT** — 1-2 things to avoid (e.g. "not startup-hipster")
4. **Primary color** — hex or description. Leave as placeholder if unknown.
5. **Target audience** — who uses this site?
6. **Main CTA** — #1 action the site should drive

## Step 5 — Write design-system files

**`design-system/guide.md`:**

```markdown
# Design guide — [project name]

> Brand principles and tone. Numeric values live in `tokens.json` / `tokens.css`.

## Stack

- **Framework**: [stack]
- **Component format**: [componentFormat]
- **Components path**: `web/src/components`

## Brand

- **Tone**: [answer]
- **Personality**: [3 inferred words]
- **We are NOT**: [answer]

## Core message

- "[Key tagline or value proposition]"

## Design principles

1. **Clarity first** — visitor understands what [company] does in <5 seconds
2. **Mobile-first** — layouts start at 375px and scale up
3. **Accessibility WCAG AA** — contrast, visible focus, ARIA where needed
4. **SEO-safe** — no sacrificing HTML semantics for aesthetics

## CTAs

- **Primary**: "[main CTA]" → solid `--color-primary` button
- **Secondary**: "[secondary CTA]" → outline or text link

## Typography

- **Headings**: font-weight 700–800
- **Body**: font-weight 400–500
- **UI labels**: font-weight 500–600

## Color (usage intent)

- **Primary** (`--color-primary`): CTAs, active links, brand elements
- **Text** (`--color-text`): main body text
- **Text muted** (`--color-text-muted`): metadata, secondary labels
- **Background** (`--color-background`): base background
- **Surface** (`--color-surface`): section backgrounds, cards

## Target audience

[answer]

## Accepted components

> Auto-populated by `/elegir-variante`.

- _(none yet)_
```

**`design-system/tokens.json`** — populate with primary color, derive hover (-15% lightness), fill rest with sensible defaults.

**`design-system/tokens.css`** — same values as CSS custom properties on `:root`.

## Step 6 — Stack-specific setup

- **Astro + Vue (option A)**: remind user to run `npm install @astrojs/vue vue` in `web/` and add `vue()` to `astro.config.mjs` integrations if not already done.
- **Astro option B / Next / Svelte**: note that `/promover-a-web` will handle conversion automatically.
- **Nuxt / Vue**: no extra setup needed.

## Step 7 — Closing

- ✓ Summary of what was configured
- Drop brand assets in `referencias/marca/` (logo, brand book images, color swatches)
- Drop UI inspiration in `referencias/inspiracion/` (screenshots of components/sites you like)
- Next step: `/auditar-web <URL>`

# Claude Code configuration

## Commands

### `/init-proyecto`
Interactive setup for a new project. Fills in `design-system/guide.md` and `tokens.json`, confirms the web repo is in `web/`, and suggests running `/auditar-web` as first step.

### `/auditar-web <URL>`
Audits the website at the given URL. Fetches content, extracts business/AI/tone/identity/technical signals, saves to `analisis/NN-slug-baseline.md`.

### `/generar-componente <Name> [N] [brief]`
Generates N component variants in parallel (default 4, up to ~12). Each uses a distinct visual direction from a library of 20 styles. Saves to `design-system/_variants/<Name>/`.

### `/refinar-componente <Name> <variant> [N]`
Takes a chosen variant and generates N micro-variations (default 6), exploring spacing, typography, density, shadows, interactions. For when you've found the right direction but want to perfect the details.

### `/elegir-variante <Name>`
Reviews generated variants, promotes the chosen one to `design-system/accepted/`, archives viable discards to `library/`.

### `/promover-a-web <Name> [category]`
Copies the accepted component from `design-system/accepted/` to `web/src/components/<category>/`.

## Agent

### `component-variant-generator`
Specialized subagent that generates a single production-quality Vue component variant. Called in parallel from `/generar-componente` and `/refinar-componente`. Targets the quality level of Linear, Stripe, Vercel design systems.

## Typical flow for a new project

```
/init-proyecto
/auditar-web https://client.com
/generar-componente Navbar 10
/refinar-componente Navbar v03-linear-dark 6
/elegir-variante Navbar
/promover-a-web Navbar layout
# repeat for each component
```

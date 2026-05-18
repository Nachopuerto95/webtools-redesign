# Claude Web Redesign System

An agentic workflow for redesigning websites using Claude Code. Generates production-quality UI components through iterative AI-driven design exploration.

## What it does

1. **Audits** the existing website — structure, content, tone, technical signals
2. **Generates** multiple component variants in parallel, each with a distinct visual direction
3. **Previews** the chosen variant injected directly into the running dev server
4. **Refines** the selected direction with micro-variations until production-ready
5. **Promotes** accepted components to the final web repository

## Prerequisites

- [Claude Code](https://claude.ai/code) CLI
- Node.js 18+
- Git

## Starting a new project

1. Click **"Use this template"** on GitHub to create your project repo
2. Clone your new project repo locally
3. Clone the client's web repo into `web/`:
   ```bash
   git clone <client-repo-url> web
   ```
4. Install playground dependencies:
   ```bash
   cd playground && npm install
   ```
5. Run `/init-proyecto` in Claude Code to set up the design system for this project

## Workflow

```
/auditar-web <URL>
  → analisis/00-baseline.md

/generar-componente Navbar 10
  → 10 variants in design-system/_variants/Navbar/

/elegir-variante Navbar
  → pick one, or...

/refinar-componente Navbar v03-linear-dark 6
  → 6 refinements of the chosen direction

/elegir-variante Navbar
  → promotes to design-system/accepted/

/promover-a-web Navbar layout
  → copies to web/src/components/layout/
```

## Commands

| Command | Description |
|---|---|
| `/init-proyecto` | Set up design system for a new project |
| `/auditar-web <URL>` | Audit an existing website, generate baseline |
| `/generar-componente <Name> [N] [brief]` | Generate N variants (default 4) |
| `/refinar-componente <Name> <variant> [N]` | Generate N refinements of a variant |
| `/elegir-variante <Name>` | Pick a variant, promote to accepted/ |
| `/promover-a-web <Name> [category]` | Copy accepted component to the web repo |

## Structure

```
.
├── .claude/
│   ├── commands/        ← slash commands
│   └── agents/          ← specialized subagents
├── playground/          ← Vue 3 + Vite component preview
├── design-system/
│   ├── guide.md         ← brand & design principles (per project)
│   ├── tokens.json      ← design tokens (per project)
│   ├── _variants/       ← work in progress (gitignored)
│   ├── accepted/        ← approved components (gitignored)
│   └── library/         ← viable discards for future use (gitignored)
├── analisis/            ← audit outputs (gitignored)
├── referencias/
│   ├── marca/           ← brand book, logo, color/type specs (gitignored)
│   ├── inspiracion/     ← UI screenshots you like (gitignored)
│   └── competencia/     ← competitor screenshots (gitignored)
└── web/                 ← client web repo, cloned here (gitignored)
```

## Dev servers

```bash
# Client web (Astro / Next / etc.)
cd web && npm run dev        # → http://localhost:4321

# Component playground
cd playground && npm run dev # → http://localhost:5173
```

## License

MIT

---
description: Reads brand assets in referencias/marca/, extracts colors, typography, tone and logo rules, then updates guide.md and tokens.json with real values.
---

Process the brand assets in `referencias/marca/` and update the design system.

## Step 1 — Inventory

List all files in `referencias/marca/` recursively. Identify:
- **Brand book**: any `.pdf` in a `Brandbook/` or similar folder → read first (most valuable)
- **Logo PNGs**: main logo versions
- **Typography specimens**: PNG images showing type usage
- **Identity/Application mockups**: JPGs or PNGs showing the brand in use
- **Font files**: `.otf` / `.ttf` → note the family names (don't read the binary)

## Step 2 — Read brand book

If a brand book PDF exists, read it (up to 20 pages). Extract:
- **Color palette**: exact hex/RGB values mentioned. Note primary, secondary, accent, neutral colors.
- **Typography**: font family names, which weights are used for what (display, body, UI). Note if they're proprietary.
- **Logo rules**: clear space, minimum size, forbidden uses, color variants (positive/negative/mono).
- **Tone & personality**: any brand voice, adjectives, or mission statements.
- **Do's and don'ts**: explicit brand rules.

If no PDF, proceed to Step 3.

## Step 3 — Read key images

Read these images visually (Claude is multimodal):
1. **Main logo PNG** — note exact logo colors, style, wordmark vs symbol
2. **Typography specimen** (e.g. `Typography/05.png`) — note fonts, weights, sizes shown
3. **1-3 application mockups** (e.g. `Applications/01.png`, `02.png`, `03.png`) — note color usage, spacing feel, overall aesthetic
4. **Identity system** (e.g. `Identity System/System 01/*.jpg`) — note color combinations, layout patterns

## Step 4 — Extract structured data

From everything read, produce:

**Colors** (with hex values if found, or best approximation from images):
- Primary brand color
- Secondary / accent colors
- Neutral palette (backgrounds, surfaces, borders)
- Text colors
- Any forbidden color combinations

**Typography**:
- Display/heading font: family name, weights available
- Body font: family name, weights available
- Is it a web-safe font, Google Font, or proprietary? If proprietary, note that self-hosting is needed.

**Brand rules**:
- 3-5 key design dos
- 3-5 key design don'ts

## Step 5 — Update design-system/guide.md

Rewrite the `## Brand`, `## Typography`, `## Color` sections with the real data. Add a `## Brand rules` section with dos/don'ts. Preserve the rest of the file unchanged.

## Step 6 — Update design-system/tokens.json and tokens.css

Replace the placeholder values with real brand values:
- Real primary color hex
- Real font family names (use the exact names from the font files / brand book)
- If fonts are proprietary, note in a `_comment` field: "Self-hosted — files in referencias/marca/Typography/"

Regenerate `tokens.css` to match.

## Step 7 — Install fonts (if proprietary)

If font `.otf` / `.ttf` files are present in `referencias/marca/Typography/`:

**7a — Choose weights to copy.** For each font family, select only the weights needed for web:
- Display/heading family: regular weight + bold weight (2 files max)
- Body family: light (300) + regular (400) + bold (700) (3 files max)

**7b — Copy to `web/public/fonts/`** (create the directory if it doesn't exist):
```
cp "referencias/marca/Typography/<Family>/<File>.otf" "web/public/fonts/<ShortName>.otf"
```

**7c — Rewrite `web/src/styles/fonts.css`** with `@font-face` declarations pointing to `/fonts/<ShortName>.otf`. Use `font-display: swap`.

**7d — Copy same files to `playground/public/fonts/`** and write `playground/src/fonts.css` with the same `@font-face` rules. Then ensure `playground/src/main.ts` imports `'./fonts.css'`.

## Step 8 — Summary

Report to the user:
- What was extracted (colors found, fonts identified, key brand rules)
- What was updated in guide.md, tokens.json, fonts.css
- Fonts installed: which weights were copied and where
- Any gaps: "Brand book didn't specify X — left as placeholder, please fill in"

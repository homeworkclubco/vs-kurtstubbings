# Astro Pages CMS Starter — Agent Guide

## Project Overview

This is a flexible starter / boilerplate for building statically-generated Astro sites with a Pages CMS page-builder. It is pre-configured for deployment to Cloudflare Pages. Content is managed through **Pages CMS** (a Git-based headless CMS configured via `.pages.yml`), which edits Markdown and JSON files directly in the repository.

The site is dark-themed by default (`data-color-scheme="dark" on <html>`) and uses a bold, high-contrast visual identity built on fluid typography, semantic colour tokens, and composable layout primitives.

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | Astro 6 (static site generation) |
| Language | TypeScript (strict mode) |
| Runtime / Deploy | Cloudflare Pages (`@astrojs/cloudflare` adapter) |
| Styling Engine | UnoCSS (custom preset) + Tailwind CSS v4 (Vite plugin) + PostCSS |
| Interactivity | Alpine.js (via `@astrojs/alpinejs`) |
| Animation | GSAP (dev dependency, used for scroll/text animations) |
| Media | Plyr (YouTube embeds), lightbox3 (image galleries), Sharp (image optimisation) |
| Icons | `@lucide/astro` |
| Fonts | Archivo Variable, Anton, Alex Brush (via `@fontsource`) |
| CMS | Pages CMS (`.pages.yml`) |
| Package Manager | pnpm |

## Build & Development Commands

```bash
# Install dependencies
pnpm install

# Start local dev server (localhost:4321)
pnpm dev

# Production build → ./dist/
pnpm build

# Preview production build locally
pnpm preview

# Astro CLI
pnpm astro ...
```

No test runner, lint script, or CI pipeline is currently configured. ESLint is installed but has no npm script or config file.

## Project Structure

```
├── src/
│   ├── assets/                 # Images, SVGs, fonts processed by Astro
│   │   └── uploads/            # CMS-uploaded images (empty in starter)
│   ├── components/
│   │   ├── actions/            # Buttons, action links
│   │   ├── blocks/             # Page-section blocks (hero, grids, etc.)
│   │   ├── display/            # Heading, Prose, OverlapHeading
│   │   ├── forms/              # Input, Textarea, Checkbox, Field, InsetField
│   │   └── layout/             # Every Layout primitives (see below)
│   ├── content/
│   │   ├── pages/              # Static pages (homepage.md, about.md, …)
│   │   ├── services/           # Service detail pages (empty in starter)
│   │   ├── caseStudies/        # Case study entries (empty in starter)
│   │   ├── blog/               # Blog posts (legacy collection, mostly unused)
│   │   ├── clients.json        # Client list for reference fields (empty in starter)
│   │   ├── testimonials.json   # Testimonial quotes (empty in starter)
│   │   └── redirects.json      # Static redirects consumed by astro.config.mjs
│   ├── layouts/
│   │   └── Layout.astro        # Root layout (SEO, header, footer, cookie consent)
│   ├── pages/
│   │   ├── index.astro         # Homepage (renders homepage.md)
│   │   ├── [...slug].astro     # Generic page route
│   │   ├── case-studies/
│   │   │   └── [slug].astro    # Case study detail
│   │   └── services/
│   │       └── [slug].astro    # Service detail
│   ├── plugins/
│   │   └── rehype-youtube-plyr.mjs   # Turns bare YouTube URLs into Plyr embeds
│   ├── styles/
│   │   ├── global.css          # Layer imports (tokens → base → props → utilities)
│   │   ├── reset.css           # Global CSS reset
│   │   ├── tokens.css          # Radius, control-height primitives
│   │   ├── spacing.css         # Fluid space scale (postcss-ruler)
│   │   ├── typography.css      # Font families, weights, measures, fluid type scale
│   │   ├── color.css           # OKLCH neutrals, semantic tokens, light/dark schemes
│   │   ├── easing.css          # Easing curves
│   │   ├── breakpoints.css     # Custom media query breakpoints
│   │   ├── prose.css           # Prose / rich-text typographic styles
│   │   ├── utilities.css       # sr-only, x-cloak
│   │   └── vars.css            # Additional CSS variables
│   ├── config.ts               # Site metadata, SEO defaults, JSON-LD data
│   ├── content.config.ts       # Astro content collections + Zod schemas
│   ├── types.ts                # Shared TypeScript types (SpaceToken, FontSizeToken)
│   └── env.d.ts
├── public/
│   └── assets/                 # Static public assets
├── .pages.yml                  # Pages CMS configuration
├── uno.config.ts               # UnoCSS custom preset (breakpoints, rules, fluid scales)
├── astro.config.mjs            # Astro config (Cloudflare adapter, sitemap, redirects)
├── wrangler.jsonc              # Cloudflare Pages deployment config
├── postcss.config.cjs          # PostCSS pipeline
└── tsconfig.json               # Path aliases + strict Astro preset
```

### Path Aliases

| Alias | Maps to |
|---|---|
| `@assets/*` | `./src/assets/*` |
| `@components/*` | `./src/components/*` |
| `@config` | `./src/config.ts` |
| `@content/*` | `./src/content/*` |
| `@layouts/*` | `./src/layouts/*` |
| `@pages/*` | `./src/pages/*` |
| `@styles/*` | `./src/styles/*` |
| `@utils/*` | `./src/utils/*` |

## Content Architecture

### Collections (`src/content.config.ts`)

Astro Content Collections define strict Zod schemas for all content:

- **`pages`** — Markdown files in `src/content/pages/`. Each page has `title`, optional `slug`, `seo` object, and a `sections` array (discriminated union of block types).
- **`services`** — Same schema as pages plus `icon`, `cta`, `order`. Empty in the starter.
- **`caseStudies`** — `title`, `client` (reference), `featuredImage` `{src, alt}`, `excerpt`, `gallery`, `body`. Empty in the starter.
- **`clients`** — Loaded from `clients.json` with a custom parser that generates IDs from names. Empty in the starter.
- **`testimonials`** — Loaded from `testimonials.json`. Empty in the starter.

### Pages CMS (`.pages.yml`)

The CMS config defines:

- **Reusable components**: `image_with_alt`, `seo`
- **Block types** under `sections`: `videoHeroBlock`, `imageHeroBlock`, `leadBlock`, `textBlock`, `clientLogosBlock`, `serviceCardsBlock`, `caseStudyGridBlock`, `galleryBlock`, `tileGridBlock`, `testimonialsBlock`, `headingBlock`, `mediaBlock`, `contactBlock`, `timelineBlock`, `mediaTextBlock`
- **Content collections**: `pages`, `clients`, `services`, `testimonials`, `redirects`, `case_studies`

### Block Rendering

`src/components/blocks/BlockRenderer.astro` auto-discovers block components via `import.meta.glob`. It maps the `type` value from frontmatter to a component filename by lowercasing the first letter (e.g. `type: caseStudyGridBlock` → `CaseStudyGridBlock.astro`). **You do not need to edit BlockRenderer when adding a new block.**

If the first section is a hero block (`videoHeroBlock` or `imageHeroBlock`), BlockRenderer omits the `header-spacer` div so the header overlays the hero.

## Layout System (Every Layout Primitives)

All layout components live in `src/components/layout/`. They are inspired by Andy Bell's *Every Layout* and solve single layout problems via context-aware CSS.

| Component | Purpose |
|---|---|
| `Stack` | Vertical rhythm with configurable gap |
| `Cluster` | Inline grouping that wraps naturally |
| `Sidebar` | Two-column layout (fixed + fluid) |
| `Grid` | Auto-fill responsive grid |
| `Switcher` | Row ↔ stack at a threshold width |
| `Frame` | Aspect ratio container |
| `Cover` | Full-height vertically-centered panel |
| `Center` | True horizontal + vertical centering |
| `Reel` | Horizontal scroll with snap |
| `Imposter` | Absolute/fixed overlay |
| `Container` | Max-width constraint + inline padding |
| `Section` | Block padding + colour scheme wrapper |
| `Icon` | Inline SVG sizing wrapper |

### Composition Rules

1. **Section wraps, Container constrains.** Never add padding to `Container`; put it on `Section`.
2. Avoid nesting two `Container`s inside one section.
3. Use semantic `as` props: `<Stack as="ul">` instead of wrapping a `Stack` in a `<ul>`.
4. Most layouts are `Stack + Cluster`. Reach for other primitives only when those genuinely don't fit.

## Styling & Design Tokens

### CSS Architecture

Styles are organised in **CSS layers** (`@layer tokens, base, props, utilities`), imported via `src/styles/global.css`:

- **tokens** — Fluid spacing, typography, colour, easing primitives
- **base** — Global reset, element defaults
- **props** — Data-attribute preflights generated by UnoCSS
- **utilities** — Alpine.js `x-cloak`, `.sr-only`, etc.

### Fluid Scales (`postcss-ruler`)

Spacing and font-size scales are fluid (interpolate between mobile and desktop values). They are generated by the `postcss-ruler` plugin configured with `minWidth: 375` and `maxWidth: 1760`.

Examples:
- `var(--space-md)` — fluid 16–24px
- `var(--font-size-3)` — fluid 24–36px
- In CSS: `ruler.fluid(300, 530)` inside `<style>` blocks also works

### UnoCSS Utilities

`uno.config.ts` exports a **custom preset** (`starterPreset`) with desktop-first **max-width** breakpoints:

| Prefix | Max-width |
|---|---|
| `2xl:` | 1920px |
| `xl:` | 1640px |
| `lg:` | 1280px |
| `md:` | 1024px |
| `sm:` | 768px |
| `xs:` | 520px |
| `2xs:` | 420px |

Available utility categories: display, flex (alignment, direction, behaviour), sizing, overflow, position, typography (`text-{n}`), margin/padding/gap (same token scale as CSS).

### Colour Tokens

Always use **semantic tokens**; never hard-code hex or raw values.

| Token | Purpose |
|---|---|
| `var(--color-bg)` | Page background |
| `var(--color-bg-alt)` | Subtle surface |
| `var(--color-foreground)` | Primary text |
| `var(--color-foreground-secondary)` | Muted text |
| `var(--color-accent)` | Brand accent (#e6372e) |
| `var(--color-on-accent)` | Text on accent background |
| `var(--color-border)` | Default border |
| `var(--color-border-strong)` | Prominent border |

Colour scheme switching is handled by `data-color-scheme="light" | "dark"` (usually via `<Section colorScheme="...">`). The `<html>` element defaults to `dark`.

### Typography Tokens

| Token | Value |
|---|---|
| `var(--font-family-body)` | Archivo Variable |
| `var(--font-family-heading)` | Archivo Variable (stretched) |
| `var(--font-family-heading-alt)` | Anton |
| `var(--font-family-alt)` | Alex Brush (decorative) |

Heading sizes: `-2`, `-1`, `0`, `1`, `2`, `3`, `4`, `5`, `subheading-lg`, `heading-lg`, `heading-xl`.

## Code Style Guidelines

- **Formatter**: Prettier with `prettier-plugin-astro` and `prettier-plugin-tailwindcss`.
- **Settings**: 2-space tabs, 80 print width, semicolons, double quotes, trailing commas (ES5), LF line endings.
- **Organize imports** on save is enabled in VS Code.
- **Never write raw CSS values.** No `px` numbers, no hex colours, no `font-size: 14px`. Always use a design token. If a token doesn't exist, leave a `/* TODO */` comment.
- **Never use raw `<div style="...">` or write layout CSS in a page.** Use a layout primitive.
- **Prefer layout primitives first.** Reach for UnoCSS utilities only when you need a breakpoint-specific override a primitive doesn't cover.
- Rich-text bodies are rendered with: `{body && <Prose><Fragment set:html={body} /></Prose>}`.
- Images in lists inside blocks: use `object` with `list: true`, fields `image` + separate `imageAlt` string.

## Adding a New Block (Pages CMS Section)

Adding a page-section block touches **exactly 3 files** in this order:

1. **`.pages.yml`** — Append a new block definition under `components → sections → blocks`. Use `camelCaseBlock` naming (e.g. `statsBlock`).
2. **`src/content.config.ts`** — Add a matching `z.object({ type: z.literal("statsBlock"), ... })` variant to the `sectionsSchema` discriminated union.
3. **`src/components/blocks/StatsBlock.astro`** — New component. `BlockRenderer` auto-discovers it via `import.meta.glob`; the `type` value must equal the filename with its first letter lowercased.

**Critical conventions:**
- Block `name` in `.pages.yml` and the `type` literal in `content.config.ts` must match exactly (`camelCase` with `Block` suffix).
- Every `.pages.yml` field must have a matching Zod field with correct optionality.
- Do **not** add `colorScheme` to new blocks — it is not used on this site.
- Every new content collection gets a `uuid` field. All cross-collection `reference` fields must key off `uuid`, not filename.
- Wrap blocks in `<Section padding="...">` → `<Container>` → `<Stack>`.
- Leave final styling as a `{/* TODO styling */}` comment for the user to refine.

## Routing

- `/` — `index.astro` loads the `homepage` entry from the `pages` collection.
- `/:slug` — `[...slug].astro` renders any other page from `src/content/pages/` (excluding `homepage`).
- `/case-studies/:slug` — Case study detail pages.
- `/services/:slug` — Service detail pages.
- Redirects are defined in `src/content/redirects.json` and injected into `astro.config.mjs` at build time.

## SEO & Structured Data

`src/components/layout/SEO.astro` renders:
- `<title>`, meta description, Open Graph tags
- JSON-LD scripts for `Organization`, `LocalBusiness`, and `WebSite`
- Services are dynamically included in `LocalBusiness.hasOfferCatalog`

Defaults are sourced from `src/config.ts`. Override per-page via the `seo` frontmatter object.

## Rehype Plugin

`src/plugins/rehype-youtube-plyr.mjs` transforms bare YouTube URLs in Markdown into Plyr embed divs (`data-plyr-provider="youtube"`). Plyr is initialised client-side in `Layout.astro` only when embeds are present.

## Deployment

- **Target**: Cloudflare Pages
- **Adapter**: `@astrojs/cloudflare` with `imageService: 'compile'`
- **Config**: `wrangler.jsonc`
  - `compatibility_date`: `2026-04-13`
  - `compatibility_flags`: `nodejs_compat`, `global_fetch_strictly_public`
  - Observability enabled
- **Output**: `./dist/client` served as static assets; server functions handled by Cloudflare Workers entrypoint.

## Security Considerations

- No authentication or authorisation layer — this is a public marketing site.
- Cookie consent banner implemented via `vanilla-cookieconsent` in `CookieConsent.astro`.
- YouTube embeds use Plyr with `noCookie: true` (privacy-enhanced mode).
- No sensitive environment variables or secrets are currently referenced in the codebase.

## Known Quirks & Gotchas

- The project has an older `new-block` skill under `.claude/skills/` that references snake_case naming and manual BlockRenderer edits. The **actual convention** used in the codebase is camelCase with auto-discovery — follow `.github/instructions/new-block.instructions.md` and the existing block components, not the old skill file.
- The `blog` collection exists but appears largely unused/legacy (contains Astro starter-kit placeholder posts).
- `src/styles/props.css` is intentionally empty ("Silence is golden, boyo") — props are generated by UnoCSS preflights.
- Alpine.js components use `x-data` inline in Astro templates (no separate JS bundle).
- Header height is dynamically measured and exposed as `--header-height` CSS custom property for layout spacing.

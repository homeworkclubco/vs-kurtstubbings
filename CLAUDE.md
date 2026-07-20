# astro-pagescms-starter

Astro static site with UnoCSS, Alpine.js, and Every Layout primitives.

## Project structure

- Components: `src/components/` — layout primitives in `layout/`, page blocks in `blocks/`
- Content: `src/content/blog/` (collection) and `src/content/pages/` (single files)
- Styles: `src/styles/` — CSS custom properties, reset, typography, utilities
- Config: `uno.config.ts` (UnoCSS), `astro.config.mjs`

## Pages CMS

Config file location: `.pages.yml`.

Pages CMS edits files in the GitHub repo directly via a YAML config. Key points:

- `type: collection` = folder of files (create/edit/delete)
- `type: file` = single file editor
- `format: yaml-frontmatter` = Astro markdown with YAML frontmatter
- Blog path: `src/content/blog/`, filename template: `{year}-{month}-{day}-{primary}.md`
- Homepage path: `src/content/pages/homepage.md`
- Media: `public/assets/` → `/assets`

## Layout system

Layout primitives live in `src/components/layout/` (Stack, Cluster, Sidebar, Grid, Center, Cover, Frame, Reel, Switcher, Imposter, Section, Container, etc.).

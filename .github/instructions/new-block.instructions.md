---
applyTo: "src/components/blocks/**,src/content.config.ts,.pages.yml"
description: "Use when scaffolding a new page-section block (Pages CMS + Astro). Triggers on requests like 'add a block', 'new section type', 'add a CMS block', or natural-language block descriptions."
---

# New block scaffold

Blocks are page-builder sections rendered by `BlockRenderer.astro` and edited via Pages CMS. Adding one touches **exactly 3 files** — BlockRenderer auto-discovers components via `import.meta.glob`, so you never need to edit it. Do them in this order — schema mismatches between them are the #1 source of bugs.

## Flow

1. **Ask the user** (if not already given):
   - Block name in natural language (e.g. "testimonials carousel")
   - Fields it needs, in plain English — for each: name, purpose, required?, single vs list
2. **Derive**:
   - `camelCaseBlock` name → CMS `name` + Astro `section.type` (e.g. `testimonialsCarouselBlock`)
   - `PascalCaseBlock` component filename (e.g. `TestimonialsCarouselBlock.astro`)
   - The component key used by BlockRenderer = first letter lowercased = `testimonialsCarouselBlock`
3. **Echo the derived spec back** as a tiny table (name → type → required?) and ask for confirmation before writing.
4. **Scaffold all 3 touchpoints** (below). Use layout primitives for the component skeleton and leave a `{/* TODO styling */}` inside — the user handles final styling.
5. **Do NOT run the dev server or typecheck** unless asked. Report the 3 edits and stop.

## The 3 touchpoints

### 1. `.pages.yml`

Append under `content[0].fields` → the field with `name: sections` → `blocks:`. Match existing YAML style (inline `{ }` for short field defs, block style for nested).

### 2. `src/content.config.ts`

Add a new `z.object({...})` variant to the `sections` `z.discriminatedUnion("type", [...])` in the `pages` collection. **Every `.pages.yml` field must have a matching zod field** with the mapping below.

### 3. `src/components/blocks/{PascalNameBlock}.astro`

New file. BlockRenderer auto-discovers it via `import.meta.glob` — the `type` value in content must equal the filename with its first letter lowercased (e.g. `TestimonialsCarouselBlock.astro` → `type: testimonialsCarouselBlock`). Skeleton:

```astro
---
import Container from "@components/layout/Container.astro";
import Section from "@components/layout/Section.astro";
import Stack from "@components/layout/Stack.astro";
import Heading from "@components/display/Heading.astro";
import Prose from "@components/display/Prose.astro";
import type { InferEntrySchema } from "astro:content";

type Section_ = NonNullable<InferEntrySchema<"pages">["sections"]>[number];

interface Props {
  block: Extract<Section_, { type: "myNewBlock" }>;
  index: number;
}

const { block, index } = Astro.props;
const { /* destructure fields */ } = block;
---

<Section padding="xl">
  <Container>
    <Stack space="lg">
      {/* TODO: final layout + styling — user will refine */}
    </Stack>
  </Container>
</Section>
```

**Do NOT edit `BlockRenderer.astro`** — it picks up the new component automatically.

## Field-type mapping (`.pages.yml` → zod → TS prop)

| Pages CMS `type`              | zod                                               | TS prop type                              | Notes |
|-------------------------------|---------------------------------------------------|-------------------------------------------|-------|
| `string`                      | `z.string()`                                      | `string`                                  | single-line text |
| `text`                        | `z.string()`                                      | `string`                                  | multi-line plain |
| `rich-text`                   | `z.string()`                                      | `string` (HTML)                           | render via `<Fragment set:html={body} />` inside `<Prose>` |
| `number`                      | `z.number()`                                      | `number`                                  | |
| `boolean`                     | `z.boolean()`                                     | `boolean`                                 | |
| `date`                        | `z.string()` or `z.coerce.date()`                 | `string \| Date`                          | stored as ISO string |
| `image`                       | `image().or(z.string())`                          | `ImageMetadata \| string`                 | use Astro `<Image>` for optimised output |
| `file`                        | `z.string()`                                      | `string` (path)                           | |
| `select` (single)             | `z.union([z.literal("a"), z.literal("b")])`       | `"a" \| "b"`                              | values from `options.values` |
| `select` (multiple)           | `z.array(z.union([z.literal(...), ...]))`         | `("a" \| "b")[]`                          | `options.multiple: true` |
| `reference` (single)          | `z.string()` (uuid or filename)                   | `string`                                  | lookup at render time via `getCollection()` |
| `reference` (list)            | `z.array(z.string()).default([])`                 | `string[]`                                | see `case_study_grid` pattern |
| `object`                      | `z.object({ ... })`                               | inline shape                              | |
| `object` + `list: true`       | `z.array(z.object({ ... }))`                      | `Array<{ ... }>`                          | see `tile_grid.items` |
| `uuid`                        | `z.string().optional()`                           | `string`                                  | |
| `code`                        | `z.string()`                                      | `string`                                  | |
| `component: image_with_alt`   | `z.object({ src: image(), alt: z.string().optional().default("") })` | `{ src; alt }` | reusable component defined in `.pages.yml` `components:` |

**Modifiers:**
- Field not `required: true` in YAML → `.optional()` on zod, `?` on TS prop
- `list: true` → wrap in `z.array(...)`; add `.default([])` if safe
- Defaults: `.default(value)` on zod when the YAML has a `default:`

## Conventions (this project)

- **Do NOT add `colorScheme` to new blocks.** Not used on this site.
- **Every new content collection gets a `uuid` field** (`type: uuid` in `.pages.yml`, `z.string().optional()` in zod). **All cross-collection relationships (`reference` fields) must key off `uuid`, not filename** — e.g. `options: { value: "{fields.uuid}" }`. Filenames change; UUIDs don't. See `case_studies` for the pattern. If a block references another collection, use UUIDs.
- Block `name` in `.pages.yml` and the `type` literal in `content.config.ts` **must match exactly** (camelCase with `Block` suffix, e.g. `statsBlock`).
- Always wrap in `<Section padding="...">` → `<Container>` → `<Stack>`. Never add padding to `Container`.
- Rich-text bodies: `{body && <Prose><Fragment set:html={body} /></Prose>}`.
- Images in a list inside a block: use `object` with `list: true`, fields `image` + a separate `imageAlt` string (see `tile_grid`).
- Use layout primitives from `@components/layout/*` and display primitives from `@components/display/*`. See `.github/instructions/layouts.instructions.md` for the full primitive list — don't hand-roll flex/grid.
- Don't write CSS values — use tokens (`var(--space-lg)`, `var(--color-accent)`, etc.).
- Leave final styling as a `{/* TODO */}` comment; the user refines.

## Worked example (condensed)

User: "Add a stats block with a heading and a list of stat items, each with a number and a label."

Derive:
- name: `statsBlock`, component: `StatsBlock.astro`
- fields: `heading` (string, optional), `items` (object list: `value` string, `label` string)

**`.pages.yml`** (append under `blocks:`):
```yaml
- name: statsBlock
  label: Stats Block
  fields:
    - { name: heading, label: Heading, type: string }
    - name: items
      label: Stats
      type: object
      list: true
      fields:
        - { name: value, label: Value, type: string }
        - { name: label, label: Label, type: string }
```

**`content.config.ts`** (add variant in discriminated union):
```ts
z.object({
  type: z.literal("statsBlock"),
  heading: z.string().optional(),
  items: z.array(z.object({
    value: z.string(),
    label: z.string(),
  })).default([]),
}),
```

**`StatsBlock.astro`** — skeleton using Section/Container/Stack + a Grid for items. Props are `block` and `index`.

BlockRenderer picks it up automatically — no changes needed there.

## Checklist before finishing

- [ ] `.pages.yml` block entry added with `camelCaseBlock` name
- [ ] zod variant added with matching field types (every YAML field mirrored, optionality preserved)
- [ ] Component `{PascalCaseBlock}.astro` created under `src/components/blocks/`
- [ ] Component uses `interface Props { block: Extract<Section_, { type: "..." }>; index: number; }`
- [ ] `name` in YAML and `z.literal(...)` in zod are **byte-identical**
- [ ] No `colorScheme` prop
- [ ] Styling left as TODO for the user

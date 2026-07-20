---
applyTo: "src/**/*.astro"
description: "Use when building layouts in Astro files. Covers which Every Layout primitive to pick, all props, composition patterns, and UnoCSS responsive utilities."
---

# Layout System

Layouts are built from composable primitives inspired by Andy Bell's *Every Layout*. The goal is to resolve layout problems at the component level using context-aware CSS — not breakpoints where avoidable. Each primitive does one job well. Compose them.

All layout components live in `src/components/layout/`.

---

## Decision Framework

Before writing any layout code, identify the layout *problem* first, then pick the primitive that solves it:

| Problem | Primitive |
|---|---|
| Stack items vertically with consistent space | `Stack` |
| Group inline items that can wrap | `Cluster` |
| Place one item beside a main content area | `Sidebar` |
| Auto-fill a grid of equal-ish items | `Grid` |
| Switch between row and stacked at a threshold | `Switcher` |
| Fill a fixed aspect ratio or media frame | `Frame` |
| Scroll horizontally with snap | `Reel` |
| Fill minimum height, pin top/bottom, center content | `Cover` |
| Center something both axes | `Center` |
| Absolutely overlap something on top of content | `Imposter` |
| Constrain width and add page padding | `Container` |
| Add block padding and/or a color scheme to a section | `Section` |

**Most layouts are Stack + Cluster.** Reach for other primitives only when those genuinely don't fit.

---

## Primitives

### `Stack` — vertical rhythm

Stacks children vertically with consistent gap. Use for any block-level vertical sequence: page sections, card contents, form fields, article body.

```astro
<Stack space="md">
  <p>...</p>
  <p>...</p>
</Stack>
```

**Props:**
| Prop | Type | Default | Notes |
|---|---|---|---|
| `as` | element tag | `div` | `section`, `article`, `ul`, `ol`, `nav`, etc. |
| `space` | SpaceToken | `md` | Gap between children |
| `splitAfter` | `1`–`5` | — | Pushes everything after this child to the bottom (`margin-block-end: auto` on that index) |
| `align` | `start \| center \| end \| stretch` | `stretch` | Cross-axis alignment |
| `justify` | `start \| center \| end \| between \| around` | `start` | Main-axis distribution |
| `text` | `left \| center \| right` | — | Sets `text-align` on all children |

**`splitAfter` is great for card footers** — forces a CTA button to the bottom regardless of content height:
```astro
<Stack space="sm" splitAfter={2}>
  <h3>Card title</h3>
  <p>Card body copy</p>
  <Button>CTA</Button>  <!-- always pinned to bottom -->
</Stack>
```

---

### `Cluster` — inline grouping

Groups items in a horizontal row that wraps naturally. Use for nav links, tags, icon+label pairs, button groups, meta information.

```astro
<Cluster as="ul" space="md" justify="between">
  <li>...</li>
  <li>...</li>
</Cluster>
```

**Props:**
| Prop | Type | Default | Notes |
|---|---|---|---|
| `as` | any tag | `div` | Use `ul` for lists |
| `space` | SpaceToken | `sm` | Uniform gap (shorthand for both axes) |
| `spaceX` | SpaceToken | — | Column gap only; overrides `space` |
| `spaceY` | SpaceToken | — | Row gap only; overrides `space` |
| `justify` | `start \| center \| end \| between \| around` | `start` | Main-axis distribution |
| `align` | `start \| center \| end \| stretch` | `center` | Cross-axis alignment |
| `noWrap` | boolean | `false` | Prevents wrapping |

---

### `Sidebar` — one fixed, one fluid

One narrow sidebar column, one flexible content area. Use for icon+text, thumbnail+description, aside+article, or any two-column layout where one column has a known width.

```astro
<Sidebar side="left" sideWidth="16rem" contentMin="60%">
  <aside><!-- fixed width --></aside>
  <main><!-- grows to fill --></main>
</Sidebar>
```

**Props:**
| Prop | Type | Default | Notes |
|---|---|---|---|
| `side` | `left \| right` | `left` | Which child is the sidebar |
| `sideWidth` | CSS length | `20rem` | Flex-basis of the sidebar |
| `contentMin` | CSS percent | `50%` | Min-width before wrapping occurs |
| `space` | SpaceToken | `md` | Gap between the two columns |
| `noStretch` | boolean | `false` | Aligns items to start instead of stretch |

---

### `Grid` — auto-fill columns

Responsive grid that fills as many columns as fit given a min item width. No breakpoints needed — the grid reflows naturally.

```astro
<Grid minItemWidth="sm" space="lg">
  <Card />
  <Card />
  <Card />
</Grid>
```

**Props:**
| Prop | Type | Default | Notes |
|---|---|---|---|
| `minItemWidth` | `xs \| sm \| md \| lg` or CSS length | `sm` | Min column width. Presets: `xs=15rem`, `sm=20rem`, `md=25rem`, `lg=30rem` |
| `space` | SpaceToken | `lg` | Uniform gap |
| `spaceX` | SpaceToken | — | Column gap only |
| `spaceY` | SpaceToken | — | Row gap only |
| `noStretch` | boolean | `false` | Aligns items to start |

Use a custom length for precise control: `minItemWidth="18rem"`.

---

### `Switcher` — deliberate breakpoint

Switches between a single row and stacked columns at a threshold width. Unlike `Grid`, items maintain equal widths and you control the exact switching point.

```astro
<Switcher threshold="40rem" space="lg" limit={2}>
  <div>...</div>
  <div>...</div>
</Switcher>
```

**Props:**
| Prop | Type | Default | Notes |
|---|---|---|---|
| `threshold` | CSS length | `30rem` | Container width at which layout switches |
| `limit` | `2`–`6` | — | Max items before forcing stack |
| `space` | SpaceToken | — | Gap |
| `align` | alignment | — | Cross-axis |
| `justify` | justify | — | Main-axis |

Use `Switcher` over `Grid` when: items must stay equal-width, you want exactly 2-up layouts, or you need predictable column counts.

---

### `Frame` — aspect ratio container

Ensures media or content maintains a given aspect ratio. Use for video embeds, images, maps, any fixed-ratio content.

```astro
<Frame ratio="16/9">
  <img src="..." alt="..." />
</Frame>

<!-- Portrait crop -->
<Frame ratio="3/4">
  <img src="..." alt="..." />
</Frame>
```

**Props:**
| Prop | Type | Default | Notes |
|---|---|---|---|
| `ratio` | string | `16/9` | Any valid CSS ratio, or `"mobile"` → `250/543` |
| `position` | CSS `object-position` | `center` | Focus point for cropped media |
| `fill` | boolean | `false` | Removes ratio, fills available height |
| `minHeight` | CSS length | — | Minimum height regardless of ratio |

Child elements get `object-fit: cover` and fill the frame absolutely.

---

### `Cover` — full-height hero

Creates a vertically centered layout that fills a minimum height. Use for hero sections, full-screen landing panels, splash screens.

```astro
<Cover minHeight="100svh">
  <slot name="top"><!-- optional pinned top --></slot>
  <div><!-- vertically centered main content --></div>
  <slot name="bottom"><!-- optional pinned bottom --></slot>
</Cover>
```

**Props:**
| Prop | Type | Default | Notes |
|---|---|---|---|
| `minHeight` | CSS length | `100vh` | Minimum height of the cover |
| `space` | SpaceToken | `lg` | Gap between top, center, and bottom zones |

The default slot content is vertically centered via `margin-block: auto`.

---

### `Center` — both-axes centering

Centers content both horizontally and vertically. Use for loading states, empty states, icon-only containers, or any case where you need something truly centered.

```astro
<Center minHeight="20rem">
  <Spinner />
</Center>
```

**Props:**
| Prop | Type | Default | Notes |
|---|---|---|---|
| `minHeight` | CSS length | `100%` | Minimum height |
| `intrinsic` | boolean | `false` | Shrink-wraps to content width with `fit-content` + `margin-inline: auto` |
| `align` | alignment | `center` | Cross-axis alignment |
| `justify` | justify | `center` | Main-axis distribution |

---

### `Reel` — horizontal scroll

A horizontally scrolling container with CSS scroll snap. Use for carousels, image galleries, tab bars, or any list that should scroll rather than wrap.

```astro
<Reel space="md" snap="start">
  <Card />
  <Card />
  <Card />
</Reel>
```

**Props:**
| Prop | Type | Default | Notes |
|---|---|---|---|
| `space` | SpaceToken | — | Gap between items |
| `snap` | `start \| center \| end` | `start` | Scroll snap alignment |
| `align` | boolean | `true` | Whether items align to height |
| `pb` | SpaceToken | — | Padding-bottom (for scrollbar clearance) |

---

### `Imposter` — overlay overlay

Absolutely positions content in the center of its nearest positioned ancestor. Use for tooltips, modals, overlays, badges.

```astro
<div style="position: relative;">
  <img src="..." />
  <Imposter>
    <Badge>New</Badge>
  </Imposter>
</div>
```

**Props:**
| Prop | Type | Default | Notes |
|---|---|---|---|
| `breakout` | boolean | `false` | Uses `position: fixed` + `z-index: 50` — for global overlays like modals |
| `margin` | SpaceToken | `0` | Minimum gap from container edges |

---

### `Container` — width constraint

Constrains content width and adds responsive inline padding. Always wrap page-level content in a `Container` inside a `Section`.

```astro
<Container size="default">
  ...
</Container>

<!-- Full-bleed 12-column grid -->
<Container bleed>
  <div class="full-bleed"><!-- edge to edge --></div>
  <div><!-- in content columns --></div>
</Container>
```

**Props:**
| Prop | Type | Default | Notes |
|---|---|---|---|
| `size` | `default \| narrow \| prose \| wide \| full` | `default` | Max-width. `default=110rem`, `narrow=45ch`, `prose=70ch`, `wide=80rem`, `full=100%` |
| `bleed` | `boolean \| 6 \| 12` | `false` | Activates the 12- or 6-column full-bleed grid |

When `bleed` is active, use `.full-bleed` or `[data-full-bleed]` to span edge-to-edge, `.popout` to bleed one column each side.

---

### `Section` — page section wrapper

Adds block padding and optional color scheme. Always the outermost wrapper for a page section. Never add padding to `Container` — put it on `Section`.

```astro
<Section padding="lg" colorScheme="dark">
  <Container>
    ...
  </Container>
</Section>

<!-- Asymmetric padding -->
<Section pt="xl" pb="none">
  ...
</Section>
```

**Props:**
| Prop | Type | Default | Notes |
|---|---|---|---|
| `as` | `section \| div \| header \| footer \| main` | `section` | Semantic element |
| `colorScheme` | `light \| dark` | — | Sets `data-color-scheme` for CSS token switching |
| `padding` | `none \| sm \| md \| lg \| xl \| 2xl` | — | Block padding both sides |
| `pt` | same scale | — | Top padding only; overrides `padding` |
| `pb` | same scale | — | Bottom padding only; overrides `padding` |

---

### `Icon` — inline SVG wrapper

Wraps an SVG to ensure consistent sizing, alignment, and color inheritance. Always use this for icons — never render raw SVGs inline.

```astro
<Icon size="lg" label="Close">
  <svg ...>...</svg>
</Icon>
```

**Props:**
| Prop | Type | Default | Notes |
|---|---|---|---|
| `size` | `sm \| md \| lg \| xl \| inline` or CSS length | `md` | `sm=0.75em`, `md=1em`, `lg=1.25em`, `xl=1.5em`, `inline=1.2ex` |
| `label` | string | — | Accessible label. Omit for decorative icons (auto `aria-hidden`) |

---

## Design Tokens

**Never write raw values in styles.** Always use a token. If a token doesn't exist for something, leave a `/* TODO */` comment rather than hardcoding a value — the user will fill it in.

### Space Scale

All `space` props on layout primitives accept a `SpaceToken`. The same tokens are available as CSS custom properties and as UnoCSS spacing utilities.

| Token | Approx. fluid range |
|---|---|
| `4xs` | 2–4px |
| `3xs` | 4–6px |
| `2xs` | 6–8px |
| `xs` | 8–12px |
| `sm` | 12–16px |
| `md` | 16–24px |
| `lg` | 24–32px |
| `xl` | 32–48px |
| `2xl` | 48–64px |
| `3xl` | 64–96px |
| `4xl` | 96–128px |
| `5xl` | 128–192px |
| `6xl` | 192–256px |

In CSS: `var(--space-md)`, `var(--space-xl)`, etc.  
In UnoCSS: `m-md`, `px-xl`, `gap-lg`, etc.

**Common choices:** `xs`–`sm` for tight density (form fields, badges), `md`–`lg` for component internals, `xl`–`2xl` for section-level breathing room.

---

### Font Size Scale

All font sizes are fluid. Reference as `var(--font-size-{n})` in CSS, or `text-{n}` in UnoCSS.

| Token | Approx. fluid range |
|---|---|
| `-2` | 11–12px |
| `-1` | 14–16px |
| `0` | 16–18px (body default) |
| `1` | 18–24px |
| `2` | 20–32px |
| `3` | 24–36px |
| `4` | 28–48px |
| `5` | 32–64px |

In CSS: `var(--font-size-0)`, `var(--font-size-3)`, `var(--font-size--1)` (note double dash for negatives).  
In UnoCSS: `text-0`, `text-3`, `text--1`.

The `Heading` component accepts a `size` prop using the same scale (`size="3"`, `size="5"`, etc.).

---

### Typography Tokens

**Font families:**
- `var(--font-family-body)` — Archivo Variable (body text)
- `var(--font-family-heading)` — Archivo Variable (headings)
- `var(--font-family-heading-alt)` — Anton (display/impact headings)
- `var(--font-family-alt)` — Alex Brush (decorative/script)

**Font weights:**
- `var(--font-weight-thin)` — 100
- `var(--font-weight-light)` — 300
- `var(--font-weight-normal)` — 400
- `var(--font-weight-medium)` — 500
- `var(--font-weight-semibold)` — 600
- `var(--font-weight-bold)` — 800
- `var(--font-weight-black)` — 900

**Letter spacing:**
- `var(--letter-spacing-tight)` — −0.05em
- `var(--letter-spacing-normal)` — 0
- `var(--letter-spacing-loose)` — 0.05em
- `var(--letter-spacing-looser)` — 0.17em (use for uppercase labels)

**Line height:**
- `var(--line-height-tighter)` — 0.75
- `var(--line-height-tight)` — 1
- `var(--line-height-snug)` — 1.33 (headings)
- `var(--line-height)` — 1.5 (body default)
- `var(--line-height-loose)` — 1.75

**Measure (max-width for text):**
- `var(--measure)` — 65ch (default body)
- `var(--measure-xl)` — 100ch
- `var(--measure-lg)` — 75ch
- `var(--measure-md)` — 50ch
- `var(--measure-sm)` — 45ch
- `var(--measure-xs)` — 30ch

---

### Color Tokens

Always use semantic tokens. Never reference raw hex or primitive color values.

**Semantic surface/text:**
- `var(--color-bg)` — page background
- `var(--color-bg-alt)` — subtle surface
- `var(--color-foreground)` — primary text
- `var(--color-foreground-secondary)` — muted text
- `var(--color-accent)` — brand red, interactive highlight
- `var(--color-on-accent)` — text on accent background

**Borders:**
- `var(--color-border)` — default border
- `var(--color-border-strong)` — prominent border

**Neutrals (use cautiously — prefer semantic tokens):**
`--color-neutral-50` through `--color-neutral-950` and `--color-white`, `--color-black`.

Color scheme switching (`light`/`dark`) is handled by `<Section colorScheme="dark">`. Semantic tokens update automatically — do not hard-code colors per theme.

---

## Composition Patterns

### Page section (standard)
```astro
<Section padding="lg">
  <Container>
    <Stack space="xl">
      <Heading>Title</Heading>
      <p>Intro</p>
    </Stack>
  </Container>
</Section>
```

### Two-column with sidebar
```astro
<Section padding="lg">
  <Container>
    <Sidebar sideWidth="300px" contentMin="60%">
      <aside>
        <Stack space="md">...</Stack>
      </aside>
      <main>
        <Stack space="lg">...</Stack>
      </main>
    </Sidebar>
  </Container>
</Section>
```

### Card grid
```astro
<Section padding="xl">
  <Container>
    <Stack space="xl">
      <Heading>Our Work</Heading>
      <Grid minItemWidth="md" space="lg">
        <Card />
        <Card />
        <Card />
      </Grid>
    </Stack>
  </Container>
</Section>
```

### Hero with full-height cover
```astro
<Section padding="none">
  <Container size="full">
    <Cover minHeight="100svh">
      <Stack space="lg" align="center" text="center">
        <Heading as="h1" size="5">Headline</Heading>
        <p>Subtext</p>
        <Cluster justify="center">
          <Button>Primary</Button>
          <Button variant="ghost">Secondary</Button>
        </Cluster>
      </Stack>
    </Cover>
  </Container>
</Section>
```

### Split layout switching to stack
```astro
<Switcher threshold="45rem" space="xl" limit={2}>
  <div>
    <Stack space="md">
      <Heading>Left</Heading>
      <p>...</p>
    </Stack>
  </div>
  <div>
    <Frame ratio="4/3">
      <img src="..." alt="..." />
    </Frame>
  </div>
</Switcher>
```

---

## UnoCSS Responsive Utilities

UnoCSS is available for **responsive one-offs** — cases where a layout primitive doesn't expose the exact prop needed at a specific breakpoint.

The breakpoint system is **desktop-first max-width**:

| Prefix | Max-width |
|---|---|
| `2xl:` | 1920px |
| `xl:` | 1640px |
| `lg:` | 1280px |
| `md:` | 1024px |
| `sm:` | 768px |
| `xs:` | 520px |
| `2xs:` | 420px |

Apply responsive classes directly on elements in Astro templates:

```astro
<div class="flex sm:flex-col">...</div>
<p class="text-center sm:text-left">...</p>
<img class="w-full md:w-auto">
```

**Available utility categories:**

- **Display:** `hidden`, `block`, `flex`, `grid`
- **Flex:** `flex-row`, `flex-col`, `flex-wrap`, `flex-nowrap`, `flex-1`, `flex-auto`, `grow`, `shrink-0`
- **Align/Justify:** `align-center`, `align-start`, `justify-between`, `justify-center`, etc.
- **Spacing (scale tokens):** `m-md`, `mt-lg`, `px-xl`, `py-0`, `gap-sm` — uses the same space token scale
- **Sizing:** `w-full`, `h-full`, `w-screen`, `h-screen`, `max-w-measure`, `max-w-full`
- **Typography:** `text-left`, `text-center`, `text-right`, `text-0`, `text--1`, `text-3` (font size scale)
- **Position:** `relative`, `absolute`, `sticky`, `fixed`, `top-0`, `inset-0`, `z-10`
- **Overflow:** `overflow-hidden`, `overflow-x-auto`, `truncate`
- **Margin auto:** `mx-auto`, `mt-auto`, `mb-auto`

**Prefer layout primitives first.** Reach for UnoCSS utilities when you need a breakpoint-specific override that a primitive prop doesn't cover.

---

## Reset Guarantees

A global reset is already in place. **Do not re-apply any of the following** — they are redundant and add noise:

- `margin: 0` / `padding: 0` — all elements reset via `* { margin: 0 }`
- `list-style: none` + `padding: 0` on `ul`/`ol` — already reset globally
- `text-decoration: none` on `a` — already reset; `a` inherits `color: currentColor`
- `background: none; border: none` on `button` — already reset
- `box-sizing: border-box` — already applied to `*`
- `display: block; max-width: 100%; height: auto` on `img`/`video`/`svg` — already reset
- `font: inherit` on `input`/`button`/`textarea` — already reset
- `-webkit-font-smoothing: antialiased` on `body` — already set

Only write styles that are genuinely additive or component-specific.

---

## Rules

1. **Never write raw CSS values.** No `px` numbers, no hex colours, no `font-size: 14px`. Always use a token from the scales above.
2. **Never use raw `<div style="...">` or write layout CSS in a page.** Use a primitive.
3. **`Section` wraps, `Container` constrains.** Never add padding to `Container`.
4. **Pick semantic `as` values** — prefer `<Stack as="ul">` over wrapping a `Stack` in a `ul`.
5. **Avoid nesting two `Container`s.** One per section.
6. **Reach for UnoCSS only after checking primitives.** If a primitive gets you 80% there, use it. UnoCSS covers the gap.
7. **Get it 90% there, then stop.** Establish the layout structure, apply the right tokens, and leave fine-tuning (micro-spacing, hover states, animation curves) for the user.

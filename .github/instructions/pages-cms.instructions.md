---
applyTo: "**"
description: "Use when configuring Pages CMS (.pages.yml) or discussing CMS editing for this Astro project."
---

# Pages CMS Configuration

Pages CMS uses a single `.pages.yml` file at the repo root. It has not been created yet.

## Project content paths

| Content | Path | Format |
|---|---|---|
| Blog collection | `src/content/blog/` | `yaml-frontmatter` |
| Homepage file | `src/content/pages/homepage.md` | `yaml-frontmatter` |
| Media | `public/assets/` → `/assets` |  |

## Blog frontmatter fields (from `src/content/config.ts`)

`title` (string), `description` (string), `pubDatetime` (date), `modDatetime` (date, optional),
`featured` (boolean, optional), `draft` (boolean, optional), `tags` (string[], default `["others"]`),
`ogImage` (image or string, optional), `canonicalURL` (string, optional)

## Recommended `.pages.yml`

```yaml
media:
  input: public/assets
  output: /assets

content:
  - name: blog
    label: Blog
    type: collection
    path: src/content/blog
    format: yaml-frontmatter
    filename: "{year}-{month}-{day}-{primary}.md"
    view:
      primary: title
      sort: pubDatetime
      order: desc
    fields:
      - { name: title, type: string }
      - { name: description, type: text }
      - { name: pubDatetime, type: date }
      - { name: modDatetime, type: date }
      - { name: draft, type: boolean }
      - { name: featured, type: boolean }
      - { name: tags, type: select, options: { multiple: true, values: [] } }
      - { name: canonicalURL, type: string }
      - { name: body, type: rich-text }

  - name: homepage
    label: Homepage
    type: file
    path: src/content/pages/homepage.md
    format: yaml-frontmatter
    fields:
      - { name: title, type: string }
      - { name: description, type: text }
```

## Key concepts

- `type: collection` — folder of files sharing a schema; editors can create/edit/delete entries
- `type: file` — single file editor
- `type: group` — sidebar nav grouping only; no editor route
- `format: yaml-frontmatter` — Markdown file with YAML frontmatter (standard for Astro)
- `filename` tokens: `{year}`, `{month}`, `{day}`, `{primary}` (value of first field), `{random}`
- `view.primary` — which field is shown as the list title
- `settings.content.merge: true` — preserve unknown frontmatter keys on save
- Field types: `string`, `text`, `rich-text`, `boolean`, `date`, `number`, `image`, `file`, `select`, `object`, `block`, `reference`, `uuid`

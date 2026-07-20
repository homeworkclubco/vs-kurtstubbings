// packages/ui/uno.config.ts
import { defineConfig, definePreset } from 'unocss'

// ==========================================
// CONFIG SETUP
// ==========================================

// Define your ordered scales
const spaceSteps = [
  '4xs',
  '3xs',
  '2xs',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
  '6xl',
]
const fontSteps = [-2, -1, 0, 1, 2, 3, 4, 5, 'heading-lg', 'heading-xl', 'subheading-lg']

// ==========================================
// END CONFIG SETUP
// ==========================================

const spacingScale = createFluidScale('space', spaceSteps)
const fontSizeScale = createFluidScale('font-size', fontSteps)

interface DataAttributeUtility {
  attribute: string
  property: string
  scale: Record<string, string>
  allowZero?: boolean
}

interface DataAttributeLiteralEntry {
  value?: string
  declarations: Record<string, string>
}

interface DataAttributeLiteralUtility {
  attribute: string
  entries: DataAttributeLiteralEntry[]
}

const dataAttributeUtilities: DataAttributeUtility[] = [
  {
    attribute: 'data-gap',
    property: 'gap',
    scale: spacingScale,
    allowZero: true,
  },
  {
    attribute: 'data-gap-x',
    property: 'column-gap',
    scale: spacingScale,
    allowZero: true,
  },
  {
    attribute: 'data-gap-y',
    property: 'row-gap',
    scale: spacingScale,
    allowZero: true,
  },
  {
    attribute: 'data-font-size',
    property: 'font-size',
    scale: fontSizeScale,
  },
  {
    attribute: 'data-margin',
    property: '--_margin',
    scale: spacingScale,
    allowZero: true,
  },
  {
    attribute: 'data-mt',
    property: 'margin-block-start',
    scale: spacingScale,
    allowZero: true,
  },
  {
    attribute: 'data-mb',
    property: 'margin-block-end',
    scale: spacingScale,
    allowZero: true,
  },
  {
    attribute: 'data-pt',
    property: 'padding-block-start',
    scale: spacingScale,
    allowZero: true,
  },
  {
    attribute: 'data-pb',
    property: 'padding-block-end',
    scale: spacingScale,
    allowZero: true,
  },
]

const dataAttributeLiteralUtilities: DataAttributeLiteralUtility[] = [
  {
    attribute: 'data-align',
    entries: [
      { value: 'start', declarations: { 'align-items': 'flex-start' } },
      { value: 'center', declarations: { 'align-items': 'center' } },
      { value: 'end', declarations: { 'align-items': 'flex-end' } },
      { value: 'stretch', declarations: { 'align-items': 'stretch' } },
    ],
  },
  {
    attribute: 'data-no-stretch',
    entries: [{ declarations: { 'align-items': 'flex-start' } }],
  },
  {
    attribute: 'data-justify',
    entries: [
      { value: 'center', declarations: { 'justify-content': 'center' } },
      { value: 'start', declarations: { 'justify-content': 'flex-start' } },
      { value: 'end', declarations: { 'justify-content': 'flex-end' } },
      { value: 'between', declarations: { 'justify-content': 'space-between' } },
      { value: 'around', declarations: { 'justify-content': 'space-around' } },
    ],
  },
  {
    attribute: 'data-text',
    entries: [
      { value: 'left', declarations: { 'text-align': 'left' } },
      { value: 'center', declarations: { 'text-align': 'center' } },
      { value: 'right', declarations: { 'text-align': 'right' } },
    ],
  },
]

const dataAttributeScalePreflights = dataAttributeUtilities.map(
  ({ attribute, property, scale, allowZero }) => ({
    layer: 'props',
    getCSS: () =>
      [
        ...Object.entries(scale).map(
          ([token, cssVar]) => `:where([${attribute}="${token}"]) { ${property}: ${cssVar}; }`,
        ),
        ...(allowZero ? [`:where([${attribute}="0"]) { ${property}: 0; }`] : []),
      ].join('\n'),
  }),
)

const dataAttributeLiteralPreflights = dataAttributeLiteralUtilities.map(
  ({ attribute, entries }) => ({
    layer: 'props',
    getCSS: () =>
      entries
        .map(({ value, declarations }) => {
          const selector =
            value === undefined ? `:where([${attribute}])` : `:where([${attribute}="${value}"])`
          const body = Object.entries(declarations)
            .map(([prop, val]) => `${prop}: ${val};`)
            .join(' ')
          return `${selector} { ${body} }`
        })
        .join('\n'),
  }),
)

const dataAttributePreflights = [...dataAttributeScalePreflights, ...dataAttributeLiteralPreflights]

const displayRules = [
  ['hidden', { display: 'none' }],
  ['block', { display: 'block' }],
  ['flex', { display: 'flex' }],
  ['grid', { display: 'grid' }],
]

const flexAlignmentRules = [
  // Align Items (Cross Axis)
  [
    /^align-(start|center|end|stretch|baseline)$/,
    ([, val]) => ({ 'align-items': val === 'start' || val === 'end' ? `flex-${val}` : val }),
  ],
  // Justify Content (Main Axis)
  [
    /^justify-(start|center|end|between|around|evenly)$/,
    ([, val]) => ({
      'justify-content':
        val === 'start' || val === 'end'
          ? `flex-${val}`
          : val === 'between'
            ? 'space-between'
            : val === 'around'
              ? 'space-around'
              : 'space-evenly',
    }),
  ],
]

const flexBehaviorRules = [
  ['flex-1', { flex: '1 1 0%' }],
  ['flex-auto', { flex: '1 1 auto' }],
  ['flex-initial', { flex: '0 1 auto' }],
  ['flex-none', { flex: 'none' }],
  ['grow', { 'flex-grow': '1' }],
  ['shrink', { 'flex-shrink': '1' }],
  ['shrink-0', { 'flex-shrink': '0' }],
]

const flexDirectionRules = [
  [
    /^flex-(row|col)(-reverse)?$/,
    ([, dir, rev]) => ({
      'flex-direction': rev ? `${dir}${rev}` : dir === 'col' ? 'column' : 'row',
    }),
  ],
  ['flex-wrap', { 'flex-wrap': 'wrap' }],
  ['flex-nowrap', { 'flex-wrap': 'nowrap' }],
]

const typographyRules = [
  // Matches: text-2, text--1, text-base
  [
    /^text-(-?.+)$/,
    ([, size], { theme }) => {
      // Check if the size exists in your theme
      const value = theme.fontSize?.[size]
      if (value) return { 'font-size': value }
    },
  ],
  // Keep your existing text alignment rule here
  [/^text-(left|center|right)$/, ([, val]) => ({ 'text-align': val })],
]

const sizingRules = [
  ['w-full', { width: '100%' }],
  ['w-screen', { width: '100vw' }],
  ['h-full', { height: '100%' }],
  ['h-screen', { height: '100vh' }],
  ['max-w-full', { 'max-width': '100%' }],
  ['max-h-full', { 'max-height': '100%' }],
  ['max-w-measure', { 'max-width': 'var(--measure)' }],
  ['max-w-measure-xl', { 'max-width': 'var(--measure-xl)' }],
  ['max-w-measure-lg', { 'max-width': 'var(--measure-lg)' }],
]

const overflowRules = [
  // Basic overflow
  ['overflow-hidden', { overflow: 'hidden' }],
  ['overflow-visible', { overflow: 'visible' }],
  ['overflow-scroll', { overflow: 'scroll' }],
  ['overflow-auto', { overflow: 'auto' }],

  // Axis-specific overflow
  ['overflow-x-hidden', { 'overflow-x': 'hidden' }],
  ['overflow-x-visible', { 'overflow-x': 'visible' }],
  ['overflow-x-scroll', { 'overflow-x': 'scroll' }],
  ['overflow-x-auto', { 'overflow-x': 'auto' }],

  ['overflow-y-hidden', { 'overflow-y': 'hidden' }],
  ['overflow-y-visible', { 'overflow-y': 'visible' }],
  ['overflow-y-scroll', { 'overflow-y': 'scroll' }],
  ['overflow-y-auto', { 'overflow-y': 'auto' }],

  // Text overflow
  ['text-ellipsis', { 'text-overflow': 'ellipsis' }],
  ['text-clip', { 'text-overflow': 'clip' }],

  // Common combinations
  [
    'truncate',
    {
      overflow: 'hidden',
      'text-overflow': 'ellipsis',
      'white-space': 'nowrap',
    },
  ],
]

const positionRules = [
  ['relative', { position: 'relative' }],
  ['absolute', { position: 'absolute' }],
  ['fixed', { position: 'fixed' }],
  ['sticky', { position: 'sticky' }],
]

const positionCoordinatesRules = [
  // Matches: top-0, left-0, inset-0
  [/^(top|bottom|left|right|inset)-0$/, ([, dir]) => ({ [dir]: '0' })],
  // Matches: z-10, z-50
  [/^z-(\d+)$/, ([, val]) => ({ 'z-index': val })],
]

const textAlignmentRules = [[/^text-(left|center|right)$/, ([, val]) => ({ 'text-align': val })]]

const marginRules = [
  // Handle m-auto, mt-auto, mb-auto, ml-auto, mr-auto, mx-auto, my-auto
  [
    /^m([tbrlxy])?-auto$/,
    ([, direction]: [string, string | undefined]) => {
      const propMap: Record<string, string> = {
        t: 'margin-block-start',
        b: 'margin-block-end',
        l: 'margin-inline-start',
        r: 'margin-inline-end',
        x: 'margin-inline',
        y: 'margin-block',
        undefined: 'margin',
      }

      return { [propMap[direction || 'undefined']]: 'auto' }
    },
  ],
  // Handle m-0, mt-0, mb-0, ml-0, mr-0, mx-0, my-0
  [
    /^m([tbrlxy])?-0$/,
    ([, direction]: [string, string | undefined]) => {
      const propMap: Record<string, string> = {
        t: 'margin-block-start',
        b: 'margin-block-end',
        l: 'margin-inline-start',
        r: 'margin-inline-end',
        x: 'margin-inline',
        y: 'margin-block',
        undefined: 'margin',
      }

      return { [propMap[direction || 'undefined']]: '0' }
    },
  ],
  // Handle theme-based margin values
  [
    /^m([tbrlxy])?-(.+)$/,
    ([, direction, size], { theme }) => {
      const value = theme.spacing?.[size]
      if (!value) return undefined

      const propMap: Record<string, string> = {
        t: 'margin-block-start',
        b: 'margin-block-end',
        l: 'margin-inline-start',
        r: 'margin-inline-end',
        x: 'margin-inline',
        y: 'margin-block',
        undefined: 'margin',
      }

      return { [propMap[direction || 'undefined']]: value }
    },
  ],
]

const paddingRules = [
  // Handle p-auto, pt-auto, pb-auto, pl-auto, pr-auto, px-auto, py-auto
  [
    /^p([tbrlxy])?-auto$/,
    ([, direction]: [string, string | undefined]) => {
      const propMap: Record<string, string> = {
        t: 'padding-block-start',
        b: 'padding-block-end',
        l: 'padding-inline-start',
        r: 'padding-inline-end',
        x: 'padding-inline',
        y: 'padding-block',
        undefined: 'padding',
      }

      return { [propMap[direction || 'undefined']]: 'auto' }
    },
  ],
  // Handle p-0, pt-0, pb-0, pl-0, pr-0, px-0, py-0
  [
    /^p([tbrlxy])?-0$/,
    ([, direction]: [string, string | undefined]) => {
      const propMap: Record<string, string> = {
        t: 'padding-block-start',
        b: 'padding-block-end',
        l: 'padding-inline-start',
        r: 'padding-inline-end',
        x: 'padding-inline',
        y: 'padding-block',
        undefined: 'padding',
      }

      return { [propMap[direction || 'undefined']]: '0' }
    },
  ],
  // Handle theme-based padding values
  [
    /^p([tbrlxy])?-(.+)$/,
    ([, direction, size], { theme }) => {
      const value = theme.spacing?.[size]
      if (!value) return undefined

      const propMap: Record<string, string> = {
        t: 'padding-block-start',
        b: 'padding-block-end',
        l: 'padding-inline-start',
        r: 'padding-inline-end',
        x: 'padding-inline',
        y: 'padding-block',
        undefined: 'padding',
      }

      return { [propMap[direction || 'undefined']]: value }
    },
  ],
]

const gapRules = [
  // Handle gap-0, gap-x-0, gap-y-0
  [
    /^gap-([xy]-)?0$/,
    ([, direction]: [string, string | undefined]) => {
      if (direction === 'x-') return { 'column-gap': '0' }
      if (direction === 'y-') return { 'row-gap': '0' }
      return { gap: '0' }
    },
  ],
  // Handle theme-based gap values
  [
    /^gap-([xy]-)?(.+)$/,
    ([, direction, size], { theme }) => {
      const value = theme.spacing?.[size]
      if (!value) return undefined

      if (direction === 'x-') return { 'column-gap': value }
      if (direction === 'y-') return { 'row-gap': value }
      return { gap: value }
    },
  ],
]

export const starterPreset = definePreset({
  name: 'starter',
  presets: [],
  theme: {
    breakpoints: {
      '2xl': '1920px',
      xl: '1640px',
      lg: '1280px',
      md: '1024px',
      sm: '768px',
      xs: '520px',
      '2xs': '420px',
    },
    spacing: spacingScale,
    fontSize: fontSizeScale,
  },
  rules: [
    ...displayRules,
    ...flexAlignmentRules,
    ...flexBehaviorRules,
    ...flexDirectionRules,
    ...sizingRules,
    ...overflowRules,
    ...positionRules,
    ...positionCoordinatesRules,
    ...typographyRules,
    ...marginRules,
    ...paddingRules,
    ...gapRules,
  ] as any[],
  variants: [
    // 2. The Custom Variant Function
    // This intercepts "md:", "lg:", etc. and converts them to max-width queries
    (matcher, { theme }) => {
      // Regex to catch prefix like "md:" or "lg:"
      // matches[1] = breakpoint name (e.g. "md")
      // matches[2] = the rest of the class (e.g. "text-center")
      const match = matcher.match(/^([a-z]+):(.*)$/)

      if (!match) return matcher

      const [, prefix, rest] = match
      const breakpoint = (theme.breakpoints as Record<string, string>)?.[prefix]

      // If the prefix matches a breakpoint (e.g. "md"), wrap it in max-width
      if (breakpoint) {
        return {
          matcher: rest, // The class without the prefix
          parent: `@media (max-width: ${breakpoint})`, // The Desktop-First logic
        }
      }

      return matcher
    },
  ],
  preflights: dataAttributePreflights,
  layer: 'utilities',
  // You can even include your global shortcuts here
  // shortcuts: {
  // "flex-center": "flex justify-center items-center",
  // },
})

/**
 * Generates a UnoCSS/Tailwind config object containing base values and fluid pairs.
 * * @param prefix - The CSS variable prefix (e.g., 'space', 'font-size')
 * @param steps - An ordered array of steps (e.g., ['xs', 'sm', 'md'] or [-2, -1, 0])
 */
export function createFluidScale(prefix: string, steps: (string | number)[]) {
  const scale: Record<string, string> = {}

  steps.forEach((step, i) => {
    // 1. Generate the Base Value
    // e.g. "sm": "var(--space-sm)"
    scale[String(step)] = `var(--${prefix}-${step})`

    // 2. Generate Cross Pairs (Forward only)
    // We start at i + 1 to ensure we only get 'sm-md', never 'md-sm' or 'sm-sm'
    for (let j = i + 1; j < steps.length; j++) {
      const nextStep = steps[j]

      // key: "sm-md"
      const key = `${step}-${nextStep}`

      // value: "var(--space-sm-md)"
      scale[key] = `var(--${prefix}-${key})`
    }
  })

  return scale
}


export default defineConfig({
  presets: [starterPreset],
})
  
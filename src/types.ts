/* --------------------------------------------
Spacing
-------------------------------------------- */

export type SpaceStep =
  | '0'
  | '4xs'
  | '3xs'
  | '2xs'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'

export type SpacePair = `${SpaceStep}-${SpaceStep}`

export type SpaceToken = SpaceStep | SpacePair

/* --------------------------------------------
Typography
-------------------------------------------- */

export type FontSizeStep = '-2' | '-1' | '0' | '1' | '2' | '3' | '4' | '5' | 'heading-lg' | 'heading-xl' | 'subheading-lg'

export type FontSizePair = `${FontSizeStep}-${FontSizeStep}`

export type FontSizeToken = FontSizeStep | FontSizePair

import type { ComponentPropsWithoutRef } from 'react'
import type { Tone } from '@p/headless/types'

type LegendDotProps = ComponentPropsWithoutRef<'span'> & {
  variant?: Tone
  /** Legacy alias. Prefer variant. */
  tone?: Tone
}

export function LegendDot({ variant, tone, ...rest }: LegendDotProps) {
  return <span data-part="legend-dot" data-variant={variant ?? tone ?? 'default'} {...rest} />
}

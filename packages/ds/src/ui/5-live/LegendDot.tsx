import type { ComponentPropsWithoutRef } from 'react'
import type { Tone } from '@p/headless/types'

type LegendDotProps = ComponentPropsWithoutRef<'span'> & {
  variant?: Tone
}

export function LegendDot({ tone = 'neutral', ...rest }: LegendDotProps) {
  return <span data-part="legend-dot" data-variant={tone} {...rest} />
}

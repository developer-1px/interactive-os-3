import type { ComponentPropsWithoutRef } from 'react'
import type { Tone } from '../../headless/types'

type LegendDotProps = ComponentPropsWithoutRef<'span'> & {
  tone?: Tone
}

export function LegendDot({ tone = 'neutral', ...rest }: LegendDotProps) {
  return <span data-part="legend-dot" data-tone={tone} {...rest} />
}

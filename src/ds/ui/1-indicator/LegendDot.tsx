import type { ComponentPropsWithoutRef } from 'react'
import type { Tone } from '../../core/types'

type LegendDotProps = ComponentPropsWithoutRef<'span'> & {
  tone?: Tone
}

export function LegendDot({ tone = 'neutral', ...rest }: LegendDotProps) {
  return <span className="legend-dot" data-tone={tone} {...rest} />
}

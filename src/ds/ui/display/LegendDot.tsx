import type { ComponentPropsWithoutRef } from 'react'
import type { BadgeTone } from './Badge'

/**
 * LegendDot — 차트/테이블 범례의 색점. Badge의 축약 형태 — 색 + 라벨 text.
 */
type LegendDotProps = ComponentPropsWithoutRef<'span'> & {
  tone?: BadgeTone
}

export function LegendDot({ tone = 'neutral', ...rest }: LegendDotProps) {
  return <span data-ds="LegendDot" data-tone={tone} {...rest} />
}

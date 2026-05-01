import type { ComponentPropsWithoutRef } from 'react'
import type { Tone } from '@p/headless/types'

export type BadgeTone = Tone | 'neutral'

type BadgeProps = ComponentPropsWithoutRef<'mark'> & {
  variant?: BadgeTone
  /** Legacy alias. Prefer variant. */
  tone?: BadgeTone
}

const toneAttr = (tone: BadgeTone | undefined) => tone === 'neutral' ? 'default' : tone

export function Badge({ variant, tone, ...rest }: BadgeProps) {
  return <mark data-variant={toneAttr(variant ?? tone ?? 'default')} {...rest} />
}

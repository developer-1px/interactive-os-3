import type { ComponentPropsWithoutRef } from 'react'
import type { Tone } from '../../headless/types'

export type BadgeTone = Tone

type BadgeProps = ComponentPropsWithoutRef<'mark'> & {
  variant?: Tone
}

export function Badge({ tone = 'neutral', ...rest }: BadgeProps) {
  return <mark data-variant={tone} {...rest} />
}

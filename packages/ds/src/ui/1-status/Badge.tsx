import type { ComponentPropsWithoutRef } from 'react'
import type { Tone } from '../../core/types'

export type BadgeTone = Tone

type BadgeProps = ComponentPropsWithoutRef<'mark'> & {
  tone?: Tone
}

export function Badge({ tone = 'neutral', ...rest }: BadgeProps) {
  return <mark data-tone={tone} {...rest} />
}

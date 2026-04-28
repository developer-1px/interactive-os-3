import type { ComponentPropsWithoutRef } from 'react'
import type { Tone } from '../../headless/types'

type SpinnerProps = Omit<ComponentPropsWithoutRef<'span'>, 'children'> & {
  tone?: Tone
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

export function Spinner({ tone = 'neutral', size = 'md', label = 'Loading', ...rest }: SpinnerProps) {
  return (
    <span data-part="spinner" data-tone={tone} data-size={size} role="status" aria-live="polite" aria-label={label} {...rest} />
  )
}

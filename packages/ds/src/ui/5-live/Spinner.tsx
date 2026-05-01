import type { ComponentPropsWithoutRef } from 'react'
import type { Tone } from '@p/headless/types'

type SpinnerProps = Omit<ComponentPropsWithoutRef<'span'>, 'children'> & {
  variant?: Tone
  /** Legacy alias. Prefer variant. */
  tone?: Tone
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

export function Spinner({ variant, tone, size = 'md', label = 'Loading', ...rest }: SpinnerProps) {
  return (
    <span data-part="spinner" data-variant={variant ?? tone ?? 'default'} data-size={size} role="status" aria-live="polite" aria-label={label} {...rest} />
  )
}

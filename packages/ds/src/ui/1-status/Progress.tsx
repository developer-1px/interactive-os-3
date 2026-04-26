import type { ComponentPropsWithoutRef } from 'react'

export function Progress(props: ComponentPropsWithoutRef<'progress'>) {
  return <progress {...props} />
}

export function Meter(props: ComponentPropsWithoutRef<'meter'>) {
  return <meter {...props} />
}

import type { ComponentPropsWithoutRef } from 'react'

type TooltipProps = Omit<ComponentPropsWithoutRef<'div'>, 'role'>

export function Tooltip(props: TooltipProps) {
  return <div role="tooltip" {...props} />
}

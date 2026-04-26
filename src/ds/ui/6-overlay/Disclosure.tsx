import type { ComponentPropsWithoutRef, ReactNode } from 'react'

// @slot children — details 내부 wrapper content (items 아님)
type DisclosureProps = ComponentPropsWithoutRef<'details'> & {
  summary: ReactNode
  children: ReactNode
}

export function Disclosure({ summary, children, ...rest }: DisclosureProps) {
  return (
    <details {...rest}>
      <summary>{summary}</summary>
      {children}
    </details>
  )
}

export function Accordion(props: ComponentPropsWithoutRef<'div'>) {
  return <div role="group" {...props} />
}

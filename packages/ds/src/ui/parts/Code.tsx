import type { ComponentPropsWithoutRef } from 'react'

type CodeProps = ComponentPropsWithoutRef<'code'>
type KbdProps = ComponentPropsWithoutRef<'kbd'>

export function Code({ children, ...rest }: CodeProps) {
  return <code {...rest}>{children}</code>
}

export function Kbd({ children, ...rest }: KbdProps) {
  return <kbd {...rest}>{children}</kbd>
}


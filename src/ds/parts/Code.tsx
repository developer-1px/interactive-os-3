import type { ComponentPropsWithoutRef } from 'react'

type CodeProps = ComponentPropsWithoutRef<'code'>
type KbdProps = ComponentPropsWithoutRef<'kbd'>

/**
 * Code — 인라인 코드 조각. <code data-part="code">.
 */
export function Code({ children, ...rest }: CodeProps) {
  return <code data-part="code" {...rest}>{children}</code>
}

/**
 * Kbd — 키보드 입력. <kbd data-part="kbd">.
 */
export function Kbd({ children, ...rest }: KbdProps) {
  return <kbd data-part="kbd" {...rest}>{children}</kbd>
}


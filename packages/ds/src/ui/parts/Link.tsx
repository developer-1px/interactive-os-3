import type { ComponentPropsWithoutRef } from 'react'

type LinkProps = ComponentPropsWithoutRef<'a'> & {
  href: string
  /** 외부 링크 — target=_blank + rel + 시각 affordance 자동. */
  external?: boolean
}

/**
 * Link — <a> + 외부 링크 affordance.
 * external이면 target/rel 자동 + data-external로 시각 표식.
 */
export function Link({ external, children, target, rel, ...rest }: LinkProps) {
  const extProps = external
    ? { target: target ?? '_blank', rel: rel ?? 'noopener noreferrer', 'data-external': '' as const }
    : { target, rel }
  return (
    <a {...extProps} {...rest}>
      {children}
    </a>
  )
}

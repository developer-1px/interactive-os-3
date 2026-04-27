import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type HeadingLevel = 'display' | 'h1' | 'h2' | 'h3' | 'body' | 'caption'

type HeadingProps = Omit<ComponentPropsWithoutRef<'h1'>, 'children'> & {
  level: HeadingLevel
  children: ReactNode
}

/**
 * Heading — 시맨틱 tag + size scale.
 * level → tag 매핑:
 *   display → <h1> (시각 가장 큼; data-level="display"로 구분)
 *   h1/h2/h3 → 동일 tag
 *   body → <p>
 *   caption → <small>
 *
 * variant 아니라 의미 토큰. 시각은 data-level이 결정.
 */
export function Heading({ level, children, ...rest }: HeadingProps) {
  const common = { 'data-part': 'heading', 'data-level': level, ...rest }
  switch (level) {
    case 'display':
    case 'h1': return <h1 {...common}>{children}</h1>
    case 'h2': return <h2 {...common}>{children}</h2>
    case 'h3': return <h3 {...common}>{children}</h3>
    case 'body': return <p {...common}>{children}</p>
    case 'caption': return <small {...common}>{children}</small>
  }
}

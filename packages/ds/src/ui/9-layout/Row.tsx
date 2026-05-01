import type { ComponentPropsWithoutRef, ReactNode } from 'react'

// @slot children — layout primitive (DOM 평탄화 wrapper)
export type Flow = 'list' | 'cluster' | 'form' | 'prose' | 'split' | 'wide'
export type Emphasis = 'flat' | 'raised' | 'sunk' | 'callout'

export type RowProps = Omit<ComponentPropsWithoutRef<'div'>, 'role'> & {
  flow?: Flow
  emphasis?: Emphasis
  variant?: Emphasis
  children?: ReactNode
}

/**
 * Horizontal flex container. 순수 시각 primitive — 의미 role을 방출하지 않는다.
 * 스타일은 [data-ds="Row"] (구조적 식별자; className/variant class가 아님).
 * 접근성 그룹이 필요하면 Aside / MenuGroup / ListboxGroup 같은 의미 역할 컴포넌트를 쓴다.
 */
export function Row({ flow, emphasis, variant, children, ...rest }: RowProps) {
  return (
    <div
      data-ds="Row"
      data-flow={flow}
      data-variant={emphasis ?? variant}
      {...rest}
    >
      {children}
    </div>
  )
}

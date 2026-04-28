import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import type { Emphasis, Flow } from './Row'

// @slot children — layout primitive (DOM 평탄화 wrapper)

export type ColumnProps = Omit<ComponentPropsWithoutRef<'div'>, 'role'> & {
  flow?: Flow
  variant?: Emphasis
  children?: ReactNode
}

/**
 * Vertical flex container. 순수 시각 primitive — 의미 role을 방출하지 않는다.
 * 스타일은 [data-ds="Column"]. 의미 그룹은 Aside / Section / MenuGroup 등을 사용.
 */
export function Column({ flow, emphasis, children, ...rest }: ColumnProps) {
  return (
    <div
      data-ds="Column"
      data-flow={flow}
      data-variant={emphasis}
      {...rest}
    >
      {children}
    </div>
  )
}

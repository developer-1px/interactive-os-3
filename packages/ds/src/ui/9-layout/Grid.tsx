import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import type { Emphasis, Flow } from './Row'

// @slot children — layout primitive (DOM 평탄화 wrapper)

export type GridCols = 1 | 2 | 3 | 4 | 6 | 9 | 12

export type GridProps = Omit<ComponentPropsWithoutRef<'div'>, 'role'> & {
  cols?: GridCols
  flow?: Flow
  variant?: Emphasis
  children?: ReactNode
}

/**
 * N-column grid container. 순수 시각 primitive — 의미 role을 방출하지 않는다.
 * 스타일은 [data-ds="Grid"][data-cols="…"]. cols는 1 | 2 | 3 | 4 | 6 | 12에서만 선택.
 */
export function Grid({ cols, flow, emphasis, children, ...rest }: GridProps) {
  return (
    <div
      data-ds="Grid"
      data-cols={cols}
      data-flow={flow}
      data-variant={emphasis}
      {...rest}
    >
      {children}
    </div>
  )
}

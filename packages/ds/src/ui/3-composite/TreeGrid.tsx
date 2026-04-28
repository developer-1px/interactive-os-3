import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { useRovingDOM } from '../../headless/roving/useRovingDOM'

/**
 * TreeGrid — APG treegrid (계층 가능). focus model = **row-focus**.
 *
 * roving tabindex는 TreeRow에만 부여 — ↑↓로 행 이동, ←→는 expand/collapse(소비자).
 * 셀 단위 focus(↑↓←→로 cell 이동, Excel형)가 필요하면 별도 컴포넌트(예: SpreadsheetGrid)
 * 로 분기. 한 컴포넌트에 prop 으로 두 모델을 넣지 않는다 — 키 매핑/tabIndex 분포/
 * aria-selected 부착 위치가 모두 다르기 때문.
 *
 * @slot children — composable (wrapper/label/subpart)
 */
type TreeGridProps = Omit<ComponentPropsWithoutRef<'table'>, 'role' | 'onKeyDown'> & {
  children: ReactNode
}

export function TreeGrid({ children, ...rest }: TreeGridProps) {
  const { onKeyDown, ref } = useRovingDOM<HTMLTableElement>(null, {
    orientation: 'vertical',
    itemSelector: '[role="row"]',
  })
  return (
    <table ref={ref} role="treegrid" onKeyDown={onKeyDown} {...rest}>
      {children}
    </table>
  )
}

import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { useRovingDOM } from '@p/headless/roving/useRovingDOM'

/**
 * DataGrid — APG grid (flat). focus model = **row-focus**.
 *
 * roving tabindex는 행에 부여 — ↑↓로 행 이동. cell-focus(Excel형)가 필요하면
 * 별도 컴포넌트로 분기. 자세한 이유는 TreeGrid 주석 참조.
 *
 * @slot children — composable (wrapper/label/subpart)
 */
type DataGridProps = Omit<ComponentPropsWithoutRef<'table'>, 'role' | 'onKeyDown'> & {
  children: ReactNode
}

export function DataGrid({ children, ...rest }: DataGridProps) {
  // DataGridRow 는 자연 tabbable 이 아니라 [role="row"][tabindex] — 기본 TABBABLE 미발견 → 명시.
  // 헤더 행(:has columnheader) 은 roving 대상에서 제외 — APG grid focus model 은 본문 행만.
  const { onKeyDown, ref } = useRovingDOM<HTMLTableElement>(null, {
    orientation: 'vertical',
    itemSelector: '[role="row"]:not([aria-disabled="true"]):not(:has(> [role="columnheader"]))',
  })
  return (
    <table ref={ref} role="grid" onKeyDown={onKeyDown} {...rest}>
      {children}
    </table>
  )
}

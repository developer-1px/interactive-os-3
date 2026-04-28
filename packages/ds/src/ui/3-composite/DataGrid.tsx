import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { useRovingDOM } from '../../headless/roving/useRovingDOM'

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
  const { onKeyDown, ref } = useRovingDOM<HTMLTableElement>(null, { orientation: 'vertical' })
  return (
    <table ref={ref} role="grid" onKeyDown={onKeyDown} {...rest}>
      {children}
    </table>
  )
}

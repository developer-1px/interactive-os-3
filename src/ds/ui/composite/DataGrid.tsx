import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { useRovingDOM } from '../../core/hooks/useRovingDOM'

// @slot children — composable (wrapper/label/subpart)
type DataGridProps = Omit<ComponentPropsWithoutRef<'table'>, 'role' | 'onKeyDown'> & {
  children: ReactNode
}

export function DataGrid({ children, ...rest }: DataGridProps) {
  const { onKeyDown, ref } = useRovingDOM<HTMLTableElement>(null, { orientation: 'both' })
  return (
    <table ref={ref} role="grid" onKeyDown={onKeyDown} {...rest}>
      {children}
    </table>
  )
}

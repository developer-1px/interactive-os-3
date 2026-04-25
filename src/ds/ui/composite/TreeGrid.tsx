import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { useRovingDOM } from '../../core/hooks/useRovingDOM'

// @slot children — composable (wrapper/label/subpart)
type TreeGridProps = Omit<ComponentPropsWithoutRef<'table'>, 'role' | 'onKeyDown'> & {
  children: ReactNode
}

export function TreeGrid({ children, ...rest }: TreeGridProps) {
  const { onKeyDown, ref } = useRovingDOM<HTMLTableElement>(null, { orientation: 'both' })
  return (
    <table ref={ref} role="treegrid" onKeyDown={onKeyDown} {...rest}>
      {children}
    </table>
  )
}

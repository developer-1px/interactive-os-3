import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type GridCellProps = Omit<ComponentPropsWithoutRef<'td'>, 'role'> & {
  selected?: boolean
  disabled?: boolean
  colindex?: number
  children: ReactNode
}

export function GridCell({
  selected,
  disabled,
  colindex,
  children,
  ...rest
}: GridCellProps) {
  return (
    <td
      role="gridcell"
      aria-selected={selected}
      aria-disabled={disabled}
      aria-colindex={colindex}
      tabIndex={selected ? 0 : -1}
      {...rest}
    >
      {children}
    </td>
  )
}

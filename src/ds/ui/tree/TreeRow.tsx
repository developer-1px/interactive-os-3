import {
  Children,
  cloneElement,
  isValidElement,
  type ComponentPropsWithoutRef,
  type ReactElement,
  type ReactNode,
} from 'react'

type TreeRowProps = Omit<ComponentPropsWithoutRef<'tr'>, 'role'> & {
  level: number
  posinset?: number
  setsize?: number
  expanded?: boolean
  selected?: boolean
  disabled?: boolean
  children: ReactNode
}

export function TreeRow({
  level,
  posinset,
  setsize,
  expanded,
  selected,
  disabled,
  children,
  ...rest
}: TreeRowProps) {
  const cells = Children.toArray(children).filter(isValidElement) as ReactElement<{
    colindex?: number
  }>[]
  const enhanced = cells.map((el, i) => cloneElement(el, { colindex: i + 1 }))
  return (
    <tr
      role="row"
      aria-level={level}
      aria-posinset={posinset}
      aria-setsize={setsize}
      aria-expanded={expanded}
      aria-selected={selected}
      aria-disabled={disabled}
      tabIndex={selected ? 0 : -1}
      {...rest}
    >
      {enhanced}
    </tr>
  )
}

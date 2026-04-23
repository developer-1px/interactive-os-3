import {
  Children,
  cloneElement,
  isValidElement,
  type ComponentPropsWithoutRef,
  type ReactElement,
  type ReactNode,
} from 'react'

type RowProps = Omit<ComponentPropsWithoutRef<'tr'>, 'role'> & {
  children: ReactNode
}

export function Row({ children, ...rest }: RowProps) {
  const cells = Children.toArray(children).filter(isValidElement) as ReactElement<{
    colindex?: number
  }>[]
  const enhanced = cells.map((el, i) => cloneElement(el, { colindex: i + 1 }))
  return (
    <tr role="row" {...rest}>
      {enhanced}
    </tr>
  )
}

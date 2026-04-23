import {
  Children,
  cloneElement,
  isValidElement,
  type ComponentPropsWithoutRef,
  type ReactElement,
  type ReactNode,
} from 'react'

type ListboxProps = Omit<ComponentPropsWithoutRef<'ul'>, 'role'> & {
  children: ReactNode
}

export function Listbox({ children, ...rest }: ListboxProps) {
  const items = Children.toArray(children).filter(isValidElement) as ReactElement<{
    posinset?: number
    setsize?: number
  }>[]
  const total = items.length
  const enhanced = items.map((el, i) =>
    cloneElement(el, { posinset: i + 1, setsize: total }),
  )
  return (
    <ul role="listbox" {...rest}>
      {enhanced}
    </ul>
  )
}

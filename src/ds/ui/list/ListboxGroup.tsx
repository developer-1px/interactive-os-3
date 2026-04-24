import { useId, type ComponentPropsWithoutRef, type ReactNode } from 'react'

// @slot children — composable (wrapper/label/subpart)
type ListboxGroupProps = Omit<ComponentPropsWithoutRef<'li'>, 'role'> & {
  label: ReactNode
  children: ReactNode
}

export function ListboxGroup({ label, children, ...rest }: ListboxGroupProps) {
  const id = useId()
  return (
    <li role="presentation" {...rest}>
      <ul role="group" aria-labelledby={id}>
        <li role="presentation" id={id}>
          {label}
        </li>
        {children}
      </ul>
    </li>
  )
}

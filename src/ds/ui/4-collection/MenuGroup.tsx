import { useId, type ComponentPropsWithoutRef, type ReactNode } from 'react'

// @slot children — composable (wrapper/label/subpart)
type MenuGroupProps = Omit<ComponentPropsWithoutRef<'li'>, 'role'> & {
  label: ReactNode
  children: ReactNode
}

export function MenuGroup({ label, children, ...rest }: MenuGroupProps) {
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

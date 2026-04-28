import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { useRovingDOM } from '../../headless/roving/useRovingDOM'

// @slot children — composable (wrapper/label/subpart)
type MenubarProps = Omit<ComponentPropsWithoutRef<'ul'>, 'role' | 'onKeyDown'> & {
  orientation?: 'horizontal' | 'vertical'
  children: ReactNode
}

export function Menubar({ orientation = 'horizontal', children, ...rest }: MenubarProps) {
  const { onKeyDown, ref } = useRovingDOM<HTMLUListElement>(null, { orientation })
  return (
    <ul ref={ref} role="menubar" aria-orientation={orientation} onKeyDown={onKeyDown} {...rest}>
      {children}
    </ul>
  )
}

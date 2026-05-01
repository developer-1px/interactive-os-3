import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { useSpatialNavigation } from '@p/headless/roving/useSpatialNavigation'

// @slot children — composable (wrapper/label/subpart)
type MenuListProps = Omit<ComponentPropsWithoutRef<'ul'>, 'role' | 'onKeyDown'> & {
  children: ReactNode
}

export function MenuList({ children, ...rest }: MenuListProps) {
  const { onKeyDown, ref } = useSpatialNavigation<HTMLUListElement>(null, { orientation: 'vertical' })
  return (
    <ul ref={ref} role="menu" onKeyDown={onKeyDown} {...rest}>
      {children}
    </ul>
  )
}

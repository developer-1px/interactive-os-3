import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { useRovingDOM } from '@p/headless/roving/useRovingDOM'

// @slot children — composable (wrapper/label/subpart)
type MenubarProps = Omit<ComponentPropsWithoutRef<'ul'>, 'role' | 'onKeyDown'> & {
  orientation?: 'horizontal' | 'vertical'
  children: ReactNode
}

export function Menubar({ orientation = 'horizontal', children, ...rest }: MenubarProps) {
  // MenuItem 은 selected 일 때만 tabIndex=0 — 기본 TABBABLE selector 로는 발견 ❌
  // → itemSelector 명시 (TreeGrid/Listbox 와 같은 그룹).
  const { onKeyDown, ref } = useRovingDOM<HTMLUListElement>(null, {
    orientation,
    itemSelector: '[role="menuitem"]:not([aria-disabled="true"])',
  })
  return (
    <ul ref={ref} role="menubar" aria-orientation={orientation} onKeyDown={onKeyDown} {...rest}>
      {children}
    </ul>
  )
}

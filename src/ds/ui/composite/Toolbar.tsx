import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { useRovingDOM } from '../../core/hooks/useRovingDOM'

/**
 * Toolbar — @slot children composable. Arrow 네비로 tabstop roving.
 *
 * useRovingDOM 으로 Arrow/Home/End 선언적 처리. Enter/Space/click 은 각
 * 네이티브 button(ToolbarButton) 이 처리하므로 별도 activate 불필요.
 */
type ToolbarProps = Omit<ComponentPropsWithoutRef<'div'>, 'role' | 'onKeyDown'> & {
  orientation?: 'horizontal' | 'vertical'
  children: ReactNode
}

export function Toolbar({ orientation = 'horizontal', children, ...rest }: ToolbarProps) {
  const { onKeyDown, ref } = useRovingDOM<HTMLDivElement>(null, { orientation })
  return (
    <div ref={ref} role="toolbar" aria-orientation={orientation} onKeyDown={onKeyDown} {...rest}>
      {children}
    </div>
  )
}

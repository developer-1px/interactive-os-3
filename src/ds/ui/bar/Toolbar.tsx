import { useRef, type ComponentPropsWithoutRef, type KeyboardEvent, type ReactNode } from 'react'

/**
 * Toolbar — @slot children composable. Arrow 네비로 tabstop roving.
 *
 * children 은 Toolbar 하위 tabbable 엘리먼트(button/input 등). 자체 내부에서
 * Arrow Left/Right(가로) 또는 Up/Down(세로) 로 focus 이동. Home/End 로 처음/끝.
 * APG Toolbar 패턴.
 */
type ToolbarProps = Omit<ComponentPropsWithoutRef<'div'>, 'role' | 'onKeyDown'> & {
  orientation?: 'horizontal' | 'vertical'
  children: ReactNode
}

const TABBABLE = 'button:not([disabled]),[tabindex]:not([tabindex="-1"])'

export function Toolbar({ orientation = 'horizontal', children, ...rest }: ToolbarProps) {
  const ref = useRef<HTMLDivElement>(null)

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const root = ref.current
    if (!root) return
    const items = Array.from(root.querySelectorAll<HTMLElement>(TABBABLE))
    if (items.length === 0) return
    const active = document.activeElement as HTMLElement | null
    const idx = active ? items.indexOf(active) : -1
    const prev = orientation === 'horizontal' ? 'ArrowLeft'  : 'ArrowUp'
    const next = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown'
    let target: HTMLElement | null = null
    if (e.key === prev) target = items[(idx - 1 + items.length) % items.length]
    else if (e.key === next) target = items[(idx + 1) % items.length]
    else if (e.key === 'Home') target = items[0]
    else if (e.key === 'End')  target = items[items.length - 1]
    if (target) { e.preventDefault(); target.focus() }
  }

  return (
    <div ref={ref} role="toolbar" aria-orientation={orientation} onKeyDown={onKeyDown} {...rest}>
      {children}
    </div>
  )
}

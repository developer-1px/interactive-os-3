import { useEffect, useRef, type ReactNode } from 'react'
import { ROOT, type ControlProps } from '../../headless/types'

// 모바일/좁은 viewport에서 Aside·Drawer 역할을 하는 sheet — bottom / end / start 방향.
// Radix·Vaul·Ariakit·Shadcn 수렴 이름 "Sheet". Dialog와 동일하게 native <dialog>.
// SRP: open/close + edge anchor만 책임. 콘텐츠는 children.
//
// data[ROOT].data: { open, side?: 'bottom'|'end'|'start', label? }
// onEvent: { type: 'open', id: ROOT, open: false }
export function Sheet({ data, onEvent, children }: ControlProps & { children?: ReactNode }) {
  const root = data.entities[ROOT]?.data ?? {}
  const open = Boolean(root.open)
  const side = (root.side as 'bottom' | 'end' | 'start' | undefined) ?? 'end'
  const label = root.label as string | undefined
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    else if (!open && d.open) d.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      data-ds-sheet={side}
      aria-label={label}
      onClose={() => onEvent?.({ type: 'open', id: ROOT, open: false })}
    >
      {children}
    </dialog>
  )
}

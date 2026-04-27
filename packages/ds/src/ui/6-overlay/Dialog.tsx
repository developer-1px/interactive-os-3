import { useEffect, useRef, type ReactNode } from 'react'
import { ROOT, type ControlProps } from '../../headless/types'

// SRP: open/close 라이프사이클만 책임. 콘텐츠는 children (구조적 슬롯).
// @slot children — items 아닌 wrapper content
// data[ROOT].data: { open, label?, alert? }
// onEvent: { type: 'open', id: ROOT, open: false } — 사용자가 닫을 때
export function Dialog({ data, onEvent, children }: ControlProps & { children?: ReactNode }) {
  const root = data.entities[ROOT]?.data ?? {}
  const open = Boolean(root.open)
  const alert = Boolean(root.alert)
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
      role={alert ? 'alertdialog' : undefined}
      aria-label={label}
      onClose={() => onEvent?.({ type: 'open', id: ROOT, open: false })}
    >
      {children}
    </dialog>
  )
}

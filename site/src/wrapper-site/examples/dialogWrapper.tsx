/* eslint-disable react-refresh/only-export-components */
import { useRef, useState } from 'react'
import { Dialog, type DialogSlots, dialogWrapperKeys } from './_dialogWrapper'

const slots: DialogSlots = {
  body: () => <p>Modal with focus management and Escape close.</p>,
  footer: () => (
    <button
      onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))}
      className="rounded-md bg-stone-900 px-3 py-1.5 text-sm text-white"
    >
      Confirm
    </button>
  ),
}

export const meta = {
  title: 'Dialog Wrapper',
  apg: 'dialog-modal',
  kind: 'overlay' as const,
  blurb: 'Wrapper surface: open · onOpenChange · slots — overlay 류 시그니처. focus mgmt + escape 자동.',
  keys: dialogWrapperKeys,
}

export default function Demo() {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setOpen(true)}
        className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-stone-50"
      >
        Open dialog
      </button>
      <Dialog
        aria-label="Confirm action"
        open={open}
        onOpenChange={setOpen}
        triggerRef={triggerRef}
        slots={slots}
      />
    </>
  )
}

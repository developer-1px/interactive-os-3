import { useRef, useState } from 'react'
import { useDialogPattern } from '@p/headless/patterns'

export const meta = {
  title: 'Dialog',
  apg: 'dialog-modal',
  kind: 'ref' as const,
  blurb: 'First-focusable on open · Escape closes · returnFocus to trigger on close · Tab cycles within.',
  keys: () => ['Escape', 'Tab'],
}

export default function Demo() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const { rootProps, closeProps } = useDialogPattern(ref, {
    open,
    onOpenChange: setOpen,
    returnFocusRef: triggerRef,
    label: 'Confirm action',
  })

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setOpen(true)}
        className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-stone-50"
      >
        Open dialog
      </button>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
          <div
            ref={ref}
            {...rootProps}
            className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl"
          >
            <h2 className="text-base font-semibold">Confirm action</h2>
            <p className="mt-2 text-sm text-stone-600">
              Modal with focus management and Escape close.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button {...closeProps} className="rounded-md border border-stone-300 px-3 py-1.5 text-sm">
                Cancel
              </button>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md bg-stone-900 px-3 py-1.5 text-sm text-white"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

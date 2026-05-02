import { useRef, useState } from 'react'
import { alertdialogPattern, useDialogPattern } from '@p/headless/patterns'

export const meta = {
  title: 'Alert Dialog',
  apg: 'alertdialog',
  kind: 'pure' as const,
  blurb: 'role="alertdialog" — modal dialog requesting an immediate response. Combine with useDialogPattern for focus.',
}

export default function Demo() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const { rootProps: roleProps } = alertdialogPattern()
  const { rootProps: dialogRoot, closeProps } = useDialogPattern(ref, {
    open,
    onOpenChange: setOpen,
    returnFocusRef: triggerRef,
    ariaLabel: 'Delete confirmation',
  })

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setOpen(true)}
        className="rounded-md border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
      >
        Delete account
      </button>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
          <div
            ref={ref}
            {...roleProps}
            {...dialogRoot}
            className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl"
          >
            <h2 className="text-base font-semibold text-red-900">Delete account?</h2>
            <p className="mt-2 text-sm text-stone-600">This action cannot be undone.</p>
            <div className="mt-4 flex justify-end gap-2">
              <button {...closeProps} className="rounded-md border border-stone-300 px-3 py-1.5 text-sm">
                Cancel
              </button>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

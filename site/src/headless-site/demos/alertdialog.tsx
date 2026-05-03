import { useRef } from 'react'
import { dialogKeys, useDialogPattern } from '@p/headless/patterns'

export const meta = {
  title: 'Alert Dialog',
  apg: 'alertdialog',
  kind: 'pure' as const,
  blurb: 'role="alertdialog" — useDialogPattern({ alert: true }) 한 줄. dialog와 동작 동일, role만 다름.',
  keys: () => dialogKeys(),
}

export default function Demo() {
  const ref = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const { rootProps, closeProps, open, setOpen } = useDialogPattern(ref, {
    alert: true,
    returnFocusRef: triggerRef,
    label: 'Delete confirmation',
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
          <div ref={ref} {...rootProps} className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl">
            <h2 className="text-base font-semibold text-red-900">Delete account?</h2>
            <p className="mt-2 text-sm text-stone-600">This action cannot be undone.</p>
            <div className="mt-4 flex justify-end gap-2">
              <button {...closeProps} className="rounded-md border border-stone-300 px-3 py-1.5 text-sm">
                Cancel
              </button>
              <button onClick={() => setOpen(false)} className="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

import { type RefObject } from 'react'
import { useDialogPattern } from '@p/headless/patterns'
import { emptySlot, renderSlot, type DialogSlots } from './slots'

export interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  triggerRef?: RefObject<HTMLElement | null>
  alert?: boolean
  'aria-label': string
  slots?: DialogSlots
}

export function Dialog({
  open, onOpenChange, triggerRef, alert = false,
  'aria-label': ariaLabel,
  slots = {},
}: DialogProps) {
  const { rootProps, closeProps } = useDialogPattern({
    open, onOpenChange, alert, returnFocusRef: triggerRef, label: ariaLabel,
  })

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <div {...rootProps} className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl">
        <div data-slot="header" className="text-base font-semibold">
          {renderSlot(slots.header, () => ariaLabel)}
        </div>
        <div data-slot="body" className="mt-2 text-sm text-stone-600">
          {renderSlot(slots.body, emptySlot)}
        </div>
        <div data-slot="footer" className="mt-4 flex justify-end gap-2">
          <button {...closeProps} className="rounded-md border border-stone-300 px-3 py-1.5 text-sm">
            Cancel
          </button>
          {renderSlot(slots.footer, emptySlot)}
        </div>
      </div>
    </div>
  )
}

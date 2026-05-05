import { useRef, useState } from 'react'
import { KEYS, matchKey } from '@p/headless'
import { useDialogPattern } from '@p/headless/patterns'
import { axisKeys } from '@p/headless'
import { gridAxis } from '@p/headless/patterns'
import { CalendarGrid } from './_calendarGrid'

export const meta = {
  title: 'Combobox · Date Picker',
  apg: 'combobox',
  kind: 'collection' as const,
  blurb: 'Editable combobox that opens a dialog containing a calendar grid.',
  keys: () => axisKeys(gridAxis()),
}

export default function Demo() {
  const [date, setDate] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { rootProps, open, setOpen } = useDialogPattern({
    label: 'Choose date',
    returnFocusRef: inputRef,
  })

  return (
    <div className="relative w-72">
      <div className="flex gap-1">
        <input
          ref={inputRef}
          role="combobox"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          onKeyDown={(e) => {
            if (matchKey(e, KEYS.ArrowDown)) {
              e.preventDefault()
              setOpen(true)
            }
          }}
          placeholder="YYYY-MM-DD"
          className="flex-1 rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm"
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label="Choose date"
          onClick={() => setOpen(true)}
          className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm hover:bg-stone-50"
        >📅</button>
      </div>

      {open && (
        <div className="absolute left-0 top-full z-10 mt-1 w-72">
          <div
            {...rootProps}
            className="rounded-md border border-stone-200 bg-white p-3 text-sm shadow-lg outline-none"
          >
            <CalendarGrid
              value={date}
              open={open}
              onCommit={(iso) => { setDate(iso); setOpen(false) }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

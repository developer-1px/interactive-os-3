import { useEffect, useRef, useState } from 'react'
import { useDialogPattern } from '@p/headless/patterns'
import { dedupe, probe } from '../catalog/keys'
import { gridAxis } from '@p/headless/patterns'

export const meta = {
  title: 'Combobox · Date Picker',
  apg: 'combobox',
  kind: 'collection' as const,
  blurb: 'Editable combobox that opens a dialog containing a calendar grid.',
  keys: () => dedupe(probe(gridAxis())),
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface CalendarDay { day: number | null; key: string }

function buildMonth(year: number, month: number): CalendarDay[] {
  const startWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: CalendarDay[] = []
  for (let i = 0; i < startWeekday; i++) cells.push({ day: null, key: `pad-${i}` })
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, key: `d-${d}` })
  while (cells.length % 7 !== 0) cells.push({ day: null, key: `pad-end-${cells.length}` })
  return cells
}

export default function Demo() {
  const today = new Date()
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() })
  const [date, setDate] = useState<string>('')
  const [focusDay, setFocusDay] = useState<number>(today.getDate())

  const inputRef = useRef<HTMLInputElement | null>(null)
  const { rootProps, open, setOpen } = useDialogPattern({
    label: `Choose date — ${MONTH_NAMES[view.m]} ${view.y}`,
    returnFocusRef: inputRef,
  })

  const cells = buildMonth(view.y, view.m)
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate()
  const dayBtnRefs = useRef(new Map<number, HTMLButtonElement | null>())

  useEffect(() => {
    if (!open) return
    const btn = dayBtnRefs.current.get(focusDay)
    btn?.focus({ preventScroll: true })
  }, [open, focusDay, view.y, view.m])

  const commit = (day: number) => {
    const iso = `${view.y}-${String(view.m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    setDate(iso)
    setOpen(false)
  }

  const moveFocus = (delta: number) => {
    const next = focusDay + delta
    if (next < 1) {
      setView((v) => ({ y: v.m === 0 ? v.y - 1 : v.y, m: (v.m + 11) % 12 }))
      const prevMonthDays = new Date(view.y, view.m, 0).getDate()
      setFocusDay(prevMonthDays + next)
    } else if (next > daysInMonth) {
      setView((v) => ({ y: v.m === 11 ? v.y + 1 : v.y, m: (v.m + 1) % 12 }))
      setFocusDay(next - daysInMonth)
    } else {
      setFocusDay(next)
    }
  }

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
            if (e.key === 'ArrowDown') {
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
            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setView((v) => ({ y: v.m === 0 ? v.y - 1 : v.y, m: (v.m + 11) % 12 }))}
                aria-label="Previous month"
                className="rounded px-2 py-1 hover:bg-stone-100"
              >‹</button>
              <span className="font-medium">{MONTH_NAMES[view.m]} {view.y}</span>
              <button
                type="button"
                onClick={() => setView((v) => ({ y: v.m === 11 ? v.y + 1 : v.y, m: (v.m + 1) % 12 }))}
                aria-label="Next month"
                className="rounded px-2 py-1 hover:bg-stone-100"
              >›</button>
            </div>

            <div role="grid" aria-label={`${MONTH_NAMES[view.m]} ${view.y}`} className="grid grid-cols-7 gap-1">
              <div role="row" className="contents">
                {WEEKDAY_NAMES.map((w) => (
                  <span key={w} role="columnheader" className="text-center text-xs text-stone-500">{w}</span>
                ))}
              </div>
              {Array.from({ length: cells.length / 7 }, (_, w) => (
                <div key={w} role="row" className="contents">
                  {cells.slice(w * 7, w * 7 + 7).map((cell) => {
                    if (cell.day === null) return <span key={cell.key} aria-hidden />
                    const day = cell.day
                    const isFocus = day === focusDay
                    return (
                      <button
                        key={cell.key}
                        ref={(el) => { dayBtnRefs.current.set(day, el) }}
                        role="gridcell"
                        type="button"
                        tabIndex={isFocus ? 0 : -1}
                        onClick={() => commit(day)}
                        onKeyDown={(e) => {
                          switch (e.key) {
                            case 'Enter':
                            case ' ':
                              e.preventDefault(); commit(day); break
                            case 'ArrowLeft': e.preventDefault(); moveFocus(-1); break
                            case 'ArrowRight': e.preventDefault(); moveFocus(1); break
                            case 'ArrowUp': e.preventDefault(); moveFocus(-7); break
                            case 'ArrowDown': e.preventDefault(); moveFocus(7); break
                          }
                        }}
                        className="rounded p-1 text-center text-sm hover:bg-stone-100 focus:bg-stone-900 focus:text-white focus:outline-none"
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

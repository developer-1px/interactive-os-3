import { useRef, useState } from 'react'
import {
  fromList,
  reduce,
  ROOT,
  type NormalizedData,
  type UiEvent,
} from '@p/headless'
import {
  disclosurePattern,
  toggleSwitchPattern,
  useTabsPattern,
  useListboxPattern,
  useRadioGroupPattern,
  useAccordionPattern,
  useTooltipPattern,
  useDialogPattern,
} from '@p/headless/patterns'

// shared local-data hook for patterns that consume NormalizedData
function useLocalData(initial: NormalizedData) {
  const [data, setData] = useState(initial)
  const onEvent = (e: UiEvent) => setData((d) => reduce(d, e))
  return [data, onEvent] as const
}

// ----- Disclosure ---------------------------------------------------------
export function DisclosureDemo() {
  const [open, setOpen] = useState(false)
  const { triggerProps, panelProps } = disclosurePattern({ open, onOpenChange: setOpen })
  return (
    <div className="space-y-3">
      <button
        {...triggerProps}
        className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-stone-50 data-[state=open]:bg-stone-100"
      >
        {open ? 'Hide details' : 'Show details'}
      </button>
      <div
        {...panelProps}
        className="rounded-md border border-stone-200 bg-white p-3 text-sm text-stone-700"
      >
        Disclosure panel content. <code className="text-xs">aria-expanded</code> · <code className="text-xs">aria-controls</code> · <code className="text-xs">role="region"</code> auto-wired.
      </div>
    </div>
  )
}

// ----- Switch -------------------------------------------------------------
export function SwitchDemo() {
  const [on, setOn] = useState(false)
  const { switchProps } = toggleSwitchPattern({ checked: on, onCheckedChange: setOn, label: 'Notifications' })
  return (
    <div className="flex items-center gap-3">
      <button
        {...switchProps}
        className="relative h-6 w-11 rounded-full bg-stone-300 transition data-[state=on]:bg-emerald-600"
      >
        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform data-[state=on]:translate-x-5" data-state={on ? 'on' : 'off'} />
      </button>
      <span className="text-sm text-stone-700">{on ? 'On' : 'Off'}</span>
    </div>
  )
}

// ----- Tabs ---------------------------------------------------------------
const tabsInit = fromList([
  { label: 'Overview', selected: true },
  { label: 'Behavior' },
  { label: 'Patterns' },
])
export function TabsDemo() {
  const [data, onEvent] = useLocalData(tabsInit)
  const { rootProps, tabProps, panelProps, items } = useTabsPattern(data, onEvent)
  const active = items.find((i) => i.selected) ?? items[0]
  return (
    <div className="space-y-3">
      <div {...rootProps} className="flex gap-1 border-b border-stone-200">
        {items.map((item) => (
          <button
            key={item.id}
            {...tabProps(item.id)}
            className="px-3 py-1.5 text-sm text-stone-600 border-b-2 border-transparent aria-selected:border-stone-900 aria-selected:text-stone-900 hover:text-stone-900"
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          {...panelProps(item.id)}
          className="rounded-md bg-stone-50 p-3 text-sm text-stone-700"
        >
          Panel: <strong>{item.label}</strong> — selected via roving + Arrow keys.
        </div>
      ))}
    </div>
  )
}

// ----- Listbox ------------------------------------------------------------
const listInit = fromList([
  { label: 'Apple' },
  { label: 'Banana' },
  { label: 'Cherry' },
  { label: 'Durian' },
])
export function ListboxDemo() {
  const [data, onEvent] = useLocalData(listInit)
  const { rootProps, optionProps, items } = useListboxPattern(data, onEvent)
  return (
    <ul
      {...rootProps}
      aria-label="Fruits"
      className="w-56 rounded-md border border-stone-200 bg-white p-1 text-sm"
    >
      {items.map((item) => (
        <li
          key={item.id}
          {...optionProps(item.id)}
          className="cursor-pointer rounded px-2 py-1 hover:bg-stone-100 aria-selected:bg-stone-900 aria-selected:text-white"
        >
          {item.label}
        </li>
      ))}
    </ul>
  )
}

// ----- Radio Group --------------------------------------------------------
const radioInit = fromList([
  { label: 'Small' },
  { label: 'Medium', selected: true },
  { label: 'Large' },
])
export function RadioGroupDemo() {
  const [data, onEvent] = useLocalData(radioInit)
  const { rootProps, radioProps, items } = useRadioGroupPattern(data, onEvent)
  return (
    <div {...rootProps} aria-label="Size" className="flex flex-col gap-2">
      {items.map((item) => (
        <label
          key={item.id}
          {...radioProps(item.id)}
          className="flex items-center gap-2 text-sm cursor-pointer"
        >
          <span
            aria-hidden
            className="h-4 w-4 rounded-full border-2 border-stone-400 grid place-items-center"
          >
            {item.selected && <span className="h-2 w-2 rounded-full bg-stone-900" />}
          </span>
          {item.label}
        </label>
      ))}
    </div>
  )
}

// ----- Accordion ----------------------------------------------------------
const accInit: NormalizedData = {
  entities: {
    [ROOT]: { id: ROOT },
    a: { id: 'a', data: { label: 'What is @p/headless?' } },
    b: { id: 'b', data: { label: 'Why ARIA-first?' } },
    c: { id: 'c', data: { label: 'Bring my own styles?' } },
  },
  relationships: { [ROOT]: ['a', 'b', 'c'] },
}
export function AccordionDemo() {
  const [data, onEvent] = useLocalData(accInit)
  const { rootProps, headerProps, triggerProps, panelProps, items } = useAccordionPattern(data, onEvent)
  return (
    <div {...rootProps} className="divide-y divide-stone-200 rounded-md border border-stone-200 bg-white">
      {items.map((item) => (
        <div key={item.id}>
          <h3 {...headerProps(item.id)} className="m-0">
            <button
              {...triggerProps(item.id)}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium hover:bg-stone-50"
            >
              {item.label}
              <span className="text-stone-400">{item.expanded ? '−' : '+'}</span>
            </button>
          </h3>
          <div {...panelProps(item.id)} className="px-3 py-2 text-sm text-stone-600 bg-stone-50">
            Body for <strong>{item.label}</strong>. Wired via roving + expand axis.
          </div>
        </div>
      ))}
    </div>
  )
}

// ----- Tooltip ------------------------------------------------------------
export function TooltipDemo() {
  const ref = useRef<HTMLButtonElement>(null)
  const { open, triggerProps, tipProps } = useTooltipPattern(ref)
  return (
    <div className="relative inline-block">
      <button
        {...triggerProps}
        className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-stone-50"
      >
        Hover or focus me
      </button>
      {open && (
        <span
          {...tipProps}
          className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded bg-stone-900 px-2 py-1 text-xs text-white shadow"
        >
          tooltip via aria-describedby
        </span>
      )}
    </div>
  )
}

// ----- Dialog -------------------------------------------------------------
export function DialogDemo() {
  const [open, setOpen] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const { rootProps, closeProps } = useDialogPattern(dialogRef, {
    open,
    onOpenChange: setOpen,
    returnFocusRef: triggerRef,
    ariaLabel: 'Confirm action',
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
            ref={dialogRef}
            {...rootProps}
            className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl"
          >
            <h2 className="text-base font-semibold">Confirm action</h2>
            <p className="mt-2 text-sm text-stone-600">
              Modal dialog with focus management and Escape-to-close. Native <code>{'<dialog>'}</code> recommended for trap.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                {...closeProps}
                className="rounded-md border border-stone-300 px-3 py-1.5 text-sm hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md bg-stone-900 px-3 py-1.5 text-sm text-white hover:bg-stone-800"
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

import { type ComponentPropsWithoutRef } from 'react'
import {
  ROOT,
  getChildren,
  getExpanded,
  getFocus,
  getLabel,
  isDisabled,
  type ControlProps,
  type Event,
} from '../../core/types'
import { activate, composeAxes, navigate, treeExpand, typeahead } from '../../axes'
import { bindAxis } from '../../core/bind'
import { useFocusBridge } from '../../core/hooks/focus'

type ColumnsProps = ControlProps &
  Omit<ComponentPropsWithoutRef<'section'>, 'role' | 'onKeyDown'>

const axis = composeAxes(navigate('vertical'), treeExpand, activate, typeahead)

const chainFrom = (d: ControlProps['data'], exp: Set<string>, cur: string = ROOT): string[] => {
  const open = getChildren(d, cur).find((k) => exp.has(k))
  return open ? [cur, ...chainFrom(d, exp, open)] : [cur]
}

const clickEvents = (id: string, hasKids: boolean, isOpen: boolean): Event[] => [
  { type: 'navigate', id },
  hasKids ? { type: 'expand', id, open: !isOpen } : { type: 'activate', id },
]

export function Columns({ data, onEvent, ...rest }: ColumnsProps) {
  const focusId = getFocus(data)
  const expanded = getExpanded(data)
  const onKey = bindAxis(axis, data, onEvent)
  const bindFocus = useFocusBridge(focusId)

  return (
    <section aria-roledescription="columns" {...rest}>
      {chainFrom(data, expanded).map((parent) => {
        const kids = getChildren(data, parent)
        const label = parent === ROOT ? 'root' : getLabel(data, parent)
        return (
          <nav key={parent} aria-roledescription="column" aria-label={label}>
            <ul role="listbox">
              {kids.map((id, i) => {
                const hasKids = getChildren(data, id).length > 0
                const isOpen = expanded.has(id)
                const disabled = isDisabled(data, id)
                const d = data.entities[id]?.data ?? {}
                return (
                  <li
                    key={id}
                    role="option"
                    ref={bindFocus(id)}
                    aria-posinset={i + 1}
                    aria-setsize={kids.length}
                    aria-selected={Boolean(d.selected) || undefined}
                    aria-haspopup={hasKids ? 'menu' : undefined}
                    aria-expanded={hasKids ? isOpen : undefined}
                    aria-disabled={disabled || undefined}
                    tabIndex={focusId === id ? 0 : -1}
                    data-icon={d.icon as string | undefined}
                    onKeyDown={(e) => {
                      if (onKey(e, id)) e.stopPropagation()
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (disabled) return
                      clickEvents(id, hasKids, isOpen).forEach(onEvent)
                    }}
                  >
                    <span>{getLabel(data, id)}</span>
                  </li>
                )
              })}
            </ul>
          </nav>
        )
      })}
    </section>
  )
}

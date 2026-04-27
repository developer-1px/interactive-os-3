import { type ComponentPropsWithoutRef } from 'react'
import {
  ROOT,
  getChildren,
  getLabel,
  isDisabled,
  type CollectionProps,
  type NormalizedData,
} from '../../headless/types'
import { activate, composeAxes, expand, navigate, typeahead } from '../../headless/axes'
import { useRoving } from '../../headless/roving/useRoving'

type ColumnsProps = CollectionProps<Omit<ComponentPropsWithoutRef<'section'>, 'role' | 'onKeyDown'>>

const axis = composeAxes(navigate('vertical'), expand, activate, typeahead)

const chainFrom = (d: NormalizedData, exp: Set<string>, cur: string = ROOT): string[] => {
  const open = getChildren(d, cur).find((k) => exp.has(k) && getChildren(d, k).length > 0)
  return open ? [cur, ...chainFrom(d, exp, open)] : [cur]
}

export function Columns({ data, onEvent, autoFocus, ...rest }: ColumnsProps) {
  const { focusId, expanded, bindFocus, delegate } = useRoving(axis, data, onEvent ?? (() => {}), { autoFocus })

  return (
    <section data-part="columns" {...delegate} {...rest}>
      {chainFrom(data, expanded).map((parent) => {
        const kids = getChildren(data, parent)
        const label = parent === ROOT ? 'root' : getLabel(data, parent)
        return (
          <nav key={parent} data-part="column" aria-label={label}>
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
                    data-id={id}
                    ref={bindFocus(id)}
                    aria-posinset={i + 1}
                    aria-setsize={kids.length}
                    aria-selected={Boolean(d.selected) || undefined}
                    aria-haspopup={hasKids ? 'menu' : undefined}
                    aria-expanded={hasKids ? isOpen : undefined}
                    aria-disabled={disabled || undefined}
                    tabIndex={focusId === id ? 0 : -1}
                    data-icon={d.icon as string | undefined}
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

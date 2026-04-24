import { type ComponentPropsWithoutRef, type KeyboardEvent, type MouseEvent } from 'react'
import {
  ROOT,
  getChildren,
  getLabel,
  isDisabled,
  type CollectionProps,
} from '../../core/types'
import { activate, composeAxes, navigate, typeahead } from '../../core/axes'
import { useRoving } from '../../core/hooks/useRoving'
import { Option } from './Option'

type ListboxProps = CollectionProps<Omit<ComponentPropsWithoutRef<'ul'>, 'role' | 'onKeyDown'>>

const axis = composeAxes(navigate('vertical'), activate, typeahead)

const idFrom = (e: { target: EventTarget }): string | null =>
  (e.target as Element).closest<HTMLElement>('[data-id]')?.dataset.id ?? null

export function Listbox({ data, onEvent, ...rest }: ListboxProps) {
  const { focusId, onKey, onClick, bindFocus } = useRoving(axis, data, onEvent ?? (() => {}))
  const kids = getChildren(data, ROOT)

  const handleClick = (e: MouseEvent) => {
    const id = idFrom(e)
    if (id) onClick(e, id)
  }
  const handleKey = (e: KeyboardEvent) => {
    const id = idFrom(e)
    if (id) onKey(e, id)
  }

  return (
    <ul role="listbox" onClick={handleClick} onKeyDown={handleKey} {...rest}>
      {kids.map((id, i) => {
        const d = data.entities[id]?.data ?? {}
        const selected = Boolean(d.selected)
        const disabled = isDisabled(data, id)
        return (
          <Option
            key={id}
            id={id}
            data-id={id}
            ref={bindFocus(id)}
            posinset={i + 1}
            setsize={kids.length}
            selected={selected}
            disabled={disabled}
            tabIndex={focusId === id ? 0 : -1}
            data-icon={d.icon as string | undefined}
            data-badge={d.badge as string | number | undefined}
            aria-haspopup={d.haspopup as ComponentPropsWithoutRef<'li'>['aria-haspopup']}
          >
            {getLabel(data, id)}
          </Option>
        )
      })}
    </ul>
  )
}

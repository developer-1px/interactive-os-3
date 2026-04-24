import { type ComponentPropsWithoutRef } from 'react'
import {
  ROOT,
  getChildren,
  getLabel,
  isDisabled,
  type ControlProps,
} from '../../core/types'
import { activate, composeAxes, navigate, typeahead } from '../../core/axes'
import { useRoving } from '../../core/hooks/useRoving'
import { Option } from './Option'

type ListboxProps = ControlProps &
  Omit<ComponentPropsWithoutRef<'ul'>, 'role' | 'onKeyDown'>

const axis = composeAxes(navigate('vertical'), activate, typeahead)

export function Listbox({ data, onEvent, ...rest }: ListboxProps) {
  const { focusId, onKey, bindFocus } = useRoving(axis, data, onEvent)
  const kids = getChildren(data, ROOT)

  return (
    <ul role="listbox" {...rest}>
      {kids.map((id, i) => {
        const d = data.entities[id]?.data ?? {}
        const selected = Boolean(d.selected)
        const disabled = isDisabled(data, id)
        return (
          <Option
            key={id}
            id={id}
            ref={bindFocus(id)}
            posinset={i + 1}
            setsize={kids.length}
            selected={selected}
            disabled={disabled}
            tabIndex={focusId === id ? 0 : -1}
            data-icon={d.icon as string | undefined}
            aria-haspopup={d.haspopup as ComponentPropsWithoutRef<'li'>['aria-haspopup']}
            onKeyDown={(e) => {
              if (onKey(e, id)) e.stopPropagation()
            }}
            onClick={() => {
              if (disabled) return
              onEvent({ type: 'navigate', id })
              onEvent({ type: 'activate', id })
            }}
          >
            {getLabel(data, id)}
          </Option>
        )
      })}
    </ul>
  )
}

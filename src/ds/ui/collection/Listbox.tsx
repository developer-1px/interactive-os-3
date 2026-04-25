import { type ComponentPropsWithoutRef } from 'react'
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

export function Listbox({ data, onEvent, ...rest }: ListboxProps) {
  const { focusId, bindFocus, delegate } = useRoving(axis, data, onEvent ?? (() => {}))
  const kids = getChildren(data, ROOT)

  return (
    <ul role="listbox" {...delegate} {...rest}>
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

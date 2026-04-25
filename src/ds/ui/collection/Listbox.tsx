import { type ComponentPropsWithoutRef } from 'react'
import {
  ROOT,
  getChildren,
  getLabel,
  isDisabled,
  type CollectionProps,
  type Event,
} from '../../core/types'
import { activate, composeAxes, navigate, typeahead } from '../../core/axes'
import { activateOnNavigate } from '../../core/gesture'
import { useRoving } from '../../core/hooks/useRoving'
import { Option } from './Option'

type ListboxProps = CollectionProps<Omit<ComponentPropsWithoutRef<'ul'>, 'role' | 'onKeyDown'>>

const axis = composeAxes(navigate('vertical'), activate, typeahead)

/**
 * Listbox — APG single-select listbox 기본 동작은 **selection follows focus**.
 * ↑↓로 옵션을 옮기면 즉시 활성화(activate)도 함께 emit → 소비자는 선택 상태를
 * 같이 갱신한다. 클릭/Enter/Space는 그대로 activate.
 */
export function Listbox({ data, onEvent, autoFocus, ...rest }: ListboxProps) {
  const relay = (e: Event) =>
    activateOnNavigate(data, e).forEach((ev) => onEvent?.(ev))
  const { focusId, bindFocus, delegate } = useRoving(axis, data, relay, { autoFocus })
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

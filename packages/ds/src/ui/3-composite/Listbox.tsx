import { type ComponentPropsWithoutRef } from 'react'
import { type CollectionProps } from '@p/headless/types'
import { listbox } from '@p/headless/patterns'
import { Option } from '../2-input/Option'

type ListboxProps = CollectionProps<Omit<ComponentPropsWithoutRef<'ul'>, 'role' | 'onKeyDown'> & {
  selectionFollowsFocus?: boolean
}>

/**
 * Listbox — APG single-select listbox. `@p/headless/patterns/listbox` recipe wrapping.
 * 기본 selection-follows-focus.
 */
export function Listbox({ data, onEvent, autoFocus, selectionFollowsFocus, ...rest }: ListboxProps) {
  const { rootProps, optionProps, items } = listbox(data, onEvent, { autoFocus, selectionFollowsFocus })

  return (
    <ul {...(rootProps as ComponentPropsWithoutRef<'ul'>)} {...rest}>
      {items.map((it) => {
        const d = data.entities[it.id]?.data ?? {}
        return (
          <Option
            key={it.id}
            {...(optionProps(it.id) as ComponentPropsWithoutRef<'li'>)}
            posinset={it.posinset}
            setsize={it.setsize}
            selected={it.selected}
            disabled={it.disabled}
            icon={d.icon as string | undefined}
            data-badge={d.badge as string | number | undefined}
            aria-haspopup={d.haspopup as ComponentPropsWithoutRef<'li'>['aria-haspopup']}
          >
            {it.label}
          </Option>
        )
      })}
    </ul>
  )
}

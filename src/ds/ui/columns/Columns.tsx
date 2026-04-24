import { type ComponentPropsWithoutRef, type KeyboardEvent, type MouseEvent } from 'react'
import {
  ROOT,
  getChildren,
  getLabel,
  isDisabled,
  type CollectionProps,
  type NormalizedData,
} from '../../core/types'
import { activate, composeAxes, navigate, treeExpand, typeahead } from '../../core/axes'
import { useRoving } from '../../core/hooks/useRoving'

type ColumnsProps = CollectionProps<Omit<ComponentPropsWithoutRef<'section'>, 'role' | 'onKeyDown'>>

const axis = composeAxes(navigate('vertical'), treeExpand, activate, typeahead)

const chainFrom = (d: NormalizedData, exp: Set<string>, cur: string = ROOT): string[] => {
  const open = getChildren(d, cur).find((k) => exp.has(k) && getChildren(d, k).length > 0)
  return open ? [cur, ...chainFrom(d, exp, open)] : [cur]
}

const idFrom = (e: { target: EventTarget }): string | null =>
  (e.target as Element).closest<HTMLElement>('[data-id]')?.dataset.id ?? null

export function Columns({ data, onEvent, ...rest }: ColumnsProps) {
  const { focusId, expanded, onKey, bindFocus } = useRoving(axis, data, onEvent)

  // 위임. 단일 제스처 emit. expand/navigate 도출은 소비자가 expandBranchOnActivate로.
  const onClick = (e: MouseEvent) => {
    const id = idFrom(e)
    if (!id || isDisabled(data, id)) return
    onEvent({ type: 'activate', id })
  }
  const onKeyDown = (e: KeyboardEvent) => {
    const id = idFrom(e)
    if (id) onKey(e, id)
  }

  return (
    <section aria-roledescription="columns" onClick={onClick} onKeyDown={onKeyDown} {...rest}>
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

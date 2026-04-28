import { Fragment, type CSSProperties, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { ROOT, getChildren, getLabel, isDisabled, type CollectionProps, type NormalizedData } from '../../headless/types'
import { composeAxes, activate, treeExpand, treeNavigate, typeahead } from '../../headless/axes'
import { useRoving } from '../../headless/roving/useRoving'

type TreeProps = CollectionProps<Omit<ComponentPropsWithoutRef<'ul'>, 'role' | 'onKeyDown'>>

const axis = composeAxes(treeNavigate, treeExpand, activate, typeahead)

const readField = <T,>(data: NormalizedData, id: string, key: string): T | undefined =>
  data.entities[id]?.data?.[key] as T | undefined

export function Tree({ data, onEvent, autoFocus, ...rest }: TreeProps) {
  const { focusId, expanded, bindFocus, delegate } = useRoving(axis, data, onEvent ?? (() => {}), { autoFocus })

  const render = (parent: string, level: number): ReactNode => {
    // entity.data.kind === 'group'은 비대화형 라벨 — role="none", 키보드 진입/선택 ❌.
    // 자식은 같은 level로 평탄 렌더된다(트리 깊이 증가 없이 시각 그룹만 만든다).
    const items = getChildren(data, parent).filter((id) => readField<string>(data, id, 'kind') !== 'group')
    return getChildren(data, parent).flatMap((id) => {
      const kind = readField<string>(data, id, 'kind')
      if (kind === 'group') {
        return (
          <Fragment key={id}>
            <li role="none" data-group-label>
              <span>{getLabel(data, id)}</span>
            </li>
            {render(id, level)}
          </Fragment>
        )
      }
      const i = items.indexOf(id)
      const setsize = items.length
      const hasKids = getChildren(data, id).length > 0
      const isOpen = expanded.has(id)
      const disabled = isDisabled(data, id)
      const focused = focusId === id
      const icon = readField<string>(data, id, 'icon')
      const badge = readField<ReactNode>(data, id, 'badge')
      const current = readField<boolean>(data, id, 'current')
      return (
        <Fragment key={id}>
          <li
            role="treeitem"
            data-id={id}
            ref={bindFocus(id)}
            aria-level={level}
            aria-posinset={i + 1}
            aria-setsize={setsize}
            aria-expanded={hasKids ? isOpen : undefined}
            aria-disabled={disabled || undefined}
            aria-current={current ? 'page' : undefined}
            tabIndex={focused ? 0 : -1}
            style={{ '--ds-level': level - 1 } as CSSProperties}
          >
            {icon && <span data-slot="leading" data-icon={icon} aria-hidden="true" />}
            <span>{getLabel(data, id)}</span>
            {badge !== undefined && badge !== null && badge !== false && (
              <span data-slot="meta" aria-label={typeof badge === 'number' ? `${badge}건` : undefined}>{badge}</span>
            )}
            {hasKids && <span data-slot="trailing" data-icon={isOpen ? 'chevronDown' : 'chevronRight'} aria-hidden="true" />}
          </li>
          {hasKids && isOpen && render(id, level + 1)}
        </Fragment>
      )
    })
  }

  return <ul role="tree" {...delegate} {...rest}>{render(ROOT, 1)}</ul>
}

import { ROOT, getChildren, type NormalizedData } from '@p/aria-kernel'
import { navigationListPattern, type PatternProps } from '@p/aria-kernel/patterns'
import { defaultLabel, renderSlot, type Slot } from '../../catalog/slots'

export interface NavSlots<TItem extends object = Record<string, unknown>> {
  label?: Slot<TItem>
}

export interface NavProps<TItem extends object = Record<string, unknown>> extends PatternProps {
  slots?: NavSlots<TItem>
}

/**
 * navigationList wrapper — `<nav>` landmark + grouped `<a aria-current="page">`.
 *
 * 데이터 트리:
 *   ROOT → group ids → link ids
 *   (단층 리스트면 ROOT 가 직접 link 들을 자식으로 가지면 됨 — group 헤딩 생략)
 *
 * group entity.label 이 있으면 `<h3>` 헤딩 노출. 클릭은 `activate` UiEvent 로 onEvent 에 위임.
 */
export function Nav<TItem extends object = Record<string, unknown>>({
  data,
  onEvent,
  slots = {},
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: NavProps<TItem>) {
  const groupIds = getChildren(data, ROOT)
  const isFlat = groupIds.every((gid) => getChildren(data, gid).length === 0)
  const groups = isFlat ? [{ id: ROOT, label: '', items: groupIds }] : groupIds.map((gid) => ({
    id: gid,
    label: (data.entities[gid]?.label as string) ?? '',
    items: getChildren(data, gid),
  }))

  const flat = navigationListPattern(data, onEvent, {
    label: ariaLabel,
    labelledBy: ariaLabelledBy,
  })

  return (
    <nav {...flat.rootProps} className="flex flex-col gap-4">
      {groups.map((group) => {
        const list = navigationListPattern(data, onEvent, { containerId: group.id })
        if (!list.items.length) return null
        return (
          <div key={group.id} className="flex flex-col gap-0.5">
            {group.label && (
              <h3 className="px-2 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                {group.label}
              </h3>
            )}
            {list.items.map((item) => {
              const itemData = (data.entities[item.id] ?? {}) as TItem
              return (
                <a
                  key={item.id}
                  {...list.linkProps(item.id)}
                  className="block rounded px-2 py-1 text-stone-700 [&:not([aria-current=page])]:hover:bg-stone-200 aria-[current=page]:bg-stone-900 aria-[current=page]:text-white"
                >
                  {renderSlot(slots.label, defaultLabel as Slot<TItem>, item, itemData)}
                </a>
              )
            })}
          </div>
        )
      })}
    </nav>
  )
}

export type NavData = NormalizedData

import type { ComponentPropsWithoutRef, ReactNode } from 'react'

/**
 * RovingItem — List·Tree·Menu·Sidebar 가 항상 품는 row 시각 셸.
 *
 * 기존 `rovingItem` 셀렉터 union (`option`/`menuitem`/`treeitem`/`tab`/`row`/`radio`)
 * 의 시각 짝. state 토큰(hover/focus/selected/disabled)은 이미 그 union 에 깔려 있어
 * RovingItem 자체는 어떤 상태 css 도 들고 있지 않다 — 셀 셸만 담당.
 *
 * role 부여는 호출자(List/Tree/Menu wrapper)의 책임. 단독 사용 ❌.
 *
 * 슬롯: icon (leading) · content (가운데, title/description 자유 조립) · tail (trailing).
 * 셀렉터 namespace: `data-part="roving-item"` + `data-slot="<name>"`.
 */
export type RovingItemSlot = 'icon' | 'content' | 'tail'

type RovingItemProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  slots: Partial<Record<RovingItemSlot, ReactNode>>
}

const ORDER: RovingItemSlot[] = ['icon', 'content', 'tail']

export function RovingItem({ slots, ...rest }: RovingItemProps) {
  return (
    <div data-part="roving-item" {...rest}>
      {ORDER.map((s) => slots[s] != null && (
        <div data-slot={s} key={s}>{slots[s]}</div>
      ))}
    </div>
  )
}

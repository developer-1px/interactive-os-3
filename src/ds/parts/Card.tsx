import type { ComponentPropsWithoutRef, ReactNode } from 'react'

/**
 * Card — content widget의 surface primitive.
 *
 * 모든 Card 변형(ContractCard, StatCard, CourseCard 등)이 이걸 root로 쓴다.
 * - layout 결정 ❌ — 슬롯 위치는 부모 Grid의 row track + subgrid가 결정
 * - 슬롯 명명 어휘: 'preview' | 'title' | 'meta' | 'body' | 'checks' | 'footer'
 * - 호출자가 slots prop으로 ReactNode 주입, slotOrder로 DOM 순서 결정
 *
 * 셀렉터 namespace: `data-part="card"` + 슬롯 자식의 `data-slot="<name>"`.
 * (memory: ds/parts layer · No aria-roledescription namespace)
 */
export type CardSlot = 'preview' | 'title' | 'meta' | 'body' | 'checks' | 'footer'

export const CARD_SLOT_ORDER: CardSlot[] = ['preview', 'title', 'meta', 'body', 'checks', 'footer']

type CardProps = Omit<ComponentPropsWithoutRef<'article'>, 'children'> & {
  slots: Partial<Record<CardSlot, ReactNode>>
  slotOrder?: CardSlot[]
  selected?: boolean
}

export function Card({ slots, slotOrder = CARD_SLOT_ORDER, selected, ...rest }: CardProps) {
  return (
    <article
      data-part="card"
      aria-current={selected ? 'true' : undefined}
      {...rest}
    >
      {slotOrder.map((s) => slots[s] != null && (
        <div data-slot={s} key={s}>{slots[s]}</div>
      ))}
    </article>
  )
}

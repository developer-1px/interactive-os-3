/**
 * selectedStore — 카드 선택 상태를 Canvas 루트 밖에 둔다.
 *
 * 이전: `useState` in Canvas → setSelected → 전 트리 re-render → 80+ demo re-render.
 * 이후: 외부 store + useSyncExternalStore. 구독한 컴포넌트(card·aside) 만 re-render.
 */
import { useSyncExternalStore } from 'react'

let current: string | null = null
const listeners = new Set<() => void>()

export function getSelected(): string | null { return current }

export function setSelected(name: string | null) {
  if (current === name) return
  current = name
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

export function useSelected(): string | null {
  return useSyncExternalStore(subscribe, getSelected, getSelected)
}

/**
 * 카드 단위 구독 — name 별로 selector 분리. selected 가 다른 이름으로 바뀌면
 * 이전 선택 카드와 새 선택 카드 두 개만 re-render.
 */
export function useIsSelected(name: string): boolean {
  return useSyncExternalStore(
    subscribe,
    () => current === name,
    () => false,
  )
}

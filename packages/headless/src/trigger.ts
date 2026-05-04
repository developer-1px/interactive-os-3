import type { KeySpec } from './key'

interface Modifiers {
  ctrl?: boolean
  alt?: boolean
  meta?: boolean
  shift?: boolean
}

/**
 * Trigger — axis primitive 가 받는 입력 이벤트의 추상 형태.
 *
 * 'key'   : 키보드 입력 (ArrowLeft/Enter/Space/printable 등)
 * 'click' : 마우스/터치 pointer 활성화. modifier (shift/ctrl/meta/alt) 동반 가능 —
 *           Shift+Click range, Ctrl/Meta+Click toggle 등 multi-select 표준 매핑용.
 *
 * activate primitive 는 key/click 둘 다 반응. navigate/expand/typeahead 등은 'key' 만.
 */
export type Trigger =
  | ({ kind: 'key' } & KeySpec)
  | ({ kind: 'click' } & Modifiers)

/** KeySpec → key Trigger 빌더. */
export const keyTrigger = (k: KeySpec): Trigger => ({ kind: 'key', ...k })
/** Modifiers → click Trigger 빌더. (Shift+Click range, Meta+Click toggle 등) */
export const clickTrigger = (mods: Modifiers = {}): Trigger => ({ kind: 'click', ...mods })

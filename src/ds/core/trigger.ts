import type { KeySpec } from './key'

/**
 * Trigger — axis primitive 가 받는 입력 이벤트의 추상 형태.
 *
 * 'key' : 키보드 입력 (ArrowLeft/Enter/Space/printable 등)
 * 'click': 마우스/터치 pointer 활성화
 *
 * activate primitive 는 둘 다 반응. 나머지(navigate/expand/typeahead 등)는
 * 'key' 만 반응 — 'click' 은 각 컴포넌트의 focus 이동으로 흡수.
 */
export type Trigger =
  | ({ kind: 'key' } & KeySpec)
  | { kind: 'click' }

export const keyTrigger = (k: KeySpec): Trigger => ({ kind: 'key', ...k })
export const clickTrigger: Trigger = { kind: 'click' }

import type { KeySpec } from './key'
import type { SwipeDir } from './hooks/useSwipe'

/**
 * Trigger — axis primitive 가 받는 입력 이벤트의 추상 형태.
 *
 * 'key'   : 키보드 입력 (ArrowLeft/Enter/Space/printable 등)
 * 'click' : 마우스/터치 pointer 활성화
 * 'swipe' : 터치 swipe (left/right/up/down). navigate/swipe axis 가 매핑.
 *
 * activate primitive 는 key/click 둘 다 반응. navigate/expand/typeahead 등은
 * 'key' 만, swipe primitive 는 'swipe' 만 반응한다.
 */
export type Trigger =
  | ({ kind: 'key' } & KeySpec)
  | { kind: 'click' }
  | { kind: 'swipe'; dir: SwipeDir }

export const keyTrigger = (k: KeySpec): Trigger => ({ kind: 'key', ...k })
export const clickTrigger: Trigger = { kind: 'click' }
export const swipeTrigger = (dir: SwipeDir): Trigger => ({ kind: 'swipe', dir })

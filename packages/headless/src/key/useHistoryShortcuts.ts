import { useShortcut } from './useShortcut'
import type { UiEvent } from '../types'

/**
 * useHistoryShortcuts — Cmd+Z / Cmd+Shift+Z 표준 매핑.
 * dispatch 만 받으면 history 어휘 2종을 키보드로 자동 emit.
 *
 * @example
 * useHistoryShortcuts(dispatch)
 */
export function useHistoryShortcuts(dispatch: (e: UiEvent) => void): void {
  useShortcut('mod+z',       () => dispatch({ type: 'undo' }))
  useShortcut('mod+shift+z', () => dispatch({ type: 'redo' }))
  // mac safari fallback — Cmd+Y 도 redo 로 받는다
  useShortcut('mod+y',       () => dispatch({ type: 'redo' }))
}

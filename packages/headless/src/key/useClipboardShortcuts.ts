import { useShortcut } from './useShortcut'
import type { UiEvent } from '../types'

/**
 * useClipboardShortcuts — Cmd+C / Cmd+X / Cmd+V / Cmd+Shift+V / Backspace / Delete 표준 매핑.
 * `getActiveId()` 로 현재 active 엔티티 id 를 받아 5종 어휘를 자동 emit.
 *
 * @example
 * useClipboardShortcuts(dispatch, () => activeId)
 */
export function useClipboardShortcuts(
  dispatch: (e: UiEvent) => void,
  getActiveId: () => string | null | undefined,
): void {
  const withId = (fn: (id: string) => UiEvent) => () => {
    const id = getActiveId()
    if (id) dispatch(fn(id))
  }
  useShortcut('mod+c',       withId((id) => ({ type: 'copy', id })))
  useShortcut('mod+x',       withId((id) => ({ type: 'cut',  id })))
  useShortcut('mod+v',       withId((id) => ({ type: 'paste', id, mode: 'auto' })))
  useShortcut('mod+shift+v', withId((id) => ({ type: 'paste', id, mode: 'child'   })))
  useShortcut('Backspace',   withId((id) => ({ type: 'remove', id })))
  useShortcut('Delete',      withId((id) => ({ type: 'remove', id })))
}

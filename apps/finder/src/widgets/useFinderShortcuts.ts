import { useCallback } from 'react'
import { FinderCmdSpec } from '../entities/spec'
import type { FinderCmd } from '../entities/schema'

/** finder.shortcut — spec.cmds.keys SSOT 에서 자동 생성되는 keymap 라우터.
 *
 *  설계:
 *  - window 글로벌 X. <main onKeyDown={...}> 에 부착해 focus tree 가
 *    finder root 안에 있을 때만 발화.
 *  - SearchBox 등 child 가 e.stopPropagation() 으로 self-handle 가능 (자연 bubble).
 *  - cmd ↔ key 매핑은 spec.cmds.keys 가 owner. 새 cmd 의 keys 슬롯이 비어 있으면
 *    cheatsheet UI 가 즉시 빈칸으로 표시 → SSOT 압력. */

type Binding = { chord: string; type: keyof typeof FinderCmdSpec; payload?: Record<string, unknown> }

const bindings: Binding[] = (() => {
  const out: Binding[] = []
  for (const [type, def] of Object.entries(FinderCmdSpec)) {
    const keys = (def as { keys?: ReadonlyArray<{ chord: string; payload?: Record<string, unknown> }> }).keys
    if (!keys) continue
    for (const k of keys) out.push({ chord: k.chord, type: type as keyof typeof FinderCmdSpec, payload: k.payload })
  }
  return out
})()

/** chord 'Meta+Shift+.' → e 매칭. key 는 마지막 segment, 그 외는 modifier. */
function matchChord(chord: string, e: KeyboardEvent | React.KeyboardEvent): boolean {
  const parts = chord.split('+')
  const code = parts[parts.length - 1]
  const mods = new Set(parts.slice(0, -1))
  if (mods.has('Meta')  !== e.metaKey)  return false
  if (mods.has('Shift') !== e.shiftKey) return false
  if (mods.has('Alt')   !== e.altKey)   return false
  if (mods.has('Ctrl')  !== e.ctrlKey)  return false
  // e.code 로 매칭 — layout/IME 독립 (Shift+. → Period 고정).
  return e.code === code
}

export function useFinderShortcuts(dispatch: (c: FinderCmd) => void) {
  return useCallback((e: React.KeyboardEvent) => {
    // input 안에서는 통과 — 검색창 타이핑 보호.
    const t = e.target as HTMLElement | null
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return

    // eslint-disable-next-line no-console
    console.log('[finder.key]', { code: e.code, key: e.key, meta: e.metaKey, shift: e.shiftKey, alt: e.altKey, ctrl: e.ctrlKey })

    for (const b of bindings) {
      if (matchChord(b.chord, e)) {
        e.preventDefault()
        dispatch({ type: b.type, ...(b.payload ?? {}) } as FinderCmd)
        return
      }
    }
  }, [dispatch])
}

/** Inspector·cheatsheet UI 용 — spec 에 등록된 모든 binding 노출. */
export const finderKeyBindings: ReadonlyArray<Binding> = bindings

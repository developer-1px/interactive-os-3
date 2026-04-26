/** Effect — 외부 동기화를 데이터로 표현. runtime 이 prev/next diff 후 실행. */

export type Effect =
  | { kind: 'navigate';       to: string }
  | { kind: 'focus';          selector: string }
  | { kind: 'scroll';         selector: string; top?: number; left?: number; behavior?: ScrollBehavior }
  | { kind: 'clipboard.write'; text: string }
  | { kind: 'title';          text: string }

const eq = (a: Effect, b: Effect): boolean => {
  if (a.kind !== b.kind) return false
  return JSON.stringify(a) === JSON.stringify(b)
}

const run = (e: Effect): void => {
  switch (e.kind) {
    case 'navigate':
      if (typeof window !== 'undefined' && window.location.pathname + window.location.search !== e.to) {
        history.pushState(null, '', e.to)
      }
      return
    case 'focus': {
      const el = document.querySelector<HTMLElement>(e.selector)
      if (el && document.activeElement !== el) el.focus()
      return
    }
    case 'scroll': {
      const el = document.querySelector<HTMLElement>(e.selector)
      if (el) el.scrollTo({ top: e.top, left: e.left, behavior: e.behavior })
      return
    }
    case 'clipboard.write':
      void navigator.clipboard?.writeText(e.text)
      return
    case 'title':
      if (document.title !== e.text) document.title = e.text
      return
  }
}

/** prev → next diff 후 새로 등장한 effect 만 실행. selector + 시그니처가 같으면 스킵. */
export function applyEffectsDiff(prev: Effect[], next: Effect[]): void {
  for (const e of next) if (!prev.some((p) => eq(p, e))) run(e)
}

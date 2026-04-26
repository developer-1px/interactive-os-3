/** /keyboard 페이지 — Section · FixtureFrame · ShortcutTable · FocusTracker. */
import { useState, useRef, useEffect, type ReactNode } from 'react'

export function FocusTracker() {
  const [info, setInfo] = useState({ tag: '—', role: '—', label: '—', activeId: '—' })
  useEffect(() => {
    const update = () => {
      const el = document.activeElement as HTMLElement | null
      if (!el) return
      setInfo({
        tag: el.tagName.toLowerCase(),
        role: el.getAttribute('role') ?? '—',
        label: el.getAttribute('aria-label') ?? el.textContent?.trim().slice(0, 40) ?? '—',
        activeId: el.getAttribute('aria-activedescendant') ?? el.id ?? '—',
      })
    }
    document.addEventListener('focusin', update)
    document.addEventListener('keyup', update)
    update()
    return () => {
      document.removeEventListener('focusin', update)
      document.removeEventListener('keyup', update)
    }
  }, [])
  return (
    <dl data-part="focus-tracker" aria-label="현재 포커스">
      <dt>tag</dt><dd>{info.tag}</dd>
      <dt>role</dt><dd>{info.role}</dd>
      <dt>label</dt><dd>{info.label}</dd>
      <dt>active id</dt><dd>{info.activeId}</dd>
    </dl>
  )
}

export function Section({ title, shortcuts, children }: {
  title: string
  shortcuts: ReadonlyArray<readonly [string, string]>
  children: ReactNode
}) {
  return (
    <section aria-labelledby={`kb-${title}`}>
      <h2 id={`kb-${title}`}>{title}</h2>
      <div data-ds="Row">
        <FixtureFrame>{children}</FixtureFrame>
        <ShortcutTable rows={shortcuts} />
      </div>
    </section>
  )
}

function FixtureFrame({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [hasFocus, setHasFocus] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onIn = () => setHasFocus(true)
    const onOut = () => setHasFocus(el.contains(document.activeElement))
    el.addEventListener('focusin', onIn)
    el.addEventListener('focusout', onOut)
    return () => {
      el.removeEventListener('focusin', onIn)
      el.removeEventListener('focusout', onOut)
    }
  }, [])
  return <div ref={ref} data-part="fixture" data-focused={hasFocus || undefined}>{children}</div>
}

function ShortcutTable({ rows }: { rows: ReadonlyArray<readonly [string, string]> }) {
  return (
    <table data-part="key-map">
      <thead><tr><th scope="col">key</th><th scope="col">action</th></tr></thead>
      <tbody>
        {rows.map(([k, a]) => (
          <tr key={k}><th scope="row"><kbd>{k}</kbd></th><td>{a}</td></tr>
        ))}
      </tbody>
    </table>
  )
}

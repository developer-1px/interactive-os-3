/** /keyboard 페이지 — Group · Section · FixtureFrame · ShortcutTable · FocusTracker. */
import { useState, useRef, useEffect, type ReactNode } from 'react'

export function Group({ title, caption, children }: {
  title: string
  caption?: string
  children: ReactNode
}) {
  const id = `kbgrp-${title}`
  return (
    <section data-part="kb-group" aria-labelledby={id}>
      <header data-ds="Column">
        <h2 id={id}>{title}</h2>
        {caption && <p data-part="kb-group-caption">{caption}</p>}
      </header>
      {children}
    </section>
  )
}

export function FocusTracker() {
  const [info, setInfo] = useState({ tag: '—', role: '—', label: '—', activeId: '—' })
  useEffect(() => {
    const update = () => {
      const el = document.activeElement as HTMLElement | null
      if (!el || el === document.body) {
        setInfo({ tag: '—', role: '—', label: '—', activeId: '—' })
        return
      }
      const rawLabel = el.getAttribute('aria-label') ?? el.innerText?.trim() ?? ''
      setInfo({
        tag: el.tagName.toLowerCase(),
        role: el.getAttribute('role') ?? '—',
        label: rawLabel.length > 40 ? rawLabel.slice(0, 40) + '…' : (rawLabel || '—'),
        activeId: el.getAttribute('aria-activedescendant') ?? (el.getAttribute('data-id') || el.id || '—'),
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
    <section aria-labelledby={`kb-${title}`} data-part="kb-section">
      <h3 id={`kb-${title}`}>{title}</h3>
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
        {rows.map(([k, a], i) => (
          <tr key={`${k}-${i}`}><th scope="row"><kbd>{k}</kbd></th><td>{a}</td></tr>
        ))}
      </tbody>
    </table>
  )
}

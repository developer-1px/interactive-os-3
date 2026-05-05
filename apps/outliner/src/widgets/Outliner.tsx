import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { useResource } from '@p/headless/store'
import { useTreePattern } from '@p/headless/patterns'
import { getFocus, reduce, type Meta, type UiEvent } from '@p/headless'
import { useHistoryShortcuts, useClipboardShortcuts } from '@p/headless/key'
import { outlineResource } from '../features/outlineResource'
import { flattenOutline } from '../features/flattenOutline'
import { crud } from '../features/outlineCrud'

export function Outliner() {
  const [doc, dispatch] = useResource(outlineResource)
  const snapshot = doc ?? crud.snapshot()
  const [meta, setMeta] = useState<Meta>({})

  useEffect(() =>
    crud.subscribe((_changes, focus) => {
      if (focus) setMeta((prev) => ({ ...prev, focus }))
    }), [])

  const data = useMemo(() => {
    const d = flattenOutline(snapshot)
    return { ...d, meta: { ...d.meta, ...meta } }
  }, [snapshot, meta])

  const onEvent = (e: UiEvent) => {
    dispatch(e)
    setMeta((prev) => reduce({ ...data, meta: prev }, e).meta ?? prev)
  }

  const tree = useTreePattern(data, onEvent, { editable: true, label: 'outline' })
  const activeId = getFocus(data) ?? tree.items[0]?.id ?? null

  useHistoryShortcuts(onEvent)
  useClipboardShortcuts(onEvent, () => activeId)

  const json = useMemo(() => JSON.stringify(crud.toJson(), null, 2), [snapshot])

  return (
    <main className="grid h-screen grid-cols-2 divide-x divide-neutral-200">
      <section className="overflow-auto p-6">
        <header className="mb-4 flex items-baseline gap-3">
          <h1 className="text-sm font-semibold text-neutral-500">Outliner</h1>
          <p className="text-xs text-neutral-400">
            Enter · Tab · Shift+Tab · Backspace · Cmd+C/X/V · Cmd+Z/Shift+Z
          </p>
        </header>
        <ul {...tree.rootProps} className="font-mono text-sm">
          {tree.items.map((item) => (
            <li
              key={item.id}
              {...tree.itemProps(item.id)}
              className="flex gap-2 py-0.5 pl-[calc(var(--lvl)*1rem)] outline-none focus:bg-blue-50 data-[selected]:bg-blue-100"
              style={{ '--lvl': item.level } as CSSProperties}
            >
              <span aria-hidden className="text-neutral-400">
                {item.hasChildren ? (item.expanded ? '▾' : '▸') : '•'}
              </span>
              <span>{item.label || <em className="text-neutral-300">empty</em>}</span>
            </li>
          ))}
        </ul>
      </section>
      <aside className="overflow-auto bg-neutral-50 p-6">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Live JSON (zod-crud snapshot)
        </h2>
        <pre className="whitespace-pre font-mono text-xs leading-relaxed text-neutral-800">{json}</pre>
      </aside>
    </main>
  )
}

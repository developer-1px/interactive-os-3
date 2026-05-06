import { useMemo, type CSSProperties } from 'react'
import { useTreePattern, treeBuiltinChords } from '@p/headless/patterns'
import { useZodCrudResource } from '@p/headless/adapters/zod-crud'
import { outlineResource } from '../features/outlineResource'
import { flattenOutline } from '../features/flattenOutline'
import { crud } from '../features/outlineCrud'

const isMac = typeof navigator !== 'undefined' && /mac/i.test(navigator.platform)

/** chord-string → display 형태. `mod` → ⌘/Ctrl, modifier 토큰 기호화. */
const fmtChord = (chord: string): string =>
  chord
    .split('+')
    .map((part) => {
      const lower = part.toLowerCase()
      if (lower === 'mod') return isMac ? '⌘' : 'Ctrl'
      if (lower === 'shift') return '⇧'
      if (lower === 'alt') return isMac ? '⌥' : 'Alt'
      if (lower === 'ctrl') return 'Ctrl'
      if (lower === 'meta') return '⌘'
      return part.charAt(0).toUpperCase() + part.slice(1)
    })
    .join('+')

export function Outliner() {
  const [data, onEvent] = useZodCrudResource(outlineResource, crud, flattenOutline, { kind: 'tree' })
  const tree = useTreePattern(data, onEvent, { editable: true, label: 'outline' })

  const json = useMemo(() => JSON.stringify(crud.toJson(), null, 2), [data])

  // chord-string 정본에서 SSOT 렌더. clipboard:* 의사 chord 는 표시 제외.
  const visibleChords = treeBuiltinChords.filter((c) => !c.chord.startsWith('clipboard:'))

  return (
    <main className="grid h-screen grid-cols-2 divide-x divide-neutral-200">
      <section className="overflow-auto p-6">
        <header className="mb-4">
          <h1 className="text-sm font-semibold text-neutral-500">Outliner</h1>
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
      <aside className="flex flex-col overflow-hidden bg-neutral-50">
        <section className="border-b border-neutral-200 p-6">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Keymap (SSOT — treeBuiltinChords)
          </h2>
          <table className="w-full text-xs">
            <tbody>
              {visibleChords.map((c) => (
                <tr key={c.chord + c.uiEvent} className="border-b border-neutral-100 last:border-0">
                  <td className="py-1 pr-3 align-top">
                    <kbd className="rounded border border-neutral-300 bg-white px-1.5 py-0.5 font-mono text-[11px] text-neutral-700 shadow-[0_1px_0_0_#d6d3d1]">
                      {fmtChord(c.chord)}
                    </kbd>
                  </td>
                  <td className="py-1 pr-3 align-top font-mono text-[11px] text-blue-600">
                    {c.uiEvent}
                  </td>
                  <td className="py-1 align-top text-neutral-600">{c.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="flex-1 overflow-auto p-6">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Live JSON (zod-crud snapshot)
          </h2>
          <pre className="whitespace-pre font-mono text-xs leading-relaxed text-neutral-800">{json}</pre>
        </section>
      </aside>
    </main>
  )
}

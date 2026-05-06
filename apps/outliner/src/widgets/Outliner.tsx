import { useMemo, type CSSProperties } from 'react'
import { useTreePattern, treeBuiltinChords } from '@p/headless/patterns'
import { useZodCrudResource } from '@p/headless/adapters/zod-crud'
import { outlineResource } from '../features/outlineResource'
import { flattenOutline } from '../features/flattenOutline'
import { resolveTextNodeId } from '../features/resolveTextNodeId'
import { crud } from '../features/outlineCrud'
import { EditInput } from './EditInput'
import { KeymapPanel } from './KeymapPanel'
import { JsonInspector } from './JsonInspector'

export function Outliner() {
  const [data, onEvent] = useZodCrudResource(outlineResource, crud, flattenOutline, { kind: 'tree' })
  const tree = useTreePattern(data, onEvent, { editable: true, label: 'outline' })

  const json = useMemo(() => crud.toJson(), [data])

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
              {data.meta?.editing === item.id ? (
                <EditInput
                  initial={item.label}
                  onCommit={(value, cancelled) => {
                    if (!cancelled) {
                      const textNodeId = resolveTextNodeId(crud.snapshot(), item.id)
                      if (textNodeId) onEvent({ type: 'update', id: textNodeId, value })
                    }
                    onEvent({ type: 'editEnd' })
                  }}
                />
              ) : (
                <span>{item.label || <em className="text-neutral-300">empty</em>}</span>
              )}
            </li>
          ))}
        </ul>
      </section>
      <aside className="flex flex-col overflow-hidden bg-neutral-50">
        <KeymapPanel chords={treeBuiltinChords} title="Keymap (SSOT — treeBuiltinChords)" />
        <JsonInspector value={json} title="Live JSON (zod-crud snapshot)" />
      </aside>
    </main>
  )
}

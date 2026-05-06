import { type CSSProperties } from 'react'
import { useTreePattern } from '@p/headless/patterns'
import { useZodCrudResource } from '@p/headless/adapters/zod-crud'
import { outlineResource } from '../features/outlineResource'
import { flattenOutline } from '../features/flattenOutline'
import { resolveTextNodeId } from '../features/resolveTextNodeId'
import { crud } from '../features/outlineCrud'
import { EditInput } from './EditInput'

export function Outliner() {
  const [data, onEvent] = useZodCrudResource(outlineResource, crud, flattenOutline, { kind: 'tree' })
  const tree = useTreePattern(data, onEvent, { editable: true, label: 'outline' })
  return (
    <ul {...tree.rootProps} className="font-mono text-sm p-6">
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
  )
}

import { type CSSProperties } from 'react'
import { useTreePattern } from '@p/headless/patterns'
import { useZodCrudResource } from '@p/headless/adapters/zod-crud'
import { outlinerSpec } from './outliner.spec'
import { resource } from './resource'
import { flatten } from './flatten'
import { crud } from './crud'
import { EditInput } from './EditInput'

const { labelField, ariaPattern, patternOptions, commands } = outlinerSpec

export function Outliner() {
  const [data, onEvent] = useZodCrudResource(resource, crud, flatten, { kind: ariaPattern, labelField })
  const tree = useTreePattern(data, onEvent, { ...patternOptions, commands })
  return (
    <ul {...tree.rootProps} className="font-mono text-sm p-6">
      {tree.items.map((item) => {
        const edit = tree.editProps(item.id)
        const glyph = item.hasChildren ? (item.expanded ? '▾' : '▸') : '•'
        return (
          <li
            key={item.id}
            {...tree.itemProps(item.id)}
            className="flex gap-2 py-0.5 outline-none focus:bg-blue-50 data-[selected]:bg-blue-100"
            style={{ '--lvl': item.level, paddingLeft: `${item.level}rem` } as CSSProperties}
          >
            <span aria-hidden className="text-neutral-400">{glyph}</span>
            {edit
              ? <EditInput initial={edit.initial} onCommit={edit.onCommit} className="flex-1 rounded border border-blue-400 bg-white px-1 outline-none" />
              : <span>{item.label || <em className="text-neutral-300">empty</em>}</span>}
          </li>
        )
      })}
    </ul>
  )
}

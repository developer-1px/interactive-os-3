import { type CSSProperties } from 'react'
import { useTreePattern } from '@p/headless/patterns'
import { useZodCrudResource } from '@p/headless/adapters/zod-crud'
import { outlinerSpec } from './outliner.spec'
import { resource } from './resource'
import { flatten } from './flatten'
import { crud } from './crud'
import { EditInput } from './EditInput'

const { glyphs, indent, classNames, emptyLabel, labelField, ariaPattern, patternOptions, commands } = outlinerSpec

export function Outliner() {
  const [data, onEvent] = useZodCrudResource(resource, crud, flatten, { kind: ariaPattern, labelField })
  const tree = useTreePattern(data, onEvent, { ...patternOptions, commands })
  return (
    <ul {...tree.rootProps} className={classNames.container}>
      {tree.items.map((item) => {
        const edit = tree.editProps(item.id)
        const glyph = item.hasChildren ? (item.expanded ? glyphs.open : glyphs.closed) : glyphs.leaf
        return (
          <li
            key={item.id}
            {...tree.itemProps(item.id)}
            className={classNames.item}
            style={{ '--lvl': item.level, paddingLeft: indent(item.level) } as CSSProperties}
          >
            <span aria-hidden className={classNames.glyph}>{glyph}</span>
            {edit
              ? <EditInput initial={edit.initial} onCommit={edit.onCommit} className={classNames.editInput} />
              : <span>{item.label || <em className={classNames.emptyLabel}>{emptyLabel}</em>}</span>}
          </li>
        )
      })}
    </ul>
  )
}

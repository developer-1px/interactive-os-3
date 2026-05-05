import { fromTree, type UiEvent } from '@p/headless'
import { menubarAxis, useMenubarPattern } from '@p/headless/patterns'
import { useLocalData } from '@p/headless/local'
import { axisKeys } from '@p/headless'

export const meta = {
  title: 'Menubar · Editor',
  apg: 'menubar',
  kind: 'collection' as const,
  blurb: 'Format menu with menuitemcheckbox + menuitemradio (single-group exclusivity).',
  keys: () => axisKeys(menubarAxis()),
}

interface Node { id: string; label: string; kind?: string; group?: string; checked?: boolean; children?: Node[] }

const ALIGN_GROUP = ['align-left', 'align-center', 'align-right']

const TREE: Node[] = [
  { id: 'format', label: 'Format', children: [
    { id: 'bold', label: 'Bold', kind: 'menuitemcheckbox', checked: true },
    { id: 'italic', label: 'Italic', kind: 'menuitemcheckbox', checked: false },
    { id: 'underline', label: 'Underline', kind: 'menuitemcheckbox', checked: false },
    { id: 'align-left', label: 'Align left', kind: 'menuitemradio', group: 'align', checked: true },
    { id: 'align-center', label: 'Align center', kind: 'menuitemradio', group: 'align' },
    { id: 'align-right', label: 'Align right', kind: 'menuitemradio', group: 'align' },
  ] },
  { id: 'view', label: 'View', children: [
    { id: 'gridlines', label: 'Gridlines', kind: 'menuitemcheckbox', checked: false },
    { id: 'rulers', label: 'Rulers', kind: 'menuitemcheckbox', checked: true },
  ] },
]

export default function Demo() {
  const [data, onEvent] = useLocalData(
    () => fromTree(TREE),
    (d, e) => {
      // checkbox toggle + radio group exclusivity
      if (e.type === 'activate') {
        const ent = d.entities[e.id] ?? {}
        const next = { ...d, entities: { ...d.entities } }
        if (ent.kind === 'menuitemcheckbox') {
          next.entities[e.id] = { ...ent, checked: !ent.checked }
        } else if (ent.kind === 'menuitemradio') {
          for (const gid of ALIGN_GROUP) {
            next.entities[gid] = { ...next.entities[gid], checked: gid === e.id }
          }
        }
        return next
      }
      return d
    },
  )

  const { rootProps, menubarItemProps, menuProps, menuitemProps, items, openId } =
    useMenubarPattern(data, onEvent as (e: UiEvent) => void, { label: 'Editor' })

  return (
    <div className="relative">
      <div {...rootProps} className="inline-flex rounded-md border border-stone-200 bg-white text-sm">
        {items.map((item) => (
          <button
            key={item.id}
            {...menubarItemProps(item.id)}
            className="px-3 py-1.5 hover:bg-stone-100 aria-expanded:bg-stone-900 aria-expanded:text-white first:rounded-l-md last:rounded-r-md"
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((top) => {
        if (openId !== top.id) return null
        const subs = (TREE.find((t) => t.id === top.id)?.children ?? [])
        return (
          <ul
            key={top.id}
            {...menuProps(top.id)}
            className="absolute left-0 top-full z-10 mt-1 min-w-[12rem] rounded-md border border-stone-200 bg-white p-1 text-sm shadow-lg"
          >
            {subs.map((sub) => {
              const ent = data.entities[sub.id] ?? {}
              const checked = ent.checked
              return (
                <li
                  key={sub.id}
                  {...menuitemProps(sub.id)}
                  className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 focus:bg-stone-900 focus:text-white focus:outline-none"
                >
                  <span aria-hidden className="w-3 text-stone-500">
                    {sub.kind === 'menuitemradio' ? (checked ? '●' : '○') : sub.kind === 'menuitemcheckbox' ? (checked ? '✓' : '') : ''}
                  </span>
                  <span>{sub.label}</span>
                </li>
              )
            })}
          </ul>
        )
      })}
    </div>
  )
}

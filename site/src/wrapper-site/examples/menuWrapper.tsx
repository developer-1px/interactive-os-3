/* eslint-disable react-refresh/only-export-components */
import { ROOT, reduceWithDefaults, type NormalizedData } from '@p/headless'
import { useLocalData } from '@p/headless/local'
import { Menu, type MenuSlotProps, type MenuSlots, menuWrapperKeys } from './_menuWrapper'

// 데이터는 예제에서 직접 보이도록 inline. wrapper(Menu) 는 _menuWrapper 안.
//
// 트리 구조:
//   ROOT (label='File')
//     ├─ new           (leaf)
//     ├─ open          (leaf)
//     ├─ open-recent   (parent → recent-1, recent-2, recent-3)
//     ├─ sep-1         (separator)
//     ├─ save          (leaf)
//     ├─ save-as       (leaf)
//     ├─ export        (parent → export-pdf, export-png, export-html)
//     ├─ sep-2         (separator)
//     └─ close         (leaf)

interface MenuItem extends Record<string, unknown> {
  label: string
  icon?: string
  shortcut?: string
  kind?: 'menuitem' | 'separator'
  disabled?: boolean
}

const initialData: NormalizedData = {
  entities: {
    [ROOT]: { id: ROOT, data: { label: 'File' } },
    new: { id: 'new', data: { label: 'New file', icon: '+', shortcut: '⌘N' } satisfies MenuItem },
    open: { id: 'open', data: { label: 'Open…', icon: '↑', shortcut: '⌘O' } satisfies MenuItem },
    'open-recent': { id: 'open-recent', data: { label: 'Open recent', icon: '⏱' } satisfies MenuItem },
    'recent-1': { id: 'recent-1', data: { label: 'project.tsx' } satisfies MenuItem },
    'recent-2': { id: 'recent-2', data: { label: 'README.md' } satisfies MenuItem },
    'recent-3': { id: 'recent-3', data: { label: 'package.json' } satisfies MenuItem },
    'sep-1': { id: 'sep-1', data: { label: '', kind: 'separator', disabled: true } satisfies MenuItem },
    save: { id: 'save', data: { label: 'Save', icon: '💾', shortcut: '⌘S' } satisfies MenuItem },
    'save-as': { id: 'save-as', data: { label: 'Save as…', shortcut: '⇧⌘S' } satisfies MenuItem },
    export: { id: 'export', data: { label: 'Export', icon: '↗' } satisfies MenuItem },
    'export-pdf': { id: 'export-pdf', data: { label: 'PDF' } satisfies MenuItem },
    'export-png': { id: 'export-png', data: { label: 'PNG' } satisfies MenuItem },
    'export-html': { id: 'export-html', data: { label: 'HTML' } satisfies MenuItem },
    'sep-2': { id: 'sep-2', data: { label: '', kind: 'separator', disabled: true } satisfies MenuItem },
    close: { id: 'close', data: { label: 'Close', icon: '✕', shortcut: '⌘W' } satisfies MenuItem },
  },
  relationships: {
    [ROOT]: ['new', 'open', 'open-recent', 'sep-1', 'save', 'save-as', 'export', 'sep-2', 'close'],
    'open-recent': ['recent-1', 'recent-2', 'recent-3'],
    export: ['export-pdf', 'export-png', 'export-html'],
  },
}

const slots: MenuSlots<MenuItem> = {
  icon: ({ data }: MenuSlotProps<MenuItem>) =>
    typeof data.icon === 'string' ? data.icon : null,
  shortcut: ({ data }: MenuSlotProps<MenuItem>) =>
    typeof data.shortcut === 'string' ? data.shortcut : null,
}

export const meta = {
  title: 'Menu Wrapper',
  apg: 'menu',
  blurb:
    'Wrapper owns trigger, popup, focus return, Escape, close-on-activate, nested submenus (ArrowRight/Enter to open, ArrowLeft to close), and separator items — all from one normalized data graph.',
  keys: menuWrapperKeys,
}

export default function Demo() {
  const [data, onEvent] = useLocalData(() => initialData, reduceWithDefaults)

  return <Menu data={data} onEvent={onEvent} slots={slots as MenuSlots} />
}

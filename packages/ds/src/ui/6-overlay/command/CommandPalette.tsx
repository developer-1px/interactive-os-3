import { useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'
import type { PaletteEntry } from './usePaletteEntries'
import { Dialog } from '../Dialog'
import { Renderer } from '../../Renderer'
import { definePage } from '../../../headless/layout/definePage'
import { ROOT } from '../../../headless/types'
import { useShortcut } from '../../../headless/hooks/useShortcut'
import { usePaletteController } from './usePaletteController'

const INPUT_DOM_ID = 'palette-input'
const LIST_DOM_ID = 'palette-list'

/**
 * CommandPalette — FlatLayout (definePage + Renderer) 기반.
 *
 * 외곽 chrome 만 Dialog (overlay primitive). 내부 entities tree 는
 *   ROOT → page (Column flow=prose)
 *     ├─ search  (Section emphasis=raised, 카드 surface) → Combobox
 *     └─ body    (Section emphasis=raised, 카드 surface) → Listbox 또는 RouteGrid (mode 별)
 *
 * 모든 ui 부품은 registry 에 등록. JSX 조립 ❌, props 만 entities tree 에 직렬.
 * focus 는 INPUT_DOM_ID 로 id 기반 — ref 직렬화 회피 (CLAUDE.md "Serializable-first").
 */
export function CommandPalette() {
  const ctrl = usePaletteController()
  const router = useRouter()
  useShortcut('mod+k', ctrl.toggle)

  // dialog open 시 input 자동 focus (id 기반)
  useEffect(() => {
    if (!ctrl.open) return
    queueMicrotask(() => document.getElementById(INPUT_DOM_ID)?.focus())
  }, [ctrl.open])

  const page = buildPage({
    query: ctrl.query,
    mode: ctrl.mode,
    activeId: ctrl.activeId,
    filtered: ctrl.filtered,
    entries: ctrl.entries,
    listData: ctrl.listData,
    onChange: (e) => ctrl.setQuery(e.currentTarget.value),
    onKeyDown: ctrl.onKeyDown,
    onListEvent: ctrl.onListEvent,
    onSelect: (e) => {
      ctrl.dispatchClose()
      router.navigate({ to: e.to, params: e.params })
    },
  })

  return (
    <Dialog data={ctrl.dialogData} onEvent={ctrl.onDialogEvent}>
      <Renderer page={page} />
    </Dialog>
  )
}

function buildPage(args: {
  query: string
  mode: 'query' | 'browse'
  activeId: string | undefined
  filtered: PaletteEntry[]
  entries: PaletteEntry[]
  listData: unknown
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onListEvent: (ev: { type: string; id?: string }) => void
  onSelect: (e: PaletteEntry) => void
}) {
  const { query, mode, activeId, filtered, entries, listData, onChange, onKeyDown, onListEvent, onSelect } = args
  const showList = mode === 'query' && filtered.length > 0
  const bodyChild = mode === 'browse' ? 'grid' : (showList ? 'list' : null)

  return definePage({
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      page: { id: 'page', data: { type: 'Column', flow: 'prose' } },
      search: {
        id: 'search',
        data: { type: 'Section', emphasis: 'raised', flow: 'cluster' },
      },
      input: {
        id: 'input',
        data: {
          type: 'Ui',
          component: 'Combobox',
          props: {
            id: INPUT_DOM_ID,
            expanded: mode === 'browse' || filtered.length > 0,
            controls: LIST_DOM_ID,
            activedescendant: mode === 'query' ? activeId : undefined,
            value: query,
            onChange,
            onKeyDown,
            placeholder: 'Jump to…',
            'aria-label': 'Search routes',
          },
        },
      },
      body: {
        id: 'body',
        data: { type: 'Section', emphasis: 'raised', flow: 'list' },
      },
      list: {
        id: 'list',
        data: {
          type: 'Ui',
          component: 'Listbox',
          props: { id: LIST_DOM_ID, data: listData, onEvent: onListEvent },
        },
      },
      grid: {
        id: 'grid',
        data: {
          type: 'Ui',
          component: 'RouteGrid',
          props: { entries, onSelect, 'aria-label': '라우트' },
        },
      },
    },
    relationships: {
      [ROOT]: ['page'],
      page: ['search', 'body'],
      search: ['input'],
      body: bodyChild ? [bodyChild] : [],
    },
  })
}

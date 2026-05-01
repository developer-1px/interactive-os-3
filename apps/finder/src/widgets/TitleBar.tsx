import {
  Toolbar, ROOT, FOCUS, useControlState,
  type NormalizedData, type UiEvent,
} from '@p/ds'
import { smartGroupOf } from '../features/data'
import type { ViewMode } from '../entities/types'

const VIEW_ITEMS: { id: ViewMode; icon: string; label: string }[] = [
  { id: 'icons',   icon: 'layout-grid',      label: '아이콘' },
  { id: 'list',    icon: 'list',             label: '목록' },
  { id: 'columns', icon: 'columns-3',        label: '컬럼' },
  { id: 'gallery', icon: 'gallery-vertical', label: '갤러리' },
]

const buildViewToolbar = (view: ViewMode): NormalizedData => ({
  entities: {
    [ROOT]: { id: ROOT, data: {} },
    ...Object.fromEntries(VIEW_ITEMS.map((v) => [
      v.id, { id: v.id, data: { label: v.label, icon: v.icon, pressed: view === v.id } },
    ])),
    [FOCUS]: { id: FOCUS, data: { id: view } },
  },
  relationships: { [ROOT]: VIEW_ITEMS.map((v) => v.id) },
})

const titleOf = (path: string) => {
  const smart = smartGroupOf(path)
  return smart ? `최근 — ${smart.label}` : (path.split('/').filter(Boolean).pop() ?? 'root')
}

export function TitleBar({
  path, onBack, canBack, view, onViewChange,
}: {
  path: string
  onBack: () => void
  canBack: boolean
  view: ViewMode
  onViewChange: (v: ViewMode) => void
}) {
  const name = titleOf(path)
  const [data, dispatch] = useControlState(buildViewToolbar(view))
  const onEvent = (e: UiEvent) => {
    dispatch(e)
    if (e.type === 'activate') onViewChange(e.id as ViewMode)
  }
  return (
    <header>
      <div data-part="window-controls" aria-label="창 컨트롤">
        <span /><span /><span />
      </div>
      <button type="button" onClick={onBack} aria-disabled={!canBack || undefined} aria-label="뒤로">‹</button>
      <button type="button" aria-disabled aria-label="앞으로">›</button>
      <h1>{name}</h1>
      <Toolbar data={data} onEvent={onEvent} aria-label="뷰 모드" />
    </header>
  )
}

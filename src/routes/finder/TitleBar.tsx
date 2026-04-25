import { Toolbar, ToolbarButton } from '../../ds'
import type { ViewMode } from './types'

const VIEW_ITEMS: { id: ViewMode; icon: string; label: string }[] = [
  { id: 'icons',   icon: 'layout-grid',      label: '아이콘' },
  { id: 'list',    icon: 'list',             label: '목록' },
  { id: 'columns', icon: 'columns-3',        label: '컬럼' },
  { id: 'gallery', icon: 'gallery-vertical', label: '갤러리' },
]

export function TitleBar({
  path, onBack, canBack, view, onViewChange,
}: {
  path: string
  onBack: () => void
  canBack: boolean
  view: ViewMode
  onViewChange: (v: ViewMode) => void
}) {
  const name = path.split('/').filter(Boolean).pop() ?? 'root'
  return (
    <header>
      <div aria-roledescription="window-controls" aria-label="창 컨트롤">
        <span /><span /><span />
      </div>
      <button type="button" onClick={onBack} aria-disabled={!canBack || undefined} aria-label="뒤로">‹</button>
      <button type="button" aria-disabled aria-label="앞으로">›</button>
      <h1>{name}</h1>
      <Toolbar aria-label="뷰 모드">
        {VIEW_ITEMS.map((v) => (
          <ToolbarButton
            key={v.id}
            pressed={view === v.id}
            aria-label={v.label}
            data-icon={v.icon}
            onClick={() => onViewChange(v.id)}
          />
        ))}
      </Toolbar>
    </header>
  )
}

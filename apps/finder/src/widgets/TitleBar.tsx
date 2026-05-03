import type { ComponentPropsWithoutRef } from 'react'
import {
  useControlState,
  type NormalizedData, type UiEvent,
} from '@p/headless'
import { useToolbarPattern } from '@p/headless/patterns'
import { smartGroupOf } from '../features/data'
import type { ViewMode } from '../entities/types'

const VIEW_ITEMS: { id: ViewMode; label: string }[] = [
  { id: 'icons',   label: '아이콘' },
  { id: 'list',    label: '목록' },
  { id: 'columns', label: '컬럼' },
  { id: 'gallery', label: '갤러리' },
]

const buildViewToolbar = (view: ViewMode): NormalizedData => ({
  entities: Object.fromEntries(
    VIEW_ITEMS.map((v) => [v.id, { label: v.label, pressed: view === v.id }]),
  ),
  relationships: {},
  meta: { root: VIEW_ITEMS.map((v) => v.id), focus: view },
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
  const { rootProps, itemProps, items } = useToolbarPattern(data, onEvent)

  return (
    <header className="flex items-center gap-3 border-b border-neutral-200 bg-white px-3 py-2">
      <div aria-label="창 컨트롤" className="flex gap-1.5">
        <span className="h-3 w-3 rounded-full bg-red-400" />
        <span className="h-3 w-3 rounded-full bg-yellow-400" />
        <span className="h-3 w-3 rounded-full bg-green-400" />
      </div>
      <button
        type="button"
        onClick={onBack}
        aria-disabled={!canBack || undefined}
        aria-label="뒤로"
        className="px-2 py-1 text-neutral-700 disabled:text-neutral-300"
      >‹</button>
      <button type="button" aria-disabled aria-label="앞으로" className="px-2 py-1 text-neutral-300">›</button>
      <h1 className="flex-1 truncate text-sm font-medium text-neutral-900">{name}</h1>
      <div
        {...(rootProps as ComponentPropsWithoutRef<'div'>)}
        aria-label="뷰 모드"
        className="inline-flex items-center rounded border border-neutral-200 bg-neutral-50 p-0.5"
      >
        {items.map((it) => {
          const d = data.entities[it.id] ?? {}
          const pressed = Boolean(d.pressed)
          return (
            <button
              key={it.id}
              type="button"
              {...(itemProps(it.id) as ComponentPropsWithoutRef<'button'>)}
              aria-pressed={pressed}
              className={
                'px-2 py-1 text-xs ' +
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 ' +
                (pressed ? 'rounded bg-white text-neutral-900 shadow-sm' : 'text-neutral-500')
              }
            >
              {String(d.label ?? it.label)}
            </button>
          )
        })}
      </div>
    </header>
  )
}

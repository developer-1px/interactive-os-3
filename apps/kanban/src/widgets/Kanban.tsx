import { useEffect, useMemo, useState } from 'react'
import { useResource } from '@p/headless/store'
import { useListboxPattern } from '@p/headless/patterns'
import { getFocus, reduce, type Meta, type UiEvent } from '@p/headless'
import { useHistoryShortcuts, useClipboardShortcuts } from '@p/headless/key'
import { boardResource } from '../features/boardResource'
import { flattenBoard } from '../features/flattenBoard'
import { crud } from '../features/boardCrud'

export function Kanban() {
  const [doc, dispatch] = useResource(boardResource)
  const snapshot = doc ?? crud.snapshot()
  const [meta, setMeta] = useState<Meta>({})

  useEffect(() =>
    crud.subscribe((_changes, focus) => {
      if (focus) setMeta((prev) => ({ ...prev, focus }))
    }), [])

  const { data, columnIds, rootId, cardParentArray } = useMemo(() => flattenBoard(snapshot), [snapshot])
  const merged = useMemo(() => ({ ...data, meta: { ...data.meta, ...meta } }), [data, meta])

  const onEvent = (e: UiEvent) => {
    dispatch(e)
    setMeta((prev) => reduce({ ...merged, meta: prev }, e).meta ?? prev)
  }

  /**
   * Kanban paste 의미 = "여기 다음에 끼우기" (sibling insert), 절대 overwrite 금지.
   * card target → parent cards-array + index 로 매핑해 zod-crud 에 전달.
   * (도메인-특화 — P2: ARIA 어휘 아님이라 widget 잔존이 정당.)
   */
  const onClipboard = (e: UiEvent) => {
    if (e.type === 'paste' && e.targetId && cardParentArray[e.targetId]) {
      const arrId = cardParentArray[e.targetId]
      const idx = (data.relationships[Object.keys(data.relationships).find(
        (k) => data.relationships[k]?.includes(e.targetId!),
      ) ?? ''] ?? []).indexOf(e.targetId)
      onEvent({ type: 'paste', targetId: arrId, mode: 'child', index: idx + 1 })
      return
    }
    onEvent(e)
  }

  const activeId = meta.selected?.[0] ?? getFocus(merged) ?? null

  useHistoryShortcuts(onEvent)
  useClipboardShortcuts(onClipboard, () => activeId)

  return (
    <main className="flex h-screen gap-4 overflow-x-auto bg-neutral-50 p-6">
      <header className="absolute right-6 top-6 text-xs text-neutral-400">
        Tab · ↑↓ · Enter · Backspace · Cmd+X→Tab→Cmd+V (move) · Cmd+Z
      </header>
      {columnIds.map((colId) => (
        <Column key={colId} id={colId} data={merged} onEvent={onEvent} />
      ))}
      <button
        onClick={() => onEvent({ type: 'appendChild', parentId: rootId })}
        className="h-10 shrink-0 self-start rounded border border-dashed border-neutral-300 px-3 text-xs text-neutral-500 hover:bg-white"
      >
        + Column
      </button>
    </main>
  )
}

function Column({
  id, data, onEvent,
}: {
  id: string
  data: import('@p/headless').NormalizedData
  onEvent: (e: UiEvent) => void
}) {
  const lb = useListboxPattern(data, onEvent, {
    containerId: id,
    label: data.entities[id]?.label,
    editable: true,
  })
  const title = data.entities[id]?.label ?? ''

  return (
    <section className="flex w-64 shrink-0 flex-col gap-2 rounded-lg bg-white p-3 shadow-sm">
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-semibold text-neutral-700">{title}</h2>
        <button
          onClick={() => onEvent({ type: 'appendChild', parentId: id })}
          className="text-xs text-neutral-400 hover:text-neutral-700"
          aria-label={`Add card to ${title}`}
        >
          +
        </button>
      </div>
      <ul {...lb.rootProps} className="flex flex-col gap-1.5 outline-none">
        {lb.items.length === 0 && (
          <li className="rounded border border-dashed border-neutral-200 p-2 text-xs text-neutral-300">
            empty
          </li>
        )}
        {lb.items.map((it) => (
          <li
            key={it.id}
            {...lb.optionProps(it.id)}
            className="cursor-default rounded border border-neutral-200 bg-white p-2 text-sm text-neutral-800 outline-none focus:border-blue-400 focus:bg-blue-50 data-[selected]:bg-blue-100"
          >
            {it.label || <em className="text-neutral-300">empty</em>}
          </li>
        ))}
      </ul>
    </section>
  )
}

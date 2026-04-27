import { type ReactNode, type KeyboardEvent, type DragEvent, useState } from 'react'
import { ROOT, getChildren, type ControlProps } from '../../headless/types'

/**
 * OrderableList — 사용자가 항목 순서를 직접 바꾸는 정렬 리스트.
 *
 * 데이터 주도. data.entities[id].data 에 4개 ReactNode slot 을 채우면
 * OrderableList 가 정해진 시각으로 행을 그린다:
 *   primary    필수 — 메인 라벨
 *   secondary  보조 — 시각·메타 단어 (small)
 *   meta       우측 — mark[data-tone] 등 caller 가 만들어 넘기는 ReactNode
 *   badge      좌측 강조 — NEW 등 caller 가 만들어 넘기는 ReactNode
 *
 * 키보드: 드래그 핸들 button focus 후 ArrowUp/ArrowDown 으로 인접 reorder 가 발생한다.
 * 마우스: HTML5 dnd. onReorder(fromId, toId) 단발 emit. toId 행 직전으로 이동을 의미한다.
 */
type OrderableListProps = ControlProps & {
  'aria-label': string
  numbered?: boolean
  onReorder: (fromId: string, toId: string) => void
}

const idFromTarget = (e: DragEvent | KeyboardEvent): string | null =>
  (e.currentTarget as HTMLElement).closest<HTMLElement>('[data-id]')?.dataset.id ?? null

export function OrderableList({ data, onReorder, numbered, ...rest }: OrderableListProps) {
  const ids = getChildren(data, ROOT)
  const [dragId, setDragId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)

  const onHandleKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const id = idFromTarget(e)
    if (!id) return
    const idx = ids.indexOf(id)
    if (idx < 0) return
    if (e.key === 'ArrowUp' && idx > 0) {
      e.preventDefault()
      onReorder(id, ids[idx - 1])
    } else if (e.key === 'ArrowDown' && idx < ids.length - 1) {
      e.preventDefault()
      onReorder(id, ids[idx + 1])
    }
  }

  const onItemDragStart = (e: DragEvent<HTMLLIElement>) => {
    const id = idFromTarget(e)
    if (!id) return
    setDragId(id)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', id)
  }
  const onItemDragOver = (e: DragEvent<HTMLLIElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    const id = idFromTarget(e)
    if (id && id !== overId) setOverId(id)
  }
  const onItemDrop = (e: DragEvent<HTMLLIElement>) => {
    e.preventDefault()
    const toId = idFromTarget(e)
    const fromId = e.dataTransfer.getData('text/plain') || dragId
    if (fromId && toId && fromId !== toId) onReorder(fromId, toId)
    setDragId(null); setOverId(null)
  }
  const onItemDragEnd = () => { setDragId(null); setOverId(null) }

  return (
    <ol data-part="orderable" {...rest}>
      {ids.map((id, i) => {
        const d = data.entities[id]?.data ?? {}
        const isDragging = dragId === id
        const isOver = overId === id && dragId !== id
        return (
          <li
            key={id}
            data-id={id}
            data-dragging={isDragging || undefined}
            data-drop-over={isOver || undefined}
            draggable
            onDragStart={onItemDragStart}
            onDragOver={onItemDragOver}
            onDrop={onItemDrop}
            onDragEnd={onItemDragEnd}
          >
            <button
              type="button"
              data-icon="grip-vertical"
              aria-label={`${i + 1}번째 항목 순서 변경`}
              onKeyDown={onHandleKey}
            />
            {numbered && <strong>{i + 1}.</strong>}
            {(d.badge as ReactNode) ?? null}
            <span>{d.primary as ReactNode}</span>
            {d.secondary != null && <small>{d.secondary as ReactNode}</small>}
            {(d.meta as ReactNode) ?? null}
          </li>
        )
      })}
    </ol>
  )
}

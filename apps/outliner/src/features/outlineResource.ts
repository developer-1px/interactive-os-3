import { defineResource } from '@p/headless/store'
import type { UiEvent } from '@p/headless'
import type { JsonDoc, NodeId } from 'zod-crud'
import { crud } from './outlineCrud'
import { flattenOutline, type OutlineItem } from './flattenOutline'

const newNode = () => ({ text: '', children: [] })

/**
 * applyEditEvent — UiEvent (편집 어휘 8종) 을 outline 의미로 zod-crud op 에 매핑.
 * generic `routeUiEventToCrud` 로는 부족한 outline 도메인 보강(부모 array 찾기,
 * 시블 추가, 자식 추가 등) 을 직접 처리한다.
 */
export function applyEditEvent(
  e: UiEvent,
  items: OutlineItem[],
): JsonDoc | undefined {
  const byId = (id: NodeId) => items.find((it) => it.id === id)

  switch (e.type) {
    case 'create': {
      // 형제 추가 = active 의 부모의 children array 에 push.
      // 부모가 없으면(root) active 본인의 children array 에 push (= 자식 추가).
      const active = byId(e.parentId)
      const target = active?.parentObjectId ? byId(active.parentObjectId) : active
      if (!target?.childrenArrayId) return undefined
      const arr = crud.read(target.childrenArrayId)
      const len = Array.isArray(arr) ? arr.length : 0
      const r = crud.create(target.childrenArrayId, len, newNode())
      return r.ok ? crud.snapshot() : undefined
    }
    case 'update': {
      const it = byId(e.id)
      if (!it) return undefined
      const current = crud.read(it.id) as { text: string; children: unknown[] }
      const next = { ...current, text: String(e.value) }
      const r = crud.update(it.id, next as never)
      return r.ok ? crud.snapshot() : undefined
    }
    case 'remove': {
      const it = byId(e.id)
      if (!it || !it.parentObjectId) return undefined // root 삭제 금지
      const r = crud.delete(it.id)
      return r.ok ? crud.snapshot() : undefined
    }
    case 'copy': {
      crud.copy(e.id)
      return undefined // copy 는 doc mutation 없음
    }
    case 'cut': {
      const r = crud.cut(e.id)
      return r.ok ? crud.snapshot() : undefined
    }
    case 'paste': {
      const it = byId(e.id)
      if (!it) return undefined
      const targetArr =
        e.mode === 'child'
          ? it.childrenArrayId
          : it.parentObjectId
            ? byId(it.parentObjectId)?.childrenArrayId
            : it.childrenArrayId
      if (!targetArr) return undefined
      const r = crud.paste(targetArr, { mode: 'auto' })
      return r.ok ? crud.snapshot() : undefined
    }
    case 'undo': {
      const r = crud.undo()
      return r.ok ? crud.snapshot() : undefined
    }
    case 'redo': {
      const r = crud.redo()
      return r.ok ? crud.snapshot() : undefined
    }
    default:
      return undefined
  }
}

export const outlineResource = defineResource<JsonDoc>({
  key: () => 'outline',
  initial: () => crud.snapshot(),
})

export { flattenOutline }

/**
 * useZodCrudResource — adapter hook 정본.
 *
 * 패턴 ↔ JsonCrud(zod-crud) wiring 1줄. 외부 store 통합(useResource), crud.subscribe →
 * meta.focus 자동 반영, flatten + meta 합성, dispatch 핸들러가 W3C Clipboard Event +
 * UiEvent 어휘를 jsonCrud op + reduce 양쪽으로 라우팅.
 *
 * 시그니처: `useZodCrudResource(resource, crud, flatten, opts?) → [data, dispatch]`.
 * useResource 시그니처와 정합. 4번째 인자 `opts.kind` 로 'list' | 'tree' | 'grid' 분기
 * (default 'tree').
 *
 * NOTE: UiEvent 정의(`types.ts:69-81`)에 `event` 필드 없음. 패턴 hook PR(Deep module #1)
 * 에서 `onEvent({type:'copy', id, event})` 동봉 시 UiEvent 확장 필요. 이 어댑터는 그
 * 확장이 들어왔다고 가정하고 `(e as {event?}).event` 로 옵셔널하게 읽는다 — event 없으면
 * clipboard payload 처리는 skip 하고 crud op 만 실행 (안전).
 */
import {useEffect, useMemo, useState} from 'react'
import type {ZodType} from 'zod'
import {reduce} from '../../state/reduce'
import {useResource, type Resource} from '../../store/data'
import {routeUiEventToCrud, type CrudPort} from '../../store/routeUiEventToCrud'
import type {Meta, NormalizedData, UiEvent} from '../../types'
import {decode, encode} from './codec'

type Kind = 'list' | 'tree' | 'grid'

/** crud.subscribe 까지 포함한 minimal duck-type. zod-crud `JsonCrud<T>` 호환. */
interface CrudWithSubscribe<S = unknown, V = unknown> extends CrudPort<S, V> {
  subscribe(notify: (changes: unknown[], focusNodeId?: string) => void): () => void
}

interface OperationResultLike {
  focusNodeId?: string
}

interface UseZodCrudOptions {
  kind?: Kind
  schema?: ZodType
}

export function useZodCrudResource<
  T,
  FlatItem extends Record<string, unknown> = Record<string, unknown>,
>(
  resource: Resource<unknown>,
  crud: CrudWithSubscribe,
  flatten: (
    snapshot: ReturnType<CrudWithSubscribe['snapshot']>,
  ) => Pick<NormalizedData<FlatItem>, 'entities' | 'relationships'> & {meta?: Partial<Meta>},
  opts: UseZodCrudOptions = {},
): [data: NormalizedData<FlatItem>, dispatch: (e: UiEvent) => void] {
  const kind: Kind = opts.kind ?? 'tree'

  const [doc, baseDispatch] = useResource(resource)
  const snapshot = (doc ?? crud.snapshot()) as ReturnType<CrudWithSubscribe['snapshot']>

  const [meta, setMeta] = useState<Meta>({})

  // crud.subscribe → meta.focus 자동 반영. unmount 시 자동 해제.
  useEffect(() => {
    return crud.subscribe((_changes, focusNodeId) => {
      if (focusNodeId) setMeta((prev) => ({...prev, focus: focusNodeId}))
    })
  }, [crud])

  const data = useMemo<NormalizedData<FlatItem>>(() => {
    const flat = flatten(snapshot)
    return {
      entities: flat.entities,
      relationships: flat.relationships,
      meta: {...flat.meta, ...meta},
    }
  }, [snapshot, meta, flatten])

  const dispatch = (e: UiEvent): void => {
    const ev = (e.type === 'copy' || e.type === 'cut' || e.type === 'paste') ? e.event : undefined
    const cb = ev?.clipboardData

    // ── Clipboard 어휘 — DOM event 동봉 시 payload 직렬화/역직렬화 ─────────────
    if (e.type === 'copy' || e.type === 'cut') {
      if (cb) {
        const value = crud.copy(e.id)
        const enc = encode(value, {kind})
        cb.setData('application/x-p-headless+json', enc.json)
        cb.setData('text/html', enc.html)
        cb.setData('text/plain', enc.plain)
        ev!.preventDefault()
      }
      if (e.type === 'cut') {
        const result = crud.cut(e.id) as OperationResultLike
        baseDispatch({type: 'set', value: crud.snapshot()})
        if (result?.focusNodeId) setMeta((prev) => ({...prev, focus: result.focusNodeId}))
      }
      return
    }

    // ── move — clipboard 미오염 구조 편집 (Tab demote/promote) ────────────────
    // read + insert + delete 시퀀스. crud.cut/paste 안 씀 → 사용자 clipboard buffer 보존.
    if (e.type === 'move') {
      const value = crud.read?.(e.id)
      if (value === undefined) return
      if (e.mode === 'child') {
        crud.appendChild(e.targetId, value as unknown as Parameters<CrudWithSubscribe['appendChild']>[1])
      } else if (e.mode === 'sibling-after' || e.mode === 'sibling-before') {
        // insertBefore 미노출 — sibling-before 도 insertAfter 로 근사 (현 zod-crud port 한계).
        crud.insertAfter(e.targetId, value as unknown as Parameters<CrudWithSubscribe['insertAfter']>[1])
      }
      const result = crud.delete(e.id) as OperationResultLike
      baseDispatch({type: 'set', value: crud.snapshot()})
      if (result?.focusNodeId) setMeta((prev) => ({...prev, focus: result.focusNodeId}))
      return
    }

    if (e.type === 'paste') {
      // DOM clipboard event 동봉 시: schema 검증만 (zod-crud paste 는 내부 buffer 사용 — value 안 받음).
      // 검증 실패 → silent 무시 (User Story #23). 단 DOM event 없을 때(Tab demote / Shift+Cmd+V keymap)
      // 는 검증 단계 skip 하고 내부 buffer 로 paste — Tab demote 시퀀스 cut+paste 가 같은 frame 안에서
      // 동작하므로 buffer 가 항상 fresh. cross-app paste 미지원(zod-crud 한계).
      if (cb) {
        const value = decode(cb, {kind, schema: opts.schema})
        if (value == null) return
        ev!.preventDefault()
      }
      const result = crud.paste(e.targetId, {mode: e.mode, index: e.index}) as OperationResultLike
      baseDispatch({type: 'set', value: crud.snapshot()})
      if (result?.focusNodeId) setMeta((prev) => ({...prev, focus: result.focusNodeId}))
      return
    }

    // ── 나머지 편집/히스토리 어휘 — routeUiEventToCrud 위임 ─────────────────────
    if (
      e.type === 'undo' ||
      e.type === 'redo' ||
      e.type === 'remove' ||
      e.type === 'update' ||
      e.type === 'insertAfter' ||
      e.type === 'appendChild'
    ) {
      const next = routeUiEventToCrud(crud, e)
      if (next !== undefined) {
        baseDispatch({type: 'set', value: next})
        // crud.subscribe 가 focus 를 push 하므로 별도 setMeta 불필요.
      }
      return
    }

    // ── view-state 어휘 — core reduce 위임 (focus/expand/select/typeahead/...) ─
    setMeta((prev) => {
      const next = reduce({entities: data.entities, relationships: data.relationships, meta: prev}, e)
      return next.meta ?? prev
    })
  }

  return [data, dispatch]
}

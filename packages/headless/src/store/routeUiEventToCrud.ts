import type { UiEvent } from '../types'

/**
 * CrudPort — UiEvent 8종을 받을 수 있는 minimal interface.
 * zod-crud `JsonCrud` 가 그대로 만족하지만, 구현은 무엇이든 OK (FS, in-memory, server proxy).
 * @p/headless 본체에 zod-crud import 0 — interface duck-typing 만.
 */
export interface CrudPort<Snap = unknown, Val = unknown> {
  snapshot(): Snap
  read?(id: string): unknown
  create(parentId: string, key: string | number | undefined, value: Val | undefined): unknown
  update(id: string, value: Val): unknown
  delete(id: string): unknown
  copy(id: string): unknown
  cut(id: string): unknown
  paste(id: string, opts?: { mode?: 'auto' | 'child' | 'overwrite' }): unknown
  undo(): unknown
  redo(): unknown
}

/**
 * routeUiEventToCrud — UiEvent (W1 8종) 을 CrudPort op 로 라우팅.
 * 매 resource 가 동일 switch 를 짜지 않도록 한 줄로 흡수.
 *
 * 반환: CrudPort 의 op 가 호출되었으면 다음 snapshot, 아니면 undefined (이벤트 미처리).
 *
 * @example
 * defineResource({
 *   key: () => 'doc',
 *   initial: () => crud.snapshot(),
 *   onEvent: (e) => routeUiEventToCrud(crud, e),
 * })
 */
export function routeUiEventToCrud<S, V = unknown>(
  crud: CrudPort<S, V>,
  e: UiEvent,
): S | undefined {
  switch (e.type) {
    case 'create': crud.create(e.parentId, e.key, e.value as V | undefined); return crud.snapshot()
    case 'update': crud.update(e.id, e.value as V);                          return crud.snapshot()
    case 'remove': crud.delete(e.id);                                        return crud.snapshot()
    case 'copy':   crud.copy(e.id);                                          return crud.snapshot()
    case 'cut':    crud.cut(e.id);                                           return crud.snapshot()
    case 'paste':  crud.paste(e.id, { mode: e.mode });                       return crud.snapshot()
    case 'undo':   crud.undo();                                              return crud.snapshot()
    case 'redo':   crud.redo();                                              return crud.snapshot()
    default:       return undefined  // navigate/activate/expand/select/value/etc. — 호스트 책임
  }
}

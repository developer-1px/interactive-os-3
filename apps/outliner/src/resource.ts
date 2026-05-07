import { defineResource, routeUiEventToCrud, type CrudPort } from '@p/headless/store'
import type { JsonDoc } from 'zod-crud'
import { crud } from './crud'

/** Resource bridge — zod-crud ↔ React. UiEvent 9종(insertAfter/appendChild/update/remove/copy/cut/paste/undo/redo)이 routeUiEventToCrud 로 자동 라우팅. */
export const resource = defineResource<JsonDoc>({
  key: () => 'outline',
  initial: () => crud.snapshot(),
  subscribe: (_k, push) => crud.subscribe(() => push(crud.snapshot())),
  onEvent: (e) => routeUiEventToCrud(crud as unknown as CrudPort<JsonDoc>, e),
})

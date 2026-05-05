import { defineResource, routeUiEventToCrud, type CrudPort } from '@p/headless/store'
import type { JsonDoc } from 'zod-crud'
import { crud } from './outlineCrud'

/**
 * outlineResource — 도메인 어댑터 0줄. zod-crud op 어휘 = UiEvent 어휘 1:1.
 * `routeUiEventToCrud` 가 9 종 편집 이벤트를 자동 라우팅.
 */
export const outlineResource = defineResource<JsonDoc>({
  key: () => 'outline',
  initial: () => crud.snapshot(),
  subscribe: (_k, push) => crud.subscribe(() => push(crud.snapshot())),
  onEvent: (e) => routeUiEventToCrud(crud as unknown as CrudPort<JsonDoc>, e),
})

import type { PluginManifest, Middleware, UiEntry } from '@p/ds'
import { uiRegistry } from '@p/ds'

/** composeRegistry — plugin manifest 배열을 ds 의 단일 registry 로 합산.
 *
 *  - widgets: ds.uiRegistry 에 mutate 합산
 *  - middlewares: phase 별 chain 으로 정렬
 *  - capabilities: 이름 → API map
 *  - routes: TanStack route 합산 (Phase B 에서 활성화) */
export interface ComposedRegistry {
  middlewares: Record<string, Middleware[]>
  capabilities: Map<string, unknown>
}

const PHASES = ['pre-dispatch', 'post-dispatch', 'pre-resource-read', 'post-resource-write'] as const

export const composeRegistry = (plugins: readonly PluginManifest[]): ComposedRegistry => {
  const middlewares: Record<string, Middleware[]> = Object.fromEntries(PHASES.map((p) => [p, []]))
  const capabilities = new Map<string, unknown>()

  for (const p of plugins) {
    if (p.widgets) {
      for (const [name, entry] of Object.entries(p.widgets)) {
        ;(uiRegistry as Record<string, UiEntry>)[name] = entry
      }
    }
    if (p.middlewares) {
      for (const m of p.middlewares) middlewares[m.phase].push(m)
    }
    if (p.capabilities) {
      for (const [k, v] of Object.entries(p.capabilities)) capabilities.set(k, v)
    }
  }

  return { middlewares, capabilities }
}

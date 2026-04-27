import type { UiEntry } from './ui/registry'
import type { Middleware } from './core/middleware'
import type { AnyRoute } from '@tanstack/react-router'

/** Plugin manifest — 모노레포 내 각 패키지가 default export 하는 정본 형태.
 *
 *  app/plugins.ts 가 정적 import 로 합산하여 ds·router·middleware·capability 레지스트리에 주입.
 *  schemas/resources/features 는 패키지 내부 implementation detail —
 *  manifest 등록 대상 아님 (다른 패키지가 import 해서 씀). */
export interface PluginManifest {
  name: string
  version?: string
  routes?: AnyRoute[]
  widgets?: Record<string, UiEntry>
  middlewares?: Middleware[]
  capabilities?: Record<string, unknown>
}

export const definePlugin = (m: PluginManifest): PluginManifest => m

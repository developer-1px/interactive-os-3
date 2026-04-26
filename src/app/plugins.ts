import type { PluginManifest } from '@p/ds'
import { definePlugin } from '@p/ds'

/** ds 자체는 widgets·middlewares 등을 자기 모듈에 직접 등록한 상태이므로
 *  manifest 는 빈 골격 — plugin 합산 시스템의 정본 placeholder 역할.
 *  domain·capability 패키지가 추가되면 아래 배열에 1줄로 등록·제거. */
const ds: PluginManifest = definePlugin({ name: '@p/ds' })

export const plugins: PluginManifest[] = [
  ds,
  // import finder from '@p/domain-finder'  → Phase B 에 활성화
  // import history from '@p/capability-history' → Phase C 에 활성화
]

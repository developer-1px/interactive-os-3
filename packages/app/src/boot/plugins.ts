import type { PluginManifest } from '@p/ds'
import { definePlugin } from '@p/ds'
import finder from '@apps/finder'

/** ds plugin manifest 는 ds 데몰리션과 함께 제거 예정.
 *  slides 앱은 pure-headless+Tailwind 로 이주 완료 — plugin 등록 불필요. */
const ds: PluginManifest = definePlugin({ name: '@p/ds' })

export const plugins: PluginManifest[] = [
  ds,
  finder,
]

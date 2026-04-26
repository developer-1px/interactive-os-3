import { definePlugin } from '@p/ds'

/** finder 앱의 plugin manifest.
 *  현재는 등록 entry 가 없음(라우트는 packages/app/src/routes/finder.$.tsx 가 file-based 로 들고 있고
 *  widgets·middlewares·capabilities 도 0개). 시드 정본 — 향후 capability 분리 시 채워진다. */
export default definePlugin({
  name: '@apps/finder',
})

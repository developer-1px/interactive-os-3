/** @apps/finder — finder 앱 패키지의 공개 표면.
 *
 *  라우트 진입(packages/app/src/routes/finder.$.tsx)과 다른 앱(markdown·m.finder)이
 *  이 barrel 만 import 한다. 내부 구현(*.feature, resources, schema 등)은
 *  apps/finder/src 안에 격리. */

export { Finder } from './Finder'
export { PreviewBody, PreviewPane } from './Preview'
export { useSidebarNav } from './useSidebarNav'

// 데이터 source — markdown·m.finder 가 사용
export {
  getTree, subscribeTree, smartGroupOf, smartItems, walk, isSmartPath,
  formatDate, formatSize, loadText,
} from './data'

// 타입·헬퍼 — m.finder 가 사용
export { extToIcon } from './types'
export type { FsNode, SmartGroupItem } from './types'

// 스타일 — main.tsx 가 사용
export { finderCss } from './style'

// 모바일 변형 (/m/finder/$ 라우트 진입)
export { FinderMobile } from './mobile/FinderMobile'
export { finderMobileCss } from './mobile/style'

// plugin manifest — packages/app/src/boot/plugins.ts 가 사용
export { default } from './plugin'

// 셸 boot 가 router 를 주입 — finder 자체는 router 인스턴스를 모른다
export { setFinderNav } from './nav'

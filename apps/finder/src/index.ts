/** @apps/finder — pure-headless + Tailwind. ds 의존성 0건. */

export { Finder } from './widgets/Finder'
export { PreviewBody, PreviewPane } from './widgets/Preview'
export { useSidebarNav } from './widgets/useSidebarNav'

export {
  getTree, subscribeTree, walk,
  formatDate, formatSize, loadText,
} from './features/data'

export { extToIcon } from './entities/types'
export type { FsNode, SmartGroupItem } from './entities/types'

export { setFinderNav } from './features/nav'

import { highlightMark } from './highlightMark'
import { legendDot } from './legendDot'
import { barChart } from './barChart'
import { top10 } from './top10'

// statCard / courseCard / roleCard 는 src/ds/index.ts 에서 content layer 로 등록.
// 여기 두 번 등록하면 cascade race → assertUniqueSelectors throw.
export const display = () => [
  highlightMark(),
  legendDot(),
  barChart(),
  top10(),
].join('\n')

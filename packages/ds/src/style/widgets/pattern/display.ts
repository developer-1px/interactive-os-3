// display() 는 이전에 highlightMark + legendDot + barChart + top10 묶음.
// Phase 2h-2 co-location 이후 legendDot·barChart·top10 은 ui/ 로 이동했고
// widgets.styles.ts 가 직접 등록한다. display() 는 highlightMark 만 남김.
import { cssHighlightMark } from './highlightMark'

export const cssDisplay = () => cssHighlightMark()

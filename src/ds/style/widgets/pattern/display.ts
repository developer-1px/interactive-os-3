import { highlightMark } from './highlightMark'
import { legendDot } from './legendDot'
import { statCard } from './statCard'
import { barChart } from './barChart'
import { top10 } from './top10'
import { courseCard } from './courseCard'
import { roleCard } from './roleCard'

export const display = () => [
  highlightMark(),
  legendDot(),
  statCard(),
  barChart(),
  top10(),
  courseCard(),
  roleCard(),
].join('\n')

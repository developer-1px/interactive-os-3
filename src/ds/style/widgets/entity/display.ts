import { badge } from './badge'
import { legendDot } from './legendDot'
import { statCard } from './statCard'
import { barChart } from './barChart'
import { top10 } from './top10'
import { courseCard } from './courseCard'
import { roleCard } from './roleCard'
import { fnCard } from './fnCard'
import { contractCard } from './contractCard'
import { leakTable } from './leakTable'

export const display = () => [
  badge(),
  legendDot(),
  statCard(),
  barChart(),
  top10(),
  courseCard(),
  roleCard(),
  fnCard(),
  contractCard(),
  leakTable(),
].join('\n')

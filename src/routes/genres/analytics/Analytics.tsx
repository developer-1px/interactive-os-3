/** Analytics v2 — KPI + 차트 + Top 리스트. */
import { useState } from 'react'
import { Renderer, definePage } from '../../../ds'
import type { Range } from './data'
import { buildAnalyticsPage } from './build'

export function Analytics() {
  const [range, setRange] = useState<Range>('7d')
  return <Renderer page={definePage(buildAnalyticsPage({ range, setRange }))} />
}

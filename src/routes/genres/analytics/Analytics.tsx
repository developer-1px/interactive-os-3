/** Analytics v2 — KPI + 차트 + Top 리스트. */
import { useMemo, useState } from 'react'
import { Renderer, definePage, ROOT, useControlState, type Event, type NormalizedData } from '../../../ds'
import { RANGES, type Range } from './data'
import { buildAnalyticsPage } from './build'

const rangeBarBase = (range: Range): NormalizedData => ({
  entities: {
    [ROOT]: { id: ROOT, data: {} },
    __focus__: { id: '__focus__', data: { id: `r-${range}` } },
    ...Object.fromEntries(RANGES.map((r) => [`r-${r}`, {
      id: `r-${r}`,
      data: { label: r === 'custom' ? '사용자 지정' : r, content: r === 'custom' ? '사용자 지정' : r, pressed: r === range },
    }])),
  },
  relationships: { [ROOT]: RANGES.map((r) => `r-${r}`) },
})

export function Analytics() {
  const [range, setRange] = useState<Range>('7d')
  const base = useMemo(() => rangeBarBase(range), [range])
  const [rangeData, rangeDispatch] = useControlState(base)
  const onRangeEvent = (e: Event) => {
    rangeDispatch(e)
    if (e.type === 'activate') setRange(e.id.replace(/^r-/, '') as Range)
  }
  return <Renderer page={definePage(buildAnalyticsPage({
    range, setRange, rangeNav: { data: rangeData, onEvent: onRangeEvent },
  }))} />
}

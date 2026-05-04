/* eslint-disable react-refresh/only-export-components */
import { fromList } from '@p/headless'
import { useLocalData } from '@p/headless/local'
import { Tabs, type TabsSlots, tabsWrapperKeys } from './_tabsWrapper'
import type { SlotProps } from '../slots'

interface TabItem extends Record<string, unknown> {
  label: string
  body: string
}

const initialData = fromList([
  { id: 'overview', label: 'Overview', body: 'Headless behavior infra for ARIA.', selected: true },
  { id: 'behavior', label: 'Behavior', body: 'axes · roving · gesture composed.' },
  { id: 'patterns', label: 'Patterns', body: 'APG recipes one signature.' },
])

const slots: TabsSlots<TabItem> = {
  panel: ({ data }: SlotProps<TabItem>) => <p>{data.body}</p>,
}

export const meta = {
  title: 'Tabs Wrapper',
  apg: 'tabs',
  kind: 'collection' as const,
  blurb: 'Wrapper surface: data · onEvent · slots — Tree/Menu 와 동일 모양.',
  keys: tabsWrapperKeys,
}

export default function Demo() {
  const [data, onEvent] = useLocalData(() => initialData)
  return <Tabs aria-label="Documentation" data={data} onEvent={onEvent} slots={slots as TabsSlots} />
}

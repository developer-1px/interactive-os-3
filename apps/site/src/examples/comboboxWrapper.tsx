/* eslint-disable react-refresh/only-export-components */
import { fromList } from '@p/headless'
import { useLocalData } from '@p/headless/local'
import { Combobox, comboboxWrapperKeys } from './_comboboxWrapper'

const initialData = fromList(
  ['Argentina', 'Australia', 'Brazil', 'Canada', 'Denmark',
   'France', 'Germany', 'Japan', 'Korea', 'Mexico',
   'Netherlands', 'Norway', 'Spain', 'Sweden', 'Switzerland'].map((label) => ({
    id: label.toLowerCase(), label,
  })),
)

export const meta = {
  title: 'Combobox Wrapper',
  apg: 'combobox',
  kind: 'collection' as const,
  blurb: 'A reusable searchable picker that owns its input, filtering, and popup behavior.',
  keys: comboboxWrapperKeys,
}

export default function ComboboxWrapperDemo() {
  const [data, onEvent] = useLocalData(() => initialData)
  return <Combobox aria-label="Country" data={data} onEvent={onEvent} placeholder="Search country…" />
}

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
  blurb: 'Wrapper surface: data · onEvent · slots — Tree/Menu 와 동일 모양. 입력/필터/팝오버는 wrapper 내부.',
  keys: comboboxWrapperKeys,
}

export default function Demo() {
  const [data, onEvent] = useLocalData(() => initialData)
  return <Combobox aria-label="Country" data={data} onEvent={onEvent} placeholder="Search country…" />
}

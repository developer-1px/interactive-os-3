/* eslint-disable react-refresh/only-export-components */
import { useLocalData } from '@p/headless/local'
import { Tree, treeData, treeReducer, treeSlots, treeWrapperKeys } from './_treeWrapper'

export const meta = {
  title: 'Tree Wrapper',
  apg: 'treeview',
  kind: 'collection' as const,
  blurb: 'Wrapper surface: normalized data · onEvent, with item data typed through slots.',
  keys: treeWrapperKeys,
}

export default function Demo() {
  const [data, onEvent] = useLocalData(() => treeData, treeReducer)

  return (
    <Tree
      aria-label="Files"
      data={data}
      onEvent={onEvent}
      slots={treeSlots}
    />
  )
}

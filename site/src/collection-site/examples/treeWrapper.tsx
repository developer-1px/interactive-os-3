/* eslint-disable react-refresh/only-export-components */
import { useLocalData } from '@p/headless/local'
import { Tree, treeReducer, treeSlots, treeStore, treeWrapperKeys } from './_treeWrapper'

export const meta = {
  title: 'Tree Wrapper',
  apg: 'treeview',
  kind: 'collection' as const,
  blurb: 'Wrapper surface: store · value · onEvent, with named content slots for item customization.',
  keys: treeWrapperKeys,
}

export default function Demo() {
  const [value, onEvent] = useLocalData(() => treeStore, treeReducer)

  return (
    <Tree
      aria-label="Files"
      store={treeStore}
      value={value}
      onEvent={onEvent}
      slots={treeSlots}
    />
  )
}

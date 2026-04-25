/** Editor — Notion 3열 (아웃라인 · 캔버스 · 속성). */
import { useMemo, useState } from 'react'
import {
  Renderer, definePage, useControlState, navigateOnActivate,
  type Event, type NormalizedData,
} from '../../../ds'
import { INITIAL, type Block, type BlockKind } from './data'
import { buildEditorPage } from './build'

function useOutlineNav(blocks: Block[], selected: string, setSelected: (id: string) => void) {
  const items = blocks.filter((b) => b.kind.startsWith('h'))
  const base = useMemo<NormalizedData>(() => {
    const entities: Record<string, { id: string; data: Record<string, unknown> }> = {
      __root__: { id: '__root__', data: {} },
      __focus__: { id: '__focus__', data: { id: selected } },
    }
    for (const b of items) {
      entities[b.id] = { id: b.id, data: { label: b.text, selected: b.id === selected } }
    }
    return { entities, relationships: { __root__: items.map((b) => b.id) } }
  }, [selected, items])
  const [data, dispatch] = useControlState(base)
  const onEvent = (e: Event) =>
    navigateOnActivate(data, e).forEach((ev) => {
      dispatch(ev)
      if (ev.type === 'activate') setSelected(ev.id)
    })
  return { data, onEvent }
}

export function Editor() {
  const [blocks, setBlocks] = useState(INITIAL)
  const [selected, setSelected] = useState('b1')
  const [title, setTitle] = useState('DS 커버리지 스윕 결과')
  const [isPublic, setPublic] = useState(false)
  const current = blocks.find((b) => b.id === selected)
  const updateText = (id: string, text: string) => setBlocks((bs) => bs.map((b) => b.id === id ? { ...b, text } : b))
  const updateKind = (id: string, kind: BlockKind) => setBlocks((bs) => bs.map((b) => b.id === id ? { ...b, kind } : b))
  const outlineNav = useOutlineNav(blocks, selected, setSelected)
  return <Renderer page={definePage(buildEditorPage({ blocks, selected, title, isPublic, current, setSelected, setTitle, setPublic, updateText, updateKind, outlineNav }))} />
}

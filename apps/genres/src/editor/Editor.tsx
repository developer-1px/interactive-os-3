/** Editor — Notion 3열 (아웃라인 · 캔버스 · 속성). */
import { useMemo, useState } from 'react'
import {
  Renderer, definePage, useControlState, navigateOnActivate, ROOT,
  SidebarAdminFloating,
  type Event, type NormalizedData,
} from '@p/ds'
import { FMT_ACTS, INITIAL, type Block, type BlockKind } from './data'
import { buildEditorPage } from './build'

const KIND_ITEMS: Array<[BlockKind, string]> = [
  ['h1', 'H1'], ['h2', 'H2'], ['list', '• 리스트'], ['code', '</>'],
]

const toolbarBase = (currentKind?: BlockKind): NormalizedData => {
  const entities: Record<string, { id: string; data: Record<string, unknown> }> = {
    [ROOT]: { id: ROOT, data: {} },
    __focus__: { id: '__focus__', data: { id: 'tB' } },
    tSep: { id: 'tSep', data: { separator: true } },
  }
  for (const [id, label, icon, content] of FMT_ACTS) {
    entities[id] = { id, data: { label, icon, content } }
  }
  for (const [kind, content] of KIND_ITEMS) {
    entities[`t-${kind}`] = { id: `t-${kind}`, data: { label: kind, content, pressed: kind === currentKind } }
  }
  return {
    entities,
    relationships: { [ROOT]: [...FMT_ACTS.map(([id]) => id), 'tSep', ...KIND_ITEMS.map(([k]) => `t-${k}`)] },
  }
}

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
  const toolbarBaseData = useMemo(() => toolbarBase(current?.kind), [current?.kind])
  const [toolbarData, toolbarDispatch] = useControlState(toolbarBaseData)
  const onToolbarEvent = (e: Event) => {
    toolbarDispatch(e)
    if (e.type === 'activate' && current && e.id.startsWith('t-')) {
      updateKind(current.id, e.id.slice(2) as BlockKind)
    }
  }
  const toolbar = { data: toolbarData, onEvent: onToolbarEvent }
  return (
    <>
      <Renderer page={definePage(buildEditorPage({ blocks, selected, title, isPublic, current, setSelected, setTitle, setPublic, updateText, updateKind, outlineNav, toolbar }))} />
      <SidebarAdminFloating
        id="editor-outline-mobile"
        label="아웃라인"
        tree={outlineNav.data}
        onEvent={outlineNav.onEvent}
        collection="listbox"
      />
    </>
  )
}

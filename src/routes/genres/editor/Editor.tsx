/** Editor — Notion 3열 (아웃라인 · 캔버스 · 속성). */
import { useState } from 'react'
import { Renderer, definePage } from '../../../ds'
import { INITIAL, type BlockKind } from './data'
import { buildEditorPage } from './build'

export function Editor() {
  const [blocks, setBlocks] = useState(INITIAL)
  const [selected, setSelected] = useState('b1')
  const [title, setTitle] = useState('DS 커버리지 스윕 결과')
  const [isPublic, setPublic] = useState(false)
  const current = blocks.find((b) => b.id === selected)
  const updateText = (id: string, text: string) => setBlocks((bs) => bs.map((b) => b.id === id ? { ...b, text } : b))
  const updateKind = (id: string, kind: BlockKind) => setBlocks((bs) => bs.map((b) => b.id === id ? { ...b, kind } : b))
  return <Renderer page={definePage(buildEditorPage({ blocks, selected, title, isPublic, current, setSelected, setTitle, setPublic, updateText, updateKind }))} />
}

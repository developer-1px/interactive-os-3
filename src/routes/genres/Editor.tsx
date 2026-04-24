/**
 * Editor genre — Notion 3열 (아웃라인 · 캔버스 · 속성 패널).
 *
 * 갭: PropertyPanel role, BlockList(DnD) role, FloatingToolbar 부재.
 *     속성 패널은 Field + Input/Switch/Select 조립으로 대체.
 */
import { useState } from 'react'
import { Renderer, definePage, ROOT, type NormalizedData } from '../../ds'

interface Block { id: string; kind: 'h1' | 'h2' | 'p' | 'list' | 'code'; text: string }
const INITIAL: Block[] = [
  { id: 'b1', kind: 'h1',   text: 'DS 커버리지 스윕 결과' },
  { id: 'b2', kind: 'p',    text: '현재 ds로 보편 8장르를 구현하며 커버되는 범위와 갭을 동시에 수집한다.' },
  { id: 'b3', kind: 'h2',   text: '개요' },
  { id: 'b4', kind: 'list', text: '• Inbox · Chat · Commerce\n• CRM · Editor · Feed\n• Analytics · Settings' },
  { id: 'b5', kind: 'h2',   text: '첫 발견' },
  { id: 'b6', kind: 'p',    text: 'registry.ts에 등록되지 않은 부품(Tree, Menu, Feed, Combobox 등)은 FlatLayout에서 직접 사용 불가.' },
  { id: 'b7', kind: 'code', text: 'const uiRegistry = { Button, Input, ... } // 약 30개만 등록' },
]

export function Editor() {
  const [blocks, setBlocks] = useState(INITIAL)
  const [selected, setSelected] = useState<string>('b1')
  const [title, setTitle] = useState('DS 커버리지 스윕 결과')
  const [isPublic, setIsPublic] = useState(false)

  const current = blocks.find((b) => b.id === selected)

  const updateText = (id: string, text: string) => setBlocks((bs) => bs.map((b) => b.id === id ? { ...b, text } : b))
  const updateKind = (id: string, kind: Block['kind']) => setBlocks((bs) => bs.map((b) => b.id === id ? { ...b, kind } : b))

  const data: NormalizedData = {
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      page: { id: 'page', data: { type: 'Row', flow: 'split' } },

      /* 좌 아웃라인 */
      outline: { id: 'outline', data: { type: 'Column', flow: 'list', emphasis: 'sunk', width: 240 } },
      oHdr: { id: 'oHdr', data: { type: 'Text', variant: 'h3', content: '아웃라인' } },
      ...Object.fromEntries(blocks.filter((b) => b.kind.startsWith('h')).map((b) => [
        `ol-${b.id}`, { id: `ol-${b.id}`, data: {
          type: 'Ui', component: 'ToolbarButton',
          props: { pressed: selected === b.id, onClick: () => setSelected(b.id), 'aria-label': b.text, style: { paddingInlineStart: b.kind === 'h2' ? 16 : 4 } },
          content: b.text,
        } },
      ])),

      /* 중앙 캔버스 */
      canvas: { id: 'canvas', data: { type: 'Column', flow: 'form', grow: true } },
      docTitle: { id: 'docTitle', data: {
        type: 'Ui', component: 'Input',
        props: { value: title, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value), 'aria-label': '문서 제목', style: { fontSize: 32, fontWeight: 800, border: 'none', background: 'transparent' } },
      } },
      toolbar: { id: 'toolbar', data: { type: 'Ui', component: 'Toolbar', props: { 'aria-label': '서식' } } },
      tB: { id: 'tB', data: { type: 'Ui', component: 'ToolbarButton', props: { 'data-icon': 'bold',      'aria-label': '굵게' }, content: 'B' } },
      tI: { id: 'tI', data: { type: 'Ui', component: 'ToolbarButton', props: { 'data-icon': 'italic',    'aria-label': '기울임' }, content: 'I' } },
      tU: { id: 'tU', data: { type: 'Ui', component: 'ToolbarButton', props: { 'data-icon': 'underline', 'aria-label': '밑줄' }, content: 'U' } },
      tSep: { id: 'tSep', data: { type: 'Ui', component: 'Separator', props: { orientation: 'vertical' } } },
      tH1: { id: 'tH1', data: { type: 'Ui', component: 'ToolbarButton', props: { onClick: () => current && updateKind(current.id, 'h1'), 'aria-label': 'H1' }, content: 'H1' } },
      tH2: { id: 'tH2', data: { type: 'Ui', component: 'ToolbarButton', props: { onClick: () => current && updateKind(current.id, 'h2'), 'aria-label': 'H2' }, content: 'H2' } },
      tL:  { id: 'tL',  data: { type: 'Ui', component: 'ToolbarButton', props: { onClick: () => current && updateKind(current.id, 'list'), 'aria-label': '리스트' }, content: '• 리스트' } },
      tC:  { id: 'tC',  data: { type: 'Ui', component: 'ToolbarButton', props: { onClick: () => current && updateKind(current.id, 'code'), 'aria-label': '코드' }, content: '</>' } },

      ...Object.fromEntries(blocks.map((b) => [
        `blk-${b.id}`, { id: `blk-${b.id}`, data: {
          type: 'Ui', component: 'Textarea',
          props: {
            value: b.text,
            onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => updateText(b.id, e.target.value),
            onFocus: () => setSelected(b.id),
            'aria-label': `블록 ${b.kind}`,
            rows: b.kind === 'p' || b.kind === 'list' || b.kind === 'code' ? 3 : 1,
            style: {
              border: selected === b.id ? '2px solid var(--ds-tone-info)' : '1px dashed transparent',
              borderRadius: 4,
              background: b.kind === 'code' ? 'var(--ds-bg-sunk, #f4f4f5)' : 'transparent',
              fontFamily: b.kind === 'code' ? 'ui-monospace, monospace' : undefined,
              fontSize: b.kind === 'h1' ? 28 : b.kind === 'h2' ? 22 : 16,
              fontWeight: b.kind === 'h1' || b.kind === 'h2' ? 700 : 400,
              resize: 'vertical',
              inlineSize: '100%',
            },
          },
        } },
      ])),

      /* 우 속성 */
      props: { id: 'props', data: { type: 'Column', flow: 'form', emphasis: 'raised', width: 280 } },
      pHdr: { id: 'pHdr', data: { type: 'Text', variant: 'h3', content: '속성' } },

      fTitle: { id: 'fTitle', data: { type: 'Ui', component: 'Field', props: { 'aria-label': '제목' } } },
      fTitleLbl: { id: 'fTitleLbl', data: { type: 'Ui', component: 'FieldLabel', content: '제목' } },
      fTitleIn: { id: 'fTitleIn', data: {
        type: 'Ui', component: 'Input',
        props: { value: title, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value), 'aria-label': '제목' },
      } },

      fPub: { id: 'fPub', data: { type: 'Ui', component: 'Field' } },
      fPubLbl: { id: 'fPubLbl', data: { type: 'Ui', component: 'FieldLabel', content: '공개 여부' } },
      fPubSw: { id: 'fPubSw', data: {
        type: 'Ui', component: 'Switch',
        props: { checked: isPublic, onChange: () => setIsPublic((v) => !v), 'aria-label': '공개' },
      } },
      fPubDesc: { id: 'fPubDesc', data: { type: 'Ui', component: 'FieldDescription', content: isPublic ? '링크가 있는 누구나 볼 수 있음' : '초대된 사람만' } },

      fBlkKind: { id: 'fBlkKind', data: { type: 'Ui', component: 'Field', hidden: !current } },
      fBlkKindLbl: { id: 'fBlkKindLbl', data: { type: 'Ui', component: 'FieldLabel', content: '블록 타입' } },
      fBlkKindSel: { id: 'fBlkKindSel', data: {
        type: 'Ui', component: 'Select',
        props: { value: current?.kind ?? 'p', onChange: (e: React.ChangeEvent<HTMLSelectElement>) => current && updateKind(current.id, e.target.value as Block['kind']), 'aria-label': '블록 타입' },
        content: <>
          <option value="h1">H1</option>
          <option value="h2">H2</option>
          <option value="p">문단</option>
          <option value="list">리스트</option>
          <option value="code">코드</option>
        </>,
      } },

      stats: { id: 'stats', data: { type: 'Text', variant: 'small', content: `블록 ${blocks.length}개 · 선택: ${current?.kind ?? '—'}` } },
    },
    relationships: {
      [ROOT]: ['page'],
      page: ['outline', 'canvas', 'props'],

      outline: ['oHdr', ...blocks.filter((b) => b.kind.startsWith('h')).map((b) => `ol-${b.id}`)],

      canvas: ['docTitle', 'toolbar', ...blocks.map((b) => `blk-${b.id}`)],
      toolbar: ['tB', 'tI', 'tU', 'tSep', 'tH1', 'tH2', 'tL', 'tC'],

      props: ['pHdr', 'fTitle', 'fPub', 'fBlkKind', 'stats'],
      fTitle: ['fTitleLbl', 'fTitleIn'],
      fPub: ['fPubLbl', 'fPubSw', 'fPubDesc'],
      fBlkKind: ['fBlkKindLbl', 'fBlkKindSel'],
    },
  }
  return <Renderer page={definePage(data)} />
}

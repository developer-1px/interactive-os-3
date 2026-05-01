import { ROOT, type UiEvent, type NormalizedData } from '@p/ds'
import { BLOCK_OPTS, type Block, type BlockKind } from './data'

export interface EditorState {
  blocks: Block[]; selected: string; title: string; isPublic: boolean
  current?: Block
  setSelected: (id: string) => void; setTitle: (v: string) => void; setPublic: (v: boolean) => void
  updateText: (id: string, v: string) => void; updateKind: (id: string, k: BlockKind) => void
  outlineNav: { data: NormalizedData; onEvent: (e: UiEvent) => void }
  toolbar: { data: NormalizedData; onEvent: (e: UiEvent) => void }
}

export function buildEditorPage(s: EditorState): NormalizedData {
  return {
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      page: { id: 'page', data: { type: 'Row', flow: 'split', roledescription: 'editor-page', label: 'Editor' } },
      outline: { id: 'outline', data: { type: 'Nav', flow: 'list', emphasis: 'sunk', width: 240, label: '아웃라인', roledescription: 'sidebar' } },
      oHdr: { id: 'oHdr', data: { type: 'Text', variant: 'h3', content: '아웃라인' } },
      olList: { id: 'olList', data: { type: 'Ui', component: 'Listbox',
        props: { data: s.outlineNav.data, onEvent: s.outlineNav.onEvent, 'aria-label': '아웃라인' } } },
      canvas: { id: 'canvas', data: { type: 'Main', flow: 'form', grow: true, label: '편집 영역' } },
      docTitle: { id: 'docTitle', data: { type: 'Ui', component: 'Input', props: { value: s.title, onChange: (e: React.ChangeEvent<HTMLInputElement>) => s.setTitle(e.target.value), 'aria-label': '문서 제목', 'data-ds-title': '' } } },
      toolbar: { id: 'toolbar', data: { type: 'Ui', component: 'Toolbar', props: { data: s.toolbar.data, onEvent: s.toolbar.onEvent, 'aria-label': '서식' } } },
      ...Object.fromEntries(s.blocks.map((b) => [`blk-${b.id}`, { id: `blk-${b.id}`, data: {
        type: 'Ui', component: 'Textarea',
        props: {
          value: b.text, 'aria-label': `블록 ${b.kind}`, 'data-block-kind': b.kind, 'data-selected': s.selected === b.id || undefined,
          rows: ['p','list','code'].includes(b.kind) ? 3 : 1,
          onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => s.updateText(b.id, e.target.value),
          onFocus: () => s.setSelected(b.id),
        },
      } }])),
      props: { id: 'props', data: { type: 'Aside', flow: 'form', emphasis: 'raised', width: 280, label: '속성' } },
      pHdr: { id: 'pHdr', data: { type: 'Text', variant: 'h3', content: '속성' } },
      fTitle: { id: 'fTitle', data: { type: 'Ui', component: 'Field' } },
      fTitleLbl: { id: 'fTitleLbl', data: { type: 'Ui', component: 'FieldLabel', content: '제목' } },
      fTitleIn: { id: 'fTitleIn', data: { type: 'Ui', component: 'Input', props: { value: s.title, onChange: (e: React.ChangeEvent<HTMLInputElement>) => s.setTitle(e.target.value), 'aria-label': '제목' } } },
      fPub: { id: 'fPub', data: { type: 'Ui', component: 'Field' } },
      fPubLbl: { id: 'fPubLbl', data: { type: 'Ui', component: 'FieldLabel', content: '공개 여부' } },
      fPubSw: { id: 'fPubSw', data: { type: 'Ui', component: 'Switch', props: { checked: s.isPublic, onChange: () => s.setPublic(!s.isPublic), 'aria-label': '공개' } } },
      fPubDesc: { id: 'fPubDesc', data: { type: 'Ui', component: 'FieldDescription', content: s.isPublic ? '링크가 있는 누구나' : '초대된 사람만' } },
      fBlkKind: { id: 'fBlkKind', data: { type: 'Ui', component: 'Field', hidden: !s.current } },
      fBlkKindLbl: { id: 'fBlkKindLbl', data: { type: 'Ui', component: 'FieldLabel', content: '블록 타입' } },
      fBlkKindSel: { id: 'fBlkKindSel', data: { type: 'Ui', component: 'Select', props: { value: s.current?.kind ?? 'p', 'aria-label': '블록 타입', onChange: (e: React.ChangeEvent<HTMLSelectElement>) => s.current && s.updateKind(s.current.id, e.target.value as BlockKind) }, content: <>{BLOCK_OPTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</> } },
      stats: { id: 'stats', data: { type: 'Text', variant: 'small', content: `블록 ${s.blocks.length}개 · 선택: ${s.current?.kind ?? '—'}` } },
    },
    relationships: {
      [ROOT]: ['page'], page: ['outline', 'canvas', 'props'],
      outline: ['oHdr', 'olList'],
      canvas: ['docTitle', 'toolbar', ...s.blocks.map((b) => `blk-${b.id}`)],
      props: ['pHdr', 'fTitle', 'fPub', 'fBlkKind', 'stats'],
      fTitle: ['fTitleLbl', 'fTitleIn'],
      fPub: ['fPubLbl', 'fPubSw', 'fPubDesc'],
      fBlkKind: ['fBlkKindLbl', 'fBlkKindSel'],
    },
  }
}

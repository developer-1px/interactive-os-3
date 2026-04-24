/**
 * Inbox — Gmail 스타일 3열 split (좌 폴더 · 중앙 리스트 · 우 디테일).
 */
import { useState } from 'react'
import { Renderer, definePage, ROOT, type NormalizedData } from '../../../ds'
import { MESSAGES, folders, labelTone, messageRowNodes, messageRowRels, type FolderId } from './data'

export function Inbox() {
  const [folder, setFolder] = useState<FolderId>('inbox')
  const [selectedId, setSelectedId] = useState<string>('m1')
  const visible = MESSAGES.filter((m) => folder === 'inbox' ? true : folder === 'starred' ? m.starred : m.folder === folder)
  const current = MESSAGES.find((m) => m.id === selectedId) ?? visible[0]

  const data: NormalizedData = {
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      page: { id: 'page', data: { type: 'Row', flow: 'split' } },
      nav: { id: 'nav', data: { type: 'Column', flow: 'list', emphasis: 'sunk', width: 220 } },
      navHdr: { id: 'navHdr', data: { type: 'Text', variant: 'h3', content: '📮 Inbox' } },
      composeBtn: { id: 'composeBtn', data: { type: 'Ui', component: 'Button', props: { onClick: () => alert('compose'), 'aria-label': '새 메일 쓰기' }, content: '＋ 새 메일' } },
      folderSep: { id: 'folderSep', data: { type: 'Ui', component: 'Separator', props: { orientation: 'horizontal' } } },
      ...Object.fromEntries(folders.map((f) => [`f-${f.id}`, { id: `f-${f.id}`, data: {
        type: 'Ui', component: 'ToolbarButton',
        props: { pressed: folder === f.id, onClick: () => setFolder(f.id), 'aria-label': f.label, 'data-icon': f.icon },
        content: <><span>{f.label}</span>{f.count !== undefined && <small data-ds-count>{f.count}</small>}</>,
      } }])),

      list: { id: 'list', data: { type: 'Column', flow: 'list', grow: true } },
      listHdr: { id: 'listHdr', data: { type: 'Ui', component: 'Toolbar', props: { 'aria-label': '메시지 도구' } } },
      searchInput: { id: 'searchInput', data: { type: 'Ui', component: 'Input', props: { type: 'search', placeholder: '메일 검색…', 'aria-label': '메일 검색', grow: true }, grow: true } },
      sortSel: { id: 'sortSel', data: {
        type: 'Ui', component: 'Select',
        props: { 'aria-label': '정렬', defaultValue: 'date-desc' },
        content: <><option value="date-desc">최신순</option><option value="date-asc">오래된 순</option><option value="unread">안 읽음 우선</option></>,
      } },
      listGrid: { id: 'listGrid', data: { type: 'Ui', component: 'DataGrid', props: { 'aria-label': '메시지 목록' } } },
      listHead: { id: 'listHead', data: { type: 'Ui', component: 'RowGroup' } },
      listHeadRow: { id: 'listHeadRow', data: { type: 'Ui', component: 'DataGridRow' } },
      lh0: { id: 'lh0', data: { type: 'Ui', component: 'ColumnHeader', content: '★' } },
      lh1: { id: 'lh1', data: { type: 'Ui', component: 'ColumnHeader', content: '발신자' } },
      lh2: { id: 'lh2', data: { type: 'Ui', component: 'ColumnHeader', content: '제목 · 프리뷰' } },
      lh3: { id: 'lh3', data: { type: 'Ui', component: 'ColumnHeader', content: '라벨' } },
      lh4: { id: 'lh4', data: { type: 'Ui', component: 'ColumnHeader', content: '시각' } },
      listBody: { id: 'listBody', data: { type: 'Ui', component: 'RowGroup' } },
      ...messageRowNodes(visible, selectedId, setSelectedId),

      detail: { id: 'detail', data: { type: 'Column', flow: 'form', emphasis: 'raised', width: 420 } },
      detailHdr: { id: 'detailHdr', data: { type: 'Header', flow: 'split' } },
      detailTitleCol: { id: 'detailTitleCol', data: { type: 'Column', flow: 'list', grow: true } },
      detailSubject: { id: 'detailSubject', data: { type: 'Text', variant: 'h2', content: current?.subject ?? '—' } },
      detailMeta: { id: 'detailMeta', data: { type: 'Text', variant: 'small', content: current ? `${current.from} · ${current.time}` : '' } },
      detailActions: { id: 'detailActions', data: { type: 'Ui', component: 'Toolbar', props: { 'aria-label': '메시지 액션' } } },
      actReply:   { id: 'actReply',   data: { type: 'Ui', component: 'ToolbarButton', props: { 'aria-label': '답장',  'data-icon': 'reply' },   content: '답장' } },
      actForward: { id: 'actForward', data: { type: 'Ui', component: 'ToolbarButton', props: { 'aria-label': '전달',  'data-icon': 'forward' }, content: '전달' } },
      actArchive: { id: 'actArchive', data: { type: 'Ui', component: 'ToolbarButton', props: { 'aria-label': '보관',  'data-icon': 'archive' }, content: '보관' } },
      actDelete:  { id: 'actDelete',  data: { type: 'Ui', component: 'ToolbarButton', props: { 'aria-label': '삭제',  'data-icon': 'trash' },   content: '삭제' } },
      detailBody: { id: 'detailBody', data: { type: 'Text', variant: 'body', content: current?.body ?? '메시지를 선택하세요.' } },
      detailLabel: { id: 'detailLabel', data: {
        type: 'Ui', component: 'Badge',
        props: { tone: current?.label ? labelTone[current.label] : 'neutral', children: current?.label ?? '—' },
        hidden: !current?.label,
      } },
      replyField: { id: 'replyField', data: { type: 'Ui', component: 'Textarea', props: { placeholder: '답장 작성…', 'aria-label': '답장 본문', rows: 3 } } },
      replySend: { id: 'replySend', data: { type: 'Ui', component: 'Button', props: { onClick: () => alert('send') }, content: '보내기' } },
    },
    relationships: {
      [ROOT]: ['page'],
      page: ['nav', 'list', 'detail'],
      nav: ['navHdr', 'composeBtn', 'folderSep', ...folders.map((f) => `f-${f.id}`)],
      list: ['listHdr', 'listGrid'],
      listHdr: ['searchInput', 'sortSel'],
      listGrid: ['listHead', 'listBody'],
      listHead: ['listHeadRow'],
      listHeadRow: ['lh0', 'lh1', 'lh2', 'lh3', 'lh4'],
      listBody: visible.map((m) => `row-${m.id}`),
      ...messageRowRels(visible),
      detail: ['detailHdr', 'detailLabel', 'detailBody', 'replyField', 'replySend'],
      detailHdr: ['detailTitleCol', 'detailActions'],
      detailTitleCol: ['detailSubject', 'detailMeta'],
      detailActions: ['actReply', 'actForward', 'actArchive', 'actDelete'],
    },
  }
  return <Renderer page={definePage(data)} />
}

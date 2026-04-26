import { ROOT, type Event, type NormalizedData } from '@p/ds'
import { MESSAGES, folders, labelTone, type FolderId } from './data'

const currentFolderLabel = (f: FolderId) => folders.find((x) => x.id === f)?.label ?? '메일'

/** density=mail 전용 셀 구성 — data-col로 grid-area 배치 */
const MAIL_COLS = ['from', 'time', 'subject', 'preview'] as const

export interface InboxState {
  folder: FolderId; selectedId: string
  setFolder: (f: FolderId) => void; setSelected: (id: string) => void
  folderNav: { data: NormalizedData; onEvent: (e: Event) => void }
  listTools: { data: NormalizedData; onEvent: (e: Event) => void }
  detailActions: { data: NormalizedData; onEvent: (e: Event) => void }
}

export function buildInboxPage(s: InboxState): NormalizedData {
  const vis = MESSAGES.filter((m) => s.folder === 'inbox' ? true : s.folder === 'starred' ? m.starred : m.folder === s.folder)
  const cur = MESSAGES.find((m) => m.id === s.selectedId) ?? vis[0]
  const rowPairs = vis.flatMap((m) => {
    const cs: Array<[typeof MAIL_COLS[number], unknown]> = [
      ['from', m.from],
      ['time', m.time],
      ['subject', m.subject],
      ['preview', m.preview],
    ]
    return [
      [`row-${m.id}`, { id: `row-${m.id}`, data: { type: 'Ui', component: 'DataGridRow', props: { 'aria-selected': m.id === s.selectedId, 'data-unread': m.unread || undefined, onClick: () => s.setSelected(m.id) } } }],
      ...cs.map(([k, c]) => [`c-${m.id}-${k}`, { id: `c-${m.id}-${k}`, data: { type: 'Ui', component: 'GridCell', props: { 'data-col': k }, content: c } }]),
    ] as Array<readonly [string, unknown]>
  })
  return {
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      page: { id: 'page', data: { type: 'Split', axis: 'row', defaultSizes: [1, 2, 3], minSizes: [200, 280, 320], roledescription: 'inbox-page', label: 'Inbox' } },
      nav: { id: 'nav', data: { type: 'Nav', flow: 'list', emphasis: 'sunk', label: '폴더', roledescription: 'sidebar' } },
      navFavTitle: { id: 'navFavTitle', data: { type: 'Text', variant: 'small', content: '즐겨찾기' } },
      folderList: { id: 'folderList', data: { type: 'Ui', component: 'Listbox', props: { data: s.folderNav.data, onEvent: s.folderNav.onEvent, 'aria-label': '폴더' } } },
      navSmartTitle: { id: 'navSmartTitle', data: { type: 'Text', variant: 'small', content: '스마트 메일상자' } },
      list: { id: 'list', data: { type: 'Main', flow: 'list', grow: true, label: '메시지 목록' } },
      listHdr: { id: 'listHdr', data: { type: 'Header', flow: 'list' } },
      listTitleRow: { id: 'listTitleRow', data: { type: 'Row', flow: 'cluster' } },
      listTitleCol: { id: 'listTitleCol', data: { type: 'Column', flow: 'list', grow: true } },
      listTitle: { id: 'listTitle', data: { type: 'Text', variant: 'h2', content: currentFolderLabel(s.folder) } },
      listCount: { id: 'listCount', data: { type: 'Text', variant: 'small', content: `${vis.length}개의 메시지` } },
      listTools: { id: 'listTools', data: { type: 'Ui', component: 'Toolbar', props: { data: s.listTools.data, onEvent: s.listTools.onEvent, 'aria-label': '도구' } } },
      listGrid: { id: 'listGrid', data: { type: 'Ui', component: 'DataGrid', props: { 'aria-label': '메시지', 'data-density': 'mail' } } },
      listBody: { id: 'listBody', data: { type: 'Ui', component: 'RowGroup' } },
      ...Object.fromEntries(rowPairs),
      detail: { id: 'detail', data: { type: 'Aside', flow: 'list', emphasis: 'raised', grow: true, label: '메시지 상세' } },
      detailActions: { id: 'detailActions', data: { type: 'Ui', component: 'Toolbar', props: { data: s.detailActions.data, onEvent: s.detailActions.onEvent, 'aria-label': '액션' } } },
      detailHdr: { id: 'detailHdr', data: { type: 'Header', flow: 'list' } },
      detailCount: { id: 'detailCount', data: { type: 'Text', variant: 'small', content: '1개의 메시지' } },
      detailSenderRow: { id: 'detailSenderRow', data: { type: 'Row', flow: 'cluster' } },
      detailSenderCol: { id: 'detailSenderCol', data: { type: 'Column', flow: 'list', grow: true } },
      detailFrom: { id: 'detailFrom', data: { type: 'Text', variant: 'strong', content: cur?.from ?? '—' } },
      detailSubject: { id: 'detailSubject', data: { type: 'Text', variant: 'body', content: cur?.subject ?? '—' } },
      detailAsideCol: { id: 'detailAsideCol', data: { type: 'Column', flow: 'list', align: 'end' } },
      detailFolderTag: { id: 'detailFolderTag', data: { type: 'Ui', component: 'Badge', props: { tone: 'neutral', children: currentFolderLabel(s.folder) } } },
      detailTime: { id: 'detailTime', data: { type: 'Text', variant: 'small', content: cur?.time ?? '' } },
      detailLabel: { id: 'detailLabel', data: { type: 'Ui', component: 'Badge', props: { tone: cur?.label ? labelTone[cur.label] : 'neutral', children: cur?.label ?? '—' }, hidden: !cur?.label } },
      detailBody: { id: 'detailBody', data: { type: 'Text', variant: 'body', content: cur?.body ?? '—', grow: true } },
      detailFooter: { id: 'detailFooter', data: { type: 'Footer', flow: 'form' } },
      replyField: { id: 'replyField', data: { type: 'Ui', component: 'Textarea', props: { placeholder: '답장…', 'aria-label': '답장', rows: 3 } } },
      replySend: { id: 'replySend', data: { type: 'Ui', component: 'Button', props: { onClick: () => alert('send') }, content: '보내기' } },
    },
    relationships: {
      [ROOT]: ['page'], page: ['nav', 'list', 'detail'],
      nav: ['navFavTitle', 'folderList', 'navSmartTitle'],
      list: ['listHdr', 'listGrid'],
      listHdr: ['listTitleRow'],
      listTitleRow: ['listTitleCol', 'listTools'],
      listTitleCol: ['listTitle', 'listCount'],
      listGrid: ['listBody'],
      listBody: vis.map((m) => `row-${m.id}`),
      ...Object.fromEntries(vis.map((m) => [`row-${m.id}`, MAIL_COLS.map((k) => `c-${m.id}-${k}`)])),
      detail: ['detailActions', 'detailHdr', 'detailBody', 'detailFooter'],
      detailHdr: ['detailCount', 'detailSenderRow', 'detailLabel'],
      detailSenderRow: ['detailSenderCol', 'detailAsideCol'],
      detailSenderCol: ['detailFrom', 'detailSubject'],
      detailAsideCol: ['detailFolderTag', 'detailTime'],
      detailFooter: ['replyField', 'replySend'],
    },
  }
}

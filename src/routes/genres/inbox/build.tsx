import { Badge, ROOT, type Event, type NormalizedData } from '../../../ds'
import { ACTS, CELL_KEYS, HEADS, MESSAGES, labelTone, type FolderId } from './data'

export interface InboxState {
  folder: FolderId; selectedId: string
  setFolder: (f: FolderId) => void; setSelected: (id: string) => void
  folderNav: { data: NormalizedData; onEvent: (e: Event) => void }
}

export function buildInboxPage(s: InboxState): NormalizedData {
  const vis = MESSAGES.filter((m) => s.folder === 'inbox' ? true : s.folder === 'starred' ? m.starred : m.folder === s.folder)
  const cur = MESSAGES.find((m) => m.id === s.selectedId) ?? vis[0]
  const rowPairs = vis.flatMap((m) => {
    const cs: Array<[typeof CELL_KEYS[number], unknown]> = [
      ['star', <span aria-label={m.starred ? '별표' : '없음'} data-icon="star" style={{ opacity: m.starred ? 1 : 0.2 }} />],
      ['from', <>{m.from}{m.unread && <span data-icon="dot" data-tone="info" aria-label="안 읽음" />}</>],
      ['subject', <><strong>{m.subject}</strong> <small>— {m.preview}</small></>],
      ['label', m.label ? <Badge tone={labelTone[m.label]}>{m.label}</Badge> : null],
      ['time', <small>{m.time}</small>],
    ]
    return [
      [`row-${m.id}`, { id: `row-${m.id}`, data: { type: 'Ui', component: 'DataGridRow', props: { 'aria-selected': m.id === s.selectedId, 'data-unread': m.unread || undefined, onClick: () => s.setSelected(m.id) } } }],
      ...cs.map(([k, c]) => [`c-${m.id}-${k}`, { id: `c-${m.id}-${k}`, data: { type: 'Ui', component: 'GridCell', content: c } }]),
    ] as Array<readonly [string, unknown]>
  })
  return {
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      page: { id: 'page', data: { type: 'Row', flow: 'list' } },
      nav: { id: 'nav', data: { type: 'Column', flow: 'list', emphasis: 'sunk', width: 220 } },
      navHdr: { id: 'navHdr', data: { type: 'Text', variant: 'h3', content: '📮 Inbox' } },
      composeBtn: { id: 'composeBtn', data: { type: 'Ui', component: 'Button', props: { onClick: () => alert('compose'), 'aria-label': '새 메일' }, content: '＋ 새 메일' } },
      folderSep: { id: 'folderSep', data: { type: 'Ui', component: 'Separator', props: { orientation: 'horizontal' } } },
      folderList: { id: 'folderList', data: { type: 'Ui', component: 'Listbox', props: { data: s.folderNav.data, onEvent: s.folderNav.onEvent, 'aria-label': '폴더' } } },
      list: { id: 'list', data: { type: 'Column', flow: 'list', grow: true } },
      listHdr: { id: 'listHdr', data: { type: 'Ui', component: 'Toolbar', props: { 'aria-label': '도구' } } },
      searchInput: { id: 'searchInput', data: { type: 'Ui', component: 'Input', props: { type: 'search', placeholder: '검색…', 'aria-label': '검색', grow: true }, grow: true } },
      sortSel: { id: 'sortSel', data: { type: 'Ui', component: 'Select', props: { 'aria-label': '정렬', defaultValue: 'date-desc' }, content: <><option value="date-desc">최신순</option><option value="unread">안 읽음</option></> } },
      listGrid: { id: 'listGrid', data: { type: 'Ui', component: 'DataGrid', props: { 'aria-label': '메시지' } } },
      listHead: { id: 'listHead', data: { type: 'Ui', component: 'RowGroup' } },
      listHeadRow: { id: 'listHeadRow', data: { type: 'Ui', component: 'DataGridRow' } },
      ...Object.fromEntries(HEADS.map((t, i) => [`lh${i}`, { id: `lh${i}`, data: { type: 'Ui', component: 'ColumnHeader', content: t } }])),
      listBody: { id: 'listBody', data: { type: 'Ui', component: 'RowGroup' } },
      ...Object.fromEntries(rowPairs),
      detail: { id: 'detail', data: { type: 'Column', flow: 'form', emphasis: 'raised', width: 420 } },
      detailHdr: { id: 'detailHdr', data: { type: 'Header', flow: 'list' } },
      detailTitleCol: { id: 'detailTitleCol', data: { type: 'Column', flow: 'list', grow: true } },
      detailSubject: { id: 'detailSubject', data: { type: 'Text', variant: 'h2', content: cur?.subject ?? '—' } },
      detailMeta: { id: 'detailMeta', data: { type: 'Text', variant: 'small', content: cur ? `${cur.from} · ${cur.time}` : '' } },
      detailActions: { id: 'detailActions', data: { type: 'Ui', component: 'Toolbar', props: { 'aria-label': '액션' } } },
      ...Object.fromEntries(ACTS.map(([id, label, icon]) => [id, { id, data: { type: 'Ui', component: 'ToolbarButton', props: { 'aria-label': label, 'data-icon': icon }, content: label } }])),
      detailBody: { id: 'detailBody', data: { type: 'Text', variant: 'body', content: cur?.body ?? '—' } },
      detailLabel: { id: 'detailLabel', data: { type: 'Ui', component: 'Badge', props: { tone: cur?.label ? labelTone[cur.label] : 'neutral', children: cur?.label ?? '—' }, hidden: !cur?.label } },
      replyField: { id: 'replyField', data: { type: 'Ui', component: 'Textarea', props: { placeholder: '답장…', 'aria-label': '답장', rows: 3 } } },
      replySend: { id: 'replySend', data: { type: 'Ui', component: 'Button', props: { onClick: () => alert('send') }, content: '보내기' } },
    },
    relationships: {
      [ROOT]: ['page'], page: ['nav', 'list', 'detail'],
      nav: ['navHdr', 'composeBtn', 'folderSep', 'folderList'],
      list: ['listHdr', 'listGrid'], listHdr: ['searchInput', 'sortSel'],
      listGrid: ['listHead', 'listBody'], listHead: ['listHeadRow'],
      listHeadRow: HEADS.map((_, i) => `lh${i}`),
      listBody: vis.map((m) => `row-${m.id}`),
      ...Object.fromEntries(vis.map((m) => [`row-${m.id}`, CELL_KEYS.map((k) => `c-${m.id}-${k}`)])),
      detail: ['detailHdr', 'detailLabel', 'detailBody', 'replyField', 'replySend'],
      detailHdr: ['detailTitleCol', 'detailActions'], detailTitleCol: ['detailSubject', 'detailMeta'],
      detailActions: ACTS.map(([id]) => id) as string[],
    },
  }
}

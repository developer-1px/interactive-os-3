import { Badge, ROOT, type NormalizedData } from '../../../ds'
import { BULK_ACTS, CONTACTS, HEADS, stageTone, type Contact } from './data'

export interface CrmState {
  sel: Set<string>; open: string | null; q: string
  toggle: (id: string) => void; toggleAll: () => void
  setOpen: (id: string | null) => void; setQ: (v: string) => void
}

const rowCells = (c: Contact, sel: Set<string>, toggle: (id: string) => void) => [
  [`c-${c.id}-0`, <input type="checkbox" checked={sel.has(c.id)} onChange={() => toggle(c.id)} onClick={(e) => e.stopPropagation()} aria-label={`${c.name} 선택`} />],
  [`c-${c.id}-1`, c.name], [`c-${c.id}-2`, c.company], [`c-${c.id}-3`, <small>{c.email}</small>],
  [`c-${c.id}-4`, <Badge tone={stageTone(c.stage)}>{c.stage}</Badge>],
  [`c-${c.id}-5`, c.value.toLocaleString()], [`c-${c.id}-6`, c.owner], [`c-${c.id}-7`, <small>{c.updatedAt}</small>],
] as const

export function buildCrmPage(s: CrmState): NormalizedData {
  const rows = CONTACTS.filter((c) => !s.q || c.name.includes(s.q) || c.company.includes(s.q) || c.email.includes(s.q))
  const allChecked = rows.length > 0 && rows.every((r) => s.sel.has(r.id))
  const current = s.open ? CONTACTS.find((c) => c.id === s.open) : null
  const rowEnts = rows.flatMap((c) => [
    [`row-${c.id}`, { id: `row-${c.id}`, data: { type: 'Ui', component: 'DataGridRow', props: { 'aria-selected': s.sel.has(c.id), onClick: () => s.setOpen(c.id) } } }],
    ...rowCells(c, s.sel, s.toggle).map(([id, content]) => [id, { id, data: { type: 'Ui', component: 'GridCell', content } }]),
  ] as Array<readonly [string, unknown]>)
  return {
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      page: { id: 'page', data: { type: 'Column', flow: 'form' } },
      hdr: { id: 'hdr', data: { type: 'Header', flow: 'split' } },
      title: { id: 'title', data: { type: 'Text', variant: 'h1', content: 'Contacts' } },
      hdrActions: { id: 'hdrActions', data: { type: 'Ui', component: 'Toolbar', props: { 'aria-label': '도구' } } },
      search: { id: 'search', data: { type: 'Ui', component: 'Input', props: { type: 'search', placeholder: '이름·회사·이메일…', value: s.q, onChange: (e: React.ChangeEvent<HTMLInputElement>) => s.setQ(e.target.value), 'aria-label': '검색' } } },
      newBtn: { id: 'newBtn', data: { type: 'Ui', component: 'Button', props: { onClick: () => alert('신규') }, content: '＋ 신규' } },
      bulk: { id: 'bulk', data: { type: 'Row', flow: 'cluster', emphasis: 'raised', hidden: s.sel.size === 0 } },
      bulkLbl: { id: 'bulkLbl', data: { type: 'Text', variant: 'strong', content: `${s.sel.size}건 선택됨` } },
      bulkBar: { id: 'bulkBar', data: { type: 'Ui', component: 'Toolbar', props: { 'aria-label': '일괄' } } },
      ...Object.fromEntries(BULK_ACTS.map(([id, label, icon]) => [id, { id, data: { type: 'Ui', component: 'ToolbarButton', props: { 'data-icon': icon, onClick: () => alert(label) }, content: label } }])),
      grid: { id: 'grid', data: { type: 'Ui', component: 'DataGrid', props: { 'aria-label': '연락처' } } },
      head: { id: 'head', data: { type: 'Ui', component: 'RowGroup' } },
      headRow: { id: 'headRow', data: { type: 'Ui', component: 'DataGridRow' } },
      h0: { id: 'h0', data: { type: 'Ui', component: 'ColumnHeader', content: <input type="checkbox" checked={allChecked} onChange={s.toggleAll} aria-label="전체 선택" /> } },
      ...Object.fromEntries(HEADS.slice(1).map((t, i) => [`h${i + 1}`, { id: `h${i + 1}`, data: { type: 'Ui', component: 'ColumnHeader', content: t } }])),
      body: { id: 'body', data: { type: 'Ui', component: 'RowGroup' } },
      ...Object.fromEntries(rowEnts),
      foot: { id: 'foot', data: { type: 'Footer', flow: 'split' } },
      pageInfo: { id: 'pageInfo', data: { type: 'Text', variant: 'small', content: `${rows.length} / ${CONTACTS.length} rows` } },
      pageNav: { id: 'pageNav', data: { type: 'Ui', component: 'Toolbar', props: { 'aria-label': '페이지' } } },
      pPrev: { id: 'pPrev', data: { type: 'Ui', component: 'ToolbarButton', props: { 'data-icon': 'chevron-left', 'aria-label': '이전' }, content: '이전' } },
      pCur:  { id: 'pCur',  data: { type: 'Ui', component: 'ToolbarButton', props: { pressed: true, 'aria-label': '1 페이지' }, content: '1' } },
      pNext: { id: 'pNext', data: { type: 'Ui', component: 'ToolbarButton', props: { 'data-icon': 'chevron-right', 'aria-label': '다음' }, content: '다음' } },
      drawer: { id: 'drawer', data: { type: 'Ui', component: 'Dialog', props: {
        open: Boolean(current), onClose: () => s.setOpen(null), 'aria-label': '연락처 상세',
        children: current ? (
          <div data-ds="Column" data-flow="form">
            <h2>{current.name}</h2>
            <dl data-ds-dl>
              <dt>회사</dt><dd>{current.company}</dd>
              <dt>이메일</dt><dd>{current.email}</dd>
              <dt>단계</dt><dd><Badge tone={stageTone(current.stage)}>{current.stage}</Badge></dd>
              <dt>가치</dt><dd>${current.value.toLocaleString()}</dd>
              <dt>담당</dt><dd>{current.owner}</dd>
              <dt>업데이트</dt><dd>{current.updatedAt}</dd>
            </dl>
          </div>
        ) : null,
      } } },
    },
    relationships: {
      [ROOT]: ['page'], page: ['hdr', 'bulk', 'grid', 'foot', 'drawer'],
      hdr: ['title', 'hdrActions'], hdrActions: ['search', 'newBtn'],
      bulk: ['bulkLbl', 'bulkBar'], bulkBar: BULK_ACTS.map(([id]) => id) as string[],
      grid: ['head', 'body'], head: ['headRow'],
      headRow: HEADS.map((_, i) => `h${i}`),
      body: rows.map((c) => `row-${c.id}`),
      ...Object.fromEntries(rows.map((c) => [`row-${c.id}`, HEADS.map((_, i) => `c-${c.id}-${i}`)])),
      foot: ['pageInfo', 'pageNav'], pageNav: ['pPrev', 'pCur', 'pNext'],
    },
  }
}

/**
 * CRM / Admin Table — 대량 테이블 + bulk action + 사이드 drawer.
 *
 * 갭: BulkActionBar role 부재(Toolbar 조합으로 대체), Drawer 부재(Dialog 재활용),
 *     Pagination 부재.
 */
import { useState } from 'react'
import { Renderer, definePage, ROOT, Badge, type NormalizedData } from '../../ds'

interface Contact {
  id: string; name: string; company: string; email: string; stage: '신규' | '검증' | '제안' | '협상' | '성사' | '실패'
  value: number; owner: string; updatedAt: string
}
const CONTACTS: Contact[] = [
  { id: 'c1', name: '김지훈', company: '네이버',        email: 'jihoon@naver.com',    stage: '신규', value:  500, owner: '박수진', updatedAt: '04-22' },
  { id: 'c2', name: '이소라', company: '카카오',        email: 'sora@kakao.com',      stage: '검증', value: 1200, owner: '박수진', updatedAt: '04-22' },
  { id: 'c3', name: '박민수', company: 'Toss',          email: 'ms@toss.im',          stage: '제안', value: 3400, owner: '이재혁', updatedAt: '04-21' },
  { id: 'c4', name: '최유리', company: 'Coupang',       email: 'yuri@coupang.com',    stage: '협상', value: 8900, owner: '이재혁', updatedAt: '04-20' },
  { id: 'c5', name: '정현우', company: '우아한형제들',  email: 'hw@woowahan.com',     stage: '성사', value: 2100, owner: '박수진', updatedAt: '04-19' },
  { id: 'c6', name: '강다은', company: 'Line',          email: 'daeun@line.me',       stage: '실패', value:  800, owner: '이재혁', updatedAt: '04-18' },
  { id: 'c7', name: '조성민', company: 'SKT',           email: 'sm@sktelecom.com',    stage: '신규', value: 4500, owner: '박수진', updatedAt: '04-22' },
  { id: 'c8', name: '윤세아', company: 'LG CNS',        email: 'sea@lgcns.com',       stage: '검증', value: 1800, owner: '이재혁', updatedAt: '04-21' },
  { id: 'c9', name: '한지우', company: 'Samsung SDS',   email: 'jw@samsungsds.com',   stage: '제안', value: 6200, owner: '박수진', updatedAt: '04-20' },
  { id: 'c10',name: '문재호', company: 'KT',            email: 'jh@kt.com',           stage: '협상', value: 3100, owner: '이재혁', updatedAt: '04-19' },
]

const stageTone = (s: Contact['stage']) =>
  s === '성사' ? 'success' : s === '실패' ? 'danger' : s === '협상' ? 'warning' : s === '제안' ? 'info' : 'neutral'

export function Crm() {
  const [sel, setSel] = useState<Set<string>>(new Set())
  const [open, setOpen] = useState<string | null>(null)
  const [q, setQ] = useState('')

  const rows = CONTACTS.filter((c) => !q || c.name.includes(q) || c.company.includes(q) || c.email.includes(q))
  const allChecked = rows.length > 0 && rows.every((r) => sel.has(r.id))
  const current = open ? CONTACTS.find((c) => c.id === open) : null

  const toggle = (id: string) => setSel((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n })
  const toggleAll = () => setSel(allChecked ? new Set() : new Set(rows.map((r) => r.id)))

  const data: NormalizedData = {
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      page: { id: 'page', data: { type: 'Column', flow: 'form' } },

      hdr: { id: 'hdr', data: { type: 'Header', flow: 'split' } },
      title: { id: 'title', data: { type: 'Text', variant: 'h1', content: 'Contacts' } },
      hdrActions: { id: 'hdrActions', data: { type: 'Ui', component: 'Toolbar', props: { 'aria-label': '테이블 도구' } } },
      search: { id: 'search', data: {
        type: 'Ui', component: 'Input',
        props: { type: 'search', placeholder: '이름·회사·이메일…', value: q, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value), 'aria-label': '검색' },
      } },
      newBtn: { id: 'newBtn', data: { type: 'Ui', component: 'Button', props: { onClick: () => alert('신규') }, content: '＋ 신규' } },

      bulk: { id: 'bulk', data: { type: 'Row', flow: 'cluster', emphasis: 'raised', hidden: sel.size === 0 } },
      bulkLbl: { id: 'bulkLbl', data: { type: 'Text', variant: 'strong', content: `${sel.size}건 선택됨` } },
      bulkBar: { id: 'bulkBar', data: { type: 'Ui', component: 'Toolbar', props: { 'aria-label': '일괄 작업' } } },
      bAssign: { id: 'bAssign', data: { type: 'Ui', component: 'ToolbarButton', props: { 'data-icon': 'user',  onClick: () => alert('담당자 변경') }, content: '담당자 변경' } },
      bStage:  { id: 'bStage',  data: { type: 'Ui', component: 'ToolbarButton', props: { 'data-icon': 'move',  onClick: () => alert('단계 이동')   }, content: '단계 이동' } },
      bExport: { id: 'bExport', data: { type: 'Ui', component: 'ToolbarButton', props: { 'data-icon': 'download', onClick: () => alert('내보내기')  }, content: '내보내기' } },
      bDelete: { id: 'bDelete', data: { type: 'Ui', component: 'ToolbarButton', props: { 'data-icon': 'trash', onClick: () => alert('삭제')        }, content: '삭제' } },

      grid: { id: 'grid', data: { type: 'Ui', component: 'DataGrid', props: { 'aria-label': '연락처 테이블' } } },
      head: { id: 'head', data: { type: 'Ui', component: 'RowGroup' } },
      headRow: { id: 'headRow', data: { type: 'Ui', component: 'DataGridRow' } },
      h0: { id: 'h0', data: { type: 'Ui', component: 'ColumnHeader', content: <input type="checkbox" checked={allChecked} onChange={toggleAll} aria-label="전체 선택" /> } },
      h1: { id: 'h1', data: { type: 'Ui', component: 'ColumnHeader', content: '이름' } },
      h2: { id: 'h2', data: { type: 'Ui', component: 'ColumnHeader', content: '회사' } },
      h3: { id: 'h3', data: { type: 'Ui', component: 'ColumnHeader', content: '이메일' } },
      h4: { id: 'h4', data: { type: 'Ui', component: 'ColumnHeader', content: '단계' } },
      h5: { id: 'h5', data: { type: 'Ui', component: 'ColumnHeader', content: '가치($)' } },
      h6: { id: 'h6', data: { type: 'Ui', component: 'ColumnHeader', content: '담당' } },
      h7: { id: 'h7', data: { type: 'Ui', component: 'ColumnHeader', content: '업데이트' } },

      body: { id: 'body', data: { type: 'Ui', component: 'RowGroup' } },
      ...Object.fromEntries(rows.flatMap((c) => [
        [`row-${c.id}`, { id: `row-${c.id}`, data: {
          type: 'Ui', component: 'DataGridRow',
          props: { 'aria-selected': sel.has(c.id), onClick: () => setOpen(c.id), style: { cursor: 'pointer' } },
        } }],
        [`c-${c.id}-0`, { id: `c-${c.id}-0`, data: { type: 'Ui', component: 'GridCell',
          content: <input type="checkbox" checked={sel.has(c.id)} onChange={() => toggle(c.id)} onClick={(e) => e.stopPropagation()} aria-label={`${c.name} 선택`} /> } }],
        [`c-${c.id}-1`, { id: `c-${c.id}-1`, data: { type: 'Ui', component: 'GridCell', content: c.name } }],
        [`c-${c.id}-2`, { id: `c-${c.id}-2`, data: { type: 'Ui', component: 'GridCell', content: c.company } }],
        [`c-${c.id}-3`, { id: `c-${c.id}-3`, data: { type: 'Ui', component: 'GridCell', content: <small>{c.email}</small> } }],
        [`c-${c.id}-4`, { id: `c-${c.id}-4`, data: { type: 'Ui', component: 'GridCell', content: <Badge tone={stageTone(c.stage)}>{c.stage}</Badge> } }],
        [`c-${c.id}-5`, { id: `c-${c.id}-5`, data: { type: 'Ui', component: 'GridCell', content: c.value.toLocaleString() } }],
        [`c-${c.id}-6`, { id: `c-${c.id}-6`, data: { type: 'Ui', component: 'GridCell', content: c.owner } }],
        [`c-${c.id}-7`, { id: `c-${c.id}-7`, data: { type: 'Ui', component: 'GridCell', content: <small>{c.updatedAt}</small> } }],
      ])),

      foot: { id: 'foot', data: { type: 'Footer', flow: 'split' } },
      pageInfo: { id: 'pageInfo', data: { type: 'Text', variant: 'small', content: `${rows.length} / ${CONTACTS.length} rows` } },
      pageNav: { id: 'pageNav', data: { type: 'Ui', component: 'Toolbar', props: { 'aria-label': '페이지' } } },
      pPrev: { id: 'pPrev', data: { type: 'Ui', component: 'ToolbarButton', props: { 'data-icon': 'chevron-left',  'aria-label': '이전' }, content: '이전' } },
      pCur:  { id: 'pCur',  data: { type: 'Ui', component: 'ToolbarButton', props: { pressed: true, 'aria-label': '1 페이지' }, content: '1' } },
      pNext: { id: 'pNext', data: { type: 'Ui', component: 'ToolbarButton', props: { 'data-icon': 'chevron-right', 'aria-label': '다음' }, content: '다음' } },

      /* drawer — Dialog 재활용 (갭: 실제 drawer 부재) */
      drawer: { id: 'drawer', data: {
        type: 'Ui', component: 'Dialog',
        props: {
          open: Boolean(current),
          onClose: () => setOpen(null),
          'aria-label': '연락처 상세',
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
        },
      } },
    },
    relationships: {
      [ROOT]: ['page'],
      page: ['hdr', 'bulk', 'grid', 'foot', 'drawer'],

      hdr: ['title', 'hdrActions'],
      hdrActions: ['search', 'newBtn'],

      bulk: ['bulkLbl', 'bulkBar'],
      bulkBar: ['bAssign', 'bStage', 'bExport', 'bDelete'],

      grid: ['head', 'body'],
      head: ['headRow'],
      headRow: ['h0', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7'],
      body: rows.map((c) => `row-${c.id}`),
      ...Object.fromEntries(rows.map((c) => [`row-${c.id}`, [0,1,2,3,4,5,6,7].map((i) => `c-${c.id}-${i}`)])),

      foot: ['pageInfo', 'pageNav'],
      pageNav: ['pPrev', 'pCur', 'pNext'],
    },
  }
  return <Renderer page={definePage(data)} />
}

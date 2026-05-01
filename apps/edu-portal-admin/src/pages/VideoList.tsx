import { useState } from 'react'
import { Renderer, definePage, ROOT, type NormalizedData } from '@p/ds'
import { videos, LEVEL_TONE, STATUS_TONE } from '../entities/data'

type SortKey = 'title' | 'enrolled' | 'completion' | 'createdAt'
type SortDir = 'ascending' | 'descending'
type EntityMap = NormalizedData['entities']
type RelationshipMap = NormalizedData['relationships']

const EDIT_ROUTE = '/edu-portal-admin/videos/$id/edit'

export function VideoList() {
  const [q, setQ] = useState('')
  const [level, setLevel] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: 'createdAt', dir: 'descending' })

  const filtered = videos.filter(
    (v) =>
      (!q || v.title.toLowerCase().includes(q.toLowerCase())) &&
      (!level || v.level === level) &&
      (!role || v.roles.includes(role)) &&
      (!status || v.status === status),
  )
  const sorted = [...filtered].sort((a, b) => {
    const av = a[sort.key] ?? ''
    const bv = b[sort.key] ?? ''
    const cmp = av < bv ? -1 : av > bv ? 1 : 0
    return sort.dir === 'ascending' ? cmp : -cmp
  })
  const onSort = (key: SortKey) =>
    setSort((s) => ({ key, dir: s.key === key && s.dir === 'ascending' ? 'descending' : 'ascending' }))
  const sortOf = (key: SortKey) => (sort.key === key ? sort.dir : 'none')

  const filterOpts: Array<[string, React.ReactNode]> = [['', '전체 레벨'], ['초급','초급'], ['중급','중급'], ['고급','고급']]
  const roleOpts: Array<[string, React.ReactNode]>   = [['', '전체 역할'], ['개발자','개발자'], ['엔지니어','엔지니어'], ['보안','보안'], ['AI','AI']]
  const statusOpts: Array<[string, React.ReactNode]> = [['', '전체 상태'], ['게시 중','게시 중'], ['임시저장','임시저장'], ['숨김','숨김'], ['예약','예약']]

  const data: NormalizedData = {
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      page: { id: 'page', data: { type: 'Column', flow: 'form' } },

      // Filter toolbar
      toolbar: { id: 'toolbar', data: { type: 'Row', flow: 'cluster', label: '영상 필터' } },
      tb_q: { id: 'tb_q', data: {
        type: 'Ui', component: 'Input',
        props: { 'aria-label': '검색', placeholder: '영상 제목, 키워드 검색', value: q, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value) },
      } },
      tb_sep: { id: 'tb_sep', data: { type: 'Ui', component: 'Separator', props: { orientation: 'vertical' } } },
      tb_level: { id: 'tb_level', data: {
        type: 'Ui', component: 'Select',
        props: { 'aria-label': '레벨', value: level, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setLevel(e.target.value) },
        content: <>{filterOpts.map(([v, l]) => <option key={String(v)} value={String(v)}>{l}</option>)}</>,
      } },
      tb_role: { id: 'tb_role', data: {
        type: 'Ui', component: 'Select',
        props: { 'aria-label': '역할', value: role, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setRole(e.target.value) },
        content: <>{roleOpts.map(([v, l]) => <option key={String(v)} value={String(v)}>{l}</option>)}</>,
      } },
      tb_status: { id: 'tb_status', data: {
        type: 'Ui', component: 'Select',
        props: { 'aria-label': '상태', value: status, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value) },
        content: <>{statusOpts.map(([v, l]) => <option key={String(v)} value={String(v)}>{l}</option>)}</>,
      } },
      tb_count: { id: 'tb_count', data: {
        type: 'Text', variant: 'body', content: <>총 <strong>{sorted.length}</strong>개</>,
      } },

      // DataGrid
      grid: { id: 'grid', data: { type: 'Ui', component: 'DataGrid', props: { 'aria-label': '영상 목록' } } },
      headGroup: { id: 'headGroup', data: { type: 'Ui', component: 'HeaderGroup' } },
      headRow: { id: 'headRow', data: { type: 'Ui', component: 'DataGridRow' } },
      h_thumb:      { id: 'h_thumb',      data: { type: 'Ui', component: 'ColumnHeader', props: { 'aria-label': '썸네일' }, content: '' } },
      h_title:      { id: 'h_title',      data: { type: 'Ui', component: 'ColumnHeader', props: { sort: sortOf('title') },      content: <button type="button" onClick={() => onSort('title')}>영상 제목</button> } },
      h_level:      { id: 'h_level',      data: { type: 'Ui', component: 'ColumnHeader', content: '레벨' } },
      h_roles:      { id: 'h_roles',      data: { type: 'Ui', component: 'ColumnHeader', content: '역할' } },
      h_enrolled:   { id: 'h_enrolled',   data: { type: 'Ui', component: 'ColumnHeader', props: { sort: sortOf('enrolled'),   'data-num': 'true' }, content: <button type="button" onClick={() => onSort('enrolled')}>수강 신청</button> } },
      h_completion: { id: 'h_completion', data: { type: 'Ui', component: 'ColumnHeader', props: { sort: sortOf('completion'), 'data-num': 'true' }, content: <button type="button" onClick={() => onSort('completion')}>완료율</button> } },
      h_rating:     { id: 'h_rating',     data: { type: 'Ui', component: 'ColumnHeader', props: { 'data-num': 'true' }, content: '별점' } },
      h_status:     { id: 'h_status',     data: { type: 'Ui', component: 'ColumnHeader', content: '상태' } },
      h_visible:    { id: 'h_visible',    data: { type: 'Ui', component: 'ColumnHeader', props: { 'data-nowrap': 'true' }, content: '노출' } },
      h_createdAt:  { id: 'h_createdAt',  data: { type: 'Ui', component: 'ColumnHeader', props: { sort: sortOf('createdAt'),   'data-num': 'true', 'data-nowrap': 'true' }, content: <button type="button" onClick={() => onSort('createdAt')}>등록일</button> } },
      h_manage:     { id: 'h_manage',     data: { type: 'Ui', component: 'ColumnHeader', props: { 'aria-label': '관리' }, content: '' } },

      bodyGroup: { id: 'bodyGroup', data: { type: 'Ui', component: 'RowGroup' } },
      ...bodyRowNodes(sorted),
    },
    relationships: {
      [ROOT]: ['page'],
      page: ['toolbar', 'grid'],
      toolbar: ['tb_q','tb_sep','tb_level','tb_role','tb_status','tb_count'],
      grid: ['headGroup', 'bodyGroup'],
      headGroup: ['headRow'],
      headRow: ['h_thumb','h_title','h_level','h_roles','h_enrolled','h_completion','h_rating','h_status','h_visible','h_createdAt','h_manage'],
      bodyGroup: sorted.map((v) => `row-${v.id}`),
      ...bodyRowRels(sorted),
    },
  }

  return <Renderer page={definePage(data)} />
}

// 썸네일 — picsum.photos seeded로 id마다 안정된 이미지. 16:9, 120x68.
const thumbUrl = (id: string) => `https://picsum.photos/seed/${id}/240/136`

function bodyRowNodes(items: typeof videos): EntityMap {
  const out: EntityMap = {}
  for (const v of items) {
    out[`row-${v.id}`] = { id: `row-${v.id}`, data: { type: 'Ui', component: 'DataGridRow' } }

    out[`c-${v.id}-thumb`] = { id: `c-${v.id}-thumb`, data: {
      type: 'Ui', component: 'GridCell',
    } }
    out[`thumb-${v.id}`] = { id: `thumb-${v.id}`, data: {
      type: 'Ui', component: 'Thumbnail',
      width: 120,
      props: { src: thumbUrl(v.id), alt: '', ratio: '16/9', loading: 'lazy' },
    } }

    out[`c-${v.id}-title`] = { id: `c-${v.id}-title`, data: {
      type: 'Ui', component: 'GridCell',
    } }
    out[`titleStack-${v.id}`] = { id: `titleStack-${v.id}`, data: { type: 'Column', flow: 'list' } }
    out[`titleLink-${v.id}`] = { id: `titleLink-${v.id}`, data: {
      type: 'Ui', component: 'Link',
      props: { to: EDIT_ROUTE, params: { id: v.id }, label: v.title, 'aria-label': `${v.title} 수정` },
    } }
    out[`titleMeta-${v.id}`] = { id: `titleMeta-${v.id}`, data: {
      type: 'Text', variant: 'small', content: v.duration,
    } }

    out[`c-${v.id}-level`]  = { id: `c-${v.id}-level`,  data: { type: 'Ui', component: 'GridCell' } }
    out[`b-${v.id}-level`]  = { id: `b-${v.id}-level`,  data: { type: 'Ui', component: 'Badge', props: { tone: LEVEL_TONE[v.level] ?? 'neutral' }, content: v.level } }

    out[`c-${v.id}-roles`]  = { id: `c-${v.id}-roles`,  data: { type: 'Ui', component: 'GridCell' } }
    out[`roles-${v.id}`] = { id: `roles-${v.id}`, data: { type: 'Row', flow: 'cluster' } }
    v.roles.forEach((role, index) => {
      out[`role-${v.id}-${index}`] = { id: `role-${v.id}-${index}`, data: {
        type: 'Ui', component: 'Badge', props: { variant: 'default' }, content: role,
      } }
    })

    out[`c-${v.id}-enrolled`] = { id: `c-${v.id}-enrolled`, data: { type: 'Ui', component: 'GridCell', props: { 'data-num': 'true' }, content: v.enrolled } }

    out[`c-${v.id}-completion`] = { id: `c-${v.id}-completion`, data: { type: 'Ui', component: 'GridCell', props: { 'data-num': 'true' } } }
    if (v.completion == null) {
      out[`completionEmpty-${v.id}`] = { id: `completionEmpty-${v.id}`, data: { type: 'Text', variant: 'muted', content: '—' } }
    } else {
      out[`completion-${v.id}`] = { id: `completion-${v.id}`, data: { type: 'Row', flow: 'cluster' } }
      out[`completionBar-${v.id}`] = { id: `completionBar-${v.id}`, data: {
        type: 'Ui', component: 'Progress',
        width: 96,
        props: { value: v.completion, max: 100, 'aria-label': `완료율 ${v.completion}%` },
      } }
      out[`completionValue-${v.id}`] = { id: `completionValue-${v.id}`, data: {
        type: 'Text', variant: 'strong', content: `${v.completion}%`, width: 44, align: 'end',
      } }
    }

    out[`c-${v.id}-rating`] = { id: `c-${v.id}-rating`, data: { type: 'Ui', component: 'GridCell', props: { 'data-num': 'true' },
      content: v.rating == null
        ? '—'
        : <span data-icon="star" aria-label={`별점 ${v.rating}`}>{v.rating}</span>,
    } }

    out[`c-${v.id}-status`] = { id: `c-${v.id}-status`, data: { type: 'Ui', component: 'GridCell' } }
    out[`b-${v.id}-status`] = { id: `b-${v.id}-status`, data: { type: 'Ui', component: 'Badge', props: { tone: STATUS_TONE[v.status] ?? 'neutral' }, content: v.status } }

    out[`c-${v.id}-visible`] = { id: `c-${v.id}-visible`, data: { type: 'Ui', component: 'GridCell', props: { 'data-nowrap': 'true' },
    } }
    out[`visible-${v.id}`] = { id: `visible-${v.id}`, data: {
      type: 'Text', variant: v.visible ? 'strong' : 'muted', content: v.visible ? '노출' : '숨김',
    } }

    out[`c-${v.id}-createdAt`] = { id: `c-${v.id}-createdAt`, data: { type: 'Ui', component: 'GridCell', props: { 'data-num': 'true', 'data-nowrap': 'true' } } }
    out[`createdAt-${v.id}`] = { id: `createdAt-${v.id}`, data: {
      type: 'Text', variant: 'small', content: v.createdAt,
    } }

    out[`c-${v.id}-manage`] = { id: `c-${v.id}-manage`, data: { type: 'Ui', component: 'GridCell', props: { 'data-num': 'true', 'data-nowrap': 'true' } } }
    out[`manage-${v.id}`] = { id: `manage-${v.id}`, data: {
      type: 'Ui', component: 'Link',
      props: { to: EDIT_ROUTE, params: { id: v.id }, label: '수정', 'aria-label': `${v.title} 수정` },
    } }
  }
  return out
}

function bodyRowRels(items: typeof videos): RelationshipMap {
  const out: RelationshipMap = {}
  const keys = ['thumb','title','level','roles','enrolled','completion','rating','status','visible','createdAt','manage']
  for (const v of items) {
    out[`row-${v.id}`] = keys.map((k) => `c-${v.id}-${k}`)
    out[`c-${v.id}-thumb`] = [`thumb-${v.id}`]
    out[`c-${v.id}-title`] = [`titleStack-${v.id}`]
    out[`titleStack-${v.id}`] = [`titleLink-${v.id}`, `titleMeta-${v.id}`]
    out[`c-${v.id}-level`]   = [`b-${v.id}-level`]
    out[`c-${v.id}-roles`] = [`roles-${v.id}`]
    out[`roles-${v.id}`] = v.roles.map((_, index) => `role-${v.id}-${index}`)
    out[`c-${v.id}-completion`] = [
      v.completion == null ? `completionEmpty-${v.id}` : `completion-${v.id}`,
    ]
    if (v.completion != null) {
      out[`completion-${v.id}`] = [`completionBar-${v.id}`, `completionValue-${v.id}`]
    }
    out[`c-${v.id}-status`]  = [`b-${v.id}-status`]
    out[`c-${v.id}-visible`] = [`visible-${v.id}`]
    out[`c-${v.id}-createdAt`] = [`createdAt-${v.id}`]
    out[`c-${v.id}-manage`]  = [`manage-${v.id}`]
  }
  return out
}

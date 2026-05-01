/** CRM — 대량 테이블 + bulk action + drawer. */
import { useMemo, useState } from 'react'
import { Renderer, definePage, ROOT, useControlState, type UiEvent, type NormalizedData } from '@p/ds'
import { BULK_ACTS, CONTACTS } from './data'
import { buildCrmPage } from './build'

const bulkBarBase = (): NormalizedData => ({
  entities: {
    [ROOT]: { id: ROOT, data: {} },
    __focus__: { id: '__focus__', data: { id: 'bAssign' } },
    ...Object.fromEntries(BULK_ACTS.map(([id, label, icon]) => [id, { id, data: { label, icon, content: label } }])),
  },
  relationships: { [ROOT]: BULK_ACTS.map(([id]) => id) as string[] },
})

const pageNavBase = (): NormalizedData => ({
  entities: {
    [ROOT]: { id: ROOT, data: {} },
    __focus__: { id: '__focus__', data: { id: 'pCur' } },
    pPrev: { id: 'pPrev', data: { label: '이전', icon: 'chevron-left', content: '이전' } },
    pCur:  { id: 'pCur',  data: { label: '1 페이지', content: '1', pressed: true } },
    pNext: { id: 'pNext', data: { label: '다음', icon: 'chevron-right', content: '다음' } },
  },
  relationships: { [ROOT]: ['pPrev', 'pCur', 'pNext'] },
})

export function Crm() {
  const [sel, setSel] = useState<Set<string>>(new Set())
  const [open, setOpen] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const toggle = (id: string) => setSel((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n })
  const rows = CONTACTS.filter((c) => !q || c.name.includes(q) || c.company.includes(q) || c.email.includes(q))
  const allChecked = rows.length > 0 && rows.every((r) => sel.has(r.id))
  const toggleAll = () => setSel(allChecked ? new Set() : new Set(rows.map((r) => r.id)))

  const [bulkBarData, bulkBarDispatch] = useControlState(useMemo(() => bulkBarBase(), []))
  const onBulkBar = (e: UiEvent) => {
    bulkBarDispatch(e)
    if (e.type === 'activate') {
      const found = BULK_ACTS.find(([id]) => id === e.id)
      if (found) alert(found[1])
    }
  }
  const [pageNavData, pageNavDispatch] = useControlState(useMemo(() => pageNavBase(), []))

  return <Renderer page={definePage(buildCrmPage({
    sel, open, q, toggle, toggleAll, setOpen, setQ,
    bulkBar: { data: bulkBarData, onEvent: onBulkBar },
    pageNav: { data: pageNavData, onEvent: pageNavDispatch },
  }))} />
}

/** CRM — 대량 테이블 + bulk action + drawer. */
import { useState } from 'react'
import { Renderer, definePage } from '../../../ds'
import { CONTACTS } from './data'
import { buildCrmPage } from './build'

export function Crm() {
  const [sel, setSel] = useState<Set<string>>(new Set())
  const [open, setOpen] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const toggle = (id: string) => setSel((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n })
  const rows = CONTACTS.filter((c) => !q || c.name.includes(q) || c.company.includes(q) || c.email.includes(q))
  const allChecked = rows.length > 0 && rows.every((r) => sel.has(r.id))
  const toggleAll = () => setSel(allChecked ? new Set() : new Set(rows.map((r) => r.id)))
  return <Renderer page={definePage(buildCrmPage({ sel, open, q, toggle, toggleAll, setOpen, setQ }))} />
}

/** Foundations 페이지 — FnCard slots 매핑 + LEAK_COLUMNS 정의. */
import { createElement, type ReactNode } from 'react'
import type { AuditData } from 'virtual:ds-audit'
import type { TableColumn } from '@p/ds/ui/parts/Table'
import type { CardSlot } from '@p/ds/ui/parts/Card'

// FnCard → Card slots 매핑.
// guard-serializable: entity data 안 `title:` `body:` `footer:` 키에 JSX 리터럴 ❌.
// → createElement + 동적 키 할당으로 우회 (canonical 슬롯 어휘는 유지).
export function fnCardSlots(args: {
  name: string
  doc?: string
  signature: string
  sites?: AuditData['callSites'][string]
  demo?: ReactNode
}): Partial<Record<CardSlot, ReactNode>> {
  const { name, doc, signature, sites, demo } = args
  const auditing = sites !== undefined
  const count = sites?.length ?? 0
  const dead = auditing && count === 0
  const titleNode = createElement(
    'header',
    null,
    createElement('code', null, name),
    auditing && createElement(
      'span',
      {
        'data-badge': true,
        'data-tone': dead ? 'bad' : 'good',
        'aria-label': `${count} call sites`,
        title: count
          ? sites!.slice(0, 10).map((s) => `${s.file}:${s.line}`).join('\n')
          : '호출처 없음 — 죽은 조립식 가능성',
      },
      `×${count}`,
    ),
  )
  const bodyNode = doc ? createElement('p', null, doc) : undefined
  const footerNode = createElement('code', { 'data-role': 'signature' }, signature)
  const slots: Partial<Record<CardSlot, ReactNode>> = {}
  slots.title = titleNode
  if (demo !== undefined) slots.preview = demo
  if (bodyNode !== undefined) slots.body = bodyNode
  slots.footer = footerNode
  return slots
}

export const LEAK_COLUMNS: TableColumn[] = [
  { key: 'file', label: '파일' },
  { key: 'line', label: 'line', align: 'end' },
  { key: 'kind', label: 'kind' },
  { key: 'snippet', label: 'snippet' },
]

import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Card, type CardSlot } from '../../parts/Card'
import { Heading } from '../../parts/Heading'
import { Code } from '../../parts/Code'
import { Callout } from '../../parts/Callout'
import { KeyValue } from '../../parts/KeyValue'

/**
 * ContractCard — ds 컴포넌트 계약 감사 카드.
 *
 * Card primitive(ds/parts/Card) 의 슬롯에 contract 데이터를 바인딩하는 thin wrapper.
 * 자체 layout 결정 ❌ — 부모 Grid가 row track owner.
 */
export type ContractCheckItem = { id: string; label: string; pass: boolean; note?: string }

type BadgeTone = 'good' | 'warn' | 'bad'

type ContractCardProps = Omit<ComponentPropsWithoutRef<'article'>, 'children' | 'onSelect'> & {
  name: string
  file: string
  role?: string | null | undefined
  propsSignature: string
  checks: ContractCheckItem[]
  callSites: number
  badgeTone?: BadgeTone
  drift?: boolean
  selected?: boolean
  onSelect?: () => void
  /** preview 슬롯 — figure 안에 들어갈 demo 노드 */
  demo?: ReactNode
  /** 슬롯 표시 순서 — 기본 ['preview','title','meta','body','checks','footer'] */
  slotOrder?: CardSlot[]
}

export function ContractCard({
  name, file, role, propsSignature, checks, callSites,
  badgeTone, drift, selected, onSelect, demo, slotOrder, ...rest
}: ContractCardProps) {
  const passCount = checks.filter((c) => c.pass).length
  const allPass = passCount === checks.length
  const tone: BadgeTone = badgeTone ?? (allPass ? 'good' : passCount / Math.max(checks.length, 1) >= 0.7 ? 'warn' : 'bad')
  const badge = allPass ? '✓' : `${passCount}/${checks.length}`

  return (
    <Card
      data-card="contract"
      slots={{
        preview: <figure aria-label={`${name} 예시`}>{demo ?? <Heading level="caption">demo TBD</Heading>}</figure>,
        title: (
          <header>
            <Heading level="h3">{name}</Heading>
            <span data-badge data-tone={tone}>{badge}</span>
            {role && <Code>role=&quot;{role}&quot;</Code>}
            <Heading level="caption">{callSites} 소비처</Heading>
          </header>
        ),
        meta: <Code>{file.replace('/src/ds/ui/', '')}</Code>,
        body: <pre><Code>{propsSignature}</Code></pre>,
        checks: (
          <KeyValue
            items={checks.map((c) => ({
              key: <span data-pass={c.pass ? 'true' : 'false'}>{c.pass ? '✓' : '✗'}</span>,
              value: c.label,
            }))}
          />
        ),
        footer: drift
          ? <Callout tone="warning">tier 폴더 외부 — 1-status ~ 8-layout 중 하나로 이동</Callout>
          : null,
      }}
      slotOrder={slotOrder}
      selected={selected}
      tabIndex={onSelect ? 0 : undefined}
      onClick={onSelect}
      onKeyDown={onSelect ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect() }
      } : undefined}
      {...rest}
    />
  )
}

import type { ReactNode } from 'react'
import { Column, Heading, Phone, PhoneTopBar, Row, TabList, Chip, fromList } from '@p/ds'
import { Button } from '@p/ds/ui/1-command/Button'
import { Card } from '@p/ds/ui/6-structure/Card'
import { defineScreen, defineGroup } from '../wireframe-registry'
import { Body } from '../wireframe-shell'
import { type } from '@p/ds/tokens/semantic'
import { meta } from '../wireframe-tokens'

defineGroup('O-Pricing',       { id: 'O', title: 'Pricing',       lede: '월/연 토글 + 3-tier Card (Free / Pro 추천 / Team) + feature checklist.', defaultGuide: 'hero' })

// ──────────────────────────────────────────────────────────────────────
// (O) Pricing — 3-tier card
// ──────────────────────────────────────────────────────────────────────

const Price = ({ amount, period = '/월' }: { amount: string; period?: string }) => (
  <strong style={type.display}>{amount}<small style={{ ...meta.weak, ...type.period }}> {period}</small></strong>
)
const Feat = ({ children }: { children: ReactNode }) => (
  <Row flow="cluster" style={{ alignItems: 'center' }}><span data-icon="check" aria-hidden /><span>{children}</span></Row>
)

const Pricing_Plans = defineScreen({
  id: 'cat-pricing-plans',
  app: 'Generic SaaS',
  flow: 'pricing',
  category: 'O-Pricing',
  patterns: ['period-tabs', 'pricing-card', 'feature-list', 'recommended-tag'],
  parts: ['Phone', 'PhoneTopBar', 'TabList', 'Card', 'Heading', 'Chip', 'Row', 'Column', 'Button'],
  render: () => (
    <Phone label="pricing" topBar={<PhoneTopBar back title="요금제" />}>
      <Body>
        <TabList aria-label="period" data={fromList([{ label: '월간', selected: true }, { label: '연간 -20%' }])} onEvent={() => {}} />
        <Card slots={{
          title: <Heading level="h3">Free</Heading>,
          meta: <Price amount="₩0" />,
          body: <Column flow="list"><Feat>5 프로젝트</Feat><Feat>1GB 저장</Feat><Feat>커뮤니티 지원</Feat></Column>,
          footer: <Button style={{ inlineSize: '100%' }}>현재 플랜</Button>,
        }} />
        <Card selected slots={{
          title: <Row flow="split" style={{ alignItems: 'center' }}><Heading level="h3">Pro</Heading><Chip label="추천" /></Row>,
          meta: <Price amount="₩9,900" />,
          body: <Column flow="list"><Feat>무제한 프로젝트</Feat><Feat>50GB 저장</Feat><Feat>이메일 지원</Feat><Feat>우선 처리</Feat></Column>,
          footer: <Button data-variant="primary" style={{ inlineSize: '100%' }}>업그레이드</Button>,
        }} />
        <Card slots={{
          title: <Heading level="h3">Team</Heading>,
          meta: <Price amount="₩29,900" />,
          body: <Column flow="list"><Feat>10인 협업</Feat><Feat>500GB 저장</Feat><Feat>전담 매니저</Feat></Column>,
          footer: <Button style={{ inlineSize: '100%' }}>문의</Button>,
        }} />
      </Body>
    </Phone>
  ),
})

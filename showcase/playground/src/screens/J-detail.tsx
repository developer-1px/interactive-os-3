import { Breadcrumb, Code, CountBadge, Heading, KeyValue, Link, Phone, PhoneTopBar, ProgressBar, Row, Tag } from '@p/ds'
import { Button } from '@p/ds/ui/2-action/Button'
import { defineScreen, defineGroup } from '../wireframe-registry'
import { Body, PrimaryButton, StickyAction } from '../wireframe-shell'

defineGroup('J-Detail',        { id: 'J', title: 'Detail',        lede: 'Breadcrumb · KeyValue · Code · Link · ProgressBar — 주문 상세 같은 정보 페이지.' })

// ──────────────────────────────────────────────────────────────────────
// (J) Detail — Breadcrumb · KeyValue · Code · Link · Progress
// ──────────────────────────────────────────────────────────────────────

const Detail_Order = defineScreen({
  id: 'cat-detail-order',
  app: 'Coupang',
  flow: 'order-detail',
  category: 'J-Detail',
  patterns: ['breadcrumb', 'progress-tracker', 'key-value-list', 'sticky-action-cta', 'top-bar-back-action'],
  parts: ['Phone', 'PhoneTopBar', 'Breadcrumb', 'Heading', 'Tag', 'CountBadge', 'ProgressBar', 'KeyValue', 'Code', 'Link', 'Button', 'Row'],
  render: () => (
    <Phone label="order detail" topBar={<PhoneTopBar back title="주문 #482" action={<span data-icon="more" aria-label="more" />} />}>
      <Body>
        <Breadcrumb items={[
          { label: 'Shop', href: '#' },
          { label: 'Orders', href: '#' },
          { label: '#482', current: true },
        ]} />
        <Heading level="h2">Mechanical Keyboard</Heading>
        <Row flow="cluster"><Tag label="배송 중" /><CountBadge label="2/3" /></Row>
        <ProgressBar value={66} max={100} aria-label="delivery progress" />
        <Heading level="h3">상세</Heading>
        <KeyValue items={[
          { key: '주문 번호', value: '#482' },
          { key: '결제', value: '신한카드 ****-1234' },
          { key: '주소', value: '서울 강남구 테헤란로' },
          { key: '예상 도착', value: '2026-04-29' },
        ]} />
        <Heading level="h3">추적 코드</Heading>
        <Code>TRK-9F-482-A1B2C3</Code>
        <Link href="#">배송 상태 자세히 보기 <span data-icon="chevron-right" aria-hidden /></Link>
      </Body>
      <StickyAction><PrimaryButton>주문 확정</PrimaryButton></StickyAction>
    </Phone>
  ),
})

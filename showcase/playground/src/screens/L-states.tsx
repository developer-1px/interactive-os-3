import { Callout, EmptyState, Phone, PhoneTabBar, PhoneTopBar, Skeleton } from '@p/ds'
import { Button } from '@p/ds/ui/2-action/Button'
import { defineScreen, defineGroup } from '../wireframe-registry'
import { Body, PrimaryButton, StickyAction, tabIcons } from '../wireframe-shell'
import { skeletonBox } from '../wireframe-tokens'

defineGroup('L-States',        { id: 'L', title: 'States',        lede: 'EmptyState · Callout · Skeleton 로 빈 상태 / 에러 / 로딩 시연.' })

// ──────────────────────────────────────────────────────────────────────
// (L) States — Empty / Error / Loading
// ──────────────────────────────────────────────────────────────────────

const State_Empty = defineScreen({
  id: 'cat-state-empty',
  app: 'Apple Mail',
  flow: 'inbox',
  category: 'L-States',
  patterns: ['empty-state', 'bottom-tab-bar', 'top-bar-back'],
  parts: ['Phone', 'PhoneTopBar', 'PhoneTabBar', 'EmptyState'],
  render: () => (
    <Phone label="empty" topBar={<PhoneTopBar back title="Inbox" />} bottomBar={<PhoneTabBar items={tabIcons(2)} active={2} />}>
      <Body>
        <EmptyState title="받은 메시지가 없습니다" description="새 메시지가 오면 여기에 표시됩니다." />
      </Body>
    </Phone>
  ),
})

const State_Error = defineScreen({
  id: 'cat-state-error',
  app: 'Generic Dashboard',
  flow: 'dashboard',
  category: 'L-States',
  patterns: ['error-callout', 'skeleton-loading', 'sticky-action-cta', 'bottom-tab-bar', 'top-bar-back'],
  parts: ['Phone', 'PhoneTopBar', 'PhoneTabBar', 'Callout', 'Skeleton', 'Button'],
  render: () => (
    <Phone label="error" topBar={<PhoneTopBar back title="Dashboard" />} bottomBar={<PhoneTabBar items={tabIcons(3)} active={3} />}>
      <Body>
        <Callout tone="danger">서버 응답 없음. 잠시 후 다시 시도하세요.</Callout>
        <Skeleton width="100%" height={skeletonBox.small.height} />
        <Skeleton width="100%" height={skeletonBox.small.height} />
        <Skeleton width="100%" height={skeletonBox.small.height} />
      </Body>
      <StickyAction><PrimaryButton>다시 시도</PrimaryButton></StickyAction>
    </Phone>
  ),
})

const State_Loading = defineScreen({
  id: 'cat-state-loading',
  app: 'Threads',
  flow: 'feed',
  category: 'L-States',
  patterns: ['skeleton-loading', 'bottom-tab-bar', 'top-bar-back'],
  parts: ['Phone', 'PhoneTopBar', 'PhoneTabBar', 'Skeleton'],
  render: () => (
    <Phone label="loading" topBar={<PhoneTopBar back title="Feed" />} bottomBar={<PhoneTabBar items={tabIcons(0)} active={0} />}>
      <Body>
        <Skeleton width="100%" height={skeletonBox.big.height} style={{ borderRadius: skeletonBox.big.radius }} />
        <Skeleton width="100%" height={skeletonBox.big.height} style={{ borderRadius: skeletonBox.big.radius }} />
        <Skeleton width="100%" height={skeletonBox.big.height} style={{ borderRadius: skeletonBox.big.radius }} />
      </Body>
    </Phone>
  ),
})

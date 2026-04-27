import { Callout, EmptyState, Phone, PhoneTabBar, PhoneTopBar, ProductCard, Row, TabList, fromList } from '@p/ds'
import { Button } from '@p/ds/ui/2-action/Button'
import { defineScreen, defineGroup } from '../wireframe-registry'
import { Body, PrimaryButton, StickyAction, sampleImg, tabIcons } from '../wireframe-shell'
import { type } from '../wireframe-tokens'

defineGroup('B-Shopping',      { id: 'B', title: 'Shopping',      lede: 'ProductCard · 카테고리 picker (TabList) + 상품 grid + 장바구니 + 빈 상태' })

// ──────────────────────────────────────────────────────────────────────
// (B) Shopping — ProductCard
// ──────────────────────────────────────────────────────────────────────

const Shop_Browse = defineScreen({
  id: 'cat-shop-browse',
  app: 'Coupang',
  flow: 'shopping',
  category: 'B-Shopping',
  patterns: ['category-tabs', 'product-card-grid', 'bottom-tab-bar', 'top-bar-search'],
  parts: ['Phone', 'PhoneTopBar', 'PhoneTabBar', 'TabList', 'ProductCard'],
  render: () => (
    <Phone
      label="browse"
      topBar={<PhoneTopBar title="Shop" action={<span data-icon="search" aria-label="search" />} />}
      bottomBar={<PhoneTabBar items={tabIcons(0)} active={0} />}
    >
      <Body>
        <TabList
          aria-label="category"
          data={fromList([
            { label: 'All', selected: true },
            { label: 'Electronics' },
            { label: 'Books' },
            { label: 'Home' },
          ])}
          onEvent={() => {}}
        />
        <ProductCard image={sampleImg('kbd')} title="Mechanical Keyboard" brand="Acme" price={189000} orig={219000} rating={4.6} reviews={128} tags={['신상']} />
        <ProductCard image={sampleImg('mouse')} title="Wireless Mouse"      brand="LogiTec" price={59000} rating={4.4} reviews={420} />
        <ProductCard image={sampleImg('monitor')} title={'27" 4K Monitor'}   brand="Display"  price={429000} orig={489000} rating={4.7} reviews={56} tags={['추천']} />
      </Body>
    </Phone>
  ),
})

const Shop_Cart = defineScreen({
  id: 'cat-shop-cart',
  app: 'Coupang',
  flow: 'cart',
  category: 'B-Shopping',
  patterns: ['cart-line-item', 'success-callout', 'total-summary', 'sticky-action-cta', 'top-bar-back'],
  parts: ['Phone', 'PhoneTopBar', 'ProductCard', 'Callout', 'Row', 'Button'],
  render: () => (
    <Phone
      label="cart"
      topBar={<PhoneTopBar back title="Cart" />}
    >
      <Body>
        <ProductCard image={sampleImg('kbd')} title="Mechanical Keyboard" brand="Acme" price={189000} rating={4.6} reviews={128} />
        <ProductCard image={sampleImg('mouse')} title="Wireless Mouse" brand="LogiTec" price={59000} rating={4.4} reviews={420} />
        <Callout tone="success">5만원 이상 무료 배송 적용</Callout>
        <Row flow="split">
          <strong>합계</strong>
          <strong style={type.amount}>₩248,000</strong>
        </Row>
      </Body>
      <StickyAction><PrimaryButton>결제하기</PrimaryButton></StickyAction>
    </Phone>
  ),
})

const Shop_Empty = defineScreen({
  id: 'cat-shop-empty',
  app: 'Coupang',
  flow: 'cart',
  category: 'B-Shopping',
  patterns: ['empty-state-with-cta', 'top-bar-back'],
  parts: ['Phone', 'PhoneTopBar', 'EmptyState', 'Button'],
  render: () => (
    <Phone
      label="empty cart"
      topBar={<PhoneTopBar back title="Cart" />}
    >
      <Body>
        <EmptyState title="장바구니가 비었습니다" description="둘러보기에서 마음에 드는 상품을 담아보세요." />
        <Button data-emphasis="primary" style={{ alignSelf: 'center' }}>둘러보기</Button>
      </Body>
    </Phone>
  ),
})

import { Column, Phone, PhoneTopBar, Row, Thumbnail } from '@p/ds'
import { Button } from '@p/ds/ui/2-action/Button'
import { NumberInput } from '@p/ds/ui/3-input/NumberInput'
import { defineScreen, defineGroup } from '../wireframe-registry'
import { Body, PrimaryButton, StickyAction, sampleImg } from '../wireframe-shell'
import { listRow, meta, qtyStepper, type } from '../wireframe-tokens'

defineGroup('T-Quantity',      { id: 'T', title: 'Quantity',      lede: 'Cart line + NumberInput stepper · subtotal · sticky 주문 CTA.' })

// ──────────────────────────────────────────────────────────────────────
// (T) Cart — Quantity stepper
// ──────────────────────────────────────────────────────────────────────

const Cart_Quantity = defineScreen({
  id: 'cat-cart-quantity',
  app: 'Coupang',
  flow: 'cart',
  category: 'T-Quantity',
  patterns: ['cart-line', 'quantity-stepper', 'subtotal-summary', 'sticky-action-cta', 'top-bar-back'],
  parts: ['Phone', 'PhoneTopBar', 'Thumbnail', 'NumberInput', 'Row', 'Column', 'Button'],
  render: () => (
    <Phone label="cart line" topBar={<PhoneTopBar back title="장바구니" />}>
      <Body>
        {[
          { name: 'Mechanical Keyboard', img: 'kbd',     qty: 1, price: 189000 },
          { name: 'Wireless Mouse',      img: 'mouse',   qty: 2, price: 59000 },
          { name: '4K Monitor',          img: 'monitor', qty: 1, price: 429000 },
        ].map(item => (
          <Row key={item.name} flow="cluster" style={{ alignItems: 'center', ...listRow }}>
            <Thumbnail src={sampleImg(item.img)} alt={item.name} />
            <Column style={{ flex: 1, minInlineSize: 0 }}>
              <strong style={{ ...type.truncate }}>{item.name}</strong>
              <small>₩{item.price.toLocaleString()}</small>
            </Column>
            <Row flow="cluster" style={{ alignItems: 'center' }}>
              <Button aria-label="감소"><span data-icon="minus" /></Button>
              <NumberInput value={item.qty} onChange={() => {}} aria-label="수량" min={1} max={99} style={qtyStepper} />
              <Button aria-label="증가"><span data-icon="plus" /></Button>
            </Row>
          </Row>
        ))}
        <Row flow="split"><strong>소계</strong><strong>₩736,000</strong></Row>
        <Row flow="split"><span style={meta.medium}>배송비</span><span>무료</span></Row>
      </Body>
      <StickyAction><PrimaryButton>주문 확정 (3)</PrimaryButton></StickyAction>
    </Phone>
  ),
})

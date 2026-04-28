import { Heading, Phone, PhoneTopBar, ProgressBar, Row } from '@p/ds'
import { Button } from '@p/ds/ui/1-command/Button'
import { Field, FieldLabel } from '@p/ds/ui/3-input/Field'
import { Input } from '@p/ds/ui/3-input/Input'
import { Select } from '@p/ds/ui/3-input/Select'
import { defineScreen, defineGroup } from '../wireframe-registry'
import { Body, PrimaryButton, StickyAction } from '../wireframe-shell'
import { meta } from '../wireframe-tokens'

defineGroup('R-Stepper',       { id: 'R', title: 'Stepper',       lede: 'Checkout 진행 stepper (1·2·3) + 배송지 폼 + 다음 단계 CTA.', defaultGuide: 'form' })

// ──────────────────────────────────────────────────────────────────────
// (R) Stepper — Checkout
// ──────────────────────────────────────────────────────────────────────

const Stepper_Checkout = defineScreen({
  id: 'cat-stepper-checkout',
  app: 'Generic Checkout',
  flow: 'checkout',
  category: 'R-Stepper',
  patterns: ['progress-stepper', 'step-labels', 'address-form', 'sticky-action-cta', 'top-bar-back'],
  parts: ['Phone', 'PhoneTopBar', 'ProgressBar', 'Heading', 'Field', 'FieldLabel', 'Input', 'Select', 'Row', 'Button'],
  render: () => (
    <Phone label="checkout" topBar={<PhoneTopBar back title="결제 (2/3)" />}>
      <Body>
        <ProgressBar value={66} max={100} aria-label="checkout progress" />
        <Row flow="split">
          <small style={meta.faint}>1. 장바구니</small>
          <small><strong>2. 배송지</strong></small>
          <small style={meta.faint}>3. 결제</small>
        </Row>
        <Heading level="h3">배송지</Heading>
        <Field>
          <FieldLabel>받는 사람</FieldLabel>
          <Input defaultValue="유용태" />
        </Field>
        <Field>
          <FieldLabel>전화번호</FieldLabel>
          <Input type="tel" defaultValue="010-1234-5678" />
        </Field>
        <Field>
          <FieldLabel>국가</FieldLabel>
          <Select defaultValue="kr"><option value="kr">대한민국</option><option value="jp">일본</option><option value="us">미국</option></Select>
        </Field>
        <Field>
          <FieldLabel>주소</FieldLabel>
          <Input defaultValue="서울특별시 강남구 테헤란로 132" />
        </Field>
        <Field>
          <FieldLabel>상세 주소</FieldLabel>
          <Input placeholder="동/호수" />
        </Field>
      </Body>
      <StickyAction><PrimaryButton>다음 — 결제</PrimaryButton></StickyAction>
    </Phone>
  ),
})

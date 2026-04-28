import { CheckboxGroup, Heading, Phone, PhoneTopBar, RadioGroup, fromList } from '@p/ds'
import { Button } from '@p/ds/ui/1-command/Button'
import { Field, FieldLabel } from '@p/ds/ui/8-field/Field'
import { Slider } from '@p/ds/ui/2-input/Slider'
import { defineScreen, defineGroup } from '../wireframe-registry'
import { Body, PrimaryButton, StickyAction } from '../wireframe-shell'

defineGroup('Q-Filter',        { id: 'Q', title: 'Filter',        lede: 'Airbnb 식 facet sheet — Slider · CheckboxGroup · RadioGroup + 결과 수 sticky CTA.', defaultGuide: 'form' })

// ──────────────────────────────────────────────────────────────────────
// (Q) Filter — facets sheet
// ──────────────────────────────────────────────────────────────────────

const Filter_Sheet = defineScreen({
  id: 'cat-filter-sheet',
  app: 'Airbnb',
  flow: 'filter',
  category: 'Q-Filter',
  patterns: ['filter-section', 'price-slider', 'checkbox-facet', 'radio-facet', 'sticky-action-cta', 'reset-action', 'top-bar-back'],
  parts: ['Phone', 'PhoneTopBar', 'Heading', 'Field', 'FieldLabel', 'Slider', 'CheckboxGroup', 'RadioGroup', 'Button'],
  render: () => (
    <Phone label="filter" topBar={<PhoneTopBar back title="필터" action="초기화" />}>
      <Body>
        <Heading level="h3">가격</Heading>
        <Field>
          <FieldLabel>최대 ₩80만원 / 박</FieldLabel>
          <Slider value={80} min={0} max={200} onChange={() => {}} />
        </Field>
        <Heading level="h3">편의시설</Heading>
        <CheckboxGroup aria-label="amenities" data={fromList([
          { label: 'Wi-Fi', expanded: true },
          { label: '주차', expanded: true },
          { label: '주방' },
          { label: '세탁기' },
          { label: '에어컨', expanded: true },
        ])} onEvent={() => {}} />
        <Heading level="h3">방 종류</Heading>
        <RadioGroup aria-label="room type" data={fromList([
          { label: '전체' },
          { label: '집 전체', selected: true },
          { label: '개인실' },
          { label: '다인실' },
        ])} onEvent={() => {}} />
      </Body>
      <StickyAction><PrimaryButton>120 개 결과 보기</PrimaryButton></StickyAction>
    </Phone>
  ),
})

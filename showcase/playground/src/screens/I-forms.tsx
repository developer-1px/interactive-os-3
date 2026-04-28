import { Callout, Listbox, Phone, PhoneTabBar, PhoneTopBar, Row, Chip, fromList } from '@p/ds'
import { Button } from '@p/ds/ui/1-command/Button'
import { Field, FieldDescription, FieldLabel } from '@p/ds/ui/8-field/Field'
import { Input } from '@p/ds/ui/2-input/Input'
import { SearchBox } from '@p/ds/ui/2-input/SearchBox'
import { Textarea } from '@p/ds/ui/2-input/Textarea'
import { defineScreen, defineGroup } from '../wireframe-registry'
import { Body, PrimaryButton, StickyAction } from '../wireframe-shell'
import { meta } from '../wireframe-tokens'

defineGroup('I-Forms',         { id: 'I', title: 'Forms',         lede: 'Field · Input · Textarea · SearchBox · validation tone (danger / success).', defaultGuide: 'form' })

// ──────────────────────────────────────────────────────────────────────
// (I) Forms — Field · Input · Textarea · SearchBox · validation
// ──────────────────────────────────────────────────────────────────────

const Form_Compose = defineScreen({
  id: 'cat-form-compose',
  app: 'Medium',
  flow: 'compose',
  category: 'I-Forms',
  patterns: ['title-body-form', 'tag-input', 'sticky-action-cta', 'top-bar-back-action'],
  parts: ['Phone', 'PhoneTopBar', 'Field', 'FieldLabel', 'FieldDescription', 'Input', 'Textarea', 'Chip', 'Row', 'Button'],
  render: () => (
    <Phone label="compose" topBar={<PhoneTopBar back title="새 글" action="발행" />}>
      <Body>
        <Field>
          <FieldLabel>제목</FieldLabel>
          <Input placeholder="제목을 입력하세요" />
        </Field>
        <Field>
          <FieldLabel>본문</FieldLabel>
          <Textarea rows={10} placeholder="이야기를 시작하세요..." />
          <FieldDescription>마크다운 지원</FieldDescription>
        </Field>
        <Field>
          <FieldLabel>태그</FieldLabel>
          <Row flow="cluster">
            <Chip label="design" onRemove={() => {}} />
            <Chip label="ds" onRemove={() => {}} />
            <Input placeholder="+ 추가" style={{ flex: 1, minInlineSize: 80 }} />
          </Row>
        </Field>
      </Body>
      <StickyAction><PrimaryButton>발행</PrimaryButton></StickyAction>
    </Phone>
  ),
})

const Form_Validation = defineScreen({
  id: 'cat-form-validation',
  app: 'Generic Signup',
  flow: 'signup',
  category: 'I-Forms',
  patterns: ['field-with-help', 'inline-validation', 'sticky-action-cta', 'top-bar-back'],
  parts: ['Phone', 'PhoneTopBar', 'Field', 'FieldLabel', 'FieldDescription', 'Input', 'Callout', 'Button'],
  render: () => (
    <Phone label="validation" topBar={<PhoneTopBar back title="회원가입" />}>
      <Body>
        <Field>
          <FieldLabel>이메일</FieldLabel>
          <Input type="email" defaultValue="teo@" />
          <FieldDescription>example@domain.com 형식</FieldDescription>
        </Field>
        <Field invalid>
          <FieldLabel>비밀번호</FieldLabel>
          <Input type="password" defaultValue="abc" />
          <Callout variant="danger">최소 8자 + 숫자 1개 이상 필요</Callout>
        </Field>
        <Field required>
          <FieldLabel>닉네임</FieldLabel>
          <Input defaultValue="Yongtae" />
          <Callout variant="success">사용 가능한 닉네임</Callout>
        </Field>
      </Body>
      <StickyAction><PrimaryButton>가입</PrimaryButton></StickyAction>
    </Phone>
  ),
})

const Form_Search = defineScreen({
  id: 'cat-form-search',
  app: 'Spotlight',
  flow: 'search',
  category: 'I-Forms',
  patterns: ['searchbox', 'recent-tags', 'suggestion-listbox', 'top-bar-back'],
  parts: ['Phone', 'PhoneTopBar', 'SearchBox', 'Chip', 'Row', 'Listbox'],
  render: () => (
    <Phone label="search" topBar={<PhoneTopBar back title="검색" />}>
      <Body>
        <SearchBox placeholder="라우트 · 컴포넌트 · 토큰" />
        <small style={meta.weak}>최근 검색</small>
        <Row flow="cluster">
          <Chip label="Phone" onRemove={() => {}} />
          <Chip label="container" onRemove={() => {}} />
          <Chip label="hierarchy" onRemove={() => {}} />
        </Row>
        <small style={meta.weak}>제안</small>
        <Listbox
          aria-label="suggestions"
          data={fromList([
            { label: 'Phone — ds/devices/Phone' },
            { label: 'PhoneTopBar' },
            { label: 'PhoneTabBar' },
            { label: 'phoneCss — style/parts/phone.ts' },
          ])}
          onEvent={() => {}}
        />
      </Body>
    </Phone>
  ),
})

import { CheckboxGroup, Heading, Phone, PhoneTabBar, PhoneTopBar, RadioGroup, Row, fromList } from '@p/ds'
import { Switch } from '@p/ds/ui/2-action/Switch'
import { Field, FieldDescription, FieldLabel } from '@p/ds/ui/3-input/Field'
import { Input } from '@p/ds/ui/3-input/Input'
import { Select } from '@p/ds/ui/3-input/Select'
import { Slider } from '@p/ds/ui/3-input/Slider'
import { defineScreen, defineGroup } from '../wireframe-registry'
import { Body, tabIcons } from '../wireframe-shell'

defineGroup('H-Settings',      { id: 'H', title: 'Settings',      lede: 'Switch · Slider · Select · RadioGroup · CheckboxGroup — 모바일 환경 설정.', defaultGuide: 'form' })

// ──────────────────────────────────────────────────────────────────────
// (H) Settings — Switch · Slider · Select · RadioGroup · CheckboxGroup
// ──────────────────────────────────────────────────────────────────────

const Settings_Preferences = defineScreen({
  id: 'cat-settings',
  app: 'iOS Settings',
  flow: 'settings',
  category: 'H-Settings',
  patterns: ['section-heading', 'switch-row', 'radio-group', 'slider-with-description', 'checkbox-group', 'bottom-tab-bar', 'top-bar-back'],
  parts: ['Phone', 'PhoneTopBar', 'PhoneTabBar', 'Heading', 'Field', 'FieldLabel', 'FieldDescription', 'Input', 'Select', 'Switch', 'RadioGroup', 'CheckboxGroup', 'Slider', 'Row'],
  render: () => (
    <Phone label="settings" topBar={<PhoneTopBar back title="Settings" />} bottomBar={<PhoneTabBar items={tabIcons(4)} active={4} />}>
      <Body>
        <Heading level="h3">계정</Heading>
        <Field>
          <FieldLabel>표시 이름</FieldLabel>
          <Input defaultValue="Yongtae Yoo" />
        </Field>
        <Field>
          <FieldLabel>언어</FieldLabel>
          <Select defaultValue="ko">
            <option value="ko">한국어</option>
            <option value="en">English</option>
            <option value="ja">日本語</option>
          </Select>
        </Field>

        <Heading level="h3">알림</Heading>
        <Row flow="split"><span>이메일 알림</span><Switch checked /></Row>
        <Row flow="split"><span>푸시 알림</span><Switch checked /></Row>
        <Row flow="split"><span>마케팅</span><Switch /></Row>

        <Heading level="h3">테마</Heading>
        <RadioGroup
          aria-label="theme"
          data={fromList([
            { label: 'Light' },
            { label: 'Dark', selected: true },
            { label: 'System' },
          ])}
          onEvent={() => {}}
        />

        <Heading level="h3">사운드</Heading>
        <Field>
          <FieldLabel>볼륨</FieldLabel>
          <Slider value={68} min={0} max={100} onChange={() => {}} />
          <FieldDescription>현재 68%</FieldDescription>
        </Field>

        <Heading level="h3">동의</Heading>
        <CheckboxGroup
          aria-label="consents"
          data={fromList([
            { label: '서비스 약관 (필수)', expanded: true },
            { label: '개인정보 처리방침 (필수)', expanded: true },
            { label: '마케팅 수신 (선택)' },
          ])}
          onEvent={() => {}}
        />
      </Body>
    </Phone>
  ),
})

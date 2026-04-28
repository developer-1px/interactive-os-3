import { Heading, Link, Phone, PhoneTopBar, Row } from '@p/ds'
import { Button } from '@p/ds/ui/1-command/Button'
import { Switch } from '@p/ds/ui/2-input/Switch'
import { Field, FieldLabel } from '@p/ds/ui/8-field/Field'
import { Input } from '@p/ds/ui/2-input/Input'
import { defineScreen, defineGroup } from '../wireframe-registry'
import { Body, PrimaryButton, StickyAction } from '../wireframe-shell'
import { type } from '@p/ds/tokens/semantic'
import { meta } from '../wireframe-tokens'

defineGroup('M-Auth',          { id: 'M', title: 'Auth',          lede: 'Login (이메일·SSO·로그인 유지) · OTP (6자리 코드·재전송 타이머).', defaultGuide: 'form' })

// ──────────────────────────────────────────────────────────────────────
// (M) Auth — Login · OTP
// ──────────────────────────────────────────────────────────────────────

const Auth_Login = defineScreen({
  id: 'cat-auth-login',
  app: 'Generic',
  flow: 'auth',
  category: 'M-Auth',
  patterns: ['title-form', 'sso-buttons', 'remember-me-switch', 'sticky-action-cta', 'top-bar-back'],
  parts: ['Phone', 'PhoneTopBar', 'Heading', 'Field', 'FieldLabel', 'Input', 'Switch', 'Row', 'Button', 'Link'],
  render: () => (
    <Phone label="login" topBar={<PhoneTopBar back title="로그인" />}>
      <Body>
        <Heading level="h2">계정 로그인</Heading>
        <Field>
          <FieldLabel>이메일</FieldLabel>
          <Input type="email" placeholder="you@example.com" />
        </Field>
        <Field>
          <FieldLabel>비밀번호</FieldLabel>
          <Input type="password" placeholder="••••••••" />
        </Field>
        <Row flow="split" style={{ alignItems: 'center' }}>
          <Row flow="cluster" style={{ alignItems: 'center' }}><Switch checked /><span>로그인 유지</span></Row>
          <Link href="#">비밀번호 찾기</Link>
        </Row>
        <Button><Row flow="cluster" style={{ alignItems: 'center', justifyContent: 'center' }}><span data-icon="apple" aria-hidden /><span>Apple 로 계속</span></Row></Button>
        <Button><Row flow="cluster" style={{ alignItems: 'center', justifyContent: 'center' }}><span data-icon="google" aria-hidden /><span>Google 로 계속</span></Row></Button>
      </Body>
      <StickyAction><PrimaryButton>로그인</PrimaryButton></StickyAction>
    </Phone>
  ),
})

const Auth_OTP = defineScreen({
  id: 'cat-auth-otp',
  app: 'Generic',
  flow: 'auth',
  category: 'M-Auth',
  patterns: ['otp-input', 'resend-timer', 'sticky-action-cta', 'top-bar-back'],
  parts: ['Phone', 'PhoneTopBar', 'Heading', 'Row', 'Input', 'Link', 'Button'],
  render: () => (
    <Phone label="OTP" topBar={<PhoneTopBar back title="인증" />}>
      <Body>
        <Heading level="h2">인증 코드</Heading>
        <p style={{ ...meta.medium, margin: 0 }}>+82 10-••••-1234 로 보낸 6자리 코드를 입력하세요.</p>
        <Row flow="cluster" style={{ justifyContent: 'space-between' }}>
          {[0,1,2,3,4,5].map(i => (
            <Input key={i} inputMode="numeric" maxLength={1} aria-label={`자리 ${i+1}`} defaultValue={i < 3 ? String((i+3)*2 % 10) : ''} style={type.digit} />
          ))}
        </Row>
        <Row flow="split"><span style={meta.medium}>코드를 못 받았나요?</span><Link href="#">재전송 (00:42)</Link></Row>
      </Body>
      <StickyAction><PrimaryButton>확인</PrimaryButton></StickyAction>
    </Phone>
  ),
})

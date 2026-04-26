/* eslint-disable react-refresh/only-export-components, no-restricted-syntax */
/**
 * wireframe-screens — iframe 임베드용 mobile screen registry.
 *
 * 각 화면은 *device chrome 없이* 본문(topBar + body + bottomBar) 만 렌더한다.
 * 라우트 /wireframe-screen?id=X 가 이걸 호출 → wireframes 카탈로그의 Phone 이
 * iframe src 로 임베드 → iframe viewport=393px 이라 ds 의 모바일 분기 자연 발동.
 *
 * 패턴 — Storybook viewport · Chromatic · Polaris docs 표준.
 *
 * Mobbin 식 다축 메타데이터 (app · flow · patterns · parts) 를 화면 정의에 부착하여
 * 같은 화면을 여러 축으로 인덱싱·역참조 가능하게 한다. affordance 카탈로그는 이
 * 메타데이터의 derived view 로 도출된다 (별도 문서 X).
 */
import type { ReactNode } from 'react'
import {
  fromList, PhoneTopBar, PhoneTabBar,
  Skeleton, Tag, Avatar, Heading, EmptyState, Callout,
  KeyValue, Breadcrumb, Code, Link, ProgressBar, CountBadge,
  Row, Column,
  Listbox, RadioGroup, CheckboxGroup,
  MessageBubble,
} from '@p/ds'
import { Switch } from '@p/ds/ui/2-action/Switch'
import { Field, FieldLabel, FieldDescription } from '@p/ds/ui/3-input/Field'
import { Input } from '@p/ds/ui/3-input/Input'
import { Textarea } from '@p/ds/ui/3-input/Textarea'
import { Slider } from '@p/ds/ui/3-input/Slider'
import { Select } from '@p/ds/ui/3-input/Select'
import { Button } from '@p/ds/ui/2-action/Button'

// ──────────────────────────────────────────────────────────────────────
// ScreenDef — Mobbin 식 다축 메타.
//   app    : 영감 받은 실 앱 (iMessage·iOS Settings·Coupang ...)
//   flow   : 사용자 시나리오 단위 (chat·settings·checkout ...)
//   category: 기존 장르 그룹 (A-Chat·H-Settings ...)
//   patterns: 다르게 만들면 어색한 어포던스 태그 (chat-bubble·fab ...)
//   parts  : 화면이 사용한 ds 부품 — 부품 사용처 역참조용
// ──────────────────────────────────────────────────────────────────────

export type ScreenDef = {
  readonly id: string
  readonly app: string
  readonly flow: string
  readonly category: string
  readonly patterns: readonly string[]
  readonly parts: readonly string[]
  readonly render: () => ReactNode
}

// ──────────────────────────────────────────────────────────────────────
// MobileShell — iframe viewport 안에서 mobile 화면 골격.
//   sticky topBar + scroll body + sticky bottomBar. ds 모바일 분기 자연 발동.
// ──────────────────────────────────────────────────────────────────────

const MobileShell = ({ topBar, body, action, tabBar }: {
  topBar?: ReactNode; body: ReactNode; action?: ReactNode; tabBar?: ReactNode
}) => (
  <div data-mobile-shell style={{
    blockSize: '100vh', display: 'grid',
    gridTemplateRows: `${topBar ? 'auto' : ''} 1fr ${action ? 'auto' : ''} ${tabBar ? 'auto' : ''}`.trim(),
    background: 'var(--ds-bg)',
  }}>
    {topBar}
    <Column flow="form" style={{ overflow: 'auto', padding: 'calc(var(--ds-space) * 4)' }}>
      {body}
    </Column>
    {action && (
      <div style={{ padding: 'calc(var(--ds-space) * 4)', borderBlockStart: 'var(--ds-hairline) solid var(--ds-border)' }}>
        {action}
      </div>
    )}
    {tabBar}
  </div>
)

// PhoneTabBar 5칸 — ds canonical 토큰 (이모지·특수기호 금지).
const TAB_TOKENS = ['home', 'search', 'inbox', 'list', 'settings'] as const
const tabIcons = (active: number) =>
  TAB_TOKENS.map((token, i) => (
    <span key={token} data-icon={token} aria-hidden style={{ color: i === active ? 'var(--ds-accent)' : undefined }} />
  ))

// ──────────────────────────────────────────────────────────────────────
// 화면 registry — ScreenDef 객체 단위. render 는 함수, 메타는 정적.
// ──────────────────────────────────────────────────────────────────────

const chatThread: ScreenDef = {
  id: 'chat-thread',
  app: 'iMessage',
  flow: 'chat',
  category: 'A-Chat',
  patterns: ['chat-bubble', 'sticky-composer', 'top-bar-back-action'],
  parts: ['PhoneTopBar', 'MessageBubble', 'Skeleton', 'Button', 'Row'],
  render: () => (
    <MobileShell
      topBar={<PhoneTopBar back title="Alex Kim" action={<span data-icon="more" aria-label="more" />} />}
      body={<>
        <MessageBubble who="Alex" time="9:14" text="오늘 PR 머지 부탁드려요. CI 그린 + 리뷰 2개 받았습니다." />
        <MessageBubble who="me" time="9:18" me text="확인하고 오후 2시쯤 머지할게요. 그 전에 staging 한 번 돌려보고요." />
        <MessageBubble who="Alex" time="9:22" text="좋습니다. staging URL 공유해 드릴게요. 혹시 hotfix 필요하면 바로 알려주세요." />
        <MessageBubble who="me" time="9:25" me text="네, 일단 통과하면 production 으로 가겠습니다." />
      </>}
      action={<Row flow="cluster" style={{ alignItems: 'center' }}>
        <Skeleton width="100%" height={36} style={{ borderRadius: 'var(--ds-radius-pill)' }} />
        <Button data-emphasis="primary" aria-label="send"><span data-icon="arrow-up" /></Button>
      </Row>}
    />
  ),
}

const conversationsList: ScreenDef = {
  id: 'chat-list',
  app: 'iMessage',
  flow: 'chat',
  category: 'A-Chat',
  patterns: ['conversation-list-row', 'avatar-with-text', 'bottom-tab-bar', 'top-bar-action'],
  parts: ['PhoneTopBar', 'PhoneTabBar', 'Avatar', 'Row', 'Column'],
  render: () => (
    <MobileShell
      topBar={<PhoneTopBar title="Messages" action={<span data-icon="edit" aria-label="compose" />} />}
      tabBar={<PhoneTabBar items={tabIcons(2)} active={2} />}
      body={<>
        {[
          { who: '김지민', time: '14:32', text: '회의 자료 검토 부탁드립니다' },
          { who: '박서연', time: '12:18', text: '점심 같이 드실래요? 1층 한식당' },
          { who: '이준호', time: '11:04', text: '디자인 시안 공유드립니다' },
          { who: '최민지', time: '10:55', text: 'RFC: focus-ring 의견 부탁' },
          { who: '강예나', time: '09:42', text: '4월 리포트 첨부합니다' },
        ].map(c => (
          <Row key={c.who} flow="cluster" style={{ alignItems: 'center', padding: 'calc(var(--ds-space) * 2) 0', borderBlockEnd: 'var(--ds-hairline) solid var(--ds-border)' }}>
            <Avatar src="" alt={c.who} />
            <Column style={{ flex: 1, minInlineSize: 0 }}>
              <Row flow="split"><strong>{c.who}</strong><small style={{ opacity: 0.6 }}>{c.time}</small></Row>
              <small style={{ opacity: 0.7, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.text}</small>
            </Column>
          </Row>
        ))}
      </>}
    />
  ),
}

const settingsPreferences: ScreenDef = {
  id: 'settings',
  app: 'iOS Settings',
  flow: 'settings',
  category: 'H-Settings',
  patterns: ['grouped-list', 'switch-row', 'section-heading', 'bottom-tab-bar', 'top-bar-back'],
  parts: ['PhoneTopBar', 'PhoneTabBar', 'Heading', 'Field', 'FieldLabel', 'FieldDescription', 'Input', 'Select', 'Switch', 'RadioGroup', 'CheckboxGroup', 'Slider', 'Row'],
  render: () => (
    <MobileShell
      topBar={<PhoneTopBar back title="Settings" />}
      tabBar={<PhoneTabBar items={tabIcons(4)} active={4} />}
      body={<>
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
      </>}
    />
  ),
}

const formCompose: ScreenDef = {
  id: 'form-compose',
  app: 'Medium',
  flow: 'compose',
  category: 'I-Forms',
  patterns: ['title-body-form', 'tag-input', 'sticky-action-cta', 'top-bar-back-action'],
  parts: ['PhoneTopBar', 'Field', 'FieldLabel', 'FieldDescription', 'Input', 'Textarea', 'Tag', 'Row', 'Button'],
  render: () => (
    <MobileShell
      topBar={<PhoneTopBar back title="새 글" action="발행" />}
      body={<>
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
            <Tag label="design" onRemove={() => {}} />
            <Tag label="ds" onRemove={() => {}} />
            <Input placeholder="+ 추가" style={{ flex: 1, minInlineSize: 80 }} />
          </Row>
        </Field>
      </>}
      action={<Button data-emphasis="primary" style={{ inlineSize: '100%' }}>발행</Button>}
    />
  ),
}

const detailOrder: ScreenDef = {
  id: 'detail-order',
  app: 'Coupang',
  flow: 'order-detail',
  category: 'J-Detail',
  patterns: ['breadcrumb', 'progress-tracker', 'key-value-list', 'sticky-action-cta', 'top-bar-back-action'],
  parts: ['PhoneTopBar', 'Breadcrumb', 'Heading', 'Tag', 'CountBadge', 'ProgressBar', 'KeyValue', 'Code', 'Link', 'Button', 'Row'],
  render: () => (
    <MobileShell
      topBar={<PhoneTopBar back title="주문 #482" action={<span data-icon="more" aria-label="more" />} />}
      body={<>
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
        <Link href="#">배송 상태 자세히 보기 ›</Link>
      </>}
      action={<Button data-emphasis="primary" style={{ inlineSize: '100%' }}>주문 확정</Button>}
    />
  ),
}

const stateEmpty: ScreenDef = {
  id: 'state-empty',
  app: 'Apple Mail',
  flow: 'inbox',
  category: 'L-States',
  patterns: ['empty-state', 'bottom-tab-bar', 'top-bar-back'],
  parts: ['PhoneTopBar', 'PhoneTabBar', 'EmptyState'],
  render: () => (
    <MobileShell
      topBar={<PhoneTopBar back title="Inbox" />}
      tabBar={<PhoneTabBar items={tabIcons(2)} active={2} />}
      body={<EmptyState title="받은 메시지가 없습니다" description="새 메시지가 오면 여기에 표시됩니다." />}
    />
  ),
}

const stateError: ScreenDef = {
  id: 'state-error',
  app: 'Generic Dashboard',
  flow: 'dashboard',
  category: 'L-States',
  patterns: ['error-callout', 'skeleton-loading', 'sticky-action-cta', 'bottom-tab-bar', 'top-bar-back'],
  parts: ['PhoneTopBar', 'PhoneTabBar', 'Callout', 'Skeleton', 'Button'],
  render: () => (
    <MobileShell
      topBar={<PhoneTopBar back title="Dashboard" />}
      tabBar={<PhoneTabBar items={tabIcons(3)} active={3} />}
      body={<>
        <Callout tone="danger">서버 응답 없음. 잠시 후 다시 시도하세요.</Callout>
        <Skeleton width="100%" height={48} />
        <Skeleton width="100%" height={48} />
        <Skeleton width="100%" height={48} />
      </>}
      action={<Button data-emphasis="primary" style={{ inlineSize: '100%' }}>다시 시도</Button>}
    />
  ),
}

export const SCREENS: Record<string, ScreenDef> = {
  [chatThread.id]:           chatThread,
  [conversationsList.id]:    conversationsList,
  [settingsPreferences.id]:  settingsPreferences,
  [formCompose.id]:          formCompose,
  [detailOrder.id]:          detailOrder,
  [stateEmpty.id]:           stateEmpty,
  [stateError.id]:           stateError,
}

// ──────────────────────────────────────────────────────────────────────
// Derived indices — Mobbin 식 다축 역참조. 같은 SCREENS 위에 만든 view.
//   byApp · byFlow · byPattern · byPart 모두 자동 도출.
//   affordance 카탈로그 == byPattern 의 키 집합.
// ──────────────────────────────────────────────────────────────────────

const groupBy = <K extends keyof ScreenDef>(key: K) => {
  const out: Record<string, ScreenDef[]> = {}
  for (const s of Object.values(SCREENS)) {
    const v = s[key]
    const arr = Array.isArray(v) ? (v as readonly string[]) : [String(v)]
    for (const k of arr) (out[k] ??= []).push(s)
  }
  return out
}

export const byApp     = () => groupBy('app')
export const byFlow    = () => groupBy('flow')
export const byPattern = () => groupBy('patterns')
export const byPart    = () => groupBy('parts')

export function WireframeScreen({ id }: { id: string }) {
  const def = SCREENS[id]
  if (!def) return <div style={{ padding: 16 }}>Unknown screen: <code>{id}</code></div>
  return def.render()
}

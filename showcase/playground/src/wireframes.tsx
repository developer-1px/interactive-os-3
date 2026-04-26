/* eslint-disable react-refresh/only-export-components, no-restricted-syntax -- showcase 라우트: wireframe 카탈로그. */
/**
 * /wireframes — 우리 ds 가 *실제로* 가진 widget 으로 짠 모바일 화면 카탈로그.
 *
 * 도메인 — 우리가 보유한 widget 에서 도출:
 *   (A) Chat        — MessageBubble
 *   (B) Shopping    — ProductCard
 *   (C) Learning    — CourseCard
 *   (D) Feed        — FeedPost
 *   (E) Dashboard   — StatCard · BarChart · Top10List
 *   (F) Contracts   — ContractCard
 *   (G) Roles       — RoleCard (sortable)
 *
 * 원칙 — 모바일은 *content + 정해진 control* 만 (FlatLayout 친화):
 *   - device chrome      = ds/parts/Phone (PhoneTopBar, PhoneTabBar)
 *   - layout primitive   = ds/ui/8-layout (Row, Column)
 *   - content widget     = ds/ui/7-pattern (StatCard, ProductCard, ...)
 *   - composite control  = ds/ui/4-collection (Listbox, TabList, Toolbar)
 *   - 인라인 <div style>  = 0
 *
 * 메타 — Mobbin 식 다축 (app · flow · category · patterns · parts) 을 ScreenDef 로
 * 부착하여 byApp/byFlow/byPattern/byPart derived view 가 자동 도출되게 한다.
 */
import { useState, type ReactNode } from 'react'
import {
  ROOT, Renderer, definePage, fromList, type NormalizedData,
  Phone, PhoneTopBar, PhoneTabBar,
  Skeleton, Tag, Avatar, Heading, EmptyState, Callout, Thumbnail, CountBadge,
  KeyValue, Breadcrumb, Code, Link, ProgressBar,
  Row, Column,
  Listbox, TabList, Toolbar, Tree, RadioGroup, CheckboxGroup,
  StatCard, CourseCard, ProductCard, FeedPost, MessageBubble, ContractCard, RoleCard, BarChart, Top10List,
  LegendDot,
} from '@p/ds'
import { Button } from '@p/ds/ui/2-action/Button'
import { Switch } from '@p/ds/ui/2-action/Switch'
import { Field, FieldLabel, FieldDescription } from '@p/ds/ui/3-input/Field'
import { Input } from '@p/ds/ui/3-input/Input'
import { Textarea } from '@p/ds/ui/3-input/Textarea'
import { SearchBox } from '@p/ds/ui/3-input/SearchBox'
import { Slider } from '@p/ds/ui/3-input/Slider'
import { Select } from '@p/ds/ui/3-input/Select'
import { Disclosure } from '@p/ds/ui/6-overlay/Disclosure'
import { auditAll, clearAll } from './hmi-audit'
import type { ScreenDef } from './wireframe-screens'

// ──────────────────────────────────────────────────────────────────────
// 모바일 골격 — content + 정해진 control. Phone wrapper.
// ──────────────────────────────────────────────────────────────────────

const TAB_TOKENS = ['home', 'search', 'inbox', 'list', 'settings'] as const
const tabIcons = (active: number) =>
  TAB_TOKENS.map((token, i) => (
    <span key={token} data-icon={token} aria-hidden style={{ color: i === active ? 'var(--ds-accent)' : undefined }} />
  ))

const Body = ({ children }: { children: ReactNode }) => (
  <Column flow="form" style={{ flex: 1, minBlockSize: 0 }}>{children}</Column>
)

const StickyAction = ({ children }: { children: ReactNode }) => (
  <div style={{ paddingBlock: 'calc(var(--ds-space) * 3)', borderBlockStart: 'var(--ds-hairline) solid var(--ds-border)', background: 'var(--ds-bg)' }}>
    {children}
  </div>
)

const PrimaryButton = ({ children }: { children: ReactNode }) => (
  <Button data-emphasis="primary" style={{ inlineSize: '100%' }}>{children}</Button>
)

// ──────────────────────────────────────────────────────────────────────
// (A) Chat — MessageBubble
// ──────────────────────────────────────────────────────────────────────

const Chat_Thread: ScreenDef = {
  id: 'cat-chat-thread',
  app: 'iMessage',
  flow: 'chat',
  category: 'A-Chat',
  patterns: ['chat-bubble', 'sticky-composer', 'top-bar-back-action'],
  parts: ['Phone', 'PhoneTopBar', 'MessageBubble', 'Skeleton', 'Button', 'Row'],
  render: () => (
    <Phone
      label="thread"
      topBar={<PhoneTopBar back title="Alex Kim" action={<span data-icon="more" aria-label="more" />} />}
    >
      <Body>
        <MessageBubble who="Alex" time="9:14" text="오늘 PR 머지 부탁드려요. CI 그린 + 리뷰 2개 받았습니다." />
        <MessageBubble who="me" time="9:18" me text="확인하고 오후 2시쯤 머지할게요. 그 전에 staging 한 번 돌려보고요." />
        <MessageBubble who="Alex" time="9:22" text="좋습니다. staging URL 공유해 드릴게요. 혹시 hotfix 필요하면 바로 알려주세요." />
        <MessageBubble who="me" time="9:25" me text="네, 일단 통과하면 production 으로 가겠습니다." />
      </Body>
      <StickyAction>
        <Row flow="cluster" style={{ alignItems: 'center' }}>
          <Skeleton width="100%" height={36} style={{ borderRadius: 'var(--ds-radius-pill)' }} />
          <Button data-emphasis="primary" aria-label="send"><span data-icon="arrow-up" /></Button>
        </Row>
      </StickyAction>
    </Phone>
  ),
}

const Chat_List: ScreenDef = {
  id: 'cat-chat-list',
  app: 'iMessage',
  flow: 'chat',
  category: 'A-Chat',
  patterns: ['conversation-list-row', 'avatar-with-text', 'bottom-tab-bar', 'top-bar-action'],
  parts: ['Phone', 'PhoneTopBar', 'PhoneTabBar', 'Avatar', 'Row', 'Column'],
  render: () => (
    <Phone
      label="conversations"
      topBar={<PhoneTopBar title="Messages" action={<span data-icon="edit" aria-label="compose" />} />}
      bottomBar={<PhoneTabBar items={tabIcons(2)} active={2} />}
    >
      <Body>
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
      </Body>
    </Phone>
  ),
}

// ──────────────────────────────────────────────────────────────────────
// (B) Shopping — ProductCard
// ──────────────────────────────────────────────────────────────────────

const sampleImg = (seed: string) => `https://picsum.photos/seed/${seed}/320/320`

const Shop_Browse: ScreenDef = {
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
}

const Shop_Cart: ScreenDef = {
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
          <strong style={{ fontSize: 'var(--ds-text-xl)' }}>₩248,000</strong>
        </Row>
      </Body>
      <StickyAction><PrimaryButton>결제하기</PrimaryButton></StickyAction>
    </Phone>
  ),
}

const Shop_Empty: ScreenDef = {
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
}

// ──────────────────────────────────────────────────────────────────────
// (C) Learning — CourseCard
// ──────────────────────────────────────────────────────────────────────

const Learn_Catalog: ScreenDef = {
  id: 'cat-learn-catalog',
  app: 'Coursera',
  flow: 'learning',
  category: 'C-Learning',
  patterns: ['level-tabs', 'course-card-list', 'bottom-tab-bar', 'top-bar-search'],
  parts: ['Phone', 'PhoneTopBar', 'PhoneTabBar', 'TabList', 'CourseCard'],
  render: () => (
    <Phone
      label="course catalog"
      topBar={<PhoneTopBar title="Courses" action={<span data-icon="search" aria-label="search" />} />}
      bottomBar={<PhoneTabBar items={tabIcons(1)} active={1} />}
    >
      <Body>
        <TabList
          aria-label="level"
          data={fromList([
            { label: '초급', selected: true },
            { label: '중급' },
            { label: '고급' },
          ])}
          onEvent={() => {}}
        />
        <CourseCard abbr="TS" name="TypeScript 심화" desc="타입 추론과 generics" tone="accent" meta={<small>240 분</small>} />
        <CourseCard abbr="RX" name="RxJS 기초"     desc="Observable · Operator" tone="info" meta={<small>180 분</small>} />
        <CourseCard abbr="GO" name="Go 동시성"     desc="goroutine · channel" tone="success" meta={<small>320 분</small>} />
        <CourseCard abbr="AI" name="LLM 앱 개발"   desc="prompt · tool use · agent" tone="warning" meta={<small>420 분</small>} />
      </Body>
    </Phone>
  ),
}

const Learn_Detail: ScreenDef = {
  id: 'cat-learn-detail',
  app: 'Coursera',
  flow: 'learning',
  category: 'C-Learning',
  patterns: ['hero-image', 'tag-meta-row', 'curriculum-list', 'sticky-action-cta', 'top-bar-back-action'],
  parts: ['Phone', 'PhoneTopBar', 'Skeleton', 'Heading', 'Tag', 'Row', 'Column', 'Button'],
  render: () => (
    <Phone
      label="course detail"
      topBar={<PhoneTopBar back title="Course" action={<span data-icon="heart" aria-label="favorite" />} />}
    >
      <Body>
        <Column>
          <Skeleton width="100%" height={180} style={{ borderRadius: 'var(--ds-radius-md)' }} />
          <Heading level="h2">TypeScript 심화 — 타입 추론과 generics</Heading>
          <Row flow="cluster"><Tag label="중급" /><Tag label="240 분" /><Tag label="자막" /></Row>
          <p style={{ opacity: 0.7 }}>강사 Sora Park · 12 챕터 · 8 실습</p>
        </Column>
        <Heading level="h3">커리큘럼</Heading>
        <Column flow="list">
          {['1. 타입 시스템 개요', '2. 타입 추론 메커니즘', '3. Generics 입문', '4. 조건부 타입', '5. 매핑 타입'].map(t => (
            <Row key={t} flow="split" style={{ padding: 'calc(var(--ds-space) * 2) 0', borderBlockEnd: 'var(--ds-hairline) solid var(--ds-border)' }}>
              <span>{t}</span><span data-icon="chevron-right" style={{ opacity: 0.5 }} aria-hidden />
            </Row>
          ))}
        </Column>
      </Body>
      <StickyAction><PrimaryButton>수강 시작</PrimaryButton></StickyAction>
    </Phone>
  ),
}

// ──────────────────────────────────────────────────────────────────────
// (D) Feed — FeedPost
// ──────────────────────────────────────────────────────────────────────

const Feed_Timeline: ScreenDef = {
  id: 'cat-feed-timeline',
  app: 'Threads',
  flow: 'feed',
  category: 'D-Feed',
  patterns: ['feed-post', 'like-comment-share', 'bottom-tab-bar', 'top-bar-action'],
  parts: ['Phone', 'PhoneTopBar', 'PhoneTabBar', 'FeedPost'],
  render: () => (
    <Phone
      label="feed"
      topBar={<PhoneTopBar title="Feed" action={<span data-icon="edit" aria-label="compose" />} />}
      bottomBar={<PhoneTabBar items={tabIcons(0)} active={0} />}
    >
      <Body>
        <FeedPost
          author="유용태" handle="@teo" time="2분 전"
          avatar="https://i.pravatar.cc/64?u=teo"
          body="recursive Proximity 가 잘 보이는 화면을 만들었다. shell·surface·section·atom 4단을 한 카드 안에서 다 시연 가능. PR #482 에 올렸으니 리뷰 부탁드려요."
          likes={24} comments={6} shared={3} liked
        />
        <FeedPost
          author="박서연" handle="@seoyeon" time="1시간 전"
          avatar="https://i.pravatar.cc/64?u=seoyeon"
          body="ds/parts/Phone 신설 — 393×852 실물 크기. dynamic island · home indicator 까지 토큰만으로 렌더."
          likes={47} comments={11} shared={5}
        />
        <FeedPost
          author="이준호" handle="@junho" time="오전 9:14"
          avatar="https://i.pravatar.cc/64?u=junho"
          body="Listbox composite 가 wireframe 안에서도 keyboard nav 가 살아있는 게 흥미롭다. showcase ↔ production 경계가 흐려짐."
          likes={89} comments={21} shared={12}
        />
      </Body>
    </Phone>
  ),
}

// ──────────────────────────────────────────────────────────────────────
// (E) Dashboard — StatCard · BarChart · Top10List
// ──────────────────────────────────────────────────────────────────────

const Dash_Overview: ScreenDef = {
  id: 'cat-dash-overview',
  app: 'Stripe Dashboard',
  flow: 'dashboard',
  category: 'E-Dashboard',
  patterns: ['period-tabs', 'kpi-grid', 'bar-chart', 'bottom-tab-bar'],
  parts: ['Phone', 'PhoneTopBar', 'PhoneTabBar', 'TabList', 'StatCard', 'BarChart', 'Row'],
  render: () => (
    <Phone
      label="dashboard"
      topBar={<PhoneTopBar title="Dashboard" action={<span data-icon="more" aria-label="more" />} />}
      bottomBar={<PhoneTabBar items={tabIcons(3)} active={3} />}
    >
      <Body>
        <TabList
          aria-label="period"
          data={fromList([
            { label: 'D' }, { label: 'W', selected: true }, { label: 'M' }, { label: '3M' },
          ])}
          onEvent={() => {}}
        />
        <Row flow="cluster" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <StatCard label="MAU" value="12,438" change="+8.2%" changeDir="up" />
          <StatCard label="Errors" value="3.4%" change="+2.1%" changeDir="up" tone="alert" />
          <StatCard label="Revenue" value="₩48.2M" change="+12%" changeDir="up" />
          <StatCard label="Latency" value="120ms" change="-8ms" changeDir="down" />
        </Row>
        <BarChart
          aria-label="weekly traffic"
          caption={<small>주간 트래픽</small>}
          data={fromList([
            { label: 'Mon', value: '8.2k', pct: 65 },
            { label: 'Tue', value: '9.1k', pct: 72 },
            { label: 'Wed', value: '12.4k', pct: 98 },
            { label: 'Thu', value: '10.8k', pct: 85 },
            { label: 'Fri', value: '11.2k', pct: 88 },
            { label: 'Sat', value: '6.4k', pct: 50 },
            { label: 'Sun', value: '5.8k', pct: 46 },
          ])}
        />
      </Body>
    </Phone>
  ),
}

const Dash_Top: ScreenDef = {
  id: 'cat-dash-top',
  app: 'Stripe Dashboard',
  flow: 'dashboard',
  category: 'E-Dashboard',
  patterns: ['top-n-list', 'top-bar-back'],
  parts: ['Phone', 'PhoneTopBar', 'Top10List'],
  render: () => (
    <Phone
      label="top routes"
      topBar={<PhoneTopBar back title="Top routes" />}
    >
      <Body>
        <Top10List
          aria-label="top routes by traffic"
          data={fromList([
            { label: '/feed', count: '12,438' },
            { label: '/dashboard', count: '8,221' },
            { label: '/shop', count: '6,109' },
            { label: '/courses', count: '4,820' },
            { label: '/messages', count: '3,945' },
            { label: '/profile', count: '2,810' },
            { label: '/settings', count: '1,932' },
            { label: '/help', count: '1,204' },
            { label: '/onboarding', count: '892' },
            { label: '/about', count: '420' },
          ])}
        />
      </Body>
    </Phone>
  ),
}

// ──────────────────────────────────────────────────────────────────────
// (F) Contracts — ContractCard
// ──────────────────────────────────────────────────────────────────────

const Contract_Audit: ScreenDef = {
  id: 'cat-contract-audit',
  app: 'Internal Audit',
  flow: 'audit',
  category: 'F-Contracts',
  patterns: ['status-summary-tags', 'contract-card-checklist', 'top-bar-back-search'],
  parts: ['Phone', 'PhoneTopBar', 'Tag', 'Row', 'ContractCard'],
  render: () => (
    <Phone
      label="contract audit"
      topBar={<PhoneTopBar back title="Contracts" action={<span data-icon="search" aria-label="search" />} />}
    >
      <Body>
        <Row flow="cluster"><Tag label="passing 12" /><Tag label="failing 2" /><Tag label="warn 3" /></Row>
        <ContractCard
          name="Listbox" file="ds/ui/4-collection/Listbox.tsx" role="listbox"
          propsSignature="(data, onEvent, autoFocus?)"
          callSites={14}
          badgeTone="good"
          checks={[
            { id: 'aria',     label: 'role=listbox',                pass: true },
            { id: 'roving',   label: 'roving + selection on focus', pass: true },
            { id: 'kbd',      label: '↑↓ Home End typeahead',       pass: true },
            { id: 'event',    label: 'activate on Enter/Space',     pass: true },
          ]}
        />
        <ContractCard
          name="MessageBubble" file="ds/ui/7-pattern/MessageBubble.tsx" role="content"
          propsSignature="(who, time, text, me?)"
          callSites={6}
          badgeTone="warn"
          checks={[
            { id: 'card',  label: 'Card slots binding',     pass: true },
            { id: 'side',  label: 'data-side me/other',     pass: true },
            { id: 'aria',  label: 'aria-label = who',       pass: true },
            { id: 'time',  label: 'Timestamp 부품 사용',     pass: false, note: 'plain string 으로 박혀 있음' },
          ]}
        />
      </Body>
    </Phone>
  ),
}

// ──────────────────────────────────────────────────────────────────────
// (G) Roles — RoleCard
// ──────────────────────────────────────────────────────────────────────

const Roles_Sortable: ScreenDef = {
  id: 'cat-roles-sortable',
  app: 'Notion Permissions',
  flow: 'roles',
  category: 'G-Roles',
  patterns: ['role-card-list', 'sticky-action-cta', 'top-bar-back-action'],
  parts: ['Phone', 'PhoneTopBar', 'RoleCard', 'Button'],
  render: () => (
    <Phone
      label="roles"
      topBar={<PhoneTopBar back title="Roles" action={<span data-icon="plus" aria-label="add" />} />}
    >
      <Body>
        <RoleCard icon={<span data-icon="star" aria-hidden />} name="Owner"   desc="모든 권한"        meta={<small>1 명</small>} />
        <RoleCard icon={<span data-icon="settings" aria-hidden />} name="Admin"   desc="설정 · 멤버 관리"  meta={<small>3 명</small>} />
        <RoleCard icon={<span data-icon="edit" aria-hidden />} name="Editor"  desc="콘텐츠 작성 · 편집" meta={<small>12 명</small>} />
        <RoleCard icon={<span data-icon="user" aria-hidden />} name="Viewer"  desc="읽기 전용"        meta={<small>48 명</small>} />
      </Body>
      <StickyAction><PrimaryButton>변경 저장</PrimaryButton></StickyAction>
    </Phone>
  ),
}

// ──────────────────────────────────────────────────────────────────────
// (H) Settings — Switch · Slider · Select · RadioGroup · CheckboxGroup
// ──────────────────────────────────────────────────────────────────────

const Settings_Preferences: ScreenDef = {
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
}

// ──────────────────────────────────────────────────────────────────────
// (I) Forms — Field · Input · Textarea · SearchBox · validation
// ──────────────────────────────────────────────────────────────────────

const Form_Compose: ScreenDef = {
  id: 'cat-form-compose',
  app: 'Medium',
  flow: 'compose',
  category: 'I-Forms',
  patterns: ['title-body-form', 'tag-input', 'sticky-action-cta', 'top-bar-back-action'],
  parts: ['Phone', 'PhoneTopBar', 'Field', 'FieldLabel', 'FieldDescription', 'Input', 'Textarea', 'Tag', 'Row', 'Button'],
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
            <Tag label="design" onRemove={() => {}} />
            <Tag label="ds" onRemove={() => {}} />
            <Input placeholder="+ 추가" style={{ flex: 1, minInlineSize: 80 }} />
          </Row>
        </Field>
      </Body>
      <StickyAction><PrimaryButton>발행</PrimaryButton></StickyAction>
    </Phone>
  ),
}

const Form_Validation: ScreenDef = {
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
          <Callout tone="danger">최소 8자 + 숫자 1개 이상 필요</Callout>
        </Field>
        <Field required>
          <FieldLabel>닉네임</FieldLabel>
          <Input defaultValue="Yongtae" />
          <Callout tone="success">사용 가능한 닉네임</Callout>
        </Field>
      </Body>
      <StickyAction><PrimaryButton>가입</PrimaryButton></StickyAction>
    </Phone>
  ),
}

const Form_Search: ScreenDef = {
  id: 'cat-form-search',
  app: 'Spotlight',
  flow: 'search',
  category: 'I-Forms',
  patterns: ['searchbox', 'recent-tags', 'suggestion-listbox', 'top-bar-back'],
  parts: ['Phone', 'PhoneTopBar', 'SearchBox', 'Tag', 'Row', 'Listbox'],
  render: () => (
    <Phone label="search" topBar={<PhoneTopBar back title="검색" />}>
      <Body>
        <SearchBox placeholder="라우트 · 컴포넌트 · 토큰" />
        <small style={{ opacity: 0.6 }}>최근 검색</small>
        <Row flow="cluster">
          <Tag label="Phone" onRemove={() => {}} />
          <Tag label="container" onRemove={() => {}} />
          <Tag label="hierarchy" onRemove={() => {}} />
        </Row>
        <small style={{ opacity: 0.6 }}>제안</small>
        <Listbox
          aria-label="suggestions"
          data={fromList([
            { label: 'Phone — ds/parts/Phone' },
            { label: 'PhoneTopBar' },
            { label: 'PhoneTabBar' },
            { label: 'phoneCss — style/parts/phone.ts' },
          ])}
          onEvent={() => {}}
        />
      </Body>
    </Phone>
  ),
}

// ──────────────────────────────────────────────────────────────────────
// (J) Detail — Breadcrumb · KeyValue · Code · Link · Progress
// ──────────────────────────────────────────────────────────────────────

const Detail_Order: ScreenDef = {
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
}

// ──────────────────────────────────────────────────────────────────────
// (K) Overlay — Disclosure FAQ + Dialog/Sheet 닫힌 상태 (showcase)
// ──────────────────────────────────────────────────────────────────────

const Overlay_FAQ: ScreenDef = {
  id: 'cat-overlay-faq',
  app: 'Notion Help',
  flow: 'help',
  category: 'K-Overlay',
  patterns: ['accordion-faq', 'top-bar-back'],
  parts: ['Phone', 'PhoneTopBar', 'Heading', 'Disclosure'],
  render: () => (
    <Phone label="FAQ" topBar={<PhoneTopBar back title="도움말" />}>
      <Body>
        <Heading level="h3">자주 묻는 질문</Heading>
        <Disclosure summary="ds/parts/Phone 은 어떤 디바이스를 모방하나요?">
          <p>iPhone 14 Pro 의 논리 폭 393×852pt 입니다. 베젤 + dynamic island + status bar + home indicator 까지 ds 토큰으로 그립니다.</p>
        </Disclosure>
        <Disclosure summary="composite 은 정적 화면에서도 동작하나요?">
          <p>네. Listbox · TabList · Toolbar 는 fromList(items) 로 정적 데이터를 넘기면 keyboard nav · focus · selected 표시까지 그대로 작동합니다. onEvent 만 no-op 이면 됩니다.</p>
        </Disclosure>
        <Disclosure summary="MobileScreen 은 wireframes 전용인가요?">
          <p>네 — Phone wrapper 의 sticky action footer 패턴을 캡슐화한 합성입니다. 다른 라우트가 폰 모사를 한다면 ds/parts 로 승격할 수 있습니다.</p>
        </Disclosure>
        <Disclosure summary="실시간 토큰 테이블은 어떻게 동작하나요?">
          <p>:root 와 모든 stylesheet 의 :root / html 룰을 walk 해서 --ds-* 를 enumerate. preset 을 갈면 즉시 따라옵니다.</p>
        </Disclosure>
      </Body>
    </Phone>
  ),
}

// ──────────────────────────────────────────────────────────────────────
// (L) States — Empty / Error / Loading
// ──────────────────────────────────────────────────────────────────────

const State_Empty: ScreenDef = {
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
}

const State_Error: ScreenDef = {
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
        <Skeleton width="100%" height={48} />
        <Skeleton width="100%" height={48} />
        <Skeleton width="100%" height={48} />
      </Body>
      <StickyAction><PrimaryButton>다시 시도</PrimaryButton></StickyAction>
    </Phone>
  ),
}

const State_Loading: ScreenDef = {
  id: 'cat-state-loading',
  app: 'Threads',
  flow: 'feed',
  category: 'L-States',
  patterns: ['skeleton-loading', 'bottom-tab-bar', 'top-bar-back'],
  parts: ['Phone', 'PhoneTopBar', 'PhoneTabBar', 'Skeleton'],
  render: () => (
    <Phone label="loading" topBar={<PhoneTopBar back title="Feed" />} bottomBar={<PhoneTabBar items={tabIcons(0)} active={0} />}>
      <Body>
        <Skeleton width="100%" height={120} style={{ borderRadius: 'var(--ds-radius-md)' }} />
        <Skeleton width="100%" height={120} style={{ borderRadius: 'var(--ds-radius-md)' }} />
        <Skeleton width="100%" height={120} style={{ borderRadius: 'var(--ds-radius-md)' }} />
      </Body>
    </Phone>
  ),
}

// ──────────────────────────────────────────────────────────────────────
// Catalog SCREENS export — derived index 를 외부에서 쓸 수 있게 노출.
// affordance 카탈로그(byPattern) · 부품 사용처(byPart) · 앱별/flow별 grouping 자동 도출.
// ──────────────────────────────────────────────────────────────────────

export const SCREENS: Record<string, ScreenDef> = {
  [Chat_Thread.id]: Chat_Thread,
  [Chat_List.id]: Chat_List,
  [Shop_Browse.id]: Shop_Browse,
  [Shop_Cart.id]: Shop_Cart,
  [Shop_Empty.id]: Shop_Empty,
  [Learn_Catalog.id]: Learn_Catalog,
  [Learn_Detail.id]: Learn_Detail,
  [Feed_Timeline.id]: Feed_Timeline,
  [Dash_Overview.id]: Dash_Overview,
  [Dash_Top.id]: Dash_Top,
  [Contract_Audit.id]: Contract_Audit,
  [Roles_Sortable.id]: Roles_Sortable,
  [Settings_Preferences.id]: Settings_Preferences,
  [Form_Compose.id]: Form_Compose,
  [Form_Validation.id]: Form_Validation,
  [Form_Search.id]: Form_Search,
  [Detail_Order.id]: Detail_Order,
  [Overlay_FAQ.id]: Overlay_FAQ,
  [State_Empty.id]: State_Empty,
  [State_Error.id]: State_Error,
  [State_Loading.id]: State_Loading,
}

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

// ──────────────────────────────────────────────────────────────────────
// Group — section ((A) Chat 등)
// ──────────────────────────────────────────────────────────────────────

const Group = ({ id, title, lede, children }: { id: string; title: string; lede?: string; children: ReactNode }) => (
  <section data-part="wf-group" id={id}>
    <header>
      <strong>({id})</strong>
      <Column style={{ gap: 'calc(var(--ds-space) * 1)' }}>
        <h2>{title}</h2>
        {lede && <p>{lede}</p>}
      </Column>
    </header>
    <div data-part="wf-grid">{children}</div>
  </section>
)

// ──────────────────────────────────────────────────────────────────────
// Showcase 전용 layout chrome — 캔버스 + group + grid 만 wf-* namespace.
// ──────────────────────────────────────────────────────────────────────

const wireframesCss = `
  [data-part="wf-canvas"] {
    inline-size: 100%;
    background: var(--ds-neutral-1);
    background-image: radial-gradient(circle, color-mix(in oklch, var(--ds-fg) 12%, transparent) 1px, transparent 1px);
    background-size: 24px 24px;
    border-radius: var(--ds-radius-lg);
    padding: calc(var(--ds-space) * 8);
    display: flex; flex-direction: column;
    gap: calc(var(--ds-space) * 16);
  }
  [data-part="wf-group"] > header {
    display: flex; align-items: baseline;
    gap: calc(var(--ds-space) * 3);
    margin-block-end: calc(var(--ds-space) * 8);
    padding-block-end: calc(var(--ds-space) * 3);
    border-block-end: var(--ds-hairline) solid var(--ds-border);
  }
  [data-part="wf-group"] > header > strong {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: var(--ds-text-2xl);
    font-weight: var(--ds-weight-regular);
    color: color-mix(in oklab, currentColor 55%, transparent);
    line-height: 1;
  }
  [data-part="wf-group"] > header h2 {
    margin: 0;
    font-size: var(--ds-text-2xl);
    font-weight: var(--ds-weight-regular);
    letter-spacing: -0.01em;
  }
  [data-part="wf-group"] > header p {
    margin: 0;
    font-size: var(--ds-text-sm);
    color: color-mix(in oklab, currentColor 60%, transparent);
    max-inline-size: 60ch;
  }
  [data-part="wf-grid"] {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(407px, max-content));
    gap: calc(var(--ds-space) * 12) calc(var(--ds-space) * 8);
    align-items: end;
    justify-content: start;
  }
`

// ──────────────────────────────────────────────────────────────────────
// Page builder
// ──────────────────────────────────────────────────────────────────────

// ──────────────────────────────────────────────────────────────────────
// HMI Audit toolbar — 위계 단조 invariant 위반 감지 toggle.
// ──────────────────────────────────────────────────────────────────────

function HmiBar() {
  const [report, setReport] = useState<{ total: number; byType: Record<string, number> } | null>(null)
  const run = () => {
    // iframe 들이 아직 mount 중일 수 있어 다음 frame 에 실행
    requestAnimationFrame(() => setReport(auditAll()))
  }
  const clear = () => { clearAll(); setReport(null) }
  return (
    <div data-part="hmi-bar" style={{
      display: 'flex', gap: 'calc(var(--ds-space) * 3)', alignItems: 'center',
      padding: 'calc(var(--ds-space) * 3)',
      background: 'var(--ds-bg)', border: 'var(--ds-hairline) solid var(--ds-border)',
      borderRadius: 'var(--ds-radius-md)', fontFamily: 'ui-monospace, monospace',
      fontSize: 'var(--ds-text-sm)', position: 'sticky', top: 0, zIndex: 10,
    }}>
      <strong>HMI Audit</strong>
      <button type="button" onClick={run} data-emphasis="primary">감사 실행</button>
      <button type="button" onClick={clear}>지우기</button>
      {report && (
        <div style={{ display: 'flex', gap: 'calc(var(--ds-space) * 4)' }}>
          <span>총 {report.total} 위반</span>
          <span><LegendDot tone="danger" /> 단조 위반 {report.byType['monotonic-violation']}</span>
          <span><LegendDot tone="warning" /> redundant padding {report.byType['redundant-padding']}</span>
          <span><LegendDot tone="info" /> gap stair {report.byType['gap-stair']}</span>
        </div>
      )}
      <small style={{ marginInlineStart: 'auto', opacity: 0.6 }}>
        단조 위반 = 자식 padding &gt; 부모 분리 · redundant = 부모/자식 padding 동시 · stair = 형제 padding 불균형
      </small>
    </div>
  )
}

function buildPage(): NormalizedData {
  const canvas: ReactNode = (
    <div data-part="wf-canvas">
      <style>{wireframesCss}</style>

      <HmiBar />

      <Group id="A" title="Chat" lede="MessageBubble · 1:1 대화 thread + 대화 목록 (Avatar + last-message)">
        {Chat_Thread.render()}{Chat_List.render()}
      </Group>

      <Group id="B" title="Shopping" lede="ProductCard · 카테고리 picker (TabList) + 상품 grid + 장바구니 + 빈 상태">
        {Shop_Browse.render()}{Shop_Cart.render()}{Shop_Empty.render()}
      </Group>

      <Group id="C" title="Learning" lede="CourseCard · 레벨 picker (TabList) + 코스 catalog + 코스 상세 (커리큘럼)">
        {Learn_Catalog.render()}{Learn_Detail.render()}
      </Group>

      <Group id="D" title="Feed" lede="FeedPost · timeline. 좋아요 · 댓글 · 공유 toolbar 자체 내장.">
        {Feed_Timeline.render()}
      </Group>

      <Group id="E" title="Dashboard" lede="StatCard 2×2 KPI grid + BarChart 주간 트래픽 + Top10List 라우트별 인기.">
        {Dash_Overview.render()}{Dash_Top.render()}
      </Group>

      <Group id="F" title="Contracts" lede="ContractCard · ds 컴포넌트 계약 감사 (검사 목록 · pass/fail · 호출 사이트).">
        {Contract_Audit.render()}
      </Group>

      <Group id="G" title="Roles" lede="RoleCard · 정렬 가능한 권한 row.">
        {Roles_Sortable.render()}
      </Group>

      <Group id="H" title="Settings" lede="Switch · Slider · Select · RadioGroup · CheckboxGroup — 모바일 환경 설정.">
        {Settings_Preferences.render()}
      </Group>

      <Group id="I" title="Forms" lede="Field · Input · Textarea · SearchBox · validation tone (danger / success).">
        {Form_Compose.render()}{Form_Validation.render()}{Form_Search.render()}
      </Group>

      <Group id="J" title="Detail" lede="Breadcrumb · KeyValue · Code · Link · ProgressBar — 주문 상세 같은 정보 페이지.">
        {Detail_Order.render()}
      </Group>

      <Group id="K" title="Overlay" lede="Disclosure · Dialog · Sheet · Popover — 모달/접힘/플로팅 표면.">
        {Overlay_FAQ.render()}
      </Group>

      <Group id="L" title="States" lede="EmptyState · Callout · Skeleton 로 빈 상태 / 에러 / 로딩 시연.">
        {State_Empty.render()}{State_Error.render()}{State_Loading.render()}
      </Group>
    </div>
  )

  return {
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      page: { id: 'page', data: { type: 'Main', flow: 'split', label: 'Wireframes' } },

      hdr: { id: 'hdr', data: { type: 'Header', flow: 'cluster' } },
      hdrTitle: { id: 'hdrTitle', data: { type: 'Text', variant: 'h1', content: 'Wireframes' } },
      hdrSub: { id: 'hdrSub', data: { type: 'Text', variant: 'small', content: '우리가 가진 widget 으로 짠 모바일 화면 카탈로그 — Chat · Shopping · Learning · Feed · Dashboard · Contracts · Roles · States. 실물 크기 iPhone (393×852pt).' } },

      canvasBlock: { id: 'canvasBlock', data: { type: 'Ui', component: 'Block', content: canvas } },
    },
    relationships: {
      [ROOT]: ['page'],
      page: ['hdr', 'canvasBlock'],
      hdr: ['hdrTitle', 'hdrSub'],
    },
  }
}

export function Wireframes() {
  const [data] = useState(buildPage)
  return <Renderer page={definePage(data)} />
}

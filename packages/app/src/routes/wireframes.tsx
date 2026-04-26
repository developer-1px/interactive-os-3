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
 */
import { createFileRoute } from '@tanstack/react-router'
import { useState, type ReactNode } from 'react'
import {
  ROOT, Renderer, definePage, fromList, type NormalizedData,
  Phone, PhoneTopBar, PhoneTabBar,
  Skeleton, Tag, Avatar, Heading, EmptyState, Callout, Thumbnail, CountBadge,
  KeyValue, Breadcrumb, Code, Link, ProgressBar,
  Row, Column,
  Listbox, TabList, Toolbar, Tree, RadioGroup, CheckboxGroup,
  StatCard, CourseCard, ProductCard, FeedPost, MessageBubble, ContractCard, RoleCard, BarChart, Top10List,
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

// ──────────────────────────────────────────────────────────────────────
// 모바일 골격 — content + 정해진 control. Phone wrapper.
// ──────────────────────────────────────────────────────────────────────

const tabIcons = (active: number) =>
  ['◧', '◫', '◉', '☰', '◐'].map((g, i) => (
    <span key={i} aria-hidden style={{ fontSize: 'var(--ds-text-xl)', color: i === active ? 'var(--ds-accent)' : undefined }}>{g}</span>
  ))

const Body = ({ children }: { children: ReactNode }) => (
  <Column flow="form" style={{ flex: 1, minBlockSize: 0 }}>{children}</Column>
)

const StickyAction = ({ children }: { children: ReactNode }) => (
  <div style={{ padding: 'calc(var(--ds-space) * 4)', borderBlockStart: 'var(--ds-hairline) solid var(--ds-border)', background: 'var(--ds-bg)' }}>
    {children}
  </div>
)

const PrimaryButton = ({ children }: { children: ReactNode }) => (
  <Button data-emphasis="primary" style={{ inlineSize: '100%' }}>{children}</Button>
)

// ──────────────────────────────────────────────────────────────────────
// (A) Chat — MessageBubble
// ──────────────────────────────────────────────────────────────────────

const Chat_Thread = (
  <Phone
    label="thread"
    topBar={<PhoneTopBar back title="Alex Kim" action="⋯" />}
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
        <Button data-emphasis="primary">↑</Button>
      </Row>
    </StickyAction>
  </Phone>
)

const Chat_List = (
  <Phone
    label="conversations"
    topBar={<PhoneTopBar title="Messages" action="✎" />}
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
)

// ──────────────────────────────────────────────────────────────────────
// (B) Shopping — ProductCard
// ──────────────────────────────────────────────────────────────────────

const sampleImg = (seed: string) => `https://picsum.photos/seed/${seed}/320/320`

const Shop_Browse = (
  <Phone
    label="browse"
    topBar={<PhoneTopBar title="Shop" action="🔍" />}
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
)

const Shop_Cart = (
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
)

const Shop_Empty = (
  <Phone
    label="empty cart"
    topBar={<PhoneTopBar back title="Cart" />}
  >
    <Body>
      <EmptyState title="장바구니가 비었습니다" description="둘러보기에서 마음에 드는 상품을 담아보세요." />
      <Button data-emphasis="primary" style={{ alignSelf: 'center' }}>둘러보기</Button>
    </Body>
  </Phone>
)

// ──────────────────────────────────────────────────────────────────────
// (C) Learning — CourseCard
// ──────────────────────────────────────────────────────────────────────

const Learn_Catalog = (
  <Phone
    label="course catalog"
    topBar={<PhoneTopBar title="Courses" action="🔍" />}
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
)

const Learn_Detail = (
  <Phone
    label="course detail"
    topBar={<PhoneTopBar back title="Course" action="♡" />}
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
            <span>{t}</span><small style={{ opacity: 0.5 }}>›</small>
          </Row>
        ))}
      </Column>
    </Body>
    <StickyAction><PrimaryButton>수강 시작</PrimaryButton></StickyAction>
  </Phone>
)

// ──────────────────────────────────────────────────────────────────────
// (D) Feed — FeedPost
// ──────────────────────────────────────────────────────────────────────

const Feed_Timeline = (
  <Phone
    label="feed"
    topBar={<PhoneTopBar title="Feed" action="✎" />}
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
)

// ──────────────────────────────────────────────────────────────────────
// (E) Dashboard — StatCard · BarChart · Top10List
// ──────────────────────────────────────────────────────────────────────

const Dash_Overview = (
  <Phone
    label="dashboard"
    topBar={<PhoneTopBar title="Dashboard" action="⋯" />}
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
)

const Dash_Top = (
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
)

// ──────────────────────────────────────────────────────────────────────
// (F) Contracts — ContractCard
// ──────────────────────────────────────────────────────────────────────

const Contract_Audit = (
  <Phone
    label="contract audit"
    topBar={<PhoneTopBar back title="Contracts" action="🔍" />}
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
)

// ──────────────────────────────────────────────────────────────────────
// (G) Roles — RoleCard
// ──────────────────────────────────────────────────────────────────────

const Roles_Sortable = (
  <Phone
    label="roles"
    topBar={<PhoneTopBar back title="Roles" action="+" />}
  >
    <Body>
      <RoleCard icon={<span aria-hidden>👑</span>} name="Owner"   desc="모든 권한"        meta={<small>1 명</small>} />
      <RoleCard icon={<span aria-hidden>🛠</span>} name="Admin"   desc="설정 · 멤버 관리"  meta={<small>3 명</small>} />
      <RoleCard icon={<span aria-hidden>✍️</span>} name="Editor"  desc="콘텐츠 작성 · 편집" meta={<small>12 명</small>} />
      <RoleCard icon={<span aria-hidden>👁</span>} name="Viewer"  desc="읽기 전용"        meta={<small>48 명</small>} />
    </Body>
    <StickyAction><PrimaryButton>변경 저장</PrimaryButton></StickyAction>
  </Phone>
)

// ──────────────────────────────────────────────────────────────────────
// (H) States — Empty / Error / Loading
// ──────────────────────────────────────────────────────────────────────

const State_Empty = (
  <Phone label="empty" topBar={<PhoneTopBar back title="Inbox" />} bottomBar={<PhoneTabBar items={tabIcons(2)} active={2} />}>
    <Body>
      <EmptyState title="받은 메시지가 없습니다" description="새 메시지가 오면 여기에 표시됩니다." />
    </Body>
  </Phone>
)

const State_Error = (
  <Phone label="error" topBar={<PhoneTopBar back title="Dashboard" />} bottomBar={<PhoneTabBar items={tabIcons(3)} active={3} />}>
    <Body>
      <Callout tone="danger">서버 응답 없음. 잠시 후 다시 시도하세요.</Callout>
      <Skeleton width="100%" height={48} />
      <Skeleton width="100%" height={48} />
      <Skeleton width="100%" height={48} />
    </Body>
    <StickyAction><PrimaryButton>다시 시도</PrimaryButton></StickyAction>
  </Phone>
)

const State_Loading = (
  <Phone label="loading" topBar={<PhoneTopBar back title="Feed" />} bottomBar={<PhoneTabBar items={tabIcons(0)} active={0} />}>
    <Body>
      <Skeleton width="100%" height={120} style={{ borderRadius: 'var(--ds-radius-md)' }} />
      <Skeleton width="100%" height={120} style={{ borderRadius: 'var(--ds-radius-md)' }} />
      <Skeleton width="100%" height={120} style={{ borderRadius: 'var(--ds-radius-md)' }} />
    </Body>
  </Phone>
)

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

function buildPage(): NormalizedData {
  const canvas: ReactNode = (
    <div data-part="wf-canvas">
      <style>{wireframesCss}</style>

      <Group id="A" title="Chat" lede="MessageBubble · 1:1 대화 thread + 대화 목록 (Avatar + last-message)">
        {Chat_Thread}{Chat_List}
      </Group>

      <Group id="B" title="Shopping" lede="ProductCard · 카테고리 picker (TabList) + 상품 grid + 장바구니 + 빈 상태">
        {Shop_Browse}{Shop_Cart}{Shop_Empty}
      </Group>

      <Group id="C" title="Learning" lede="CourseCard · 레벨 picker (TabList) + 코스 catalog + 코스 상세 (커리큘럼)">
        {Learn_Catalog}{Learn_Detail}
      </Group>

      <Group id="D" title="Feed" lede="FeedPost · timeline. 좋아요 · 댓글 · 공유 toolbar 자체 내장.">
        {Feed_Timeline}
      </Group>

      <Group id="E" title="Dashboard" lede="StatCard 2×2 KPI grid + BarChart 주간 트래픽 + Top10List 라우트별 인기.">
        {Dash_Overview}{Dash_Top}
      </Group>

      <Group id="F" title="Contracts" lede="ContractCard · ds 컴포넌트 계약 감사 (검사 목록 · pass/fail · 호출 사이트).">
        {Contract_Audit}
      </Group>

      <Group id="G" title="Roles" lede="RoleCard · 정렬 가능한 권한 row.">
        {Roles_Sortable}
      </Group>

      <Group id="H" title="States" lede="EmptyState · Callout · Skeleton 로 빈 상태 / 에러 / 로딩 시연.">
        {State_Empty}{State_Error}{State_Loading}
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

function Wireframes() {
  const [data] = useState(buildPage)
  return <Renderer page={definePage(data)} />
}

// eslint-disable-next-line react-refresh/only-export-components
export const Route = createFileRoute('/wireframes')({
  component: Wireframes,
  staticData: { palette: { label: 'Wireframes', to: '/wireframes' } },
})

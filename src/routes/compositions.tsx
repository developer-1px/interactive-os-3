/**
 * /compositions — 복합 부품의 조립 변형 갤러리.
 *
 * 외부 벤더 (TailwindUI · Untitled UI · shadcn) 가 수렴한 패턴을 우리 ds 어휘로:
 *   1) 같은 조립의 N 변형을 vertical stack — variant matrix
 *   2) in-the-wild working chrome 임베드 (floating-in-void 금지)
 *   3) stacked-tree recipe (Polaris) — entity 트리가 곧 anatomy
 *
 * Renderer + definePage canonical. 변형 시각만 Ui Block (children passthrough) 슬롯.
 */
import { createFileRoute } from '@tanstack/react-router'
import { useState, type ReactNode } from 'react'
import { ROOT, Renderer, definePage, type NormalizedData } from '../ds'
import { Avatar, Badge, Tag, Callout, EmptyState, Skeleton, KeyValue } from '../ds/parts'

const todayAt = (hhmm: string): number => {
  const [h, m] = hhmm.split(':').map(Number)
  const d = new Date(); d.setHours(h, m, 0, 0); return d.getTime()
}

// ──────────────────────────────────────────────────────────────────────
// Card 변형
// ──────────────────────────────────────────────────────────────────────

const messageBubble = (side: 'me' | 'other', who: string, text: string, time: string): ReactNode => (
  <article data-part="card" data-card="message" data-side={side}>
    {side === 'other' && <div data-slot="title"><strong>{who}</strong></div>}
    <div data-slot="body"><p>{text}</p></div>
    <div data-slot="meta"><small>{time}</small></div>
  </article>
)

const postCardVariant = (cont: boolean, who: string, time: string, body: string, avatar: string): ReactNode => (
  <article data-part="card" data-card="post" {...(cont && { 'data-cont': '' })}>
    <div data-slot="preview">
      {!cont && <strong data-ds-aspect="square"><img src={avatar} alt="" /></strong>}
    </div>
    <div data-slot="title">
      {!cont && <strong>{who} <small>{time}</small></strong>}
    </div>
    <div data-slot="body"><p>{body}</p></div>
  </article>
)

const statCardVariant = (label: string, value: string, delta: string, tone?: 'alert'): ReactNode => (
  <article data-part="card" data-card="stat" {...(tone && { 'data-tone': tone })}>
    <div data-slot="title"><header><strong>{label}</strong>{tone === 'alert' && <Badge tone="danger" label="alert" />}</header></div>
    <div data-slot="meta"><strong>{value}</strong></div>
    <div data-slot="footer"><small>{delta}</small></div>
  </article>
)

const productCardVariant = (name: string, price: string, img: string, badge?: string): ReactNode => (
  <article data-part="card" data-card="product">
    <div data-slot="preview"><img src={img} alt={name} loading="lazy" />{badge && <Badge tone="success" label={badge} />}</div>
    <div data-slot="title"><strong>{name}</strong></div>
    <div data-slot="footer"><strong>{price}</strong></div>
  </article>
)

const courseCardVariant = (title: string, instructor: string, level: string, mins: number): ReactNode => (
  <article data-part="card" data-card="course">
    <div data-slot="title"><strong>{title}</strong></div>
    <div data-slot="meta"><Tag label={level} /><small> · {instructor} · {mins}분</small></div>
  </article>
)

// ──────────────────────────────────────────────────────────────────────
// Inbox row 변형
// ──────────────────────────────────────────────────────────────────────

const inboxRow = (
  variant: 'unread' | 'read' | 'starred' | 'threaded' | 'attachment' | 'system',
  who: string, subject: string, preview: string, time: string,
): ReactNode => (
  <article data-part="card" data-card="inbox-row" data-state={variant}>
    <div data-slot="preview">
      {variant !== 'system' && <Avatar alt={who} initial={who[0]} />}
      {variant === 'system' && <span data-icon="info" aria-hidden />}
    </div>
    <div data-slot="title">
      <strong>{variant === 'unread' ? <b>{who}</b> : who}</strong>
      {variant === 'starred' && <span data-icon="star" aria-label="별표" />}
      {variant === 'threaded' && <Badge count={3} label="3 답장" />}
      {variant === 'attachment' && <span data-icon="archive" aria-label="첨부 있음" />}
    </div>
    <div data-slot="body"><p><strong>{subject}</strong> — <small>{preview}</small></p></div>
    <div data-slot="footer"><time dateTime={new Date(todayAt(time)).toISOString()}>{time}</time></div>
  </article>
)

// ──────────────────────────────────────────────────────────────────────
// Field 변형
// ──────────────────────────────────────────────────────────────────────

const field = (
  variant: 'basic' | 'required' | 'help' | 'error' | 'success' | 'disabled',
  label: string, placeholder: string, helpText?: string,
): ReactNode => (
  <div role="group" data-part="field"
    {...(variant === 'required' && { 'aria-required': 'true' })}
    {...(variant === 'error' && { 'aria-invalid': 'true' })}>
    <label htmlFor={`f-${variant}-${label}`}>{label}</label>
    <input id={`f-${variant}-${label}`} type="text" placeholder={placeholder}
      defaultValue={variant === 'success' ? 'jane.doe@example.com' : variant === 'error' ? 'invalid' : ''}
      disabled={variant === 'disabled'} />
    {helpText && <p>{helpText}</p>}
    {variant === 'error' && <p data-tone="danger">올바른 이메일 형식이 아닙니다.</p>}
    {variant === 'success' && <p data-tone="success">사용 가능한 이메일입니다.</p>}
  </div>
)

// ──────────────────────────────────────────────────────────────────────
// Prose 변형
// ──────────────────────────────────────────────────────────────────────

const proseHero = (): ReactNode => (
  <article data-flow="prose">
    <hgroup><h1>The Hierarchy Manifesto</h1><p>recursive Proximity 가 만드는 다섯 단계의 위계</p></hgroup>
    <p>모든 시각 위계는 한 단계 위로 갈수록 한 단계 큰 spacing 을 갖는다. Gestalt 의 가장 단순한 표현이며 우리 ds 의 SSOT 다.</p>
  </article>
)

const proseTable = (): ReactNode => (
  <article data-flow="prose">
    <h2>토큰 비교</h2>
    <table><thead><tr><th>Tier</th><th>토큰</th><th>실측 px</th></tr></thead><tbody>
      <tr><td>atom</td><td><code>hierarchy.atom</code></td><td>2px</td></tr>
      <tr><td>cluster</td><td><code>hierarchy.group</code></td><td>4px</td></tr>
      <tr><td>section</td><td><code>hierarchy.section</code></td><td>12px</td></tr>
      <tr><td>surface</td><td><code>hierarchy.surface</code></td><td>24px</td></tr>
      <tr><td>shell</td><td><code>hierarchy.shell</code></td><td>48px</td></tr>
    </tbody></table>
  </article>
)

const proseCallout = (): ReactNode => (
  <article data-flow="prose">
    <h3>주의</h3>
    <p>이 토큰들은 monotonic 단조 증가를 강제합니다.</p>
    <aside><p><strong>금지:</strong> hierarchy.surface 안쪽 콘텐츠가 hierarchy.shell 보다 큰 spacing 을 가질 수 없음.</p></aside>
    <p>위반 시 <code>scripts/audit-hmi.mjs</code> 가 정적 점검에서 차단합니다.</p>
  </article>
)

const proseCode = (): ReactNode => (
  <article data-flow="prose">
    <h3>적용 예</h3>
    <pre><code>{`import { hierarchy } from 'src/ds/foundations'

const sidebarSurface = css\`
  nav[data-part="sidebar"] {
    padding: \${hierarchy.surface};
    gap: \${hierarchy.shell};
  }
\``}</code></pre>
  </article>
)

// ──────────────────────────────────────────────────────────────────────
// Pattern-level states
// ──────────────────────────────────────────────────────────────────────

const stateRow = (state: 'empty' | 'loading' | 'error' | 'partial' | 'done'): ReactNode => {
  switch (state) {
    case 'empty':   return <EmptyState title="받은 편지함이 비었습니다" description="새 메일이 도착하면 여기에 표시됩니다." />
    case 'loading': return (<div role="status" aria-label="로딩 중"><Skeleton width="100%" height={48} /><Skeleton width="100%" height={48} /><Skeleton width="100%" height={48} /></div>)
    case 'error':   return <Callout tone="danger">서버 응답 없음. 잠시 후 다시 시도하세요.</Callout>
    case 'partial': return (<div>{inboxRow('unread', '김지민', '회의 자료', 'PR 검토 부탁드립니다', '14:32')}{inboxRow('read', '박서연', '점심', '점심 같이 드실래요?', '12:18')}<Skeleton width="100%" height={48} /></div>)
    case 'done':    return <KeyValue items={[{ key: '총', value: '128개' }, { key: '읽지 않음', value: '12개' }, { key: '별표', value: '4개' }]} />
  }
}

// ──────────────────────────────────────────────────────────────────────
// VariantRow + Family — definePage 친화 ReactNode 헬퍼
// ──────────────────────────────────────────────────────────────────────

const VariantRow = ({ label, children }: { label: string; children: ReactNode }) => (
  <section aria-label={label} data-part="variant-row">
    <small>{label}</small>
    <div>{children}</div>
  </section>
)

// ──────────────────────────────────────────────────────────────────────
// Page builder
// ──────────────────────────────────────────────────────────────────────

function buildPage(): NormalizedData {
  const cardVariants: ReactNode = (<>
    <VariantRow label="post / 일반">{postCardVariant(false, '유용태', '2분 전', 'recursive Proximity 가 잘 보이는 화면을 만들었다.', 'https://i.pravatar.cc/64?u=teo')}</VariantRow>
    <VariantRow label="post / 연속">{postCardVariant(true, '', '', '같은 사람의 두 번째 메시지 — avatar/header 시각 숨김 (Slack 패턴).', '')}</VariantRow>
    <VariantRow label="message / other">{messageBubble('other', 'Alex', '오늘 PR 머지 부탁해요.', '오전 9:14')}</VariantRow>
    <VariantRow label="message / me">{messageBubble('me', 'me', '확인하고 오후에 머지할게요!', '오전 9:18')}</VariantRow>
    <VariantRow label="stat / 기본">{statCardVariant('월간 활성 사용자', '12,438', '+8.2% vs 전월')}</VariantRow>
    <VariantRow label="stat / alert">{statCardVariant('에러율', '3.4%', '+2.1% vs 전월', 'alert')}</VariantRow>
    <VariantRow label="product">{productCardVariant('Mechanical Keyboard', '₩189,000', 'https://picsum.photos/seed/kbd/240/180', '신상')}</VariantRow>
    <VariantRow label="course">{courseCardVariant('TypeScript 심화', 'Sora Park', '중급', 240)}</VariantRow>
  </>)

  const inboxVariants: ReactNode = (<>
    <VariantRow label="unread">{inboxRow('unread', '김지민', '회의 자료 검토', 'PR #482 리뷰 부탁드립니다.', '14:32')}</VariantRow>
    <VariantRow label="read">{inboxRow('read', '박서연', '점심 약속', '오늘 점심 같이 드실래요?', '12:18')}</VariantRow>
    <VariantRow label="starred">{inboxRow('starred', '이준호', '디자인 시안', '새 토큰 ladder 좋네요.', '11:04')}</VariantRow>
    <VariantRow label="threaded">{inboxRow('threaded', '최민지', 'RFC: focus-ring', '4명이 답글을 남겼습니다.', '10:55')}</VariantRow>
    <VariantRow label="attachment">{inboxRow('attachment', '강예나', '월간 리포트', '4월 리포트 첨부드립니다.', '09:42')}</VariantRow>
    <VariantRow label="system">{inboxRow('system', 'system', '비밀번호 변경 알림', '계정 비밀번호가 변경되었습니다.', '08:30')}</VariantRow>
  </>)

  const fieldVariants: ReactNode = (<>
    <VariantRow label="basic">{field('basic', '이름', 'Jane Doe')}</VariantRow>
    <VariantRow label="required">{field('required', '이메일', 'jane@example.com', '필수 입력입니다.')}</VariantRow>
    <VariantRow label="help">{field('help', '사용자명', 'username', '소문자·숫자·하이픈 3-20자')}</VariantRow>
    <VariantRow label="error">{field('error', '이메일', 'jane@example.com')}</VariantRow>
    <VariantRow label="success">{field('success', '이메일', 'jane@example.com')}</VariantRow>
    <VariantRow label="disabled">{field('disabled', '회원 ID', '자동 생성', '가입 시 자동 부여')}</VariantRow>
  </>)

  const proseVariants: ReactNode = (<>
    <VariantRow label="hero">{proseHero()}</VariantRow>
    <VariantRow label="table">{proseTable()}</VariantRow>
    <VariantRow label="callout">{proseCallout()}</VariantRow>
    <VariantRow label="code">{proseCode()}</VariantRow>
  </>)

  const stateVariants: ReactNode = (<>
    <VariantRow label="empty">{stateRow('empty')}</VariantRow>
    <VariantRow label="loading">{stateRow('loading')}</VariantRow>
    <VariantRow label="error">{stateRow('error')}</VariantRow>
    <VariantRow label="partial">{stateRow('partial')}</VariantRow>
    <VariantRow label="done (KeyValue)">{stateRow('done')}</VariantRow>
  </>)

  return {
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      page: { id: 'page', data: { type: 'Column', flow: 'form' } },

      hdr: { id: 'hdr', data: { type: 'Header', flow: 'cluster' } },
      hdrTitle: { id: 'hdrTitle', data: { type: 'Text', variant: 'h1', content: '복합 조립 갤러리' } },
      hdrSub: { id: 'hdrSub', data: { type: 'Text', variant: 'small', content: '같은 primitive 가 어떻게 다른 조립으로 변주되는가 — variant matrix.' } },

      sec1: { id: 'sec1', data: { type: 'Section', flow: 'form', emphasis: 'raised', heading: { variant: 'h2', content: '1. Card 변형 (8 patterns)' } } },
      sec1Note: { id: 'sec1Note', data: { type: 'Text', variant: 'small', content: '같은 article[data-part="card"] 가 data-card 마커 + 슬롯 조합으로 8가지 시각.' } },
      sec1Body: { id: 'sec1Body', data: { type: 'Ui', component: 'Block', content: cardVariants } },

      sec2: { id: 'sec2', data: { type: 'Section', flow: 'form', emphasis: 'raised', heading: { variant: 'h2', content: '2. Inbox row 변형 (6 states)' } } },
      sec2Note: { id: 'sec2Note', data: { type: 'Text', variant: 'small', content: '메일 행 — read/unread/starred/threaded/attachment/system. 같은 grid 안에서 차이가 드러난다 (Gestalt similarity).' } },
      sec2Body: { id: 'sec2Body', data: { type: 'Ui', component: 'Block', content: inboxVariants } },

      sec3: { id: 'sec3', data: { type: 'Section', flow: 'form', emphasis: 'raised', heading: { variant: 'h2', content: '3. Field 변형 (6 variants)' } } },
      sec3Note: { id: 'sec3Note', data: { type: 'Text', variant: 'small', content: '같은 [role="group"][data-part="field"] 골격 — basic/required/help/error/success/disabled.' } },
      sec3Body: { id: 'sec3Body', data: { type: 'Ui', component: 'Block', content: fieldVariants } },

      sec4: { id: 'sec4', data: { type: 'Section', flow: 'form', emphasis: 'raised', heading: { variant: 'h2', content: '4. Prose / Markdown 블록 (4 layouts)' } } },
      sec4Note: { id: 'sec4Note', data: { type: 'Text', variant: 'small', content: 'data-flow="prose" 한 어휘로 hero / table / callout / code 4가지 다른 조립.' } },
      sec4Body: { id: 'sec4Body', data: { type: 'Ui', component: 'Block', content: proseVariants } },

      sec5: { id: 'sec5', data: { type: 'Section', flow: 'form', emphasis: 'raised', heading: { variant: 'h2', content: '5. Pattern-level states (Carbon 시그니처)' } } },
      sec5Note: { id: 'sec5Note', data: { type: 'Text', variant: 'small', content: 'collection 패턴은 default 만으로 부족 — empty/loading/error/partial/done ladder 가 1급 시민.' } },
      sec5Body: { id: 'sec5Body', data: { type: 'Ui', component: 'Block', content: stateVariants } },
    },
    relationships: {
      [ROOT]: ['page'],
      page: ['hdr', 'sec1', 'sec2', 'sec3', 'sec4', 'sec5'],
      hdr: ['hdrTitle', 'hdrSub'],
      sec1: ['sec1Note', 'sec1Body'],
      sec2: ['sec2Note', 'sec2Body'],
      sec3: ['sec3Note', 'sec3Body'],
      sec4: ['sec4Note', 'sec4Body'],
      sec5: ['sec5Note', 'sec5Body'],
    },
  }
}

function Compositions() {
  const [data] = useState(buildPage)
  return <Renderer page={definePage(data)} />
}

// eslint-disable-next-line react-refresh/only-export-components
export const Route = createFileRoute('/compositions')({
  component: Compositions,
  staticData: { palette: { label: '복합 조립 갤러리', to: '/compositions' } },
})

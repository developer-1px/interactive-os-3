/* eslint-disable react-refresh/only-export-components, no-restricted-syntax -- showcase 라우트 갤러리: 컴포넌트 + 헬퍼 함수 한 파일, role/style/aria 의도적 변형 시연 */
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
import { useState, type ReactNode } from 'react'
import { ROOT, Renderer, definePage, type NormalizedData } from '@p/ds'
import { Avatar, Badge, Chip, Callout, EmptyState, Skeleton, KeyValue } from '@p/ds/ui/6-structure'

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

// eslint-disable-next-line no-restricted-syntax -- showcase: stat value 큰 글자 강조 (display 변형 대체 토큰 부재)
const statCardVariant = (label: string, value: string, delta: string, tone?: 'alert'): ReactNode => (
  <article data-part="card" data-card="stat" {...(tone && { 'data-variant': tone })}>
    <div data-slot="title"><header><strong>{label}</strong>{tone === 'alert' && <Badge variant="danger" label="alert" />}</header></div>
    <div data-slot="meta"><strong style={{ fontSize: '2em', fontVariantNumeric: 'tabular-nums' }}>{value}</strong></div>
    <div data-slot="footer"><small>{delta}</small></div>
  </article>
)

const productCardVariant = (name: string, price: string, img: string, badge?: string): ReactNode => (
  <article data-part="card" data-card="product">
    <div data-slot="preview"><img src={img} alt={name} loading="lazy" />{badge && <Badge variant="success" label={badge} />}</div>
    <div data-slot="title"><strong>{name}</strong></div>
    <div data-slot="footer"><strong>{price}</strong></div>
  </article>
)

const courseCardVariant = (title: string, instructor: string, level: string, mins: number): ReactNode => (
  <article data-part="card" data-card="course">
    <div data-slot="title"><strong>{title}</strong></div>
    <div data-slot="meta"><Chip label={level} /><small> · {instructor} · {mins}분</small></div>
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
  // eslint-disable-next-line no-restricted-syntax -- field group 의미 (showcase)
  <div role="group" data-part="field"
    {...(variant === 'required' && { 'aria-required': 'true' })}
    {...(variant === 'error' && { 'aria-invalid': 'true' })}>
    <label htmlFor={`f-${variant}-${label}`}>{label}</label>
    <input id={`f-${variant}-${label}`} type="text" placeholder={placeholder}
      defaultValue={variant === 'success' ? 'jane.doe@example.com' : variant === 'error' ? 'invalid' : ''}
      disabled={variant === 'disabled'} />
    {helpText && <p>{helpText}</p>}
    {variant === 'error' && <p data-variant="danger">올바른 이메일 형식이 아닙니다.</p>}
    {variant === 'success' && <p data-variant="success">사용 가능한 이메일입니다.</p>}
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
// 인증 폼 — 로그인 / 가입 / 비번 재설정 / OAuth picker
// 보편 패턴: 카드 surface + heading + 필드 stack + primary CTA + 보조 링크
// ──────────────────────────────────────────────────────────────────────

const oauthRow = (): ReactNode => (
  <div role="group" aria-label="소셜 로그인" data-part="oauth-row">
    <button type="button"><span data-icon="user" aria-hidden /> Google 로 계속</button>
    <button type="button"><span data-icon="hash" aria-hidden /> GitHub 로 계속</button>
  </div>
)

const divider = (label: string): ReactNode => (
  <div role="separator" aria-label={label}><small>{label}</small></div>
)

const loginCard = (): ReactNode => (
  <article data-part="card" data-card="auth" aria-labelledby="login-h">
    <div data-slot="title">
      <header>
        <h2 id="login-h">로그인</h2>
        <small>계정으로 다시 시작하세요.</small>
      </header>
    </div>
    <div data-slot="body">
      <form>
        {oauthRow()}
        {divider('또는 이메일로')}
        {field('basic', '이메일', 'jane@example.com')}
        {field('basic', '비밀번호', '••••••••')}
        <div data-part="row-split">
          <label><input type="checkbox" defaultChecked /> 로그인 유지</label>
          <a href="#">비밀번호 찾기</a>
        </div>
        <button type="submit" data-variant="primary">로그인</button>
      </form>
    </div>
    <div data-slot="footer">
      <small>처음 오셨나요? <a href="#">계정 만들기</a></small>
    </div>
  </article>
)

const signupCard = (): ReactNode => (
  <article data-part="card" data-card="auth" aria-labelledby="signup-h">
    <div data-slot="title">
      <header>
        <h2 id="signup-h">계정 만들기</h2>
        <small>30초면 끝납니다.</small>
      </header>
    </div>
    <div data-slot="body">
      <form>
        {field('basic', '이름', 'Jane Doe')}
        {field('basic', '이메일', 'jane@example.com')}
        {field('help', '비밀번호', '8자 이상', '대소문자·숫자·특수문자 조합 권장')}
        <label><input type="checkbox" /> <small><a href="#">이용약관</a> 과 <a href="#">개인정보 처리방침</a> 에 동의합니다.</small></label>
        <button type="submit" data-variant="primary">가입하기</button>
      </form>
    </div>
    <div data-slot="footer">
      <small>이미 계정이 있나요? <a href="#">로그인</a></small>
    </div>
  </article>
)

const resetCard = (): ReactNode => (
  <article data-part="card" data-card="auth" aria-labelledby="reset-h">
    <div data-slot="title">
      <header>
        <h2 id="reset-h">비밀번호 재설정</h2>
        <small>가입한 이메일로 재설정 링크를 보내드립니다.</small>
      </header>
    </div>
    <div data-slot="body">
      <form>
        {field('required', '이메일', 'jane@example.com')}
        <button type="submit" data-variant="primary">재설정 링크 받기</button>
      </form>
    </div>
    <div data-slot="footer"><small><a href="#">← 로그인으로 돌아가기</a></small></div>
  </article>
)

const otpCard = (): ReactNode => (
  <article data-part="card" data-card="auth" aria-labelledby="otp-h">
    <div data-slot="title">
      <header>
        <h2 id="otp-h">2단계 인증</h2>
        <small>jane@example.com 으로 보낸 6자리 코드를 입력하세요.</small>
      </header>
    </div>
    <div data-slot="body">
      <form>
        <div role="group" aria-label="OTP 6자리" data-part="otp-row">
          {[0,1,2,3,4,5].map((i) => (
            <input key={i} type="text" inputMode="numeric" maxLength={1} aria-label={`자리 ${i+1}`} />
          ))}
        </div>
        <button type="submit" data-variant="primary">확인</button>
        <small>코드를 못 받으셨나요? <a href="#">다시 보내기</a> (45초)</small>
      </form>
    </div>
  </article>
)

// ──────────────────────────────────────────────────────────────────────
// 보편 콘텐츠 카드 — Article / Profile / Pricing / Team
// ──────────────────────────────────────────────────────────────────────

const articleCard = (): ReactNode => (
  <article data-part="card" data-card="article">
    <div data-slot="preview">
      <img src="https://picsum.photos/seed/article/640/360" alt="" loading="lazy" />
    </div>
    <div data-slot="meta"><Chip label="디자인" /><small> · 5분 읽기</small></div>
    <div data-slot="title"><h3>recursive Proximity — 위계가 곧 spacing 이다</h3></div>
    <div data-slot="body"><p>Gestalt 의 가장 단순한 표현. atom→cluster→section→surface→shell 5단이 어떻게 한 화면 안에서 작동하는지.</p></div>
    <div data-slot="footer">
      <Avatar alt="유용태" initial="유" />
      <small>유용태 · <time dateTime="2026-04-26">4월 26일</time></small>
    </div>
  </article>
)

const profileCard = (): ReactNode => (
  <article data-part="card" data-card="profile">
    <div data-slot="preview">
      <img src="https://i.pravatar.cc/240?u=jane" alt="" />
    </div>
    <div data-slot="title">
      <h3>Jane Doe</h3>
      <small>Senior Product Designer · Seoul</small>
    </div>
    <div data-slot="body"><p>디자인 시스템과 접근성을 다룹니다. 최근에는 OKLCH 색 공간과 recursive proximity 에 빠져 있습니다.</p></div>
    <div data-slot="meta">
      <Chip label="design-systems" /> <Chip label="a11y" /> <Chip label="frontend" />
    </div>
    <div data-slot="footer">
      <button type="button" data-variant="primary">팔로우</button>
      <button type="button">메시지</button>
    </div>
  </article>
)

const pricingCard = (tier: 'free' | 'pro' | 'team', highlighted?: boolean): ReactNode => {
  const data = {
    free: { name: 'Free',  price: '₩0',       per: '영구 무료', cta: '시작하기',
            features: ['프로젝트 3개', '월 1,000 요청', '커뮤니티 지원'] },
    pro:  { name: 'Pro',   price: '₩19,000',  per: '/월',      cta: 'Pro 시작',
            features: ['프로젝트 무제한', '월 50,000 요청', '이메일 지원', '버전 히스토리 30일'] },
    team: { name: 'Team',  price: '₩49,000',  per: '/사용자/월', cta: '팀 만들기',
            features: ['Pro 의 모든 것', '월 무제한 요청', 'SSO·SCIM', '전용 매니저', 'SLA 99.9%'] },
  }[tier]
  return (
    <article data-part="card" data-card="pricing" aria-current={highlighted ? 'true' : undefined}>
      <div data-slot="title">
        <header>
          <h3>{data.name}</h3>
          {highlighted && <Badge variant="success" label="추천" />}
        </header>
      </div>
      <div data-slot="meta">
        <strong>{data.price}</strong> <small>{data.per}</small>
      </div>
      <div data-slot="checks">
        <ul>{data.features.map((f) => <li key={f}><span data-icon="check" aria-hidden />{f}</li>)}</ul>
      </div>
      <div data-slot="footer">
        <button type="button" data-variant={highlighted ? 'primary' : undefined}>{data.cta}</button>
      </div>
    </article>
  )
}

const settingsPanel = (): ReactNode => (
  <article data-part="card" data-card="settings" aria-labelledby="settings-h">
    <div data-slot="title">
      <header>
        <h2 id="settings-h">계정 설정</h2>
        <small>프로필과 알림 설정을 관리합니다.</small>
      </header>
    </div>
    <div data-slot="body">
      <form>
        <fieldset>
          <legend>프로필</legend>
          {field('basic', '이름', 'Jane Doe')}
          {field('help', '핸들', '@jane', '소문자·숫자·하이픈 3-20자')}
        </fieldset>
        <fieldset>
          <legend>알림</legend>
          <label><input type="checkbox" defaultChecked /> 이메일 알림 받기</label>
          <label><input type="checkbox" defaultChecked /> 답글 알림</label>
          <label><input type="checkbox" /> 마케팅 이메일</label>
        </fieldset>
      </form>
    </div>
    <div data-slot="footer">
      <button type="button">취소</button>
      <button type="button" data-variant="primary">저장</button>
    </div>
  </article>
)

const confirmDialog = (tone: 'default' | 'danger'): ReactNode => (
  <article data-part="card" data-card="confirm" data-variant={tone === 'danger' ? 'alert' : undefined} role="alertdialog" aria-labelledby="confirm-h" aria-describedby="confirm-d">
    <div data-slot="title"><h3 id="confirm-h">{tone === 'danger' ? '계정을 삭제하시겠어요?' : '저장하시겠어요?'}</h3></div>
    <div data-slot="body"><p id="confirm-d">{tone === 'danger' ? '이 작업은 되돌릴 수 없습니다. 모든 데이터가 즉시 삭제됩니다.' : '변경 사항을 저장합니다. 다른 사용자에게 즉시 반영됩니다.'}</p></div>
    <div data-slot="footer">
      <button type="button">취소</button>
      <button type="button" data-variant={tone === 'danger' ? 'danger' : 'primary'}>{tone === 'danger' ? '영구 삭제' : '저장'}</button>
    </div>
  </article>
)

// ──────────────────────────────────────────────────────────────────────
// Pattern-level states
// ──────────────────────────────────────────────────────────────────────

const stateRow = (state: 'empty' | 'loading' | 'error' | 'partial' | 'done'): ReactNode => {
  switch (state) {
    case 'empty':   return <EmptyState title="받은 편지함이 비었습니다" description="새 메일이 도착하면 여기에 표시됩니다." />
    // eslint-disable-next-line no-restricted-syntax -- loading status (showcase)
    case 'loading': return (<div role="status" aria-label="로딩 중"><Skeleton width="100%" height={48} /><Skeleton width="100%" height={48} /><Skeleton width="100%" height={48} /></div>)
    case 'error':   return <Callout variant="danger">서버 응답 없음. 잠시 후 다시 시도하세요.</Callout>
    case 'partial': return (<div>{inboxRow('unread', '김지민', '회의 자료', 'PR 검토 부탁드립니다', '14:32')}{inboxRow('read', '박서연', '점심', '점심 같이 드실래요?', '12:18')}<Skeleton width="100%" height={48} /></div>)
    case 'done':    return <KeyValue items={[{ key: '총', value: '128개' }, { key: '읽지 않음', value: '12개' }, { key: '별표', value: '4개' }]} />
  }
}

// ──────────────────────────────────────────────────────────────────────
// Frame — Figma 의 frame. 라벨 chip 위 + bordered surface 안에 컨텐츠.
//   stage="chat"=360 / "feed"=600 / "list"=720 / "form"=420 / "grid"=240 / "card"=320
// 캔버스 위에 family 별로 flex-wrap 가로 배치 (layout.ts CSS).
// ──────────────────────────────────────────────────────────────────────

type Stage = 'chat' | 'feed' | 'list' | 'form' | 'grid' | 'card' | 'reading' | 'panel'

const Frame = ({ label, stage, children }: { label: string; stage: Stage; children: ReactNode }) => (
  <figure aria-label={label} data-part="frame">
    <figcaption data-part="frame-label">{label}</figcaption>
    <div data-stage={stage}>{children}</div>
  </figure>
)

const Family = ({ title, children }: { title: string; children: ReactNode }) => (
  <section data-part="canvas-family">
    <h2>{title}</h2>
    <div data-part="frames">{children}</div>
  </section>
)

// ──────────────────────────────────────────────────────────────────────
// Page builder
// ──────────────────────────────────────────────────────────────────────

function buildPage(): NormalizedData {
  const cardVariants: ReactNode = (<>
    <Frame label="post / 일반"   stage="feed">{postCardVariant(false, '유용태', '2분 전', 'recursive Proximity 가 잘 보이는 화면을 만들었다. shell·surface·section·atom 4단을 한 카드 안에서 다 시연 가능. PR #482 에 올렸으니 리뷰 부탁드려요.', 'https://i.pravatar.cc/64?u=teo')}</Frame>
    <Frame label="post / 연속"   stage="feed">{postCardVariant(true, '', '', '같은 사람의 두 번째 메시지 — avatar 와 header 시각 숨김 (Slack 패턴). Gestalt similarity 가 두 행을 한 묶음으로 묶음.', '')}</Frame>
    <Frame label="message / other" stage="chat">{messageBubble('other', 'Alex', '오늘 PR 머지 부탁드려요. CI 그린 + 리뷰 2개 받았습니다.', '오전 9:14')}</Frame>
    <Frame label="message / me"    stage="chat">{messageBubble('me', 'me', '확인하고 오후 2시쯤 머지할게요. 그 전에 staging 한 번 돌려보고요.', '오전 9:18')}</Frame>
    <Frame label="stat / 기본"    stage="grid">{statCardVariant('월간 활성 사용자', '12,438', '+8.2% vs 전월')}</Frame>
    <Frame label="stat / alert"   stage="grid">{statCardVariant('에러율', '3.4%', '+2.1% vs 전월', 'alert')}</Frame>
    <Frame label="product"        stage="grid">{productCardVariant('Mechanical Keyboard', '₩189,000', 'https://picsum.photos/seed/kbd/240/180', '신상')}</Frame>
    <Frame label="course"         stage="card">{courseCardVariant('TypeScript 심화 — 타입 추론과 generics', 'Sora Park', '중급', 240)}</Frame>
  </>)

  const inboxVariants: ReactNode = (<>
    <Frame label="unread"     stage="list">{inboxRow('unread', '김지민', '회의 자료 검토', 'PR #482 리뷰 부탁드립니다. CI 통과 + 리뷰어 2명 지정 완료.', '14:32')}</Frame>
    <Frame label="read"       stage="list">{inboxRow('read', '박서연', '점심 약속', '오늘 점심 같이 드실래요? 1층 한식당 가려고요.', '12:18')}</Frame>
    <Frame label="starred"    stage="list">{inboxRow('starred', '이준호', '디자인 시안', '새 토큰 ladder 좋네요. atom→shell 5단이 깔끔합니다.', '11:04')}</Frame>
    <Frame label="threaded"   stage="list">{inboxRow('threaded', '최민지', 'RFC: focus-ring', '4명이 답글을 남겼습니다. 합의 도출 중.', '10:55')}</Frame>
    <Frame label="attachment" stage="list">{inboxRow('attachment', '강예나', '월간 리포트', '4월 리포트 첨부드립니다. report-2026-04.pdf (2.1MB)', '09:42')}</Frame>
    <Frame label="system"     stage="list">{inboxRow('system', 'system', '비밀번호 변경 알림', '계정 비밀번호가 변경되었습니다. 본인이 아니면 즉시 신고하세요.', '08:30')}</Frame>
  </>)

  const fieldVariants: ReactNode = (<>
    <Frame label="basic"    stage="form">{field('basic', '이름', 'Jane Doe')}</Frame>
    <Frame label="required" stage="form">{field('required', '이메일', 'jane@example.com', '필수 입력입니다.')}</Frame>
    <Frame label="help"     stage="form">{field('help', '사용자명', 'username', '소문자·숫자·하이픈 3-20자')}</Frame>
    <Frame label="error"    stage="form">{field('error', '이메일', 'jane@example.com')}</Frame>
    <Frame label="success"  stage="form">{field('success', '이메일', 'jane@example.com')}</Frame>
    <Frame label="disabled" stage="form">{field('disabled', '회원 ID', '자동 생성', '가입 시 자동 부여')}</Frame>
  </>)

  const proseVariants: ReactNode = (<>
    <Frame label="hero"    stage="reading">{proseHero()}</Frame>
    <Frame label="table"   stage="reading">{proseTable()}</Frame>
    <Frame label="callout" stage="reading">{proseCallout()}</Frame>
    <Frame label="code"    stage="reading">{proseCode()}</Frame>
  </>)

  const stateVariants: ReactNode = (<>
    <Frame label="empty"          stage="list">{stateRow('empty')}</Frame>
    <Frame label="loading"        stage="list">{stateRow('loading')}</Frame>
    <Frame label="error"          stage="panel">{stateRow('error')}</Frame>
    <Frame label="partial"        stage="list">{stateRow('partial')}</Frame>
    <Frame label="done (KeyValue)" stage="form">{stateRow('done')}</Frame>
  </>)

  const authVariants: ReactNode = (<>
    <Frame label="login"           stage="panel">{loginCard()}</Frame>
    <Frame label="signup"          stage="panel">{signupCard()}</Frame>
    <Frame label="reset password"  stage="panel">{resetCard()}</Frame>
    <Frame label="2FA / OTP"       stage="panel">{otpCard()}</Frame>
  </>)

  const contentCardVariants: ReactNode = (<>
    <Frame label="article preview" stage="card">{articleCard()}</Frame>
    <Frame label="profile"         stage="card">{profileCard()}</Frame>
    <Frame label="pricing / free"  stage="card">{pricingCard('free')}</Frame>
    <Frame label="pricing / pro ★" stage="card">{pricingCard('pro', true)}</Frame>
    <Frame label="pricing / team"  stage="card">{pricingCard('team')}</Frame>
    <Frame label="settings panel"  stage="form">{settingsPanel()}</Frame>
    <Frame label="confirm / 기본"  stage="panel">{confirmDialog('default')}</Frame>
    <Frame label="confirm / danger" stage="panel">{confirmDialog('danger')}</Frame>
  </>)

  // Figma 캔버스 — family 별 frame 들을 한 캔버스 위에 가로 wrap 으로 배치
  const canvas: ReactNode = (
    <div data-part="canvas">
      <Family title="1. Card 변형 (8 patterns)">{cardVariants}</Family>
      <Family title="2. Inbox row (6 states)">{inboxVariants}</Family>
      <Family title="3. Field (6 variants)">{fieldVariants}</Family>
      <Family title="4. Prose / Markdown (4 layouts)">{proseVariants}</Family>
      <Family title="5. Pattern-level states (Carbon 시그니처)">{stateVariants}</Family>
      <Family title="6. 인증 폼 (4 patterns)">{authVariants}</Family>
      <Family title="7. 보편 콘텐츠 카드 (8 patterns)">{contentCardVariants}</Family>
    </div>
  )

  return {
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      // Figma 캔버스는 메인 컨텐츠 폭 제약 풀고 viewport full
      page: { id: 'page', data: { type: 'Main', flow: 'split', label: '복합 조립 갤러리' } },

      hdr: { id: 'hdr', data: { type: 'Header', flow: 'cluster' } },
      hdrTitle: { id: 'hdrTitle', data: { type: 'Text', variant: 'h1', content: '복합 조립 캔버스' } },
      hdrSub: { id: 'hdrSub', data: { type: 'Text', variant: 'small', content: '같은 primitive 가 어떻게 다른 조립으로 변주되는가 — Figma frame 처럼.' } },

      canvasBlock: { id: 'canvasBlock', data: { type: 'Ui', component: 'Block', content: canvas } },
    },
    relationships: {
      [ROOT]: ['page'],
      page: ['hdr', 'canvasBlock'],
      hdr: ['hdrTitle', 'hdrSub'],
    },
  }
}

export function Compositions() {
  const [data] = useState(buildPage)
  return <Renderer page={definePage(data)} />
}



import { font, weight } from './scale'

/**
 * type — 글자 role 시멘틱. role-scoped semantic (slot/size 와 동형).
 *
 * scalar primitive (`font('xl')` · `weight('semibold')`) 를 widget·screen 안에서
 * 단독 호출하지 말 것 — 의미가 빠진 수치 조립이다. 모든 글자 변주는 *역할 라벨*
 * 로 접근한다. 같은 수치(font('xl'))가 여러 role(amount·digit)에 등장해도 의미는
 * 다르다 — 각자 자기 컴포넌트의 결정. 한쪽이 바뀌면 한쪽만 바뀐다.
 *
 * Material 3 `comp.typography.*` · Spectrum `type-*` 패턴.
 *
 * shape 는 React `style` prop 에 그대로 spread 가능한 CSS key. CSS 템플릿 안에서
 * 도 `${type.display.fontSize}` 식으로 분해 사용 가능 — 값은 모두 var(--ds-*)
 * 토큰 문자열이라 preset 스왑 안전.
 */
export const type = {
  /** pricing card 큰 가격 — h1 급 강조. */
  display:   { fontSize: font('2xl'), fontWeight: weight('semibold') },
  /** cart total · 강조 amount inline — semibold xl. */
  amount:    { fontSize: font('xl'),  fontWeight: weight('semibold') },
  /** pricing period suffix (/월) — regular weight 회복. */
  period:    { fontSize: font('sm'),  fontWeight: weight('regular') },
  /** OTP digit input — center align xl. */
  digit:     { fontSize: font('xl'),  textAlign: 'center' as const, inlineSize: 44 },
  /** calendar weekday header — sm center. */
  weekday:   { fontSize: font('sm'),  textAlign: 'center' as const },
  /** calendar today pill text — semibold. */
  todayBold: { fontWeight: weight('semibold') },
  /** 코드 inline / chrome bar — monospace sm. */
  mono:      { fontFamily: 'var(--ds-font-mono)' as const, fontSize: font('sm') },
  /** 1줄 ellipsis truncate — list row text. */
  truncate:  { overflow: 'hidden' as const, textOverflow: 'ellipsis' as const, whiteSpace: 'nowrap' as const },

  // ── 일반 본문 / 라벨 / meta role — widget 에서 가장 자주 호출되는 묶음 ──────
  /** body 본문 (md regular) — 일반 단락. */
  body:           { fontSize: font('md'), fontWeight: weight('regular') },
  /** body 강조 (md semibold) — 본문 안 강조 텍스트. */
  bodyStrong:     { fontSize: font('md'), fontWeight: weight('semibold') },
  /** caption / 보조 (sm regular) — 행 본문보다 한 단 작게. */
  caption:        { fontSize: font('sm'), fontWeight: weight('regular') },
  /** caption 강조 (sm semibold) — chip · key label · 강한 caption. */
  captionStrong:  { fontSize: font('sm'), fontWeight: weight('semibold') },
  /** label (sm medium) — form label · key column · table header. */
  label:          { fontSize: font('sm'), fontWeight: weight('medium') },
  /** micro / meta (xs regular) — timestamp · meta · footnote. */
  micro:          { fontSize: font('xs'), fontWeight: weight('regular') },
  /** micro 강조 (xs semibold) — badge label · count · eyebrow. */
  microStrong:    { fontSize: font('xs'), fontWeight: weight('semibold') },
  /** heading h3 (lg semibold) — 섹션 제목. */
  heading:        { fontSize: font('lg'), fontWeight: weight('semibold') },
  /** heading h2 (xl bold) — 강한 섹션 제목. */
  headingStrong:  { fontSize: font('xl'), fontWeight: weight('bold') },
  /** hero (3xl bold) — page banner / column banner display. */
  hero:           { fontSize: font('3xl'), fontWeight: weight('bold') },
  /** monospace micro (xs mono semibold) — eyebrow · subgroup label · meta. uppercase는 호출처에서 적용. */
  monoMicro:      { fontFamily: 'var(--ds-font-mono)' as const, fontSize: font('xs'), fontWeight: weight('semibold') },
  /** monospace label (sm mono medium) — token call · code label. */
  monoLabel:      { fontFamily: 'var(--ds-font-mono)' as const, fontSize: font('sm'), fontWeight: weight('medium') },
  /** monospace strong (sm mono semibold) — code step · ramp index. */
  monoStrong:     { fontFamily: 'var(--ds-font-mono)' as const, fontSize: font('sm'), fontWeight: weight('semibold') },
} as const

/**
 * typography(role) — type[role] 을 CSS 템플릿으로 emit. widget css`` 안에서 한 줄 호출.
 *
 *   `${typography('caption')}` → `font-size: var(--ds-text-sm); font-weight: var(--ds-weight-regular);`
 *
 * 단일 axis 만 필요하면 `${type.body.fontSize}` 같은 분해 접근 사용.
 * 새 role 이 필요하면 위 type 객체에 등재 — widget 에서 raw scale (`font('xl')`) 직호출 ❌.
 */
export const typography = (role: keyof typeof type) => {
  const t = type[role] as { fontSize?: string; fontWeight?: string; fontFamily?: string }
  const lines: string[] = []
  if (t.fontSize)   lines.push(`font-size: ${t.fontSize};`)
  if (t.fontWeight) lines.push(`font-weight: ${t.fontWeight};`)
  if (t.fontFamily) lines.push(`font-family: ${t.fontFamily};`)
  return lines.join(' ')
}

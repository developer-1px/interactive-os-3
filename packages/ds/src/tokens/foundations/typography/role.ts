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
  mono:      { fontFamily: 'ui-monospace, monospace' as const, fontSize: font('sm') },
  /** 1줄 ellipsis truncate — list row text. */
  truncate:  { overflow: 'hidden' as const, textOverflow: 'ellipsis' as const, whiteSpace: 'nowrap' as const },
} as const

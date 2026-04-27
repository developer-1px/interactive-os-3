/**
 * wireframe-tokens — role-based semantic tokens for wireframe screen widgets.
 *
 * **원칙**: widget inline style 안에서 `var(--ds-*)` ❌, raw 숫자 ❌,
 *         foundations 의 `pad(N)` / `font(s)` / `weight(w)` 단독 호출 ❌.
 *         모든 값은 *의미 라벨* (role) 로 접근. 수치 중복 허용 — 의미가 다르면 다른 토큰.
 *
 * 모든 객체 토큰은 React `style` prop 에 그대로 spread 가능한 CSS key 를 사용.
 */
import { radius, hairlineWidth, accent, onAccent, bg, border } from '@p/ds/tokens/foundations'
import { pad, weight } from '@p/ds/tokens/palette'

// ── 공통 divider — row↔row 사이 hairline ─────────────────────────────────
export const divider = `${hairlineWidth()} solid ${border()}`

// ── meta — opacity 약화 3단 ──────────────────────────────────────────
// 위로 갈수록 약함 (덜 보임). 같은 strength 라도 의미가 다르면 별도 토큰을 만들어 분리.
export const meta = {
  /** 가장 약함 — disabled step label, 비활성 chevron */
  faint:  { opacity: 0.5 },
  /** 표준 meta — timestamp, count, weekday header */
  weak:   { opacity: 0.6 },
  /** 본문 mute — paragraph 디스크립션 */
  medium: { opacity: 0.7 },
}

// ── list row — Chat conv · Notif inbox · Comments · Cart line · Curriculum
export const listRow = {
  paddingBlock: pad(2),
  borderBlockEnd: divider,
}

// ── sticky composer / CTA footer (StickyAction) ─────────────────────────
export const composer = {
  paddingBlock: pad(3),
  borderBlockStart: divider,
  background: bg(),
  inputRadius: radius('pill'),
  inputHeight: 36,
}

// ── tab bar 활성 인디케이터 (PhoneTabBar) ───────────────────────────────
export const tabBar = {
  activeColor: accent(),
}

// ── banner + avatar overlap (Profile hero) ──────────────────────────────
export const banner = {
  height: 120,
  radius: radius('md'),
  /** avatar 가 banner 위로 올라타는 음수 margin */
  avatarOverlap: `calc(${pad(1)} * -6)`,
}

// ── avatar — 큰 사이즈 ────────────────────────────────────────────────
export const avatar = {
  big: 96,
}

// ── pricing card 가격 표기 ────────────────────────────────────────────
export const pricing = {
  buttonFull: '100%' as const,
}

// ── unread / event 인디케이터 dot — 컨텍스트별 함수 ────────────────────
export const dot = {
  /** Notif inbox 좌측 unread 표시 (8x8) */
  unread: (active: boolean) => ({
    inlineSize: 8, blockSize: 8,
    borderRadius: radius('pill'),
    background: active ? accent() : 'transparent' as const,
    flexShrink: 0,
  }),
  /** Calendar event 표시 (4x4) */
  event: (active: boolean) => ({
    inlineSize: 4, blockSize: 4,
    borderRadius: radius('pill'),
    background: active ? accent() : 'transparent' as const,
  }),
}

// ── today pill (Calendar 활성 day) ────────────────────────────────────
export const todayPill = (today: boolean) => ({
  inlineSize: 32, blockSize: 32,
  lineHeight: '32px' as const,
  borderRadius: radius('pill'),
  background: today ? accent() : undefined,
  color: today ? onAccent() : undefined,
  fontWeight: today ? weight('semibold') : undefined,
})

// ── calendar month grid ───────────────────────────────────────────────
export const calendar = {
  cols: 'repeat(7, 1fr)',
  rowGap: pad(2),
  cellGap: pad(0.5),
}

// ── nested comment indent ─────────────────────────────────────────────
export const commentIndent = (level: number) => `calc(${pad(4)} * ${level})`

// ── KPI / stat 2x2 grid (Dashboard) ───────────────────────────────────
export const statGrid2 = {
  cols: 'repeat(2, 1fr)',
}

// ── hero thumbnail skeleton (Learning detail) ─────────────────────────
export const hero = {
  height: 180,
  radius: radius('md'),
}

// ── skeleton box (loading / error states) ─────────────────────────────
export const skeletonBox = {
  big:   { height: 120, radius: radius('md') },
  small: { height: 48 },
}

// ── quantity stepper input (Cart) ─────────────────────────────────────
export const qtyStepper = {
  inlineSize: 48,
  textAlign: 'center' as const,
}

// ── tag composer (Forms compose) ──────────────────────────────────────
export const tagInput = {
  flex: 1,
  minInlineSize: 80,
}

// ── chevron / faint icon (curriculum row, voting down) ────────────────
export const chevron = { opacity: 0.5 }

// ── primary button full-width 슬롯 ────────────────────────────────────
export const fullW = { inlineSize: '100%' as const }

// ── body fill (Phone screen content) ──────────────────────────────────
export const bodyFill = { flex: 1, minBlockSize: 0 }

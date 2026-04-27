/**
 * Semantic tier — 의미 토큰. **widget이 색을 만질 때 사용하는 유일한 인터페이스.**
 *
 * de facto 3-tier (Material 3 / Radix / Primer / Spectrum):
 *   palette (raw neutral-N) → **semantic (이 파일)** → component
 *
 * 원칙:
 *   - 의미로 고른다, 숫자로 고르지 않는다. (`text('mute')` ✅, `neutral(6)` ❌ in widget)
 *   - 페어가 필요한 곳은 fn/pair.ts의 tone/pair/mute/emphasize.
 *   - 단독 색 토큰만 여기.
 */
import { neutral, type Neutral } from '../../palette/color'

// ── Text — 텍스트 색 의미 토큰 ──────────────────────────────────────────
/**
 * text role:
 *   default — 본문 (기본값)
 *   strong  — 제목·강조 본문
 *   subtle  — secondary 텍스트
 *   mute    — caption·meta·placeholder. 단, item-level "약화"는 mute() opacity 사용 권장
 *   inverse — 강조 surface 위 (Canvas)
 *
 * 주의: cell·item에 `text('mute')`를 박는 것보다 `mute()` (opacity)가 surface flip 안전.
 *       text('mute')는 단독 텍스트 라벨처럼 surface 변경 가능성이 없는 곳에만.
 */
/** @demo type=color fn=text args=["default"] */
export const text = (role: 'default' | 'strong' | 'subtle' | 'mute' | 'inverse' = 'default') => {
  switch (role) {
    case 'strong':  return neutral(9)
    case 'default': return neutral(8)
    case 'subtle':  return neutral(7)
    case 'mute':    return neutral(6)
    case 'inverse': return 'Canvas'
  }
}

// ── Surface — 약한 surface 배경 (panel/banner/chip 등) ──────────────────
/**
 * surface(role) — 본 surface 위에 얹는 배경.
 *   'subtle' = 가장 약함 (panel/sidebar 배경)
 *   'muted'  = 중간 (chip·banner 배경)
 *   'raised' = 좀 더 진함 (raised section, hover bg)
 *
 * 페어 필요 시 fn/pair.ts의 pair({ bg, fg }) 사용.
 * @demo type=color fn=surface args=["subtle"]
 */
export const surface = (role: 'subtle' | 'muted' | 'raised' = 'subtle') => {
  const map = { subtle: 1, muted: 2, raised: 3 } as const
  return neutral(map[role] as Neutral)
}

// ── Border — 위계별 경계선 ──────────────────────────────────────────────
/**
 * border(role) — 위계별 경계선. 인자 없으면 default (var(--ds-border)).
 *   'subtle' = hairline (가장 흐림 — compact 행 구분)
 *   'default' = 표 hairline, divider (= 인자 없는 호출과 동일 의미)
 *   'strong'  = 강조 경계
 *   'emphatic' = drop-zone 등 가장 강한 점선
 * @demo type=color fn=border args=["default"]
 */
export const border = (role?: 'subtle' | 'default' | 'strong' | 'emphatic') => {
  if (!role || role === 'default') return `var(--ds-border)`
  const map = { subtle: 1, strong: 3, emphatic: 4 } as const
  return neutral(map[role] as Neutral)
}

// ── 기존 semantic 토큰 (palette.ts에서 이전) ────────────────────────────
/** @demo type=color fn=accent */
export const accent    = () => `var(--ds-accent)`
/** @demo type=color fn=onAccent */
export const onAccent  = () => `var(--ds-accent-on)`

export type StatusTone = 'success' | 'warning' | 'danger'
/** @demo type=color fn=status args=["success"] */
export const status    = (t: StatusTone) => `var(--ds-${t})`

/** @demo type=color fn=muted */
export const muted     = () => `var(--ds-muted)`
/** @demo type=color fn=bg */
export const bg        = () => `var(--ds-bg)`

// ── Scrim — modal/popover 뒤 dim layer ─────────────────────────────────
/**
 * scrim(role) — 오버레이 뒤 dim 배경. CanvasText 알파 tint.
 *   'subtle' = 10% (backdrop-filter blur 와 짝)
 *   'strong' = 30% (불투명한 scrim — popover 단독)
 *
 * 광원이 다른 surface 위에서도 일관되게 어두워진다 (currentColor 기반 X — Canvas 기반).
 * @demo type=color fn=scrim args=["subtle"]
 */
export const scrim = (role: 'subtle' | 'strong' = 'subtle') =>
  role === 'strong'
    ? `color-mix(in oklab, CanvasText 30%, transparent)`
    : `color-mix(in oklab, CanvasText 10%, transparent)`

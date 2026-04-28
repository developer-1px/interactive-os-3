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
/* ── Tier 정렬 ──────────────────────────────────────────────
 * palette (raw)    --ds-neutral-1..9                   ← var(--ds-tone) mix Canvas
 * scalar (named)   --ds-fg / fg-2..5 · --ds-bg{,-elev,-sunken,-hover}
 *                  --ds-line / line-2 / line-strong    ← Atlas/Linear/Vercel 디팩토
 * semantic (fn)    text/surface/border/state           ← scalar 를 role 로 alias
 *
 * widget 컴파일물에 scalar 이름이 살아있다 (var 체인 invariant).
 * scalar 는 base(Canvas/CanvasText) 추종 → light/dark/forced-colors auto.
 * fg-4 = AA 4.5:1 경계 (caption/mute).
 */

// ── Text — fg ladder 의 role alias ──────────────────────────────────────
/**
 * text(role) — Atlas/Linear 5단 fg ladder 의 의미 별칭.
 *   'default' → fg    body (~21:1)
 *   'strong'  → fg    heading
 *   'subtle'  → fg-2  secondary (~12:1)
 *   'mute'    → fg-4  caption·meta·placeholder (~4.5:1 AA)
 *   'disabled'→ fg-5  presentational
 *   'inverse' → Canvas
 *   'link'    → accent
 *   'on-accent' → accent-on
 *   'success'/'warning'/'danger' → status
 *
 * 주의: cell·item 의 "약화"는 mute() opacity 가 surface flip 안전.
 *       text('mute') 는 단독 텍스트 라벨처럼 surface 변경 가능성이 없는 곳에만.
 */
type TextRole =
  | 'strong' | 'default' | 'subtle' | 'mute' | 'disabled' | 'inverse'
  | 'link' | 'on-accent' | 'success' | 'warning' | 'danger'
const TEXT_VAR: Record<TextRole, string> = {
  strong:    'var(--ds-fg)',
  default:   'var(--ds-fg)',
  subtle:    'var(--ds-fg-2)',
  mute:      'var(--ds-fg-4)',
  disabled:  'var(--ds-fg-5)',
  inverse:   'Canvas',
  link:      'var(--ds-accent)',
  'on-accent': 'var(--ds-accent-on)',
  success:   'var(--ds-success)',
  warning:   'var(--ds-warning)',
  danger:    'var(--ds-danger)',
}
/** @demo type=color fn=text args=["default"] */
export const text = (role: TextRole = 'default') => TEXT_VAR[role]

// ── Surface — bg ladder 의 role alias ───────────────────────────────────
/**
 * surface(role) — Atlas 4단 bg ladder.
 *   'default' → bg          card/popover/input
 *   'subtle'  → bg-sunken   page ground
 *   'muted'   → bg-sunken   chip·banner (alias)
 *   'raised'  → bg-elev     popover (alias of bg)
 *   'inverse' → CanvasText
 * 페어가 필요한 곳은 fn/pair.ts 의 pair({ bg, fg }).
 * @demo type=color fn=surface args=["subtle"]
 */
type SurfaceRole = 'default' | 'subtle' | 'muted' | 'raised' | 'inverse'
const SURFACE_VAR: Record<SurfaceRole, string> = {
  default: 'var(--ds-bg)',
  subtle:  'var(--ds-bg-sunken)',
  muted:   'var(--ds-bg-sunken)',
  raised:  'var(--ds-bg-elev)',
  inverse: 'CanvasText',
}
export const surface = (role: SurfaceRole = 'subtle') => SURFACE_VAR[role]

// ── Border — line ladder 의 role alias ──────────────────────────────────
/**
 * border(role) — Atlas 3단 line ladder + focus.
 *   'default'  → line          표 hairline·divider
 *   'subtle'   → line          alias (Atlas 는 동일)
 *   'strong'   → line-2        강조
 *   'emphatic' → line-strong   가장 강한
 *   'focus'    → accent
 * @demo type=color fn=border args=["default"]
 */
type BorderRole = 'subtle' | 'default' | 'strong' | 'emphatic' | 'focus'
const BORDER_VAR: Record<BorderRole, string> = {
  subtle:   'var(--ds-line)',
  default:  'var(--ds-line)',
  strong:   'var(--ds-line-2)',
  emphatic: 'var(--ds-line-strong)',
  focus:    'var(--ds-accent)',
}
export const border = (role: BorderRole = 'default') => BORDER_VAR[role]

// ── 기존 semantic 토큰 (palette.ts에서 이전) ────────────────────────────
/** @demo type=color fn=accent */
export const accent    = () => `var(--ds-accent)`

/**
 * accentTint(role) — accent surface/border 변형. 같은 accent 색의 강도 role.
 *   'softest' = 6%   — hover/selected 행 배경 (가장 약한 accent surface)
 *   'soft'    = 12%  — 활성 상태 surface
 *   'medium'  = 18%  — 강한 활성 surface
 *   'border'  = 40%  — accent 톤 경계선
 *   'glow'    = 60%  — focus ring 외곽
 *   'strong'  = 85%  — accent surface 강조 (text inverse 배경)
 * @demo type=color fn=accentTint args=["soft"]
 */
export const accentTint = (role: 'softest' | 'soft' | 'medium' | 'border' | 'glow' | 'strong') => {
  const map = { softest: 6, soft: 12, medium: 18, border: 40, glow: 60, strong: 85 } as const
  return `color-mix(in oklab, var(--ds-accent) ${map[role]}%, transparent)`
}

/**
 * statusTint(tone, role) — status 색의 강도 변형. accentTint 와 같은 role 어휘.
 * @demo type=color fn=statusTint args=["danger","border"]
 */
export const statusTint = (tone: StatusTone, role: 'soft' | 'border' | 'medium') => {
  const map = { soft: 12, border: 40, medium: 70 } as const
  return `color-mix(in oklab, var(--ds-${tone}) ${map[role]}%, transparent)`
}

/**
 * surfaceTint(role) — Canvas/CanvasText 기반 알파 surface. neutral palette flip 안전.
 *   'glass'  = 4%   — 가장 약한 overlay (chip 배경)
 *   'overlay' = 8%  — 약한 overlay (hover row)
 *   'highlight' = 30% — 반사 하이라이트 (inset shadow)
 * @demo type=color fn=surfaceTint args=["overlay"]
 */
export const surfaceTint = (role: 'glass' | 'overlay' | 'highlight') => {
  const map = { glass: 4, overlay: 8, highlight: 30 } as const
  const base = role === 'highlight' ? 'Canvas' : 'CanvasText'
  return `color-mix(in oklab, ${base} ${map[role]}%, transparent)`
}

/**
 * currentTint(role) — currentColor 기반 알파 surface/shadow. surface flip 안전.
 * dim() 의 role-based 래퍼. 호버 배경·shadow alpha·gradient stop 용도.
 *   'subtle' = 3%   — 가장 약한 hover bg
 *   'soft'   = 6%   — shadow alpha · 표준 hover
 *   'medium' = 10%  — active bg · 진한 shadow
 *   'strong' = 55%  — gradient mid stop
 *   'deep'   = 80%  — gradient end stop · 거의 full color
 * @demo type=color fn=currentTint args=["soft"]
 */
export const currentTint = (role: 'subtle' | 'soft' | 'medium' | 'strong' | 'deep') => {
  const map = { subtle: 3, soft: 6, medium: 10, strong: 55, deep: 80 } as const
  return `color-mix(in oklab, currentColor ${map[role]}%, transparent)`
}

/**
 * gradientDeep(color) — 그라데이션 딥 스탑. 주어진 색을 CanvasText 로 70% 섞어 어둡게.
 * `linear-gradient(deg, color, gradientDeep(color))` 패턴 전용.
 * @demo type=color fn=gradientDeep args=["var(--ds-accent)"]
 */
export const gradientDeep = (color: string) =>
  `color-mix(in oklab, ${color} 70%, CanvasText)`
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

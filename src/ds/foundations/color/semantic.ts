/**
 * Semantic tier — 의미 토큰. **widget이 색을 만질 때 사용하는 유일한 인터페이스.**
 *
 * de facto 3-tier (Material 3 / Radix / Primer / Spectrum):
 *   palette (raw gray-N) → **semantic (이 파일)** → component
 *
 * 원칙:
 *   - 의미로 고른다, 숫자로 고르지 않는다. (`text('mute')` ✅, `gray(6)` ❌ in widget)
 *   - 페어가 필요한 곳은 fn/pair.ts의 tone/pair/mute/emphasize.
 *   - 단독 색 토큰만 여기.
 */
import { gray, type Gray } from '../../palette/color'

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
    case 'strong':  return gray(9)
    case 'default': return gray(8)
    case 'subtle':  return gray(7)
    case 'mute':    return gray(6)
    case 'inverse': return 'Canvas'
  }
}

// ── Surface — 약한 surface 배경 (panel/banner/chip 등) ──────────────────
/**
 * surfaceMuted level — 본 surface 위에 얹는 약한 background.
 *   1 = 가장 약함 (panel/sidebar 배경)
 *   2 = 중간 (chip·banner 배경)
 *   3 = 좀 더 진함 (raised section, hover bg)
 *
 * 페어 필요 시 fn/pair.ts의 pair({ bg, fg }) 사용.
 */
/** @demo type=color fn=surfaceMuted args=[1] */
export const surfaceMuted = (level: 1 | 2 | 3 = 1) => gray(level as Gray)

// ── Border — 위계별 경계선 ──────────────────────────────────────────────
/**
 * borderLevel:
 *   1 = hairline (가장 흐림 — compact 행 구분)
 *   2 = default (표 hairline, divider)
 *   3 = emphasis (강조 경계)
 *   4 = dashed-drop (drop zone 점선)
 */
/** @demo type=color fn=borderLevel args=[2] */
export const borderLevel = (level: 1 | 2 | 3 | 4 = 2) => gray(level as Gray)

// ── 기존 semantic 토큰 (palette.ts에서 이전) ────────────────────────────
/** @demo type=color fn=accent */
export const accent    = () => `var(--ds-accent)`
/** @demo type=color fn=onAccent */
export const onAccent  = () => `var(--ds-accent-on)`

export type StatusTone = 'success' | 'warning' | 'danger'
/** @demo type=color fn=status args=["success"] */
export const status    = (t: StatusTone) => `var(--ds-${t})`

/** @demo type=color fn=border */
export const border    = () => `var(--ds-border)`
/** @demo type=color fn=muted */
export const muted     = () => `var(--ds-muted)`
/** @demo type=color fn=bg */
export const bg        = () => `var(--ds-bg)`

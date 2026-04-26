import type { Proximity } from './proximity'

/**
 * Gestalt 분리 강도 점수화 — Hierarchy Monotonicity Invariant (HMI) 기반.
 *
 * # 불변식
 *   ∀ (A, B) where A ∈ descendants_of_some_sibling_of(B):
 *     sep(siblings_of(A)) ≤ sep(siblings_of(B))
 *
 *   "자손 그룹의 분리 강도는 조상 그룹의 분리 강도를 절대 넘지 않는다."
 *
 * # 점수 단위
 *   1 점 = 1em 시각 호흡과 동등. 채널별 가중치는 em-equivalent 로 캘리브레이션.
 *   라틴 본문 기준이며 한국어처럼 word boundary 가 약한 스크립트는 ε 보정이 필요할 수
 *   있다 (현재는 미적용).
 *
 * # 사용
 *   - 작성자: "이 boundary 는 1.5 점이어야 해" 로 사고 → proximity('group') 선택
 *   - 검증기: scripts/audit-hmi.mjs 가 selector depth 별 점수 누적 후 monotonic 검증
 */

// ── proximity tier → 점수 (gap 채널 단독) ──────────────────────────────
const PROXIMITY_SCORE: Record<Proximity, number> = {
  bonded: 0.25,
  related: 0.5,
  sibling: 1.0,
  group: 1.5,
  section: 2.0,
  major: 3.0,
  page: 4.0,
}

/**
 * proximity 토큰의 단일 점수.
 * @demo type=value fn=proximityScore args=["section"]
 */
export const proximityScore = (rel: Proximity): number => PROXIMITY_SCORE[rel]

// ── 채널별 가중치 (em-equivalent) ──────────────────────────────────────
/**
 * border / hr 두께 → 점수.
 * 1px ≈ 0.3, 2px ≈ 0.5, 4px ≈ 0.8 em-equivalent.
 */
export const borderScore = (px: number): number => {
  if (px <= 0) return 0
  if (px <= 1) return 0.3
  if (px <= 2) return 0.5
  if (px <= 3) return 0.65
  return Math.min(1.0, 0.65 + (px - 3) * 0.1)
}

/** surface(bg) 변화 강도. 0 = 없음, 0.5 = 같은 톤 미세 단계, 1.0 = 별 톤. */
export const surfaceJumpScore = (jump: 0 | 0.5 | 1): number => jump

/** font-size step. ratio = child/parent. 1.0 = 변화 없음. log₂(ratio) × 0.5. */
export const sizeStepScore = (ratio: number): number => {
  if (ratio <= 0 || ratio === 1) return 0
  return Math.abs(Math.log2(ratio)) * 0.5
}

/** font-weight 단계 차. (childWeight - parentWeight) / 300. 음수 양수 무관 절대값. */
export const weightStepScore = (parentW: number, childW: number): number =>
  Math.abs(childW - parentW) / 300 * 0.3

// ── 합산 ───────────────────────────────────────────────────────────────
export interface SepChannels {
  /** 마진 (em). 양쪽 마진 collapse 후의 실효 gap. */
  gap?: number
  /** border 두께 (px). border-block 또는 hr. */
  border?: number
  /** surface 변화 강도. 0 / 0.5 / 1. */
  surfaceJump?: 0 | 0.5 | 1
  /** font-size ratio. 1 = 변화 없음. */
  sizeRatio?: number
  /** weight pair. */
  weights?: { parent: number; child: number }
}

/**
 * 한 boundary 의 분리 강도 점수.
 * 모든 채널은 가산. 채널이 없으면 0 기여.
 *
 * @demo type=value fn=sepScore args=[{"gap":1,"border":1}]
 */
export const sepScore = (ch: SepChannels): number => {
  let s = 0
  if (ch.gap) s += ch.gap
  if (ch.border) s += borderScore(ch.border)
  if (ch.surfaceJump) s += surfaceJumpScore(ch.surfaceJump)
  if (ch.sizeRatio) s += sizeStepScore(ch.sizeRatio)
  if (ch.weights) s += weightStepScore(ch.weights.parent, ch.weights.child)
  return s
}

// ── HMI 검증 헬퍼 ──────────────────────────────────────────────────────
/**
 * 두 boundary 점수가 단조성을 만족하는지.
 * inner ≤ outer 여야 한다 (자손이 조상보다 셀 수 없음).
 */
export const monotonic = (outer: number, inner: number): boolean =>
  inner <= outer + 1e-9

/** HMI 위반 정도. 0 이하 = OK, 양수 = 위반(점수 차이). */
export const hmiViolation = (outer: number, inner: number): number =>
  Math.max(0, inner - outer)

import { css } from './values'

/**
 * Tone pair — bg/fg를 쌍으로 묶어 contrast를 preset 정의 시점에 결정한다.
 *
 * 원칙:
 *   - 채도 있는 surface(accent/status 류) 위에는 `--ds-<name>-on` 이 짝궁 전경.
 *   - 소비자는 이 함수로 bg+fg를 한 번에 적용 → 한쪽만 쓰고 다른 쪽을 빼먹는 누락이
 *     구조적으로 불가능해진다. contrast CI 대신 "쌍을 강제하는 primitive".
 *
 * 사용:
 *   css`
 *     [aria-roledescription="chip"] {
 *       ${tone('accent')}  // background-color + color를 쌍으로 주입
 *     }
 *   `
 */
export type Tone = 'accent' | 'success' | 'warning' | 'danger'

export const tone = (name: Tone) => css`
  background-color: var(--ds-${name});
  color: var(--ds-${name}-on);
`

/** tinted 버전 — bg는 alpha 낮은 tint, fg는 진한 색 자신을 쓴다.
 *  "strong"이 아닌 톤 칩/배지용. contrast는 preset 색의 채도가 보장. */
export const toneTint = (name: Tone, pct: number = 12) => css`
  background-color: color-mix(in oklab, var(--ds-${name}) ${pct}%, transparent);
  color: var(--ds-${name});
`

/** on-* 색 접근자 — Tone별 전경. 드물게 단독으로 필요할 때. */
export const on = (name: Tone) => `var(--ds-${name}-on)`

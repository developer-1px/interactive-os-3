import { css } from '../primitives/css'

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
 *     [data-part="tag"] {
 *       ${tone('accent')}  // background-color + color를 쌍으로 주입
 *     }
 *   `
 */
export type Tone = 'accent' | 'success' | 'warning' | 'danger'

/** @demo type=pair fn=tone args=["accent"] */
export const tone = (name: Tone) => css`
  background-color: var(--ds-${name});
  color: var(--ds-${name}-on);
`

/**
 * tinted 버전 — bg는 alpha 낮은 tint, fg는 진한 색 자신을 쓴다.
 * "strong"이 아닌 톤 칩/배지용. contrast는 preset 색의 채도가 보장.
 * @demo type=pair fn=toneTint args=["accent",16]
 */
export const toneTint = (name: Tone, pct: number = 12) => css`
  background-color: color-mix(in oklab, var(--ds-${name}) ${pct}%, transparent);
  color: var(--ds-${name});
`

/**
 * on-* 색 접근자 — Tone별 전경. 드물게 단독으로 필요할 때.
 * @demo type=color fn=on args=["accent"]
 */
export const on = (name: Tone) => `var(--ds-${name}-on)`

/**
 * pair — 임의 bg/fg 페어 주입. tone()이 커버 못하는 surface(row hover/header/banner 등)를
 * 위한 일반화. 한쪽만 쓰는 것을 구조적으로 막기 위해 두 인자가 모두 필수.
 *
 * 사용:
 *   css`
 *     [role="row"][aria-selected="true"] {
 *       ${pair({ bg: accent(), fg: on('accent') })}
 *     }
 *   `
 *
 * 원칙:
 *   - bg를 만지는 곳 = fg를 만지는 곳. 누락 시 surface flip이 자식의 색과 충돌한다.
 *   - 자식(cell/item)은 색을 가지지 않는다 — color: inherit 또는 mute()/emphasize().
 */
/** @demo type=recipe fn=pair */
export const pair = ({ bg, fg }: { bg: string; fg: string }) => css`
  background-color: ${bg};
  color: ${fg};
`

/**
 * mute — item을 약화한다. *색이 아니라* opacity로. surface가 어떤 색이어도 자동 따라옴.
 *
 * 왜 색이 아닌가: cell/item에 `color: gray-N`을 박으면 surface(부모)가 background를
 * 뒤집는 순간 대비가 깨진다. opacity는 currentColor에 알파를 곱하므로 surface 무관.
 *
 * 레벨:
 *   1 = .80 (약한 약화 — secondary text 본문 톤다운)
 *   2 = .65 (표준 약화 — caption/meta 라인 — 기본값)
 *   3 = .50 (강한 약화 — placeholder/disabled-ish)
 *
 * 사용:
 *   css`
 *     [role="gridcell"][data-col="time"]    { ${mute(2)} }
 *     [role="gridcell"][data-col="preview"] { ${mute(2)} }
 *   `
 */
/** @demo type=recipe fn=mute args=[2] */
export const mute = (level: 1 | 2 | 3 = 2) => {
  const op = level === 1 ? '.80' : level === 2 ? '.65' : '.50'
  return css`opacity: ${op};`
}

/**
 * emphasize — item을 강조한다. *색이 아니라* font-weight로. surface 무관.
 *
 * 레벨:
 *   1 = 600 (medium 강조)
 *   2 = 700 (강한 강조 — unread, active label 등 — 기본값)
 *
 * 사용:
 *   css`
 *     [role="row"][data-unread="true"] [role="gridcell"][data-col="from"] {
 *       ${emphasize()}
 *     }
 *   `
 */
/** @demo type=recipe fn=emphasize args=[2] */
export const emphasize = (level: 1 | 2 = 2) => {
  const w = level === 1 ? '600' : '700'
  return css`font-weight: ${w};`
}

/** @demo type=value fn=pad args=[2] */
export const pad = (t: number) => `calc(var(--ds-space) * ${t})`

/**
 * --ds-control-h 공식(space*2 수직)을 만족하는 패딩. 수평만 노출.
 * @demo type=value fn=rowPadding args=[2]
 */
export const rowPadding = (h: number) => `${pad(1)} ${pad(h)}`

/**
 * Tree level depth — context 변수, calc 안에서만 사용.
 * @demo type=value fn=level
 */
export const level = () => `var(--ds-level, 0)`

/**
 * em-based vertical rhythm raw scale — body 폰트 크기 비례 (raw, no semantic).
 *
 * Gestalt proximity 7단계와 1:1 대응 인덱스. 의미 부여는 foundations/proximity()가 한다.
 *
 *   0 → 0.25em   (bonded)
 *   1 → 0.5em    (related)
 *   2 → 1em      (sibling)
 *   3 → 1.5em    (group)
 *   4 → 2em      (section)
 *   5 → 3em      (major)
 *   6 → 4em      (page)
 *
 * @demo type=value fn=emStep args=[3]
 */
export const emStep = (n: 0 | 1 | 2 | 3 | 4 | 5 | 6) => {
  const scale = ['0.25em', '0.5em', '1em', '1.5em', '2em', '3em', '4em'] as const
  return scale[n]
}

/**
 * em-based inset raw scale — 컴포넌트 *내부* padding (proximity와 분리).
 *
 *   0 → 0.2em (xs)
 *   1 → 0.4em (sm)
 *   2 → 0.6em (md)
 *   3 → 1em   (lg)
 *
 * @demo type=value fn=insetStep args=[1]
 */
export const insetStep = (n: 0 | 1 | 2 | 3) => {
  const scale = ['0.2em', '0.4em', '0.6em', '1em'] as const
  return scale[n]
}

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

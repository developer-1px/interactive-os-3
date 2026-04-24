export const css = (s: TemplateStringsArray, ...v: unknown[]) =>
  String.raw({ raw: s }, ...v)

export const pad = (t: number) => `calc(var(--ds-space) * ${t})`

/** --ds-control-h 공식(space*2 수직)을 만족하는 패딩. 수평만 노출. */
export const rowPadding = (h: number) => `${pad(1)} ${pad(h)}`

export const radius = (s: 'sm' | 'md' | 'lg' | 'pill') => `var(--ds-radius-${s})`

/** preset.elevation[d] 소비. ring은 --ds-elev-* 내부에 spread shadow로 포함.
 *  d=0: 완전 투명, d=1: ring only(hairline), d=2: ring+sharp+soft, d=3: 더 깊음. */
export const surface = (d: 0 | 1 | 2 | 3) => css`
  background-color: var(--ds-bg);
  border: 0;
  box-shadow: var(--ds-elev-${d});
`

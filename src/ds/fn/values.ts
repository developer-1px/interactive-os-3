export const css = (s: TemplateStringsArray, ...v: unknown[]) =>
  String.raw({ raw: s }, ...v)

export const pad = (t: number) => `calc(var(--ds-space) * ${t})`

/** --ds-control-h 공식(space*2 수직)을 만족하는 패딩. 수평만 노출. */
export const rowPadding = (h: number) => `${pad(1)} ${pad(h)}`

export const radius = (s: 'sm' | 'md' | 'lg' | 'pill') =>
  ({ sm: '4px', md: '6px', lg: '10px', pill: '999px' })[s]

export const surface = (d: 0 | 1 | 2) => css`
  background-color: var(--ds-bg);
  border: 1px solid ${d === 0 ? 'transparent' : 'var(--ds-border)'};
  ${d >= 2 ? 'box-shadow: var(--ds-shadow);' : ''}
`

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

// ── Typography scalar tokens ────────────────────────────────────────────
/** font-size scale — preset.text. */
export const font = (s: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl') =>
  `var(--ds-text-${s})`

/** letter-spacing — preset.leading.tracking */
export const tracking = () => `var(--ds-tracking)`

// ── Motion scalar tokens ────────────────────────────────────────────────
/** duration token — preset의 모션 시간. transition·animation에 사용. */
export const dur  = (d: 'fast' | 'base') => `var(--ds-dur-${d})`
/** easing token — preset의 모션 곡선. */
export const ease = (e: 'out' | 'spring') => `var(--ds-ease-${e})`

// ── Control scalar tokens ───────────────────────────────────────────────
/** control 스칼라 — h: block-size, border/borderHover/channel: border 색. */
export const control = (k: 'h' | 'border' | 'borderHover' | 'channel') => {
  switch (k) {
    case 'h':           return `var(--ds-control-h)`
    case 'border':      return `var(--ds-control-border)`
    case 'borderHover': return `var(--ds-control-border-hover)`
    case 'channel':     return `var(--ds-control-channel)`
  }
}

// ── Misc scalar tokens ──────────────────────────────────────────────────
/** elevation shadow scalar — d=0..3. surface()는 background+border까지 박는 풀 사양. */
export const elev = (d: 0 | 1 | 2 | 3) => `var(--ds-elev-${d})`

/** preset.shadow 호환 alias — 과거 단일 shadow 토큰 소비처용. */
export const shadow = () => `var(--ds-shadow)`

/** hairline thickness scalar — structural.ts의 hairline(sel)과 별개로 두께 값만 필요할 때. */
export const hairlineWidth = () => `var(--ds-hairline)`

/** space unit — pad(t)는 calc(space * t). 단위 자체가 필요할 때만. */
export const space = () => `var(--ds-space)`

/** Tree level depth — context 변수, calc 안에서만 사용. */
export const level = () => `var(--ds-level, 0)`

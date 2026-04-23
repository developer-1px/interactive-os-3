export const css = (s: TemplateStringsArray, ...v: unknown[]) =>
  String.raw({ raw: s }, ...v)

export const pad = (t: number) => `calc(var(--ds-space) * ${t})`

/** --ds-control-h 공식(space*2 수직)을 만족하는 패딩. 수평만 노출. */
export const rowPadding = (h: number) => `${pad(1)} ${pad(h)}`

export const radius = (s: 'sm' | 'md' | 'lg' | 'pill') =>
  ({ sm: '4px', md: '6px', lg: '10px', pill: '999px' })[s]

// Inline SVG → mask url. currentColor로 칠해지도록 alpha 마스크 방식.
const svgUrl = (svg: string) =>
  `url("data:image/svg+xml;utf8,${encodeURIComponent(svg.replace(/\s+/g, ' ').trim())}")`

export const icon = (svg: string, size: string = '1em') => css`
  content: '';
  display: inline-block;
  width: ${size};
  height: ${size};
  flex: none;
  background-color: currentColor;
  mask: ${svgUrl(svg)} center / contain no-repeat;
  -webkit-mask: ${svgUrl(svg)} center / contain no-repeat;
`

const S = (d: string, opts = '') =>
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' ${opts}>${d}</svg>`

export const icons = {
  chevronRight: S(`<path d='M6 3l5 5-5 5'/>`),
  chevronDown:  S(`<path d='M3 6l5 5 5-5'/>`),
  check:        S(`<path d='M3 8.5l3.2 3L13 4.5'/>`),
  dot:          `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><circle cx='8' cy='8' r='2.5' fill='black'/></svg>`,
}

// ── Structural axes ───────────────────────────────────
// selector → rules. state 축(hover/selected/…)과 동일한 시그니처 형식.

export const listReset = (sel: string) => css`
  :where(${sel}) { list-style: none; margin: 0; padding: 0; }
`

// 29.5px 높이 계약. clickable·control·사용자 정의 컨트롤 모두 이 한 함수로 정렬된다.
export const controlBox = (sel: string) => css`
  :where(${sel}) {
    box-sizing: border-box;
    font: inherit;
    line-height: var(--ds-leading);
    min-height: var(--ds-control-h);
    padding: ${rowPadding(2)};
    border: 1px solid transparent;
    border-radius: ${radius('sm')};
    background: transparent;
    color: inherit;
  }
`

type IndicatorOpts = {
  pseudo?: '::before' | '::after'  // 기본 '::before'
  size?: string                    // 기본 '1em'
  when?: string                    // 표시 조건 셀렉터 (예: '[aria-expanded]')
  on?: string                      // 활성(transform) 조건 셀렉터
  transform?: string               // on 일치 시 transform
  spacing?: string                 // margin-inline-end
}

export const indicator = (sel: string, svg: string, opts: IndicatorOpts = {}) => {
  const { pseudo = '::before', size = '1em', when, on, transform, spacing } = opts
  // when/on 중 하나라도 있으면 토글 인디케이터 — 기본 hidden.
  // 둘 다 없으면 장식용 고정 인디케이터 — 항상 표시.
  const toggles = Boolean(when || (on && !transform))
  const slot = css`
    :where(${sel})${pseudo} {
      ${icon(svg, size)}
      ${toggles ? 'visibility: hidden;' : ''}
      ${spacing ? `margin-inline-end: ${spacing};` : ''}
      ${transform ? 'transition: transform 120ms;' : ''}
    }
  `
  const show = when ? css`
    :where(${sel})${when}${pseudo} { visibility: visible; opacity: .6; }
  ` : ''
  const rotate = on && transform ? css`
    :where(${sel})${on}${pseudo} { transform: ${transform}; }
  ` : ''
  const checked = on && !transform ? css`
    :where(${sel})${on}${pseudo} { visibility: visible; }
  ` : ''
  return [slot, show, rotate, checked].join('\n')
}

export const surface = (d: 0 | 1 | 2) => css`
  background-color: var(--ds-bg);
  border: 1px solid ${d === 0 ? 'transparent' : 'var(--ds-border)'};
  ${d >= 2 ? 'box-shadow: var(--ds-shadow);' : ''}
`

// ── State layers ──────────────────────────────────────
// sel 은 단일/콤마-리스트 둘 다 허용. :where() 로 union 에 pseudo 적용 + specificity 0 유지.

const w = (sel: string) => `:where(${sel})`

const overlay = (pct: number) =>
  `linear-gradient(color-mix(in oklch, currentColor ${pct}%, transparent) 0 100%)`

// leaf-only: 조상 체인 전파 방지 (hover/active 는 자식이 매칭되면 부모도 매칭되는 pseudo)
const leaf = (pseudo: string) => `:not(:has(${pseudo}))`

export const hover = (sel: string) => css`
  ${w(sel)}:hover:not([aria-disabled="true"])${leaf(':hover')} {
    background-image: ${overlay(8)};
  }
`

export const active = (sel: string) => css`
  ${w(sel)}:active:not([aria-disabled="true"])${leaf(':active')} {
    background-image: ${overlay(14)};
  }
`

export const focus = (sel: string) => css`
  ${w(sel)}:focus-visible {
    outline: 2px solid var(--ds-accent);
    outline-offset: 2px;
  }
`

export const highlighted = (sel: string) => css`
  ${w(sel)}:focus {
    background-color: var(--ds-accent);
    color: #fff;
  }
`

export const selected = (sel: string) => css`
  ${w(sel)}[aria-selected="true"],
  ${w(sel)}[aria-current="true"],
  ${w(sel)}[aria-pressed="true"],
  ${w(sel)}[aria-checked="true"] {
    background-color: var(--ds-accent);
    color: #fff;
  }
`

export const disabled = (sel: string) => css`
  ${w(sel)}[aria-disabled="true"] {
    opacity: 0.4;
    pointer-events: none;
  }
`

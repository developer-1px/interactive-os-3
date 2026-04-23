import { css } from './values'

// sel 은 단일/콤마-리스트 둘 다 허용. :where() 로 union 에 pseudo 적용 + specificity 0 유지.
const w = (sel: string) => `:where(${sel})`

const overlay = (pct: number) =>
  `linear-gradient(color-mix(in oklch, currentColor ${pct}%, transparent) 0 100%)`

// leaf-only: 같은 역할 자손(중첩 roving 아이템)만 배제.
// `:has(:hover)` 는 자식 span/아이콘까지 잡아 hover 를 꺼 버리므로
// 반드시 동일 셀렉터로 좁힌다.
const leaf = (sel: string, pseudo: string) => `:not(:has(${sel}${pseudo}))`

export const hover = (sel: string) => css`
  ${w(sel)}:hover:not([aria-disabled="true"])${leaf(w(sel), ':hover')} {
    background-image: ${overlay(8)};
  }
`

export const active = (sel: string) => css`
  ${w(sel)}:active:not([aria-disabled="true"])${leaf(w(sel), ':active')} {
    background-image: ${overlay(14)};
  }
`

export const focus = (sel: string) => css`
  ${w(sel)}:focus-visible { outline: 2px solid var(--ds-accent); outline-offset: 2px; }
`

export const highlighted = (sel: string) => css`
  ${w(sel)}:focus { background-color: var(--ds-accent); color: #fff; }
`

export const selected = (sel: string) => css`
  ${w(sel)}[aria-selected="true"],
  ${w(sel)}[aria-current="true"],
  ${w(sel)}[aria-pressed="true"],
  ${w(sel)}[aria-checked="true"] { background-color: var(--ds-accent); color: #fff; }
`

export const disabled = (sel: string) => css`
  ${w(sel)}[aria-disabled="true"] { opacity: 0.4; pointer-events: none; }
`

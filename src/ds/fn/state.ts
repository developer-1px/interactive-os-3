import { css } from './values'

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

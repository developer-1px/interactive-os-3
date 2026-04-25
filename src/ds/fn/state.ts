import { css } from './values'
import { accent, onAccent, bg } from './semantic'
import { dim, tint } from './palette'

// sel 은 단일/콤마-리스트 둘 다 허용. :where() 로 union 에 pseudo 적용 + specificity 0 유지.
const w = (sel: string) => `:where(${sel})`

const overlay = (pct: number) => `linear-gradient(${dim(pct)} 0 100%)`

// leaf-only: 같은 역할 자손(중첩 roving 아이템)만 배제.
// `:has(:hover)` 는 자식 span/아이콘까지 잡아 hover 를 꺼 버리므로
// 반드시 동일 셀렉터로 좁힌다.
const leaf = (sel: string, pseudo: string) => `:not(:has(${sel}${pseudo}))`

export const hover = (sel: string) => css`
  ${w(sel)}:hover:not([aria-disabled="true"])${leaf(w(sel), ':hover')} {
    background-image: ${overlay(6)};
  }
`

export const active = (sel: string) => css`
  ${w(sel)}:active:not([aria-disabled="true"])${leaf(w(sel), ':active')} {
    background-image: ${overlay(12)};
  }
`

// 2026 스타일 포커스 — outline 대신 ring (box-shadow) + 더 얇게. 라운드 코너에 매끄럽게 붙는다.
export const focus = (sel: string) => css`
  ${w(sel)}:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px ${bg()}, 0 0 0 4px ${tint(accent(), 60)};
  }
`

// highlighted — 키보드 탐색 강조. tint + accent 텍스트로 톤 다운.
export const highlighted = (sel: string) => css`
  ${w(sel)}:focus {
    background-color: ${tint(accent(), 16)};
    color: ${accent()};
  }
`

// selected (기본) — tint + accent 텍스트. 긴 리스트(그리드/트리/listbox)에 적합.
export const selected = (sel: string) => css`
  ${w(sel)}[aria-selected="true"],
  ${w(sel)}[aria-current="true"],
  ${w(sel)}[aria-pressed="true"],
  ${w(sel)}[aria-checked="true"] {
    background-color: ${tint(accent(), 14)};
    color: ${accent()};
    font-weight: 600;
  }
`

// selectedStrong — 풀 accent fill. 짧은 팝오버 리스트(menu)처럼 "지금 이거" 강조가
// 필요한 컨텍스트에서 widget이 호출한다. 텍스트 대비를 위해 onAccent 사용.
export const selectedStrong = (sel: string, on: string[] = ['[aria-selected="true"]', '[aria-current="true"]', '[aria-checked="true"]', ':focus']) => css`
  ${on.map((s) => `${w(sel)}${s}`).join(',\n  ')} {
    background-color: ${accent()};
    color: ${onAccent()};
    font-weight: inherit;
  }
`

export const disabled = (sel: string) => css`
  ${w(sel)}[aria-disabled="true"] { opacity: 0.4; pointer-events: none; }
`

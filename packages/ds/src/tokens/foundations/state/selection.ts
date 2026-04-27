import { css } from '../css'
import { accent, onAccent } from '../color/semantic'
import { tint } from '../../palette/color'

const w = (sel: string) => `:where(${sel})`

// highlighted — 키보드 탐색 강조. tint + accent 텍스트로 톤 다운.
/** @demo type=selector fn=highlighted args=["li"] */
export const highlighted = (sel: string) => css`
  ${w(sel)}:focus {
    background-color: ${tint(accent(), 16)};
    color: ${accent()};
  }
`

// selected (기본) — tint + accent 텍스트. 긴 리스트(그리드/트리/listbox)에 적합.
/** @demo type=selector fn=selected args=["li"] */
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
/** @demo type=selector fn=selectedStrong args=["li"] */
export const selectedStrong = (sel: string, on: string[] = ['[aria-selected="true"]', '[aria-current="true"]', '[aria-checked="true"]', ':focus']) => css`
  ${on.map((s) => `${w(sel)}${s}`).join(',\n  ')} {
    background-color: ${accent()};
    color: ${onAccent()};
    font-weight: inherit;
  }
`

/** @demo type=selector fn=disabled args=["li"] */
export const disabled = (sel: string) => css`
  ${w(sel)}[aria-disabled="true"] { opacity: 0.4; pointer-events: none; }
`

import { css } from '../css'
import {accent, surface} from '../color/semantic'
import { dim, tint } from '../../scalar/color'

// sel 은 단일/콤마-리스트 둘 다 허용. :where() 로 union 에 pseudo 적용 + specificity 0 유지.
const w = (sel: string) => `:where(${sel})`

const overlay = (pct: number) => `linear-gradient(${dim(pct)} 0 100%)`

// leaf-only: 같은 역할 자손(중첩 roving 아이템)만 배제.
// `:has(:hover)` 는 자식 span/아이콘까지 잡아 hover 를 꺼 버리므로
// 반드시 동일 셀렉터로 좁힌다.
const leaf = (sel: string, pseudo: string) => `:not(:has(${sel}${pseudo}))`

/** @demo type=selector fn=hover args=["li"] */
export const hover = (sel: string) => css`
  ${w(sel)}:hover:not([aria-disabled="true"])${leaf(w(sel), ':hover')} {
    background-image: ${overlay(6)};
  }
`

/** @demo type=selector fn=active args=["li"] */
export const active = (sel: string) => css`
  ${w(sel)}:active:not([aria-disabled="true"])${leaf(w(sel), ':active')} {
    background-image: ${overlay(12)};
  }
`

// 2026 스타일 포커스 — outline 대신 ring (box-shadow) + 더 얇게. 라운드 코너에 매끄럽게 붙는다.
/** @demo type=selector fn=focus args=["button"] */
export const focus = (sel: string) => css`
  ${w(sel)}:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px ${surface('default')}, 0 0 0 4px ${tint(accent(), 60)};
  }
`

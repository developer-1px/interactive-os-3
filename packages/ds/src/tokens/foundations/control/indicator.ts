import { css } from '../primitives/css'
import { icon, type IconToken } from '../iconography/icon'

type IndicatorOpts = {
  pseudo?: '::before' | '::after'
  size?: string
  when?: string      // 표시 조건 셀렉터 (예: '[aria-expanded]')
  on?: string        // 활성(transform) 조건 셀렉터
  transform?: string // on 일치 시 transform
  spacing?: string   // margin-inline-end
}

/** @demo type=structural fn=indicator args=["[data-icon]","chevronRight"] */
export const indicator = (sel: string, token: IconToken, opts: IndicatorOpts = {}) => {
  const { pseudo = '::before', size = '1em', when, on, transform, spacing } = opts
  // when/on 중 하나라도 있으면 토글 인디케이터 — 기본 hidden. 둘 다 없으면 고정.
  const toggles = Boolean(when || (on && !transform))
  const slot = css`
    :where(${sel})${pseudo} {
      ${icon(token, size)}
      ${toggles ? 'visibility: hidden;' : ''}
      ${spacing ? `margin-inline-end: ${spacing};` : ''}
      ${transform ? 'transition: transform 120ms;' : ''}
    }
  `
  const show = when
    ? css`:where(${sel})${when}${pseudo} { visibility: visible; opacity: .6; }` : ''
  const rotate = on && transform
    ? css`:where(${sel})${on}${pseudo} { transform: ${transform}; }` : ''
  const checked = on && !transform
    ? css`:where(${sel})${on}${pseudo} { visibility: visible; }` : ''
  return [slot, show, rotate, checked].join('\n')
}

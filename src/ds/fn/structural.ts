import { css, radius, rowPadding } from './values'
import { icon, type IconToken } from './icon'

export const listReset = (sel: string) => css`
  :where(${sel}) { list-style: none; margin: 0; padding: 0; }
`

// 29.5px 높이 계약 + 콘텐츠 중앙 정렬 축.
// clickable·control·사용자 정의 컨트롤 모두 이 한 함수로 정렬된다.
// inline-flex + center는 "컨트롤 내부의 아이콘·텍스트가 vertically·horizontally 가운데
// 위치해야 한다"는 규약을 한 곳에서 박아둔 것 — data-icon::before + 텍스트 조합이 baseline이
// 아닌 기하 중앙에 놓이게 만든다. <input>/<select>/<textarea>는 replaced element라 내부에
// 영향 없음.
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
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
`

type IndicatorOpts = {
  pseudo?: '::before' | '::after'
  size?: string
  when?: string      // 표시 조건 셀렉터 (예: '[aria-expanded]')
  on?: string        // 활성(transform) 조건 셀렉터
  transform?: string // on 일치 시 transform
  spacing?: string   // margin-inline-end
}

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

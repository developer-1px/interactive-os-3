import { css, status } from '../../../tokens/semantic'
import { pad } from '../../../tokens/scalar'

// 잔존: cssAlert만 — Checkbox·Radio는 ui/2-input/{Checkbox,Radio}.style.ts 로 이전.
export const cssAlert = () => css`
  [role="alert"] {
    color: ${status('danger')};
    font-size: 0.85em;
    line-height: 1.4;
    margin-block-start: ${pad(0.5)};
  }
`

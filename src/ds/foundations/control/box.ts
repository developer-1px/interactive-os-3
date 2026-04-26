import { css } from '../primitives/css'
import { rowPadding } from '../../palette/space'
import { radius } from '../shape/radius'
import { hairlineWidth } from '../shape/hairline'

/** @demo type=structural fn=controlBox args=["button"] */
export const controlBox = (sel: string) => css`
  :where(${sel}) {
    box-sizing: border-box;
    font: inherit;
    line-height: var(--ds-leading);
    block-size: var(--ds-control-h);
    padding: ${rowPadding(2)};
    border: ${hairlineWidth()} solid transparent;
    border-radius: ${radius('sm')};
    background: transparent;
    color: inherit;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
`

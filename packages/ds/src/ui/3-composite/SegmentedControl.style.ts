import { border, control, css, hairlineWidth, radius, ring, surface, text } from '../../tokens/semantic'
import { pad } from '../../tokens/scalar'
import { defineStyleContract } from '../../style/contract'

/**
 * SegmentedControl — iOS 식 한 덩어리 컨트롤. inner padding + 선택 segment 만 raised.
 * Tabs 와 시각·의미 둘 다 분리. data-part="segmented" + "segment".
 */
export const segmentedControlStyle = defineStyleContract('SegmentedControl', {
  root: css`
    display: inline-flex;
    align-items: center;
    inline-size: fit-content;
    max-inline-size: 100%;
    padding: ${pad(0.25)};
    background: ${surface('subtle')};
    border: ${hairlineWidth()} solid ${border()};
    border-radius: ${radius('md')};
    gap: ${pad(0.25)};
    overflow: auto hidden;

    & > button[role="radio"] {
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      inline-size: auto;
      block-size: auto;
      min-inline-size: max-content;
      min-block-size: ${control('h')};
      background: transparent;
      border: ${hairlineWidth()} solid transparent;
      border-radius: ${radius('sm')};
      padding: ${pad(0.5)} ${pad(2)};
      color: ${text('subtle')};
      cursor: pointer;
      white-space: nowrap;
    }
    & > button[role="radio"]::before {
      content: none;
      display: none;
    }
    & > button[role="radio"][aria-checked="true"] {
      background: ${surface('raised')};
      color: inherit;
      box-shadow: 0 1px 2px rgb(0 0 0 / .08);
    }
    & > button[role="radio"]:focus-visible {
      ${ring()}
    }
  `,
})

export const cssSegmented = () => segmentedControlStyle.css

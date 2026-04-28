import { border, css, hairlineWidth, radius, ring, surface, text } from '../../tokens/semantic'
import { pad } from '../../tokens/scalar'

/**
 * SegmentedControl — iOS 식 한 덩어리 컨트롤. inner padding + 선택 segment 만 raised.
 * Tabs 와 시각·의미 둘 다 분리. data-part="segmented" + "segment".
 */
export const cssSegmented = () => css`
  [data-part="segmented"] {
    display: inline-flex;
    padding: ${pad(0.25)};
    background: ${surface('subtle')};
    border: ${hairlineWidth()} solid ${border()};
    border-radius: ${radius('md')};
    gap: ${pad(0.25)};
  }
  [data-part="segmented"] > [data-part="segment"] {
    background: transparent;
    border: 0;
    border-radius: ${radius('sm')};
    padding: ${pad(0.5)} ${pad(2)};
    color: ${text('subtle')};
    cursor: pointer;
  }
  [data-part="segmented"] > [data-part="segment"][aria-checked="true"] {
    background: ${surface('raised')};
    color: inherit;
    box-shadow: 0 1px 2px rgb(0 0 0 / .08);
  }
  [data-part="segmented"] > [data-part="segment"]:focus-visible {
    ${ring()}
  }
`

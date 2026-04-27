import { accent, accentTint, css, currentTint, dur, ease, icon, radius } from '../../tokens/foundations'
import { font } from '../../tokens/palette'
import { dim, pad, tint } from '../../tokens/palette'

/**
 * Tag — removable label. Chip(entity)과 다른 부품 layer 시맨틱.
 * 셀렉터: span[data-part="tag"]. optional remove button (× icon).
 */
export const cssTag = () => css`
  :where(span[data-part="tag"]) {
    display: inline-flex;
    align-items: center;
    gap: ${pad(0.5)};
    padding: ${pad(0.25)} ${pad(1.25)};
    background: ${currentTint('soft')};
    border-radius: ${radius('pill')};
    font-size: ${font('sm')};
    line-height: 1.4;
    white-space: nowrap;
  }
  :where(span[data-part="tag"]:has(> button)) {
    padding-inline-end: ${pad(0.25)};
  }
  span[data-part="tag"] > button {
    all: unset;
    inline-size: 1.25em;
    block-size: 1.25em;
    border-radius: ${radius('pill')};
    display: inline-grid;
    place-items: center;
    cursor: pointer;
    color: inherit;
    opacity: .55;
    font-size: 0;
    transition: opacity ${dur('fast')} ${ease('out')},
                background-color ${dur('fast')} ${ease('out')};
  }
  span[data-part="tag"] > button::before {
    ${icon('x', '0.85em')}
    font-size: ${font('sm')};
  }
  span[data-part="tag"] > button:hover {
    opacity: 1;
    background: ${accentTint('medium')};
    color: ${accent()};
  }
  span[data-part="tag"] > button:focus-visible {
    outline: ${pad(0.25)} solid ${accent()};
    outline-offset: ${pad(0.25)};
    opacity: 1;
  }
`

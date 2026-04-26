import { accent, css, dur, ease, pad } from '../../foundations'

/**
 * Link — <a data-part="link"> + 외부 링크 표식 (data-external).
 * 시각 affordance: 색 + underline(hover) + 외부 ↗ icon (after).
 */
export const link = () => css`
  :where(a[data-part="link"]) {
    color: ${accent()};
    text-decoration: none;
    border-radius: 2px;
    transition: text-decoration-color ${dur('fast')} ${ease('out')};
  }
  a[data-part="link"]:hover {
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  a[data-part="link"]:focus-visible {
    outline: ${pad(0.25)} solid ${accent()};
    outline-offset: ${pad(0.25)};
  }
  a[data-part="link"][data-external]::after {
    content: "\\2197";
    margin-inline-start: ${pad(0.25)};
    opacity: 0.7;
    font-size: 0.85em;
  }
`

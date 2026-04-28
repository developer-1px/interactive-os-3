import { accent, css, dur, ease, ring } from '../../tokens/foundations'
import { pad } from '../../tokens/palette'

export const cssLink = () => css`
  :where(a) {
    color: ${accent()};
    text-decoration: none;
    border-radius: 2px;
    transition: text-decoration-color ${dur('fast')} ${ease('out')};
  }
  :where(a):hover {
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  :where(a):focus-visible {
    ${ring()}
  }
  :where(a)[data-external]::after {
    content: "\\2197";
    margin-inline-start: ${pad(0.25)};
    opacity: 0.7;
    font-size: 0.85em;
  }
`

import { border, css, currentTint, hairlineWidth, radius } from '../../tokens/semantic'
import { font, pad } from '../../tokens/scalar'

export const cssCode = () => css`
  :where(code) {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.9em;
    background: ${currentTint('soft')};
    padding: 0.1em ${pad(0.5)};
    border-radius: ${radius('sm')};
  }
  :where(kbd) {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: ${font('xs')};
    line-height: 1;
    display: inline-flex;
    align-items: center;
    padding: ${pad(0.25)} ${pad(0.5)};
    border: ${hairlineWidth()} solid ${border('default')};
    border-block-end-width: 2px;
    border-radius: ${radius('sm')};
    background: var(--ds-bg);
    min-inline-size: 1.5em;
    justify-content: center;
  }
`

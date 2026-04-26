import { border, css, dim, font, pad, radius } from '../../foundations'

/**
 * Code / Kbd — 인라인 시맨틱.
 *   <code data-part="code">  : monospace + 약한 배경
 *   <kbd  data-part="kbd">   : monospace + border + raised 시각 (키캡 메타포)
 */
export const code = () => css`
  :where(code[data-part="code"]) {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.9em;
    background: ${dim(8)};
    padding: 0.1em ${pad(0.5)};
    border-radius: ${radius('sm')};
  }
  :where(kbd[data-part="kbd"]) {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: ${font('xs')};
    line-height: 1;
    display: inline-flex;
    align-items: center;
    padding: ${pad(0.25)} ${pad(0.5)};
    border: 1px solid ${border('default')};
    border-block-end-width: 2px;
    border-radius: ${radius('sm')};
    background: var(--ds-bg);
    min-inline-size: 1.5em;
    justify-content: center;
  }
`

import { control, css, hairlineWidth } from '../../tokens/foundations'

/**
 * Split — N-pane resize layout primitive.
 *
 * - data-ds="Split" + data-axis="row|column" — only structural identifier.
 * - 항상 full-height (min-block-size: 100%).
 * - 자식 panel 사이에 [role="separator"][data-ds-handle]가 Split.tsx에서 자동 삽입된다.
 *   grid-template-{cols|rows}는 panel/separator 트랙을 인라인 style로 주입(Split.tsx).
 * - separator는 평소 invisible, hover/active 시 1px hairline. hit area는 separator 트랙(8px).
 * - Tab 흐름 미오염: separator는 tabIndex=-1 (Split.tsx에서 부여).
 */
export const cssSplit = () => css`
  [data-ds="Split"] {
    display: grid;
    min-block-size: 100%;
    min-inline-size: 0;
  }

  /* separator — 자동 삽입, classless: role + data-ds-handle만으로 식별 */
  [data-ds="Split"] > [role="separator"][data-ds-handle] {
    position: relative;
    background: transparent;
    touch-action: none;
    user-select: none;
  }
  [data-ds="Split"][data-axis="row"]    > [role="separator"][data-ds-handle] { cursor: col-resize; }
  [data-ds="Split"][data-axis="column"] > [role="separator"][data-ds-handle] { cursor: row-resize; }

  /* hairline — separator 중앙 1px, 평소 투명 */
  [data-ds="Split"] > [role="separator"][data-ds-handle]::before {
    content: "";
    position: absolute;
    inset: 0;
    margin: auto;
    background: ${control('border')};
    opacity: 0;
    transition: opacity 120ms;
  }
  [data-ds="Split"][data-axis="row"]    > [role="separator"][data-ds-handle]::before {
    inline-size: ${hairlineWidth()};
    block-size: 100%;
  }
  [data-ds="Split"][data-axis="column"] > [role="separator"][data-ds-handle]::before {
    block-size: ${hairlineWidth()};
    inline-size: 100%;
  }
  [data-ds="Split"] > [role="separator"][data-ds-handle]:hover::before,
  [data-ds="Split"] > [role="separator"][data-ds-handle][data-active="true"]::before {
    opacity: 1;
  }

  /* 드래그 중: 전역 cursor 강제 (페이지 어디든 col/row-resize) */
  [data-ds="Split"][data-dragging="row"]    * { cursor: col-resize !important; }
  [data-ds="Split"][data-dragging="column"] * { cursor: row-resize !important; }
`

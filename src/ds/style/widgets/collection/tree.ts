import { css, indicator, microLabel, pad, rowPadding } from '../../../foundations'
import { levelShift } from '../../seed/keyline'

export const tree = () => [
  indicator('[role="treeitem"]', 'chevronRight', {
    when: '[aria-expanded]',
    on: '[aria-expanded="true"]',
    transform: 'rotate(90deg)',
    spacing: pad(1),
  }),
  // Level 들여쓰기는 --ds-level 변수로만 주입. 계산은 여기에 단일화.
  css`
    [role="treeitem"] {
      padding-inline-start: calc(${levelShift} * var(--ds-level, 0));
    }
  `,
  // Group label in listbox/menu — the [role=presentation] li directly inside [role=group]
  css`
    [role="group"] > li[role="presentation"]:first-child {
      ${microLabel()}
      padding: ${rowPadding(2)};
      pointer-events: none;
    }
  `,
].join('\n')

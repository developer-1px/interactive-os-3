import { css, icons, indicator, listReset, pad, rowPadding } from './fn'

export const tree = () => [
  listReset('[role="tree"], [role="group"]'),
  indicator('[role="treeitem"]', icons.chevronRight, {
    when: '[aria-expanded]',
    on: '[aria-expanded="true"]',
    transform: 'rotate(90deg)',
    spacing: pad(1),
  }),
  // Group label in listbox/menu — the [role=presentation] li directly inside [role=group]
  css`
    [role="group"] > li[role="presentation"]:first-child {
      padding: ${rowPadding(2)};
      font-size: .85em;
      opacity: .6;
      text-transform: uppercase;
      letter-spacing: .05em;
      pointer-events: none;
    }
  `,
].join('\n')

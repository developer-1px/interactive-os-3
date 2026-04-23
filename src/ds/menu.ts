import { css, icons, indicator, listReset, pad, radius, rowPadding, surface } from './fn'

export const menu = () => [
  css`
    button[popovertarget] {
      ${surface(1)}
      padding: ${rowPadding(3)};
      border-radius: ${radius('md')};
      font: inherit; color: inherit; cursor: pointer;
    }
    button[popovertarget][aria-expanded="true"],
    [role="menuitem"][aria-expanded="true"] {
      background-color: var(--ds-accent); color: #fff;
    }

    [popover] {
      margin: 0;
      padding: 0; border: 0; background: transparent; overflow: visible;
    }
  `,
  listReset('[role="menu"]'),
  css`
    [role="menu"] {
      ${surface(2)}
      padding: ${pad(1)};
      min-width: 180px; width: max-content;
      border-radius: ${radius('md')};
      display: flex; flex-direction: column; color: var(--ds-fg);
    }

    [role="menuitem"],
    [role="menuitemcheckbox"],
    [role="menuitemradio"] {
      padding: ${rowPadding(2.5)};
      border-radius: ${radius('sm')};
      display: flex; align-items: center;
      gap: ${pad(2)};
      cursor: default; user-select: none; outline: none;
    }
    [role="menuitem"] { justify-content: space-between; gap: ${pad(4)}; }
  `,
  indicator('[role="menuitem"][aria-haspopup="menu"]', icons.chevronRight, { pseudo: '::after', size: '0.9em' }),
  css`[role="menuitem"][aria-haspopup="menu"]::after { opacity: .6; }`,
  indicator('[role="menuitemcheckbox"]', icons.check, { on: '[aria-checked="true"]' }),
  indicator('[role="menuitemradio"]',    icons.dot,   { on: '[aria-checked="true"]' }),
].join('\n')

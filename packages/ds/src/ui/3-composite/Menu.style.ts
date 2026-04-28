import { accent, css, dur, ease, grouping, indicator, listReset, radius, selectedStrong, text } from '../../tokens/semantic'
import { pad, rowPadding } from '../../tokens/scalar'
export const cssMenu = () => [
  css`
    button[popovertarget] {
      ${grouping(1)}
      padding: ${rowPadding(3)};
      border-radius: ${radius('md')};
      font: inherit; color: inherit; cursor: pointer;
    }
    button[popovertarget][aria-expanded="true"],
    [role="menuitem"][aria-expanded="true"] {
      background-color: ${accent()}; color: ${text('on-accent')};
    }
    /* 메뉴 아이템은 global tint(selected)가 아니라 풀 accent fill(selectedStrong)로 강조 —
       팝오버의 짧은 리스트에선 명확한 "이것" 신호가 필요하다. */

    [popover] {
      margin: 0;
      padding: 0; border: 0; background: transparent; overflow: visible;
    }
  `,
  listReset('[role="menu"]'),
  css`
    [role="menu"] {
      ${grouping(2)}
      padding: ${pad(1)};
      min-width: 180px; width: max-content;
      border-radius: ${radius('md')};
      display: flex; flex-direction: column; color: ${text('strong')};
    }

    /* inline-flex + align-items:center + justify-content:center + gap은 controlBox 축에서 상속.
       여기선 display를 flex(블록 플로우)로 넓히고, menuitem만 space-between로 덮는다. */
    [role="menuitem"],
    [role="menuitemcheckbox"],
    [role="menuitemradio"] {
      padding: ${rowPadding(2.5)};
      border-radius: ${radius('sm')};
      display: flex;
      gap: ${pad(2)};
      cursor: default; user-select: none; outline: none;
      transition: background-color ${dur('fast')} ${ease('out')},
                  color ${dur('fast')} ${ease('out')};
    }
    [role="menuitem"] { justify-content: space-between; gap: ${pad(4)}; }
  `,
  indicator('[role="menuitem"][aria-haspopup="menu"]', 'chevronRight', { pseudo: '::after', size: '0.9em' }),
  css`[role="menuitem"][aria-haspopup="menu"]::after { opacity: .6; }`,
  indicator('[role="menuitemcheckbox"]', 'check', { on: '[aria-checked="true"]' }),
  indicator('[role="menuitemradio"]',    'dot',   { on: '[aria-checked="true"]' }),
  // global selected(tint)를 덮어쓰는 풀 fill — menu 3종만 대상.
  selectedStrong('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]'),
].join('\n')

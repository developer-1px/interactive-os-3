import { accent, control, css, dur, ease, indicator, radius, surface, text } from '../../tokens/semantic'

export const cssCheckbox = () => [
  css`
    [role="checkbox"] {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.125em;
      height: 1.125em;
      min-height: 0; block-size: 1.125em;
      padding: 0;
      border: 1.5px solid ${control('border')};
      border-radius: ${radius('sm')};
      background: ${surface('default')};
      flex: 0 0 auto;
      cursor: pointer;
      transition:
        background-color ${dur('base')} ${ease('out')},
        border-color ${dur('base')} ${ease('out')},
        box-shadow ${dur('base')} ${ease('out')};
    }

    [role="checkbox"][aria-checked="false"]:hover:not([aria-disabled="true"]) {
      border-color: ${control('borderHover')};
    }

    @keyframes ds-checkbox-pop {
      0%   { opacity: 0; transform: scale(0.5); }
      100% { opacity: 1; transform: scale(1); }
    }
    [role="checkbox"][aria-checked="true"]::before,
    [role="checkbox"][aria-checked="mixed"]::after {
      animation: ds-checkbox-pop ${dur('base')} ${ease('spring')};
    }

    [role="checkbox"][aria-checked="true"],
    [role="checkbox"][aria-checked="mixed"] {
      background: ${accent()};
      border-color: ${accent()};
      color: ${text('on-accent')};
    }
  `,
  indicator('[role="checkbox"]', 'check', { on: '[aria-checked="true"]', size: '0.8em' }),
  css`
    [role="checkbox"][aria-checked="mixed"]::before { visibility: hidden; }
    [role="checkbox"][aria-checked="mixed"]::after {
      content: '';
      display: block;
      width: 0.6em;
      height: 2px;
      background: currentColor;
      border-radius: 1px;
    }
  `,
].join('\n')

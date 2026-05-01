import { accent, control, css, dur, ease, indicator, radius, slot, surface, text } from '../../tokens/semantic'

export const cssRadio = () => [
  css`
    [role="radio"] {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.125em;
      height: 1.125em;
      min-height: 0; block-size: 1.125em;
      padding: 0;
      border: 1.5px solid ${control('border')};
      border-radius: ${radius('pill')};
      background: ${surface('default')};
      flex: 0 0 auto;
      cursor: pointer;
      transition:
        background-color ${dur('base')} ${ease('out')},
        border-color ${dur('base')} ${ease('out')},
        box-shadow ${dur('base')} ${ease('out')};
    }

    [role="radio"][aria-checked="false"]:hover:not([aria-disabled="true"]) {
      border-color: ${control('borderHover')};
    }

    @keyframes ds-radio-pop {
      0%   { opacity: 0; transform: scale(0.5); }
      100% { opacity: 1; transform: scale(1); }
    }
    [role="radio"][aria-checked="true"]::before {
      animation: ds-radio-pop ${dur('base')} ${ease('spring')};
    }

    [role="radio"][aria-checked="true"] {
      background: ${accent()};
      border-color: ${accent()};
      color: ${text('on-accent')};
    }

    [role="radiogroup"] {
      display: flex;
      flex-direction: column;
      gap: ${slot.form.fieldGap};
    }
    [role="radiogroup"][aria-orientation="horizontal"] {
      flex-direction: row;
      flex-wrap: wrap;
      gap: ${slot.form.gap};
    }
  `,
  indicator('[role="radio"]', 'dot', { on: '[aria-checked="true"]', size: '0.6em' }),
].join('\n')

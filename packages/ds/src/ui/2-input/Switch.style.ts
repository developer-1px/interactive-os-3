import {
  accent,
  border,
  control,
  css,
  currentTint,
  dur,
  ease,
  hairlineWidth,
  radius,
  ring,
  surface,
  text,
} from '../../tokens/semantic'

export const cssSwitch = () => css`
  button[role="switch"] {
    --switch-track-w: calc(${control('h')} * 1.28);
    --switch-track-h: calc(${control('h')} * 0.56);
    --switch-pad: 2px;
    --switch-thumb: calc(var(--switch-track-h) - var(--switch-pad) * 2);
    --switch-travel: calc(var(--switch-track-w) - var(--switch-thumb) - var(--switch-pad) * 2);

    position: relative;
    inline-size: calc(var(--switch-track-w) + 8px);
    min-inline-size: calc(var(--switch-track-w) + 8px);
    block-size: ${control('h')};
    min-block-size: ${control('h')};
    padding: 0;
    border: 0;
    border-radius: ${radius('pill')};
    background: transparent;
    color: ${text('subtle')};
    display: inline-grid;
    place-items: center;
    vertical-align: middle;
    transition:
      color ${dur('fast')} ${ease('out')};

    &::before {
      content: '';
      inline-size: var(--switch-track-w);
      block-size: var(--switch-track-h);
      border: ${hairlineWidth()} solid ${control('border')};
      border-radius: ${radius('pill')};
      background: ${surface('subtle')};
      transition:
        background-color ${dur('fast')} ${ease('out')},
        border-color ${dur('fast')} ${ease('out')};
    }

    &::after {
      content: '';
      position: absolute;
      inline-size: var(--switch-thumb);
      block-size: var(--switch-thumb);
      inset-inline-start: calc((100% - var(--switch-track-w)) / 2 + var(--switch-pad));
      inset-block-start: 50%;
      border: ${hairlineWidth()} solid ${border()};
      border-radius: ${radius('pill')};
      background: ${surface('default')};
      box-shadow: 0 1px 2px ${currentTint('soft')};
      transform: translateY(-50%);
      transition:
        background-color ${dur('fast')} ${ease('out')},
        border-color ${dur('fast')} ${ease('out')},
        transform ${dur('base')} ${ease('spring')};
    }

    &:hover:not([aria-disabled="true"])::before {
      border-color: ${control('borderHover')};
      background: ${control('channel')};
    }

    &[aria-checked="true"] {
      color: ${accent()};
    }
    &[aria-checked="true"]::before {
      border-color: ${accent('border')};
      background: ${accent('soft')};
    }
    &[aria-checked="true"]::after {
      border-color: ${accent()};
      background: ${accent()};
      transform: translate(var(--switch-travel), -50%);
    }
    &[aria-checked="true"]:hover:not([aria-disabled="true"])::before {
      background: ${accent('medium')};
    }
    &[aria-checked="true"]:hover:not([aria-disabled="true"])::after {
      border-color: ${accent('strong')};
      background: ${accent('strong')};
    }

    &:focus-visible {
      ${ring()}
    }

    &[aria-disabled="true"] {
      cursor: not-allowed;
      color: ${text('mute')};
    }
    &[aria-disabled="true"]::before {
      border-color: ${control('border')};
      background: ${surface('subtle')};
    }
    &[aria-disabled="true"]::after {
      border-color: ${control('border')};
      background: ${control('channel')};
    }
  }
`

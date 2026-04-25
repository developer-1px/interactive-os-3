import { css, indicator, onAccent, pad, radius } from '../../../fn'

export const toggle = () => [
  css`
    [role="checkbox"],
    [role="radio"] {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.125em;
      height: 1.125em;
      min-height: 0; block-size: 1.125em;
      padding: 0;
      border: 1.5px solid var(--ds-control-border);
      background: var(--ds-bg);
      flex: 0 0 auto;
      cursor: pointer;
      transition:
        background-color var(--ds-dur-base) var(--ds-ease-out),
        border-color var(--ds-dur-base) var(--ds-ease-out),
        box-shadow var(--ds-dur-base) var(--ds-ease-out);
    }
    [role="checkbox"] { border-radius: ${radius('sm')}; }
    [role="radio"]    { border-radius: 50%; }

    [role="checkbox"][aria-checked="false"]:hover:not([aria-disabled="true"]),
    [role="radio"][aria-checked="false"]:hover:not([aria-disabled="true"]) {
      border-color: var(--ds-control-border-hover);
    }

    @keyframes ds-toggle-pop {
      0%   { opacity: 0; transform: scale(0.5); }
      100% { opacity: 1; transform: scale(1); }
    }
    [role="checkbox"][aria-checked="true"]::before,
    [role="checkbox"][aria-checked="mixed"]::after,
    [role="radio"][aria-checked="true"]::before {
      animation: ds-toggle-pop var(--ds-dur-base) var(--ds-ease-spring);
    }

    [role="checkbox"][aria-checked="true"],
    [role="checkbox"][aria-checked="mixed"],
    [role="radio"][aria-checked="true"] {
      background: var(--ds-accent);
      border-color: var(--ds-accent);
      color: ${onAccent()};
    }

    [role="radiogroup"] {
      display: flex;
      flex-direction: column;
      gap: ${pad(1)};
    }
    [role="radiogroup"][aria-orientation="horizontal"] {
      flex-direction: row;
      flex-wrap: wrap;
      gap: ${pad(3)};
    }
  `,
  indicator('[role="checkbox"]', 'check', { on: '[aria-checked="true"]', size: '0.8em' }),
  indicator('[role="radio"]',    'dot',   { on: '[aria-checked="true"]', size: '0.6em' }),
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

export const alert = () => css`
  [role="alert"] {
    color: var(--ds-danger);
    font-size: 0.85em;
    line-height: 1.4;
    margin-block-start: ${pad(0.5)};
  }
`

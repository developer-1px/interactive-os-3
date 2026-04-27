import { css, hairlineWidth, neutral, pad, radius } from '../../../tokens/foundations'

/**
 * MessageBubble slot inner styling — DM 1:1 채팅 버블.
 * 카드 root layout(flex stack)은 parts/card.ts owner.
 */
export const messageBubble = () => css`
  article[data-part="card"][data-card="message"] {
    max-inline-size: min(75%, 36rem);
    padding: ${pad(2)} ${pad(2.5)};
    border-radius: ${radius('lg')};
    gap: ${pad(0.5)};
  }
  article[data-part="card"][data-card="message"][data-side="other"] {
    align-self: flex-start;
    background: ${neutral(2)};
    border-end-start-radius: ${radius('sm')};
  }
  article[data-part="card"][data-card="message"][data-side="me"] {
    align-self: flex-end;
    background: var(--ds-accent);
    color: var(--ds-accent-on);
    border: ${hairlineWidth()} solid transparent;
    border-end-end-radius: ${radius('sm')};
  }
  article[data-part="card"][data-card="message"] > [data-slot="meta"] > small {
    opacity: .7;
    font-size: var(--ds-text-xs);
    margin: 0;
  }
  article[data-part="card"][data-card="message"] > [data-slot="body"] > p {
    margin: 0;
    line-height: 1.4;
    word-break: break-word;
  }
`

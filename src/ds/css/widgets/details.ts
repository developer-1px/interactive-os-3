import { css, icon, pad, radius } from '../../fn'

export const detailsCss = css`
  :where(details) {
    border: 1px solid var(--ds-border);
    border-radius: ${radius('sm')};
    overflow: hidden;
  }
  :where(details) + :where(details) { border-top-width: 0; border-radius: 0; }
  :where(details:first-child) {
    border-top-left-radius: ${radius('sm')};
    border-top-right-radius: ${radius('sm')};
  }
  :where(details:last-child) {
    border-bottom-left-radius: ${radius('sm')};
    border-bottom-right-radius: ${radius('sm')};
  }
  :where(details) > :where(summary) {
    list-style: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: ${pad(1.5)};
    padding: ${pad(1.5)} ${pad(2)};
    user-select: none;
  }
  :where(details) > :where(summary)::-webkit-details-marker { display: none; }
  :where(details) > :where(summary)::before {
    ${icon('chevronRight')}
    opacity: .6;
    transition: transform 120ms;
    flex: none;
  }
  :where(details[open]) > :where(summary)::before { transform: rotate(90deg); }
  :where(details[open]) > :where(summary) { border-bottom: 1px solid var(--ds-border); }
  :where(details) > :not(summary) { padding: ${pad(2)}; }
`

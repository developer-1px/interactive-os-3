import { css, font, mute, pad } from '../../tokens/foundations'

/**
 * EmptyState — icon + heading + description + optional CTA.
 * 시맨틱: <div role="status" data-part="empty-state">. 자식은 의미 tag(h3/p/...).
 */
export const emptyState = () => css`
  :where(div[data-part="empty-state"]) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${pad(1.5)};
    padding: ${pad(6)} ${pad(3)};
    text-align: center;
  }
  div[data-part="empty-state"] > h3 {
    margin: 0;
    font-size: ${font('lg')};
    font-weight: 600;
  }
  div[data-part="empty-state"] > p {
    margin: 0;
    ${mute(2)}
    font-size: ${font('sm')};
    max-inline-size: 36ch;
  }
`

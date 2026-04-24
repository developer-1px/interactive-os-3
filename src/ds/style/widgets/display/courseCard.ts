import { css, dim, mix, on, pad, radius, status } from '../../../fn'

export const courseCard = () => css`
  .course-card {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: ${pad(3)};
    padding: ${pad(3)};
    background: Canvas;
    border: 1px solid ${dim(8)};
    border-radius: ${radius('lg')};
    transition: box-shadow .15s ease, border-color .15s ease;
  }
  .course-card:hover {
    border-color: ${dim(15)};
    box-shadow: 0 1px 3px ${dim(6)};
  }
  .course-card + .course-card { margin-block-start: ${pad(2)}; }

  .course-card > figure {
    margin: 0;
    inline-size: 56px; block-size: 56px;
    border-radius: ${radius('md')};
    display: grid; place-items: center;
    font-size: var(--ds-text-sm);
    font-weight: 800;
    letter-spacing: -0.02em;
    color: ${on('accent')};
    background: linear-gradient(135deg, var(--ds-accent), ${mix('var(--ds-accent)', 70, 'CanvasText')});
  }
  .course-card[data-tone="success"] > figure {
    color: ${on('success')};
    background: linear-gradient(135deg, ${status('success')}, ${mix(status('success'), 70, 'CanvasText')});
  }
  .course-card[data-tone="warning"] > figure {
    color: ${on('warning')};
    background: linear-gradient(135deg, ${status('warning')}, ${mix(status('warning'), 70, 'CanvasText')});
  }
  .course-card[data-tone="danger"] > figure {
    color: ${on('danger')};
    background: linear-gradient(135deg, ${status('danger')}, ${mix(status('danger'), 70, 'CanvasText')});
  }
  .course-card[data-tone="neutral"] > figure {
    background: linear-gradient(135deg, ${dim(55)}, ${dim(80)});
  }

  .course-card > div:nth-of-type(1) {
    min-inline-size: 0;
    display: flex; flex-direction: column; gap: ${pad(0.5)};
  }
  .course-card > div:nth-of-type(1) > h3 {
    margin: 0;
    font-size: var(--ds-text-md);
    font-weight: 700;
    letter-spacing: -0.01em;
  }
  .course-card > div:nth-of-type(1) > p {
    margin: 0;
    font-size: var(--ds-text-sm);
    color: ${dim(60)};
    line-height: 1.5;
  }

  .course-card > div:nth-of-type(2) {
    display: flex; flex-direction: column; align-items: flex-end;
    gap: ${pad(1.5)};
    flex-shrink: 0;
  }
  .course-card > div:nth-of-type(2) > div {
    display: flex; align-items: center; gap: ${pad(1)};
  }
  .course-card > div:nth-of-type(2) > small {
    font-size: var(--ds-text-xs);
    color: ${dim(55)};
  }
`

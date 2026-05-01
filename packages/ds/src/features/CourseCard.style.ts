import { accent, border, css, currentTint, gradientDeep, hairlineWidth, on, radius, status, surface, text, typography } from '../tokens/semantic'
import { font, weight, pad } from '../tokens/scalar'
import { defineStyleContract } from '../style/contract'
import { courseCardContract } from './CourseCard.contract'

/**
 * CourseCard generated class contract.
 *
 * root class가 component boundary를 소유하고, tag/slot selector는 그 아래에서만
 * anatomy를 고른다. 전역 `article[data-card="course"]` selector는 쓰지 않는다.
 */
export const courseCardStyle = defineStyleContract(courseCardContract.name, {
  root: css`
    &[data-part="card"] {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: start;
      column-gap: ${pad(2)};
      row-gap: ${pad(1)};
      padding: ${pad(2)};
    }

    &[data-part="card"] > [data-slot="preview"] {
      grid-column: 1;
      grid-row: 1 / span 3;
      min-block-size: 0;
      inline-size: 56px;
      block-size: 56px;
      padding: 0;
      border: 0;
      border-radius: ${radius('md')};
      align-self: start;
    }
    &[data-part="card"] > [data-slot="title"],
    &[data-part="card"] > [data-slot="body"] {
      grid-column: 2;
      min-inline-size: 0;
    }
    &[data-part="card"] > [data-slot="footer"] {
      grid-column: 3;
      grid-row: 1 / span 3;
      align-self: center;
      justify-self: end;
      min-inline-size: max-content;
    }
    &[data-part="card"] > [data-slot="preview"] > figure {
      margin: 0;
      inline-size: 100%;
      block-size: 100%;
      border-radius: ${radius('md')};
      display: grid;
      place-items: center;
      font-size: ${font('sm')};
      font-weight: ${weight('extrabold')};
      letter-spacing: 0;
      color: ${on('accent')};
      background: linear-gradient(135deg, ${accent()}, ${gradientDeep(accent())});
    }
    &[data-part="card"][data-variant="success"] > [data-slot="preview"] > figure {
      color: ${on('success')};
      background: linear-gradient(135deg, ${status('success')}, ${gradientDeep(status('success'))});
    }
    &[data-part="card"][data-variant="warning"] > [data-slot="preview"] > figure {
      color: ${on('warning')};
      background: linear-gradient(135deg, ${status('warning')}, ${gradientDeep(status('warning'))});
    }
    &[data-part="card"][data-variant="danger"] > [data-slot="preview"] > figure {
      color: ${on('danger')};
      background: linear-gradient(135deg, ${status('danger')}, ${gradientDeep(status('danger'))});
    }
    &[data-part="card"][data-variant="default"] > [data-slot="preview"] > figure {
      background: linear-gradient(135deg, ${currentTint('strong')}, ${currentTint('deep')});
    }

    &[data-part="card"] > [data-slot="title"] > header {
      display: flex;
      flex-direction: row;
      align-items: center;
      flex-wrap: wrap;
      gap: ${pad(1)};
      min-inline-size: 0;
    }
    &[data-part="card"] > [data-slot="title"] > header > mark {
      flex: none;
      background: ${surface('subtle')};
      color: ${text('subtle')};
      border: ${hairlineWidth()} solid ${border()};
    }
    &[data-part="card"] > [data-slot="title"] [data-part="heading"][data-level="h3"] {
      margin: 0;
      ${typography('bodyStrong')}
    }
    &[data-part="card"] > [data-slot="body"] > p {
      margin: 0;
      font-size: ${font('sm')};
      color: ${text('mute')};
      line-height: 1.5;
    }

    &[data-part="card"] > [data-slot="footer"] > div {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: ${pad(1.5)};
    }
    &[data-part="card"] > [data-slot="footer"] > div > small {
      display: inline-flex;
      align-items: center;
      font-size: ${font('xs')};
      color: ${text('subtle')};
      background: ${surface('subtle')};
      border: ${hairlineWidth()} solid ${border()};
      border-radius: ${radius('pill')};
      padding: ${pad(0.5)} ${pad(1.5)};
      white-space: nowrap;
    }
    &[data-part="card"] [data-slot="actions"] {
      display: inline-flex;
      align-items: center;
      justify-content: flex-end;
      flex-wrap: wrap;
      gap: ${pad(1.5)};
    }
  `,
})

export const cssCourseCard = () => courseCardStyle.css

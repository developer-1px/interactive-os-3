import { accent, css, currentTint, gradientDeep, on, radius, status, text, typography } from '../tokens/foundations'
import { font, weight, pad } from '../tokens/palette'

/**
 * CourseCard slot inner styling — Card primitive 슬롯 안의 코스 특화 시각.
 * 카드 root layout(flex stack/border)은 parts/card.ts owner.
 */
export const cssCourseCard = () => css`
  /* preview 슬롯 — abbr 그라데이션 배지 (작은 정사각). 일반 preview override. */
  article[data-part="card"][data-card="course"] > [data-slot="preview"] {
    min-block-size: 0;
    inline-size: 56px; block-size: 56px;
    padding: 0;
    border: 0;
    border-radius: ${radius('md')};
    align-self: start;
  }
  article[data-part="card"][data-card="course"] > [data-slot="preview"] > figure {
    margin: 0;
    inline-size: 100%; block-size: 100%;
    border-radius: ${radius('md')};
    display: grid; place-items: center;
    font-size: ${font('sm')};
    font-weight: ${weight('extrabold')};
    letter-spacing: -0.02em;
    color: ${on('accent')};
    background: linear-gradient(135deg, ${accent()}, ${gradientDeep(accent())});
  }
  article[data-part="card"][data-card="course"][data-tone="success"] > [data-slot="preview"] > figure {
    color: ${on('success')};
    background: linear-gradient(135deg, ${status('success')}, ${gradientDeep(status('success'))});
  }
  article[data-part="card"][data-card="course"][data-tone="warning"] > [data-slot="preview"] > figure {
    color: ${on('warning')};
    background: linear-gradient(135deg, ${status('warning')}, ${gradientDeep(status('warning'))});
  }
  article[data-part="card"][data-card="course"][data-tone="danger"] > [data-slot="preview"] > figure {
    color: ${on('danger')};
    background: linear-gradient(135deg, ${status('danger')}, ${gradientDeep(status('danger'))});
  }
  article[data-part="card"][data-card="course"][data-tone="neutral"] > [data-slot="preview"] > figure {
    background: linear-gradient(135deg, ${currentTint('strong')}, ${currentTint('deep')});
  }

  /* title 슬롯 — h3 + meta 가로 묶음 */
  article[data-part="card"][data-card="course"] > [data-slot="title"] > header {
    display: flex; align-items: center; justify-content: space-between;
    gap: ${pad(2)};
  }
  article[data-part="card"][data-card="course"] > [data-slot="title"] [data-part="heading"][data-level="h3"] {
    margin: 0;
    ${typography('bodyStrong')}
    letter-spacing: -0.01em;
  }

  /* body 슬롯 — desc */
  article[data-part="card"][data-card="course"] > [data-slot="body"] > p {
    margin: 0;
    font-size: ${font('sm')};
    color: ${text('mute')};
    line-height: 1.5;
  }

  /* footer 슬롯 — 최종 수정일 + actions */
  article[data-part="card"][data-card="course"] > [data-slot="footer"] > footer {
    display: flex; align-items: center; justify-content: space-between;
    gap: ${pad(2)};
  }
  article[data-part="card"][data-card="course"] > [data-slot="footer"] > footer > small {
    font-size: ${font('xs')};
    color: ${text('mute')};
  }
`

import { css, font, mute, pad } from '../../foundations'

/**
 * Heading — 시맨틱 tag(h1~h3, p, small) + data-level로 시각 size.
 * variant 아니라 의미 토큰. display는 시각 최상위, h1~h3은 의미 동일+시각 step.
 */
export const heading = () => css`
  :where([data-part="heading"]) {
    margin: 0;
    line-height: 1.25;
    font-weight: 600;
  }
  :where([data-part="heading"][data-level="display"]) {
    font-size: ${font('2xl')};
    font-weight: 700;
    letter-spacing: -0.01em;
  }
  :where([data-part="heading"][data-level="h1"]) {
    font-size: ${font('xl')};
  }
  :where([data-part="heading"][data-level="h2"]) {
    font-size: ${font('lg')};
  }
  :where([data-part="heading"][data-level="h3"]) {
    font-size: ${font('md')};
  }
  :where([data-part="heading"][data-level="body"]) {
    font-size: ${font('md')};
    font-weight: 400;
    line-height: 1.5;
  }
  :where([data-part="heading"][data-level="caption"]) {
    ${mute(2)}
    font-size: ${font('xs')};
    font-weight: 400;
    line-height: 1.4;
  }
  :where([data-part="heading"][data-level="body"]) + :where([data-part="heading"][data-level="body"]) {
    margin-block-start: ${pad(1)};
  }
`

import { css } from '../css'

/**
 * grouping(d) — 시각 그룹의 중첩 깊이. d=0 투명·d=1 hairline·d=2 ring+sharp+soft·d=3 깊음.
 * pair/mute/emphasize와 함께 grouping 셀(색·강조·깊이)을 구성한다.
 * @demo type=recipe fn=grouping args=[2]
 */
export const grouping = (d: 0 | 1 | 2 | 3) => css`
  background-color: var(--ds-bg);
  border: 0;
  box-shadow: var(--ds-elev-${d});
`

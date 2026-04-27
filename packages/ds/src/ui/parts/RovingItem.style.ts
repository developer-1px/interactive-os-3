import { css } from '../../tokens/foundations'
import { pad } from '../../tokens/palette'

/**
 * RovingItem — row 시각 셸. icon · content · tail 3-track flex.
 *
 * 상태 css(hover/focus/selected/disabled) 없음 — `rovingItem` 셀렉터 union 이
 * states.ts 에서 이미 적용. 여기는 layout/typography 만.
 *
 * content 슬롯이 가변, icon/tail 은 자연 크기.
 */
export const cssRovingItem = () => css`
  :where([data-part="roving-item"]) {
    display: flex;
    align-items: center;
    gap: ${pad(1.5)};
    padding: ${pad(1)} ${pad(1.5)};
    min-inline-size: 0;
  }
  [data-part="roving-item"] > [data-slot="icon"] {
    display: inline-flex;
    align-items: center;
    flex: 0 0 auto;
  }
  [data-part="roving-item"] > [data-slot="content"] {
    flex: 1 1 auto;
    min-inline-size: 0;
    display: flex;
    flex-direction: column;
    gap: ${pad(0.25)};
  }
  [data-part="roving-item"] > [data-slot="tail"] {
    display: inline-flex;
    align-items: center;
    flex: 0 0 auto;
    margin-inline-start: auto;
  }
`

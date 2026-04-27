import { css, font, mute, pad } from '../../tokens/foundations'

/**
 * KeyValue — <dl><dt><dd> 라벨-값 쌍 리스트.
 * 셀렉터: :where(dl). dt는 mute, dd는 default.
 */
export const keyValue = () => css`
  :where(:where(dl)) {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: ${pad(0.75)} ${pad(2)};
    margin: 0;
  }
  :where(dl) > dt {
    ${mute(2)}
    font-size: ${font('sm')};
  }
  :where(dl) > dd {
    margin: 0;
    font-size: ${font('sm')};
    font-variant-numeric: tabular-nums;
  }
`

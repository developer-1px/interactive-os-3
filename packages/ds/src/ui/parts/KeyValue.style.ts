import { css, font, mute, pad } from '../../tokens/foundations'

/**
 * KeyValue — <dl><dt><dd> 라벨-값 쌍 리스트.
 * 셀렉터: dl[data-part="key-value"]. dt는 mute, dd는 default.
 */
export const keyValue = () => css`
  :where(dl[data-part="key-value"]) {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: ${pad(0.75)} ${pad(2)};
    margin: 0;
  }
  dl[data-part="key-value"] > dt {
    ${mute(2)}
    font-size: ${font('sm')};
  }
  dl[data-part="key-value"] > dd {
    margin: 0;
    font-size: ${font('sm')};
    font-variant-numeric: tabular-nums;
  }
`

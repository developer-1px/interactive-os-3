import { css, mute } from '../../tokens/semantic'
import { font, pad } from '../../tokens/scalar'
/**
 * Listbox — [icon][label ···][trailing] 보편 리스트 행.
 *
 * 구조는 Option(`<li role="option">`)의 기본 flex 배치(base.ts) 위에
 *   - `data-icon` → ::before (아이콘, fn/icon.ts iconIndicator)
 *   - `data-badge` → ::after (우측 카운트/트레일링)
 * 두 슬롯을 data-attr로만 주입. 새로운 wrapper/슬롯 없이 classless 유지.
 */
export const cssListbox = () => css`
  [role="option"][data-badge]::after {
    content: attr(data-badge);
    margin-inline-start: auto;
    padding-inline-start: ${pad(2)};
    font-size: ${font('sm')};
    ${mute(2)}
    font-variant-numeric: tabular-nums;
  }
`

import { css, radius, toneTint } from '../../tokens/foundations'
import { font } from '../../tokens/palette'
import { pad } from '../../tokens/palette'

/**
 * Callout — info/success/warning/danger 메시지 박스.
 * <aside data-part="callout"> + role=status|alert (소비자가 tone에 맞춰 결정).
 * tone은 의미 토큰(데이터), variant 아님.
 */
export const cssCallout = () => css`
  :where(aside[data-part="callout"]) {
    display: flex;
    align-items: flex-start;
    gap: ${pad(1.5)};
    padding: ${pad(2)} ${pad(2.5)};
    border-radius: ${radius('md')};
    font-size: ${font('sm')};
    line-height: 1.5;
    border: 1px solid transparent;
  }
  aside[data-part="callout"][data-tone="info"]    { ${toneTint('accent', 8)} }
  aside[data-part="callout"][data-tone="success"] { ${toneTint('success', 8)} }
  aside[data-part="callout"][data-tone="warning"] { ${toneTint('warning', 10)} }
  aside[data-part="callout"][data-tone="danger"]  { ${toneTint('danger', 10)} }
`

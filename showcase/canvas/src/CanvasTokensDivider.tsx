/**
 * CanvasTokensDivider — Atlas Divider frame.
 *
 * 출처: docs/inbox/app.jsx DividerFrame
 *   01 Border weights — subtle · default · strong · emphatic
 *   02 In context     — 같은 weight 으로 그린 카드들
 *   03 Horizontal rule — <hr>
 */
import { border } from '@p/ds/tokens/semantic'
import { SubGroup } from './SectionFrame'
import { TokenPreview } from './preview'

type Swatch = { name: string; call: string; value: string }

const WEIGHTS: Swatch[] = [
  { name: 'Subtle',   call: "border('subtle')",   value: border('subtle') },
  { name: 'Default',  call: 'border()',           value: border() },
  { name: 'Strong',   call: "border('strong')",   value: border('strong') },
  { name: 'Emphatic', call: "border('emphatic')", value: border('emphatic') },
]

export function CanvasTokensDivider() {
  return (
    <div data-part="canvas-divider-frame">
      <SubGroup title="Border weights">
        <div data-part="canvas-color-grid">
          {WEIGHTS.map((s) => (
            <TokenPreview key={s.name} kind="color" value={s.value} name={s.name} call={s.call} />
          ))}
        </div>
      </SubGroup>

      <SubGroup title="In context">
        <div data-part="canvas-divider-context">
          {WEIGHTS.map((s) => (
            <div
              key={s.name}
              data-part="canvas-divider-card"
              style={{ border: `1px solid ${s.value}` }}
            >
              1px <code>{s.call}</code>
            </div>
          ))}
        </div>
      </SubGroup>

      <SubGroup title="Horizontal rule">
        <hr data-part="canvas-divider-hr" />
      </SubGroup>
    </div>
  )
}

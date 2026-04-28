/**
 * CanvasTokensIndicators — Atlas Iconography frame 의 본 프로젝트 대응.
 *
 * `data-icon` canonical token 을 grid 로 — ICON_TOKENS SSOT.
 * cell 렌더링은 <TokenPreview kind="icon"> — value 는 var(--ds-icon-X).
 */
import { ICON_TOKENS } from '@p/ds/tokens/semantic'
import { TokenPreview } from './preview'

export function CanvasTokensIndicators() {
  return (
    <div data-part="canvas-indicator-grid">
      {ICON_TOKENS.map((t) => (
        <TokenPreview
          key={t}
          kind="icon"
          value={`var(--ds-icon-${t})`}
          name={t}
        />
      ))}
    </div>
  )
}

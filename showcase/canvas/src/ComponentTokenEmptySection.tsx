/**
 * ComponentTokenEmptySection — L1.5 의도적 빈 패널.
 *
 * Radix Colors / Base UI 노선의 자체 문서화 — semantic-only 로 어휘를 닫고
 * component token tier 를 의도적으로 비웠음을 viewer 에 명시.
 */
import { ColumnBanner } from './ColumnBanner'
import { DIVIDER } from './dividerCopy'

export function ComponentTokenEmptySection() {
  const c = DIVIDER.componentTokens
  return (
    <section data-part="canvas-empty-column" data-variant={c.tone}>
      <ColumnBanner tier={c.tier} variant={c.tone} title={c.title} hint={c.hint} />
    </section>
  )
}

/**
 * ColumnBanner — canvas L0/L1/L2/L3 4 column 의 헤더.
 *
 * de facto 수렴 (M3·Carbon·Polaris·Spectrum·Atlassian·Fluent):
 *   - eyebrow + 강한 명사 타이틀 (Tokens / Foundations / Atoms / Composed)
 *   - 거대 숫자 거부 — Knapsack 명시적 룰 (사용자는 tier 숫자가 아니라 명사로 사고)
 *   - tier 배지 (small pill) — 메타 정보는 유지하되 시각 닻 ❌
 *   - column-tinted underline — 컬럼 경계의 색조 신호 (Carbon · Atlassian)
 *   - typography-only — 카드 wrapper · 배경 fill · 아이콘 ❌
 *
 * 셀렉터:
 *   [data-part="canvas-column-banner"]          root (data-tone 으로 색)
 *   [data-part="canvas-column-banner-eyebrow"]  "L0 — TIER" mono uppercase + tier 배지
 *   [data-part="canvas-column-banner-tier"]     tier 배지 (small pill, 색조)
 *   [data-part="canvas-column-banner-title"]    display title
 *   [data-part="canvas-column-banner-hint"]     설명 단락 (max 56ch)
 *   [data-part="canvas-column-banner-rule"]     하단 column-tinted underline
 */
import type { ReactNode } from 'react'

export type ColumnTone = 'neutral' | 'blue' | 'green' | 'amber'

type Props = {
  /** L0 · L1 · L2 · L3 — tier 배지에 표시 */
  tier: string
  /** 강한 명사 타이틀 (Tokens / Foundations / Atoms / Composed) */
  title: string
  /** 보조 설명 단락 */
  hint?: ReactNode
  /** atomic-design 단계 색상. 기본 neutral. */
  tone?: ColumnTone
}

export function ColumnBanner({ tier, title, hint, tone = 'neutral' }: Props) {
  return (
    <header data-part="canvas-column-banner" data-tone={tone}>
      <div data-part="canvas-column-banner-eyebrow">
        <span data-part="canvas-column-banner-tier">{tier}</span>
      </div>
      <h2 data-part="canvas-column-banner-title">{title}</h2>
      {hint && <p data-part="canvas-column-banner-hint">{hint}</p>}
      <div data-part="canvas-column-banner-rule" />
    </header>
  )
}

/**
 * PageDivider — canvas L0/L1/L2/L3 4 column 의 헤더.
 *
 * 합성 어휘 (de facto 수렴):
 *   - Brad Frost atomic poster   tone color 단계 코딩
 *   - Vercel Geist / Linear      mono eyebrow + 거대 sans 타이틀
 *   - Atlassian / Polaris        uppercase letterspaced eyebrow + display title
 *   - Material 3 chapter         상단 full-width tone stripe
 *   - Untitled UI section-header level pill + supporting paragraph
 *
 * 셀렉터:
 *   [data-part="canvas-page-divider"]            root (data-tone 속성으로 색)
 *   [data-part="canvas-page-divider-stripe"]     상단 full-width tone stripe
 *   [data-part="canvas-page-divider-eyebrow"]    "L0 · PALETTE" mono uppercase
 *   [data-part="canvas-page-divider-numeral"]    거대 ultralight 번호 (시각 닻)
 *   [data-part="canvas-page-divider-title"]      display title (가장 강한 타이포)
 *   [data-part="canvas-page-divider-subtitle"]   부제 (한 줄, mono)
 *   [data-part="canvas-page-divider-hint"]       설명 단락 (max 56ch)
 *
 * HMI 단조 — page divider 는 lane(◆ canvas-section-tag) 보다 시각적으로 강하다.
 */
import type { ReactNode } from 'react'

export type PageTone = 'neutral' | 'blue' | 'green' | 'amber'

type Props = {
  /** L0 · L1 · L2 · L3 같은 레벨 라벨 (mono eyebrow 에 "L0 · TITLE" 합성) */
  level: string
  /** page 제목 — display title */
  title: string
  /** 부제 — 짧은 한 줄 mono */
  subtitle?: string
  /** 보조 설명 단락 (max 56ch) */
  hint?: ReactNode
  /** atomic-design 단계 색상 (Brad Frost 수렴). 기본 neutral. */
  tone?: PageTone
}

export function PageDivider({ level, title, subtitle, hint, tone = 'neutral' }: Props) {
  return (
    <header data-part="canvas-page-divider" data-tone={tone}>
      <div data-part="canvas-page-divider-stripe" />
      <div data-part="canvas-page-divider-eyebrow">
        <span>{level}</span>
        <span aria-hidden>/</span>
        <span>{title}</span>
      </div>
      <div data-part="canvas-page-divider-head">
        <span data-part="canvas-page-divider-numeral" aria-hidden>
          {level.replace(/[^0-9]/g, '') || '0'}
        </span>
        <div>
          <h2 data-part="canvas-page-divider-title">{title}</h2>
          {subtitle && (
            <div data-part="canvas-page-divider-subtitle">{subtitle}</div>
          )}
        </div>
      </div>
      {hint && <p data-part="canvas-page-divider-hint">{hint}</p>}
    </header>
  )
}

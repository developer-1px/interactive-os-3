/**
 * SectionFrame — 흰 frame + 좌상단 검은 floating tag (Figma section 톤).
 * 셀렉터: [data-part="canvas-section"], [data-part="canvas-section-tag"]
 */
import type { CSSProperties, ReactNode } from 'react'

type Props = {
  title: string
  children: ReactNode
  count?: number
  /** 폴더·tier 등 내부 식별자 (e.g. "ui/2-action") — 표준 라벨 옆에 메타로 표시 */
  subtitle?: string
  /** 업계 표준 어휘 매핑 (e.g. "Ant General · Material Actions") */
  standard?: string
  /** 그리드 cols — 비우면 ceil(sqrt(count))로 정사각 그리드 자동 산정 */
  cols?: number
}

export function SectionFrame({ title, children, count, subtitle, standard, cols }: Props) {
  const c = cols ?? (count !== undefined ? Math.max(1, Math.ceil(Math.sqrt(count))) : undefined)
  return (
    <section
      data-part="canvas-section"
      style={c !== undefined ? ({ ['--cols' as string]: c } as CSSProperties) : undefined}
    >
      <header data-part="canvas-section-tag">
        {title}
        {subtitle && <span data-subtitle>{subtitle}</span>}
        {count !== undefined && <small>{count}</small>}
      </header>
      {standard && <div data-part="canvas-section-standard">≈ {standard}</div>}
      {children}
    </section>
  )
}

export function SubGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div data-part="canvas-subgroup">
      <h3>{title}</h3>
      {children}
    </div>
  )
}

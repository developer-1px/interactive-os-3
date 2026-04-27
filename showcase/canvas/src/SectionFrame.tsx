/**
 * SectionFrame — page divider 안 lane(section) 단위.
 *
 * 위계 위치: PageDivider(L0/L1/L2/L3) > SectionFrame(◆ Color · Spacing) > Card.
 * 부모 page 의 data-tone(--tone) 을 CSS 상속으로 받아 ◆ 마커·accent rule 에 반영.
 *
 * 셀렉터:
 *   [data-part="canvas-section"]          root
 *   [data-part="canvas-section-header"]   title + meta + standard 묶음 (시각 단일 블록)
 *   [data-part="canvas-section-tag"]      ◆ + title + subtitle + count
 *   [data-part="canvas-section-standard"] ≈ 업계 표준 캡션
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
      <header data-part="canvas-section-header">
        <h3 data-part="canvas-section-tag">
          <span data-marker aria-hidden />
          <span data-title>{title}</span>
          {subtitle && <span data-subtitle>{subtitle}</span>}
          {count !== undefined && <small>{count}</small>}
        </h3>
        {standard && <div data-part="canvas-section-standard">≈ {standard}</div>}
      </header>
      {children}
    </section>
  )
}

export function SubGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div data-part="canvas-subgroup">
      <h4>{title}</h4>
      {children}
    </div>
  )
}

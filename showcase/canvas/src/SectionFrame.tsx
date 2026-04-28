/**
 * SectionFrame — page divider 안 lane(section) 단위.
 *
 * 위계 위치: PageDivider(L0/L1/L2/L3) > SectionFrame(◆ Color · Spacing) > Card.
 * 부모 page 의 data-variant(--tone) 을 CSS 상속으로 받아 ◆ 마커·accent rule 에 반영.
 *
 * 셀렉터:
 *   [data-part="canvas-section"]          root
 *   [data-part="canvas-section-header"]   title + meta + standard 묶음 (시각 단일 블록)
 *   [data-part="canvas-section-tag"]      ◆ + title + subtitle + count
 *   [data-part="canvas-section-standard"] ≈ 업계 표준 캡션
 *   [data-num]                            (Atlas-style) 2자리 zero-padded 번호
 */
import type { CSSProperties, ReactNode } from 'react'

type Props = {
  title: string
  children: ReactNode
  count?: number
  /** 폴더·tier 등 내부 식별자 (e.g. "ui/2-action") — 표준 라벨 옆에 메타로 표시 */
  subtitle?: string
  /** 그리드 cols — 비우면 ceil(sqrt(count))로 정사각 그리드 자동 산정 */
  cols?: number
  /** Atlas-style 좌측 mono 번호 ('01', '02', …). TOC anchor 와 짝. */
  num?: string
  /** anchor 타깃 — TOC 의 `#${id}` 가 여기로 점프. scroll-margin은 CSS에서. */
  id?: string
}

export function SectionFrame({ title, children, count, subtitle, cols, num, id }: Props) {
  const c = cols ?? (count !== undefined ? Math.max(1, Math.ceil(Math.sqrt(count))) : undefined)
  return (
    <section
      data-part="canvas-section"
      id={id}
      style={c !== undefined ? ({ ['--cols' as string]: c } as CSSProperties) : undefined}
    >
      <header data-part="canvas-section-header">
        <h3 data-part="canvas-section-tag">
          {num && <span data-num>{num}</span>}
          <span data-marker aria-hidden />
          <span data-title>{title}</span>
          {count !== undefined && <span data-count aria-label={`${count}개`}>{count}</span>}
          {subtitle && <span data-subtitle>{subtitle}</span>}
        </h3>
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

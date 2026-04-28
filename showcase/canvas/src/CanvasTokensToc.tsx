/**
 * CanvasTokensToc — Atlas-style numbered jump TOC.
 *
 * de facto: Figma section TOC · Notion h2 outline · Atlas one-pager.
 * 인라인 numbered jump anchors — `01 color   02 spacing   …`. anchor 사이는
 * gap+padding 으로 분리 (Atlas 원본 패턴). dot 구분자 추가 ❌.
 *
 * 셀렉터:
 *   [data-part="canvas-toc"]       root (flex wrap · mono · subtle)
 *   [data-part="canvas-toc-item"]  하나의 anchor (a)
 *   [data-num]                     2자리 zero-padded 번호
 */
import type { ReactNode } from 'react'

export type TocItem = {
  /** 2자리 zero-padded 표시 번호 (e.g. '01') */
  num: string
  /** 라벨 텍스트 */
  label: ReactNode
  /** anchor href (`#category` 등) */
  href: string
}

type Props = {
  items: TocItem[]
}

export function CanvasTokensToc({ items }: Props) {
  return (
    <nav data-part="canvas-toc" aria-label="Token sections">
      {items.map((it) => (
        <a data-part="canvas-toc-item" href={it.href} key={it.href}>
          <span data-num>{it.num}</span>
          <span data-label>{it.label}</span>
        </a>
      ))}
    </nav>
  )
}

/** partsCatalog — ds/parts 표준 부품 9종 카탈로그(데이터 + 데모 inline). */
import type { ReactNode } from 'react'
import {
  Avatar, Badge, Tag, Thumbnail, Timestamp,
  Skeleton, EmptyState, Callout, KeyValue,
} from '@p/ds/parts'

export interface PartEntry {
  name: string
  doc: string
  demo: ReactNode
}

// 9 parts × name + 1줄 설명 + demo render. variant 도입 없음 — 호출 인자만 다름.
export const PARTS: PartEntry[] = [
  { name: 'Avatar',     doc: '사람·엔티티 식별. src 있으면 img, 없으면 fallback initial.', demo: <Avatar alt="Jane Doe" initial="J" /> },
  { name: 'Badge',      doc: 'counter(숫자) 또는 status dot. tone=success/warning/danger.', demo: <Badge count={3} tone="danger" label="3 unread" /> },
  { name: 'Tag',        doc: '라벨 + optional remove(×). chip 아니라 Tag로 통일.',          demo: <Tag label="design-system" /> },
  { name: 'Thumbnail',  doc: 'aspect-ratio 보존 미리보기 미디어.',                          demo: <Thumbnail src="data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22><rect width=%2280%22 height=%2280%22 fill=%22%23ddd%22/></svg>" alt="placeholder" ratio="1/1" /> },
  { name: 'Timestamp',  doc: '<time datetime> 시맨틱. absolute or relative.',               demo: <Timestamp value={Date.now() - 1000 * 60 * 7} display="relative" /> },
  { name: 'Skeleton',   doc: '로딩 placeholder. 단색 box. width/height 호출부 결정.',       demo: <Skeleton width={120} height={12} /> },
  { name: 'EmptyState', doc: 'icon + heading + description + optional CTA.',                demo: <EmptyState title="No results" description="검색어를 바꿔보세요." /> },
  { name: 'Callout',    doc: 'info/success/warning/danger 메시지 박스. role 자동.',         demo: <Callout tone="info">정보 메시지입니다.</Callout> },
  { name: 'KeyValue',   doc: '<dl><dt><dd> 라벨-값 쌍. 데이터 주도(items prop).',           demo: <KeyValue items={[{ key: 'Status', value: 'Active' }, { key: 'Plan', value: 'Pro' }]} /> },
]

// Coverage: 표준 17 대비 9 — 누락은 다른 layer에 존재하거나 미구현.
export const COVERAGE_NOTE = '9 / 17 standard parts. 다른 layer에 존재: Heading scale·Money·Stat (entity), Divider (fn hairline), Progress (ui/2-action). 미구현: Link, Code/Kbd, Breadcrumb.'

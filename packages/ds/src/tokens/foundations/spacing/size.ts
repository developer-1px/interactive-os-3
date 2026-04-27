import { pad } from '../../palette/space'

/**
 * size — 컴포넌트 **고정 치수**. spacing scale 과 분리한다.
 *
 * Carbon `$container-*` / Spectrum `size-*` 패턴.
 *
 * inline-size·block-size 를 위해 spacing scale 을 도용하던 의미 혼동 제거.
 *   `inline-size: ${pad(14)}` ❌ — 14 는 거리가 아니라 치수
 *   `inline-size: ${size.fab}` ✅ — FAB 의 정해진 크기
 *
 * 수치는 우연히 pad scale 에 정렬되어 있지만(같은 4px 베이스) 의미선이 다르다.
 * size 가 spacing 과 함께 움직여야 할 이유가 없다 — preset 스왑 시 별도 결정.
 */
export const size = {
  /** lucide·HIG icon 표준 — text-relative. */
  icon:   '1em',
  /** sidebar/inbox row avatar — Linear/Slack/Gmail 32px 수렴. */
  avatar: pad(8),
  /** floating action button — Material/HIG 56px 표준. */
  fab:    pad(14),
} as const

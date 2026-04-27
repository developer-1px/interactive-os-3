/**
 * dividerCopy — 6 페이지 ColumnBanner 의 인간 도메인 카피 SSoT.
 *
 * 자동 도출 불가능한 한 군데. 다른 lane 메타는 fs 위치에서 도출되지만,
 * 페이지 단위 설명문은 사람이 쓴 도메인 지식이라 여기 모은다.
 */
import type { ColumnTone } from './ColumnBanner'
import type { Bucket } from './lanes'

export type DividerCopy = {
  tier: string
  tone: ColumnTone
  title: string
  hint: string
}

export const DIVIDER: Record<'palette' | 'foundations' | 'componentTokens' | Bucket, DividerCopy> = {
  palette: {
    tier: 'L0',
    tone: 'neutral',
    title: 'Palette',
    hint: 'raw scale (gray N · pad N · elev N). 수치만 — widget 직접 import ❌. foundations 의 alias 통해서만 소비.',
  },
  foundations: {
    tier: 'L1',
    tone: 'blue',
    title: 'Foundations',
    hint: 'palette 위 의미 레이어. text · surface · border · accent · state 등 role 별 토큰. widget 은 여기까지만 import.',
  },
  componentTokens: {
    tier: 'L1.5',
    tone: 'neutral',
    title: 'Component tokens',
    hint: 'intentionally empty — Radix Colors / Base UI 노선. semantic-only 로 어휘를 닫는다. 멀티브랜드·dynamic theming 도입 시 재고.',
  },
  L2: {
    tier: 'L2',
    tone: 'green',
    title: 'Primitives',
    hint: '1 role = 1 component. 단일 인터랙션 · 합성·roving·focus 없음.',
  },
  L3: {
    tier: 'L3',
    tone: 'amber',
    title: 'Patterns',
    hint: 'atoms + tokens 합성. roving·focus·gesture 가 핵심. selection · display · overlay · patterns · content widgets.',
  },
  L4: {
    tier: 'L4',
    tone: 'amber',
    title: 'Templates',
    hint: 'layout 합성 — definePage 조합 스니펫. Row/Column/Grid 같은 layout primitive · sidebar · holyGrail 등 page recipe.',
  },
  L5: {
    tier: 'L5',
    tone: 'amber',
    title: 'Devices',
    hint: 'presentation surface — Phone · MobileFrame 등 mock frame. canvas 의 시각 무게 lane 분리 근거.',
  },
}

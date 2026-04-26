/**
 * Catalog tier — 폴더(`N-<kind>`)와 1:1 대응. vite-plugin-ds-contracts 의 Kind 가
 * 곧 tier 라벨이라, 폴더 이동만으로 카탈로그 정렬이 자동 수렴한다.
 *
 *   1 indicator     아이콘·뱃지·구분자 — 시각 토큰
 *   2 action        Button·Switch — 단일 탭 액션
 *   3 input         Checkbox·Input — 폼 값을 갖는 단일 입력
 *   4 collection    Listbox·Menu·Tree — roving 단일 진입
 *   5 composite     DataGrid·Menubar — 격자·계층 합성
 *   6 overlay       Dialog·Popover·Tooltip — surface
 *   7 pattern       도메인 카드·차트 — 위 어휘를 콘텐츠로 조립
 *   8 layout        Row·Column·Grid·Carousel — 시각 골격
 */
import type { Kind } from 'virtual:ds-contracts'

export type Tier = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export const tierLabel: Record<Tier, string> = {
  1: 'indicator',
  2: 'action',
  3: 'input',
  4: 'collection',
  5: 'composite',
  6: 'overlay',
  7: 'pattern',
  8: 'layout',
}

export const tierBlurb: Record<Tier, string> = {
  1: '시각 토큰 — 다른 컴포넌트의 슬롯으로 들어가는 단위',
  2: 'native action — Button·Switch·Progress',
  3: 'form input — 폼 값을 갖는 단일 입력',
  4: 'roving 묶음 — primitive 들이 키보드 단일 진입으로 모인다',
  5: 'composite — collection 위에 격자·계층 의미를 얹는다',
  6: 'overlay — surface로 띄우고 dismiss/escape를 OS에 위임',
  7: 'pattern — 위 어휘를 도메인 콘텐츠로 조립한 카드/차트',
  8: 'layout — 페이지 시각 골격. roving 무관',
}

const kindToTier: Record<Kind, Tier> = {
  indicator: 1,
  action: 2,
  input: 3,
  collection: 4,
  composite: 5,
  overlay: 6,
  pattern: 7,
  layout: 8,
  drift: 8,
}

export function tierOf(_name: string, kind: Kind): Tier {
  return kindToTier[kind]
}

export const tierOrder: Tier[] = [1, 2, 3, 4, 5, 6, 7, 8]

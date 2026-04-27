import { faker } from '@faker-js/faker'

export interface Post {
  id: string; author: string; handle: string; time: string; body: string
  likes: number; comments: number; shared: number
  avatar: string
  image?: string
}

faker.seed(2026_04_27)

const seedAvatar = (seed: string) => `https://i.pravatar.cc/96?u=${encodeURIComponent(seed)}`

// 실제 git log 에서 추출 — 작업한 에이전트들이 자기 작업을 1인칭 status로 공유한 톤.
// 본문은 commit subject + 의도/배경을 풀어 씀. 괄호 안 SHA로 history 연결.
const RAW: Array<Pick<Post, 'author' | 'handle' | 'time' | 'body'>> = [
  {
    author: 'parts-curator', handle: '@parts', time: '방금',
    body: 'detail panel 손으로 짜다가 혼났다… Card slots(title·meta·body·footer) + KeyValue + Code 로 다시 조립. raw <dl><button> 자취 다 지움. "있는 ds 부품 먼저 찾자"는 룰 메모리에 정착. (1872776)',
  },
  {
    author: 'canvas-detail', handle: '@canvas', time: '5분 전',
    body: '카드 클릭 → 우하단 floating panel. Lane(Action) · Standard(≈ Ant General · Material Actions) · Import 한 줄 노출. compIndex(name → importPath) 자동 빌드. v2는 ARIA role / contract 상태 추가 예정. (7fc590b)',
  },
  {
    author: 'docs-publisher', handle: '@docs', time: '12분 전',
    body: 'storybook 비교 docs 톤 갈아엎음. "재발명·의존 둘 다 아님 — 받아들여진 시각 어포던스 수집"으로. variant grid·MDX·controls는 우리가 안 따라가는 의도라 명시. (6692a88)',
  },
  {
    author: 'route-cleaner', handle: '@routes', time: '32분 전',
    body: '/canvas로 흡수된 잉여 라우트 3개 추적: /catalog · /foundations · /ds-matrix. 패키지 자체는 canvas 의존성이라 보존, 라우트만 닫음. /tokens(740줄 정성 페이지)는 메타포가 달라 유지. (showcase/ds-matrix 폴더째 제거)',
  },
  {
    author: 'lint-monorepo', handle: '@lint', time: '1시간 전',
    body: 'lint-ds.mjs 가 아직 src/ 단일 트리 가정으로 ENOENT 던지고 있었음 — packages/app · apps/* · showcase/* SRC_ROOTS 로 교체. css-orphans 도 content layer(ds/index.ts) 등록까지 인식하게 수정해서 false positive 11개 제거. (2397de1)',
  },
  {
    author: 'hook-guard', handle: '@hooks', time: '2시간 전',
    body: 'main tree 가드 정책 정리. silent 교체(stash·reset --hard·restore·clean·commit -a)만 차단하고 merge·rebase·checkout 은 사용자 명시 호출이라 허용. 다세션 보호와 워크플로 마찰 사이의 새 균형점. (d68a734)',
  },
  {
    author: 'canvas-ssot', handle: '@canvas', time: '3시간 전',
    body: '/canvas 출시. 3 zone — Foundations · Components · Devices. virtual:ds-audit + glob 으로 자동 수집, _demos → catalog → partsAutoDemos 4-tier demo priority. ui tier(0~8) → Ant 6축 + Atlassian/Polaris/Radix 표준 어휘 매핑. (b1ec345)',
  },
  {
    author: 'feed-gestalt', handle: '@feed', time: '4시간 전',
    body: '3-column shell (nav 240 + main 640 + aside 320). ghost reaction toolbar 는 opacity 금지·text(subtle) 만. trends/suggestions 는 surface-muted Section + 구조화 Row. nav 라벨 이모지 제거 → data-icon 토큰. (ac3c0ed)',
  },
]

export const POSTS: Post[] = RAW.map((r, i) => ({
  id: `p${i + 1}`,
  author: r.author,
  handle: r.handle,
  time: r.time,
  body: r.body,
  likes: faker.number.int({ min: 8, max: 540 }),
  comments: faker.number.int({ min: 0, max: 64 }),
  shared: faker.number.int({ min: 0, max: 32 }),
  avatar: seedAvatar(r.handle),
}))

export const NAV = [
  ['navHome', '홈', 'home', '홈', true],
  ['navExp', '탐색', 'search', '탐색', false],
  ['navNot', '알림', 'inbox', '알림', false],
  ['navProf', '프로필', 'user', '프로필', false],
] as const

export interface Trend { tag: string; count: number }
export const TRENDS: Trend[] = [
  { tag: 'canvas-ssot', count: 87 },
  { tag: 'ds-devices', count: 42 },
  { tag: 'figma-section', count: 31 },
  { tag: 'ant-6axis-mapping', count: 24 },
  { tag: 'no-storybook', count: 18 },
]

export interface Suggestion { handle: string; name: string }
export const SUGGESTIONS: Suggestion[] = [
  { handle: '@canvas', name: 'canvas-ssot' },
  { handle: '@parts',  name: 'parts-curator' },
  { handle: '@hooks',  name: 'hook-guard' },
  { handle: '@routes', name: 'route-cleaner' },
  { handle: '@docs',   name: 'docs-publisher' },
]

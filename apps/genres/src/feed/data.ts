import { faker } from '@faker-js/faker'

export interface Post {
  id: string; author: string; handle: string; time: string; body: string
  likes: number; comments: number; shared: number
  avatar: string
  image?: string
}

faker.seed(2026_04_25)

const TOPICS = [
  'DS 커버리지 스윕 — 오늘은 Inbox·Chat·Commerce·CRM까지 정리.',
  'Radix / Base / Ariakit / RAC 중 2곳 이상 수렴하는 패턴만 ds로 채택.',
  'FlatLayout definePage의 매력: 누가 구현해도 같은 결과로 수렴하는 선언형.',
  '컴포넌트 variant 폭발을 막는 첫 단추는 prop 이름을 ARIA에 맞추는 것.',
  '오늘의 발견: container query 안에서 :popover-open이 polyfill 환경에서도 잘 동작.',
  '디자인 토큰을 palette/semantic/pair/component 4-tier로 쪼개니 widget이 단순해진다.',
  '모바일 stack-nav는 따로 만드는 게 정답. 같은 컴포넌트가 두 모드를 다 처리하면 둘 다 어색해짐.',
]

const RELATIVE_TIMES = ['방금', '5분 전', '12분 전', '1시간 전', '2시간 전', '4시간 전', '오늘 오전', '어제', '이틀 전']

const seedAvatar = (seed: string) => `https://i.pravatar.cc/96?u=${encodeURIComponent(seed)}`
const seedImage = (seed: string) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/640/360`

export const POSTS: Post[] = Array.from({ length: 8 }, (_, i) => {
  const author = faker.person.fullName()
  const handle = '@' + faker.internet.username().toLowerCase().slice(0, 14)
  const body = faker.helpers.arrayElement(TOPICS) + ' ' + faker.lorem.sentence({ min: 6, max: 14 })
  const hasImage = i % 3 === 1
  return {
    id: `p${i + 1}`,
    author,
    handle,
    time: RELATIVE_TIMES[i % RELATIVE_TIMES.length],
    body,
    likes: faker.number.int({ min: 8, max: 540 }),
    comments: faker.number.int({ min: 0, max: 64 }),
    shared: faker.number.int({ min: 0, max: 32 }),
    avatar: seedAvatar(handle),
    image: hasImage ? seedImage(`feed-${i}`) : undefined,
  }
})

export const NAV = [
  ['navHome', '홈', 'home', '홈', true],
  ['navExp', '탐색', 'search', '탐색', false],
  ['navNot', '알림', 'inbox', '알림', false],
  ['navProf', '프로필', 'user', '프로필', false],
] as const

export interface Trend { tag: string; count: number }
export const TRENDS: Trend[] = [
  { tag: 'ds-커버리지', count: 128 },
  { tag: 'flatlayout', count: 64 },
  { tag: '2026-tone', count: 42 },
  { tag: 'container-query', count: 31 },
  { tag: 'aria-first', count: 24 },
]

export interface Suggestion { handle: string; name: string }
export const SUGGESTIONS: Suggestion[] = Array.from({ length: 5 }, () => ({
  handle: '@' + faker.internet.username().toLowerCase().slice(0, 12),
  name: faker.person.fullName(),
}))

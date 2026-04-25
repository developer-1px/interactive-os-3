import { faker } from '@faker-js/faker'

faker.seed(2026_05_01)

export interface BoardChannel { id: string; name: string; type: 'public' | 'private'; unread?: number }
export interface BoardPost { id: string; who: string; time: string; text: string; avatar: string }

export const channels: BoardChannel[] = [
  { id: 'general',   name: 'general',   type: 'public',  unread: 3 },
  { id: 'ds',        name: 'ds',        type: 'public',  unread: 12 },
  { id: 'random',    name: 'random',    type: 'public' },
  { id: 'design',    name: 'design',    type: 'private' },
  { id: 'engineering', name: 'engineering', type: 'public' },
  { id: 'product',   name: 'product',   type: 'public' },
]

const TIMES = ['09:12', '09:13', '09:18', '09:24', '09:31', '09:44', '10:02', '10:08', '10:15', '10:31', '10:42', '11:08']
const TOPICS = [
  'PR #482 머지 부탁드려요. CI 그린 + 리뷰 2개 받았습니다.',
  '오늘 디자인 싱크 11시 — 어젠다는 #design 채널 핀에.',
  '모바일 collapse-sides 패턴 잘 동작하네요. side·right가 깔끔하게 popover로 합쳐짐.',
  'Slack 스타일 게시판 트라이 중 — 연속 메시지는 avatar 숨기는 식으로 처리.',
  'feed랑 shop은 faker + picsum으로 톤이 살아남.',
  'control-h 통일 후에 form 정렬 깔끔해진 거 확인했습니다 👍',
  'square fn으로 icon-only 버튼 정리 — aspect-ratio 1:1 원샷.',
  '@here Liquid Glass 시도 — hover:none + pointer:coarse에서만 발동, 데스크톱은 그대로.',
  '내일 리뷰 회의 어젠다 정리해두겠습니다. 누락된 거 있으면 댓글 부탁.',
  '포스 업데이트했어요. 새 토큰 4개 (heart, share, more, message-circle) 추가.',
  'Popover scrim 옵트인 잘 동작 — 큰 popover에 backdrop이 자연스럽게 깔립니다.',
  'GitHub Pages 배포 끝났습니다. 모바일 finder도 잘 보여요.',
]

const NAMES = [
  '유용태', 'Alex Kim', 'Sora Park', 'Jun Lee', 'Mina Choi', 'David Han',
  'Yuna Kang', 'Daniel Park', 'Iris Yoon', 'Tom Bae', 'Lia Seo', 'Nick Cho',
]

const seedAvatar = (seed: string) => `https://i.pravatar.cc/64?u=${encodeURIComponent(seed)}`

export const POSTS: Record<string, BoardPost[]> = Object.fromEntries(
  channels.map((c) => [
    c.id,
    Array.from({ length: 12 }, (_, i) => {
      // 같은 사람이 연속으로 쓰는 빈도 ~30% — Slack 스타일의 cont 효과 가시화
      const who = i > 0 && Math.random() < 0.3 ? '__same__' : faker.helpers.arrayElement(NAMES)
      return {
        id: `${c.id}-${i + 1}`,
        who,
        time: TIMES[i % TIMES.length],
        text: faker.helpers.arrayElement(TOPICS),
        avatar: '',
      }
    }).map((p, i, arr) => {
      // __same__ 마커를 직전 이름으로 치환
      const who = p.who === '__same__' ? arr[i - 1]?.who ?? '유용태' : p.who
      return { ...p, who, avatar: seedAvatar(who) }
    }),
  ]),
)

export const activeLabel = (id: string) => channels.find((c) => c.id === id)?.name ?? id

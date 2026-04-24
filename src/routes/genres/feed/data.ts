export interface Post {
  id: string; author: string; handle: string; time: string; body: string
  likes: number; comments: number; shared: number
}

export const POSTS: Post[] = [
  { id: 'p1', author: '유용태',    handle: '@yongtae', time: '2시간 전', body: 'DS 커버리지 스윕 시작 — 오늘은 8장르 중 Inbox·Chat·Commerce·CRM까지 완료.', likes: 42,  comments: 8,  shared: 3 },
  { id: 'p2', author: 'Alex Kim',  handle: '@alex',    time: '4시간 전', body: 'Radix / Base / Ariakit / RAC 중 2곳 이상 수렴하는 패턴만 ds로 채택 중.',       likes: 128, comments: 24, shared: 17 },
  { id: 'p3', author: 'Sora Park', handle: '@sora',    time: '어제',     body: 'FlatLayout definePage의 매력: 누가 구현해도 같은 결과로 수렴하는 선언형.',     likes: 89,  comments: 12, shared: 6 },
]

export const NAV = [['navHome','홈','home','🏠 홈',true],['navExp','탐색','compass','🧭 탐색',false],['navNot','알림','bell','🔔 알림',false],['navProf','프로필','user','👤 프로필',false]] as const
export const TRENDS = ['#ds-커버리지 · 128 posts', '#flatlayout · 64 posts', '#2026-tone · 42 posts']
export const SUGGESTIONS = ['📌 @radix', '📌 @react-aria', '📌 @ariakit']

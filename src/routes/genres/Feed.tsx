/**
 * Social Feed genre — 타임라인 카드 + 반응/댓글.
 *
 * 갭: PostCard / ReactionBar / CommentThread role 부재. Section + Row 조합으로 대체.
 */
import { useState } from 'react'
import { Renderer, definePage, ROOT, type NormalizedData } from '../../ds'

interface Post { id: string; author: string; handle: string; time: string; body: string; likes: number; comments: number; shared: number }
const POSTS: Post[] = [
  { id: 'p1', author: '유용태',    handle: '@yongtae',  time: '2시간 전', body: 'DS 커버리지 스윕 시작 — 오늘은 8장르 중 Inbox·Chat·Commerce·CRM까지 완료.', likes: 42, comments: 8, shared: 3 },
  { id: 'p2', author: 'Alex Kim',  handle: '@alex',     time: '4시간 전', body: 'Radix / Base / Ariakit / RAC 중 2곳 이상 수렴하는 패턴만 ds로 채택 중. 안전한 "de facto"만 남기는 전략.', likes: 128, comments: 24, shared: 17 },
  { id: 'p3', author: 'Sora Park', handle: '@sora',     time: '어제',      body: 'FlatLayout definePage의 매력: "누가 구현해도 같은 결과로 수렴"하는 선언형. JSX 조립보다 훨씬 예측 가능.', likes: 89, comments: 12, shared: 6 },
]

export function Feed() {
  const [liked, setLiked] = useState<Set<string>>(new Set())
  const toggle = (id: string) => setLiked((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n })

  const data: NormalizedData = {
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      page: { id: 'page', data: { type: 'Row', flow: 'split' } },

      /* 좌 내비 */
      nav: { id: 'nav', data: { type: 'Column', flow: 'list', emphasis: 'sunk', width: 220 } },
      navHome: { id: 'navHome', data: { type: 'Ui', component: 'ToolbarButton', props: { pressed: true, 'data-icon': 'home',  'aria-label': '홈' }, content: '🏠 홈' } },
      navExp:  { id: 'navExp',  data: { type: 'Ui', component: 'ToolbarButton', props: { 'data-icon': 'compass',                'aria-label': '탐색' }, content: '🧭 탐색' } },
      navNot:  { id: 'navNot',  data: { type: 'Ui', component: 'ToolbarButton', props: { 'data-icon': 'bell',                   'aria-label': '알림' }, content: '🔔 알림' } },
      navProf: { id: 'navProf', data: { type: 'Ui', component: 'ToolbarButton', props: { 'data-icon': 'user',                   'aria-label': '프로필' }, content: '👤 프로필' } },
      composeBtn: { id: 'composeBtn', data: { type: 'Ui', component: 'Button', props: { onClick: () => alert('글쓰기') }, content: '＋ 글쓰기' } },

      /* 중앙 타임라인 */
      feed: { id: 'feed', data: { type: 'Column', flow: 'form', grow: true } },
      feedHdr: { id: 'feedHdr', data: { type: 'Header', flow: 'split' } },
      feedTitle: { id: 'feedTitle', data: { type: 'Text', variant: 'h1', content: '홈' } },
      feedTabs: { id: 'feedTabs', data: { type: 'Ui', component: 'Toolbar', props: { 'aria-label': '피드 탭' } } },
      tabAll:   { id: 'tabAll',   data: { type: 'Ui', component: 'ToolbarButton', props: { pressed: true,  'aria-label': '전체' }, content: '전체' } },
      tabFol:   { id: 'tabFol',   data: { type: 'Ui', component: 'ToolbarButton', props: { 'aria-label': '팔로잉' },               content: '팔로잉' } },
      tabFav:   { id: 'tabFav',   data: { type: 'Ui', component: 'ToolbarButton', props: { 'aria-label': '인기' },                content: '인기' } },

      ...Object.fromEntries(POSTS.flatMap((p) => [
        [`card-${p.id}`, { id: `card-${p.id}`, data: { type: 'Section', emphasis: 'raised' as const, flow: 'form' as const } }],
        [`meta-${p.id}`, { id: `meta-${p.id}`, data: { type: 'Row', flow: 'cluster' } }],
        [`avatar-${p.id}`, { id: `avatar-${p.id}`, data: {
          type: 'Text', variant: 'strong',
          content: p.author[0],
          width: 36,
        } }],
        [`who-${p.id}`, { id: `who-${p.id}`, data: {
          type: 'Text', variant: 'strong',
          content: <>{p.author} <small>{p.handle} · {p.time}</small></>,
          grow: true,
        } }],
        [`more-${p.id}`, { id: `more-${p.id}`, data: { type: 'Ui', component: 'Button', props: { 'aria-label': '더보기', 'data-icon': 'more' }, content: '⋯' } }],

        [`body-${p.id}`, { id: `body-${p.id}`, data: { type: 'Text', variant: 'body', content: p.body } }],

        [`rxn-${p.id}`, { id: `rxn-${p.id}`, data: { type: 'Ui', component: 'Toolbar', props: { 'aria-label': '반응' } } }],
        [`rxLike-${p.id}`,   { id: `rxLike-${p.id}`,   data: { type: 'Ui', component: 'ToolbarButton', props: { pressed: liked.has(p.id), onClick: () => toggle(p.id), 'data-icon': 'heart',  'aria-label': '좋아요' }, content: <>♥ {p.likes + (liked.has(p.id) ? 1 : 0)}</> } }],
        [`rxCom-${p.id}`,    { id: `rxCom-${p.id}`,    data: { type: 'Ui', component: 'ToolbarButton', props: { 'data-icon': 'message-circle', 'aria-label': '댓글' }, content: <>💬 {p.comments}</> } }],
        [`rxShare-${p.id}`,  { id: `rxShare-${p.id}`,  data: { type: 'Ui', component: 'ToolbarButton', props: { 'data-icon': 'share',          'aria-label': '공유' }, content: <>↗ {p.shared}</> } }],
      ])),

      /* 우 사이드: 트렌드 */
      side: { id: 'side', data: { type: 'Column', flow: 'form', emphasis: 'raised', width: 280 } },
      sHdr: { id: 'sHdr', data: { type: 'Text', variant: 'h3', content: '트렌드' } },
      t1: { id: 't1', data: { type: 'Text', variant: 'body', content: '#ds-커버리지 · 128 posts' } },
      t2: { id: 't2', data: { type: 'Text', variant: 'body', content: '#flatlayout · 64 posts' } },
      t3: { id: 't3', data: { type: 'Text', variant: 'body', content: '#2026-tone · 42 posts' } },
      sugHdr: { id: 'sugHdr', data: { type: 'Text', variant: 'h3', content: '추천 팔로우' } },
      sug1: { id: 'sug1', data: { type: 'Text', variant: 'body', content: '📌 @radix' } },
      sug2: { id: 'sug2', data: { type: 'Text', variant: 'body', content: '📌 @react-aria' } },
      sug3: { id: 'sug3', data: { type: 'Text', variant: 'body', content: '📌 @ariakit' } },
    },
    relationships: {
      [ROOT]: ['page'],
      page: ['nav', 'feed', 'side'],

      nav: ['navHome', 'navExp', 'navNot', 'navProf', 'composeBtn'],

      feed: ['feedHdr', ...POSTS.map((p) => `card-${p.id}`)],
      feedHdr: ['feedTitle', 'feedTabs'],
      feedTabs: ['tabAll', 'tabFol', 'tabFav'],
      ...Object.fromEntries(POSTS.map((p) => [`card-${p.id}`, [`meta-${p.id}`, `body-${p.id}`, `rxn-${p.id}`]])),
      ...Object.fromEntries(POSTS.map((p) => [`meta-${p.id}`, [`avatar-${p.id}`, `who-${p.id}`, `more-${p.id}`]])),
      ...Object.fromEntries(POSTS.map((p) => [`rxn-${p.id}`, [`rxLike-${p.id}`, `rxCom-${p.id}`, `rxShare-${p.id}`]])),

      side: ['sHdr', 't1', 't2', 't3', 'sugHdr', 'sug1', 'sug2', 'sug3'],
    },
  }
  return <Renderer page={definePage(data)} />
}


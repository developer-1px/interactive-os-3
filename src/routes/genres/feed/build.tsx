import { ROOT, type NormalizedData } from '../../../ds'
import { NAV, POSTS, SUGGESTIONS, TRENDS } from './data'

export interface FeedState { liked: Set<string>; toggle: (id: string) => void }

export function buildFeedPage(s: FeedState): NormalizedData {
  const postEnts = POSTS.flatMap((p) => [
    [`card-${p.id}`,    { id: `card-${p.id}`,    data: { type: 'Section', emphasis: 'raised', flow: 'form' } }],
    [`meta-${p.id}`,    { id: `meta-${p.id}`,    data: { type: 'Row', flow: 'cluster' } }],
    [`avatar-${p.id}`,  { id: `avatar-${p.id}`,  data: { type: 'Text', variant: 'strong', content: p.author[0], width: 36, aspect: 'square' } }],
    [`who-${p.id}`,     { id: `who-${p.id}`,     data: { type: 'Text', variant: 'strong', content: <>{p.author} <small>{p.handle} · {p.time}</small></>, grow: true } }],
    [`more-${p.id}`,    { id: `more-${p.id}`,    data: { type: 'Ui', component: 'Button', props: { 'aria-label': '더보기', 'data-icon': 'more' }, content: '' } }],
    [`body-${p.id}`,    { id: `body-${p.id}`,    data: { type: 'Text', variant: 'body', content: p.body } }],
    [`rxn-${p.id}`,     { id: `rxn-${p.id}`,     data: { type: 'Ui', component: 'Toolbar', props: { 'aria-label': '반응' } } }],
    [`rxLike-${p.id}`,  { id: `rxLike-${p.id}`,  data: { type: 'Ui', component: 'ToolbarButton', props: { pressed: s.liked.has(p.id), onClick: () => s.toggle(p.id), 'data-icon': 'heart', 'aria-label': '좋아요' }, content: String(p.likes + (s.liked.has(p.id) ? 1 : 0)) } }],
    [`rxCom-${p.id}`,   { id: `rxCom-${p.id}`,   data: { type: 'Ui', component: 'ToolbarButton', props: { 'data-icon': 'message-circle', 'aria-label': '댓글' }, content: String(p.comments) } }],
    [`rxShare-${p.id}`, { id: `rxShare-${p.id}`, data: { type: 'Ui', component: 'ToolbarButton', props: { 'data-icon': 'share', 'aria-label': '공유' }, content: String(p.shared) } }],
  ] as Array<readonly [string, unknown]>)
  return {
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      page: { id: 'page', data: { type: 'Row', flow: 'split', roledescription: 'feed-page', label: 'Feed' } },
      menuBtn: { id: 'menuBtn', data: { type: 'Ui', component: 'Button', props: { popovertarget: 'feed-menu', 'aria-label': '메뉴', 'data-collapse-menu-btn': '' }, content: '☰' } },
      menuPop: { id: 'menuPop', data: { type: 'Ui', component: 'Popover', props: { id: 'feed-menu', label: 'Feed 메뉴', scrim: true }, content: (
        <>
          <section>
            <h3>탐색</h3>
            <ul>{NAV.map(([id, label, , content]) => <li key={id}>{content || label}</li>)}</ul>
          </section>
          <section>
            <h3>트렌드</h3>
            <ul>{TRENDS.map((t, i) => <li key={i}>{t}</li>)}</ul>
          </section>
          <section>
            <h3>추천 팔로우</h3>
            <ul>{SUGGESTIONS.map((s2, i) => <li key={i}>{s2}</li>)}</ul>
          </section>
        </>
      ) } },
      nav: { id: 'nav', data: { type: 'Column', flow: 'list', emphasis: 'sunk', width: 220 } },
      ...Object.fromEntries(NAV.map(([id, label, icon, content, pressed]) => [id, { id, data: {
        type: 'Ui', component: 'ToolbarButton', props: { pressed: pressed || undefined, 'data-icon': icon, 'aria-label': label }, content,
      } }])),
      composeBtn: { id: 'composeBtn', data: { type: 'Ui', component: 'Button', props: { onClick: () => alert('글쓰기') }, content: '＋ 글쓰기' } },
      feed: { id: 'feed', data: { type: 'Column', flow: 'form', grow: true } },
      feedHdr: { id: 'feedHdr', data: { type: 'Header', flow: 'split' } },
      feedTitle: { id: 'feedTitle', data: { type: 'Text', variant: 'h1', content: '홈' } },
      feedTabs: { id: 'feedTabs', data: { type: 'Ui', component: 'Toolbar', props: { 'aria-label': '피드 탭' } } },
      tabAll: { id: 'tabAll', data: { type: 'Ui', component: 'ToolbarButton', props: { pressed: true, 'aria-label': '전체' }, content: '전체' } },
      tabFol: { id: 'tabFol', data: { type: 'Ui', component: 'ToolbarButton', props: { 'aria-label': '팔로잉' }, content: '팔로잉' } },
      tabFav: { id: 'tabFav', data: { type: 'Ui', component: 'ToolbarButton', props: { 'aria-label': '인기' }, content: '인기' } },
      ...Object.fromEntries(postEnts),
      side: { id: 'side', data: { type: 'Column', flow: 'form', emphasis: 'raised', width: 280 } },
      sHdr: { id: 'sHdr', data: { type: 'Text', variant: 'h3', content: '트렌드' } },
      ...Object.fromEntries(TRENDS.map((t, i) => [`tr${i}`, { id: `tr${i}`, data: { type: 'Text', variant: 'body', content: t } }])),
      sugHdr: { id: 'sugHdr', data: { type: 'Text', variant: 'h3', content: '추천 팔로우' } },
      ...Object.fromEntries(SUGGESTIONS.map((s2, i) => [`sg${i}`, { id: `sg${i}`, data: { type: 'Text', variant: 'body', content: s2 } }])),
    },
    relationships: {
      [ROOT]: ['page', 'menuPop'], page: ['nav', 'feed', 'side'],
      nav: [...NAV.map(([id]) => id), 'composeBtn'],
      feed: ['feedHdr', ...POSTS.map((p) => `card-${p.id}`)],
      feedHdr: ['menuBtn', 'feedTitle', 'feedTabs'],
      feedTabs: ['tabAll', 'tabFol', 'tabFav'],
      ...Object.fromEntries(POSTS.map((p) => [`card-${p.id}`, [`meta-${p.id}`, `body-${p.id}`, `rxn-${p.id}`]])),
      ...Object.fromEntries(POSTS.map((p) => [`meta-${p.id}`, [`avatar-${p.id}`, `who-${p.id}`, `more-${p.id}`]])),
      ...Object.fromEntries(POSTS.map((p) => [`rxn-${p.id}`, [`rxLike-${p.id}`, `rxCom-${p.id}`, `rxShare-${p.id}`]])),
      side: ['sHdr', ...TRENDS.map((_, i) => `tr${i}`), 'sugHdr', ...SUGGESTIONS.map((_, i) => `sg${i}`)],
    },
  }
}

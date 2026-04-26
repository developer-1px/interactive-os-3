import { ROOT, type Event, type NormalizedData } from '@p/ds'
import { NAV, POSTS, SUGGESTIONS, TRENDS } from './data'

export interface FeedState {
  liked: Set<string>; toggle: (id: string) => void
  nav: { data: NormalizedData; onEvent: (e: Event) => void }
  feedTabs: { data: NormalizedData; onEvent: (e: Event) => void }
  rxn: Record<string, { data: NormalizedData; onEvent: (e: Event) => void }>
}

export function buildFeedPage(s: FeedState): NormalizedData {
  const postEnts = POSTS.flatMap((p) => [
    [`card-${p.id}`,    { id: `card-${p.id}`,    data: { type: 'Section', flow: 'form' } }],
    [`meta-${p.id}`,    { id: `meta-${p.id}`,    data: { type: 'Row', flow: 'cluster' } }],
    [`avatar-${p.id}`,  { id: `avatar-${p.id}`,  data: { type: 'Text', variant: 'strong', content: <img src={p.avatar} alt="" loading="lazy" />, width: 40, aspect: 'square' } }],
    [`who-${p.id}`,     { id: `who-${p.id}`,     data: { type: 'Text', variant: 'strong', content: <>{p.author} <small>{p.handle} · {p.time}</small></>, grow: true } }],
    [`more-${p.id}`,    { id: `more-${p.id}`,    data: { type: 'Ui', component: 'Button', props: { 'aria-label': '더보기', 'data-icon': 'more' }, content: '' } }],
    [`body-${p.id}`,    { id: `body-${p.id}`,    data: { type: 'Text', variant: 'body', content: p.body } }],
    ...(p.image ? [[`img-${p.id}`, { id: `img-${p.id}`, data: { type: 'Text', variant: 'body', content: <img src={p.image} alt="" loading="lazy" /> } }] as const] : []),
    [`rxn-${p.id}`, { id: `rxn-${p.id}`, data: { type: 'Ui', component: 'Toolbar', props: { data: s.rxn[p.id]?.data, onEvent: s.rxn[p.id]?.onEvent, 'aria-label': '반응' } } }],
  ] as Array<readonly [string, unknown]>)
  return {
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      page: { id: 'page', data: { type: 'Row', flow: 'split', label: 'Feed' } },
      menuBtn: { id: 'menuBtn', data: { type: 'Ui', component: 'Button', props: { popoverTarget: 'feed-menu', 'aria-label': '메뉴', 'data-icon': 'more', 'data-collapse-menu-btn': '' }, content: '' } },
      menuPop: { id: 'menuPop', data: { type: 'Ui', component: 'Popover', props: { id: 'feed-menu', label: 'Feed 메뉴', scrim: true }, content: (
        <>
          <section>
            <h3>탐색</h3>
            <ul>{NAV.map(([id, label]) => <li key={id}>{label}</li>)}</ul>
          </section>
          <section>
            <h3>트렌드</h3>
            <ul>{TRENDS.map((t, i) => <li key={i}>#{t.tag} · {t.count} posts</li>)}</ul>
          </section>
          <section>
            <h3>추천 팔로우</h3>
            <ul>{SUGGESTIONS.map((s2, i) => <li key={i}>{s2.name} <small>{s2.handle}</small></li>)}</ul>
          </section>
        </>
      ) } },
      nav: { id: 'nav', data: { type: 'Nav', flow: 'form', width: 240, label: '피드 내비게이션' } },
      navBrand: { id: 'navBrand', data: { type: 'Text', variant: 'h2', content: 'Feed' } },
      navList: { id: 'navList', data: { type: 'Ui', component: 'Listbox',
        props: { data: s.nav.data, onEvent: s.nav.onEvent, 'aria-label': '피드 내비게이션' } } },
      composeBtn: { id: 'composeBtn', data: { type: 'Ui', component: 'Button', props: { onClick: () => alert('글쓰기'), 'data-icon': 'edit', 'data-cta': 'primary' }, content: '글쓰기' } },
      feed: { id: 'feed', data: { type: 'Main', flow: 'form', grow: true, label: '피드' } },
      feedHdr: { id: 'feedHdr', data: { type: 'Header', flow: 'split' } },
      feedTitle: { id: 'feedTitle', data: { type: 'Text', variant: 'h1', content: '홈' } },
      feedTabs: { id: 'feedTabs', data: { type: 'Ui', component: 'Toolbar', props: { data: s.feedTabs.data, onEvent: s.feedTabs.onEvent, 'aria-label': '피드 탭' } } },
      ...Object.fromEntries(postEnts),
      side: { id: 'side', data: { type: 'Aside', flow: 'form', width: 320, label: '추천', roledescription: 'feed-side' } },
      trendSec: { id: 'trendSec', data: { type: 'Section', emphasis: 'raised', flow: 'form' } },
      sHdr: { id: 'sHdr', data: { type: 'Text', variant: 'h3', content: '트렌드' } },
      ...Object.fromEntries(TRENDS.flatMap((t, i) => [
        [`tr${i}`, { id: `tr${i}`, data: { type: 'Row', flow: 'cluster' } }],
        [`trIcon${i}`, { id: `trIcon${i}`, data: { type: 'Text', variant: 'body', content: <span data-icon="hash" aria-hidden /> } }],
        [`trTag${i}`, { id: `trTag${i}`, data: { type: 'Text', variant: 'strong', content: t.tag, grow: true } }],
        [`trCount${i}`, { id: `trCount${i}`, data: { type: 'Text', variant: 'caption', content: `${t.count} posts` } }],
      ])),
      sugSec: { id: 'sugSec', data: { type: 'Section', emphasis: 'raised', flow: 'form' } },
      sugHdr: { id: 'sugHdr', data: { type: 'Text', variant: 'h3', content: '추천 팔로우' } },
      ...Object.fromEntries(SUGGESTIONS.flatMap((s2, i) => [
        [`sg${i}`, { id: `sg${i}`, data: { type: 'Row', flow: 'cluster' } }],
        [`sgWho${i}`, { id: `sgWho${i}`, data: { type: 'Text', variant: 'strong', content: <>{s2.name} <small>{s2.handle}</small></>, grow: true } }],
        [`sgFol${i}`, { id: `sgFol${i}`, data: { type: 'Ui', component: 'Button', props: { onClick: () => {} }, content: '팔로우' } }],
      ])),
    },
    relationships: {
      [ROOT]: ['page', 'menuPop'], page: ['nav', 'feed', 'side'],
      nav: ['navBrand', 'navList', 'composeBtn'],
      feed: ['feedHdr', ...POSTS.map((p) => `card-${p.id}`)],
      feedHdr: ['menuBtn', 'feedTitle', 'feedTabs'],
      ...Object.fromEntries(POSTS.map((p) => [`card-${p.id}`, [`meta-${p.id}`, `body-${p.id}`, ...(p.image ? [`img-${p.id}`] : []), `rxn-${p.id}`]])),
      ...Object.fromEntries(POSTS.map((p) => [`meta-${p.id}`, [`avatar-${p.id}`, `who-${p.id}`, `more-${p.id}`]])),
      side: ['trendSec', 'sugSec'],
      trendSec: ['sHdr', ...TRENDS.map((_, i) => `tr${i}`)],
      sugSec: ['sugHdr', ...SUGGESTIONS.map((_, i) => `sg${i}`)],
      ...Object.fromEntries(TRENDS.map((_, i) => [`tr${i}`, [`trIcon${i}`, `trTag${i}`, `trCount${i}`]])),
      ...Object.fromEntries(SUGGESTIONS.map((_, i) => [`sg${i}`, [`sgWho${i}`, `sgFol${i}`]])),
    },
  }
}

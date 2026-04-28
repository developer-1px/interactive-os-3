/**
 * Genres hub — 보편 FE 장르 8종을 한 곳에서 열람.
 * 각 장르 페이지는 현재 ds로 어디까지 커버되는지를 검증한다.
 */
import { Renderer, definePage, ROOT, type NormalizedData } from '@p/ds'

const entries: Array<{ id: string; title: string; blurb: string; to: string; state: 'done' | 'todo' }> = [
  { id: 'inbox',     title: 'Inbox (Gmail)',          blurb: '좌 폴더 · 중앙 리스트 · 우 디테일 3열 split',    to: '/genres/inbox',     state: 'done' },
  { id: 'chat',      title: 'Chat (Slack)',           blurb: '채널 트리 + 메시지 스트림 + composer',           to: '/genres/chat',      state: 'todo' },
  { id: 'shop',      title: 'Commerce (PLP)',         blurb: '필터 사이드바 + 카드 그리드',                    to: '/genres/shop',      state: 'todo' },
  { id: 'crm',       title: 'CRM / Admin Table',      blurb: '대량 테이블 + bulk action + drawer',              to: '/genres/crm',       state: 'todo' },
  { id: 'editor',    title: 'Editor (Notion)',        blurb: '아웃라인 + 캔버스 + 속성 패널',                   to: '/genres/editor',    state: 'todo' },
  { id: 'feed',      title: 'Social Feed',            blurb: '타임라인 카드 + 반응/댓글',                       to: '/genres/feed',      state: 'todo' },
  { id: 'analytics', title: 'Analytics Dashboard v2', blurb: '차트 확장 + 필터 + drilldown',                     to: '/genres/analytics', state: 'todo' },
  { id: 'settings',  title: 'Settings / Preferences', blurb: '섹션 내비 + 폼 + danger zone',                    to: '/genres/settings',  state: 'todo' },
]

export function GenresHub() {
  const data: NormalizedData = {
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      page: { id: 'page', data: { type: 'Column', flow: 'form' } },

      hdr: { id: 'hdr', data: { type: 'Header', flow: 'list' } },
      title: { id: 'title', data: { type: 'Text', variant: 'h1', content: '장르 커버리지 스윕' } },
      lede: { id: 'lede', data: { type: 'Text', variant: 'body',
        content: '보편 FE 장르 8종을 현재 ds로 구현해 커버리지와 갭을 동시에 확인한다. 각 카드는 해당 장르 라우트로 이동한다.' } },

      grid: { id: 'grid', data: { type: 'Grid', cols: 4, flow: 'form' } },
      ...Object.fromEntries(entries.map((e) => [
        `card-${e.id}`,
        { id: `card-${e.id}`, data: {
          type: 'Section',
          heading: { variant: 'h3' as const, content: e.title },
          variant: 'raised' as const,
        } },
      ])),
      ...Object.fromEntries(entries.flatMap((e) => [
        [`blurb-${e.id}`,  { id: `blurb-${e.id}`,  data: { type: 'Text', variant: 'small', content: e.blurb } }],
        [`state-${e.id}`,  { id: `state-${e.id}`,  data: { type: 'Text', variant: 'strong',
          content: e.state === 'done' ? '✅ 완료' : '⬜ 예정' } }],
        [`link-${e.id}`,   { id: `link-${e.id}`,   data: {
          type: 'Ui', component: 'Button',
          props: { onClick: () => { window.location.hash = ''; window.location.pathname = e.to }, disabled: e.state !== 'done' },
          content: e.state === 'done' ? '열기' : '준비 중',
        } }],
      ])),
    },
    relationships: {
      [ROOT]: ['page'],
      page: ['hdr', 'grid'],
      hdr: ['title', 'lede'],
      grid: entries.map((e) => `card-${e.id}`),
      ...Object.fromEntries(entries.map((e) => [`card-${e.id}`, [`blurb-${e.id}`, `state-${e.id}`, `link-${e.id}`]])),
    },
  }
  return <Renderer page={definePage(data)} />
}

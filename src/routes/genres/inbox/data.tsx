import { Badge } from '../../../ds'

export type FolderId = 'inbox' | 'starred' | 'sent' | 'drafts' | 'spam' | 'trash'
export type LabelKey = 'work' | 'news' | 'billing' | 'alert'

export interface Message {
  id: string
  from: string
  subject: string
  preview: string
  time: string
  unread: boolean
  starred: boolean
  label?: LabelKey
  folder: FolderId
  body: string
}

export const folders: Array<{ id: FolderId; label: string; icon: string; count?: number }> = [
  { id: 'inbox',   label: '받은편지함', icon: 'inbox',  count: 24 },
  { id: 'starred', label: '별표',       icon: 'star',    count: 6 },
  { id: 'sent',    label: '보낸편지함', icon: 'send' },
  { id: 'drafts',  label: '임시보관',   icon: 'file',   count: 2 },
  { id: 'spam',    label: '스팸',       icon: 'ban' },
  { id: 'trash',   label: '휴지통',     icon: 'trash' },
]

export const MESSAGES: Message[] = [
  { id: 'm1', from: 'GitHub',     subject: '[ds] PR #142 merged',          preview: 'Atlas 대시보드 · invariant 린트 3층 적용 완료…', time: '오전 10:42', unread: true,  starred: true,  label: 'work',    folder: 'inbox', body: 'Your pull request #142 has been merged into main. CI passed on all checks.' },
  { id: 'm2', from: 'Anthropic',  subject: 'Claude 4.7 릴리즈 노트',      preview: '1M 컨텍스트 윈도우와 향상된 도구 사용 능력…',      time: '오전 9:15',  unread: true,  starred: false, label: 'news',    folder: 'inbox', body: 'Claude 4.7 with a 1M token context window.' },
  { id: 'm3', from: '유용태',     subject: 'ds registry 갭 리뷰',          preview: '현재 장르 스윕 중에 발견된 Tree/Menu 부재가…',     time: '어제',       unread: false, starred: true,  label: 'work',    folder: 'inbox', body: 'registry.ts에 Tree/Menu가 등록되지 않아 FlatLayout에서 직접 못 씁니다.' },
  { id: 'm4', from: 'Linear',     subject: 'INGEST-214 상태 변경',         preview: 'pipeline 장애 건 · In Progress → In Review…',     time: '어제',       unread: false, starred: false, label: 'work',    folder: 'inbox', body: 'Ticket moved to In Review.' },
  { id: 'm5', from: 'Stripe',     subject: '2026년 3월 결제 요약',         preview: '총 매출 $12,430 · 활성 구독 98건…',                time: '월요일',     unread: false, starred: false, label: 'billing', folder: 'inbox', body: 'March summary attached.' },
  { id: 'm6', from: 'npm',        subject: 'vite 6.2.3 보안 업데이트',     preview: '의존성 트리에서 1건의 high severity 이슈…',        time: '지난 주',    unread: true,  starred: false, label: 'alert',   folder: 'inbox', body: 'Please update vite.' },
  { id: 'm7', from: 'Notion',     subject: '공유된 페이지: DS Roadmap Q2', preview: '유용태님이 DS Roadmap Q2 페이지를 공유했습니다…',  time: '지난 주',    unread: false, starred: true,  label: 'work',    folder: 'inbox', body: 'Shared page link.' },
  { id: 'm8', from: 'Sentry',     subject: 'production: 새 이슈 3건',      preview: 'TypeError on /viewer · 누적 42회 발생…',           time: '2주 전',     unread: false, starred: false, label: 'alert',   folder: 'inbox', body: '3 new issues in production.' },
]

export const labelTone: Record<LabelKey, 'info' | 'success' | 'warning' | 'danger' | 'neutral'> = {
  work: 'info', news: 'neutral', billing: 'success', alert: 'danger',
}

export function messageRowNodes(msgs: Message[], selectedId: string, onSelect: (id: string) => void) {
  const out: Record<string, { id: string; data: Record<string, unknown> }> = {}
  for (const m of msgs) {
    out[`row-${m.id}`] = { id: `row-${m.id}`, data: {
      type: 'Ui', component: 'DataGridRow',
      props: { 'aria-selected': m.id === selectedId, 'data-unread': m.unread || undefined, onClick: () => onSelect(m.id) },
    } }
    const cells: Array<[string, unknown]> = [
      [`star`, <span aria-label={m.starred ? '별표 있음' : '별표 없음'} aria-pressed={m.starred} data-icon={m.starred ? 'star' : 'star-off'} />],
      [`from`, <>{m.from}{m.unread && <span data-icon="dot" data-tone="info" aria-label="안 읽음" />}</>],
      [`subject`, <><strong>{m.subject}</strong> <small>— {m.preview}</small></>],
      [`label`, m.label ? <Badge tone={labelTone[m.label]}>{m.label}</Badge> : null],
      [`time`, <small>{m.time}</small>],
    ]
    for (const [key, content] of cells) {
      out[`c-${m.id}-${key}`] = { id: `c-${m.id}-${key}`, data: { type: 'Ui', component: 'GridCell', content } }
    }
  }
  return out
}

export function messageRowRels(msgs: Message[]) {
  const out: Record<string, string[]> = {}
  const keys = ['star', 'from', 'subject', 'label', 'time']
  for (const m of msgs) out[`row-${m.id}`] = keys.map((k) => `c-${m.id}-${k}`)
  return out
}

export type FolderId = 'inbox' | 'starred' | 'sent' | 'drafts' | 'spam' | 'trash'
export type LabelKey = 'work' | 'news' | 'billing' | 'alert'

export interface Message {
  id: string; from: string; subject: string; preview: string; time: string
  unread: boolean; starred: boolean; label?: LabelKey; folder: FolderId; body: string
}

export const folders: Array<{ id: FolderId; label: string; icon: string; count?: number }> = [
  { id: 'inbox',   label: '받은편지함', icon: 'inbox',  count: 24 },
  { id: 'starred', label: '별표',       icon: 'star',   count: 6 },
  { id: 'sent',    label: '보낸편지함', icon: 'send' },
  { id: 'drafts',  label: '임시보관',   icon: 'file',   count: 2 },
  { id: 'spam',    label: '스팸',       icon: 'ban' },
  { id: 'trash',   label: '휴지통',     icon: 'trash' },
]

export const MESSAGES: Message[] = [
  { id: 'm1', from: 'GitHub',    subject: '[ds] PR #142 merged', preview: 'Atlas · invariant 린트 3층…', time: '오전 10:42', unread: true,  starred: true,  label: 'work',    folder: 'inbox', body: 'PR #142 merged.' },
  { id: 'm2', from: 'Anthropic', subject: 'Claude 4.7 릴리즈',   preview: '1M 컨텍스트…',                time: '오전 9:15',  unread: true,  starred: false, label: 'news',    folder: 'inbox', body: 'Claude 4.7.' },
  { id: 'm3', from: '유용태',    subject: 'ds registry 갭',      preview: 'Tree/Menu 부재…',             time: '어제',       unread: false, starred: true,  label: 'work',    folder: 'inbox', body: '갭.' },
  { id: 'm4', from: 'Linear',    subject: 'INGEST-214',          preview: 'In Progress → In Review…',    time: '어제',       unread: false, starred: false, label: 'work',    folder: 'inbox', body: 'In Review.' },
  { id: 'm5', from: 'Stripe',    subject: '3월 결제 요약',        preview: '총 매출 $12,430…',            time: '월요일',     unread: false, starred: false, label: 'billing', folder: 'inbox', body: 'Summary.' },
  { id: 'm6', from: 'npm',       subject: 'vite 보안 업데이트',   preview: 'high severity 1건…',          time: '지난 주',    unread: true,  starred: false, label: 'alert',   folder: 'inbox', body: 'Update.' },
  { id: 'm7', from: 'Notion',    subject: '공유: DS Roadmap',    preview: '공유된 페이지…',              time: '지난 주',    unread: false, starred: true,  label: 'work',    folder: 'inbox', body: 'Shared.' },
  { id: 'm8', from: 'Sentry',    subject: '새 이슈 3건',          preview: 'TypeError…',                  time: '2주 전',     unread: false, starred: false, label: 'alert',   folder: 'inbox', body: '3 issues.' },
]

export const labelTone: Record<LabelKey, 'info' | 'success' | 'warning' | 'danger' | 'neutral'> = {
  work: 'info', news: 'neutral', billing: 'success', alert: 'danger',
}

export const ACTS = [['actReply','답장','reply'],['actForward','전달','forward'],['actArchive','보관','archive'],['actDelete','삭제','trash']] as const
export const HEADS = ['★','발신자','제목 · 프리뷰','라벨','시각']
export const CELL_KEYS = ['star','from','subject','label','time'] as const

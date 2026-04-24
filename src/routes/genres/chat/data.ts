export type ChannelType = 'public' | 'private' | 'dm'
export interface Channel { id: string; name: string; type: ChannelType; unread?: number }
export interface Msg { id: string; who: string; time: string; text: string; me?: boolean }

export const channels: Channel[] = [
  { id: 'general',   name: 'general',   type: 'public',  unread: 3 },
  { id: 'ds',        name: 'ds',        type: 'public',  unread: 12 },
  { id: 'random',    name: 'random',    type: 'public' },
  { id: 'design',    name: 'design',    type: 'private' },
  { id: 'alex',      name: 'Alex Kim',  type: 'dm',      unread: 1 },
  { id: 'sora',      name: 'Sora Park', type: 'dm' },
]

export const INITIAL: Record<string, Msg[]> = {
  ds: [
    { id: 's1', who: '유용태', time: '09:12', text: '장르 스윕 시작합니다.' },
    { id: 's2', who: 'Claude', time: '09:13', text: 'registry에 Tree/Menu 미등록.' },
    { id: 's3', who: '유용태', time: '09:14', text: '일단 부품 조합, 갭만 기록.', me: true },
    { id: 's4', who: 'Claude', time: '09:15', text: 'MessageBubble/Composer도 갭.' },
  ],
}

export const MEMBERS = [
  '🟢 유용태 · 온라인', '🟢 Alex Kim · 온라인',
  '⚪ Sora Park · 자리비움', '⚫ Jun Lee · 오프라인',
]

export const ACTS = [['aPin','핀','pin'],['aSearch','검색','search'],['aInfo','정보','info']] as const

export const activeLabel = (id: string) => channels.find((c) => c.id === id)?.name ?? id
export const now = () => { const d = new Date(); return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}` }

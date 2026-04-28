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
    { id: 's1', who: '유용태',   time: '09:12', text: '장르 스윕 시작합니다.' },
    { id: 's2', who: 'Claude',   time: '09:13', text: 'registry에 Tree/Menu 미등록 — 8군데서 사용 중인데 import 누락.' },
    { id: 's3', who: '유용태',   time: '09:14', text: '일단 부품 조합으로 갈게요. 갭은 docs/GAPS.md에 정리.', me: true },
    { id: 's4', who: 'Claude',   time: '09:15', text: 'MessageBubble/Composer도 ds에 없음.' },
    { id: 's5', who: 'Alex Kim', time: '09:18', text: 'shop 카드는 picsum으로 채웠습니다 — 12개.' },
    { id: 's6', who: '유용태',   time: '09:19', text: '👍 feed도 픽섬 + faker 적용했어요.', me: true },
    { id: 's7', who: 'Sora Park',time: '09:23', text: '모바일에서 컨트롤 정렬 좀 봐주세요. control-h 통일됐는데 여백이 들쭉날쭉.' },
    { id: 's8', who: '유용태',   time: '09:25', text: '확인하고 답 드릴게요.', me: true },
    { id: 's9', who: 'Claude',   time: '09:27', text: 'square()의 block-size:auto가 controlBox를 덮고 있었네요. 패치 푸시.' },
  ],
}

export type MemberStatus = 'online' | 'away' | 'offline'
export interface Member { id: string; name: string; status: MemberStatus }

export const MEMBERS: Member[] = [
  { id: 'yt',   name: '유용태',    status: 'online'  },
  { id: 'ak',   name: 'Alex Kim',  status: 'online'  },
  { id: 'sp',   name: 'Sora Park', status: 'away'    },
  { id: 'jl',   name: 'Jun Lee',   status: 'offline' },
]

export const statusLabel: Record<MemberStatus, string> = {
  online: '온라인', away: '자리비움', offline: '오프라인',
}
export const statusTone: Record<MemberStatus, 'success' | 'warning' | 'default'> = {
  online: 'success', away: 'warning', offline: 'default',
}

export const ACTS = [['aPin','핀','pin'],['aSearch','검색','search'],['aInfo','정보','info']] as const

export const activeLabel = (id: string) => channels.find((c) => c.id === id)?.name ?? id
export const now = () => { const d = new Date(); return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}` }

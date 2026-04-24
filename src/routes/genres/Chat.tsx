/**
 * Chat genre — Slack 스타일 3열.
 *   좌: 채널 나열 (Toolbar 세로)
 *   중: 메시지 스트림 (Column flow=list) + composer
 *   우: 멤버/정보 aside
 *
 * 갭: MessageBubble role 부재, Composer 합성 role 부재. 현재는 Text/Input/Button 조립.
 */
import { useState } from 'react'
import { Renderer, definePage, ROOT, Badge, type NormalizedData } from '../../ds'

type ChannelType = 'public' | 'private' | 'dm'
interface Channel { id: string; name: string; type: ChannelType; unread?: number }
interface Msg { id: string; who: string; time: string; text: string; me?: boolean }

const channels: Channel[] = [
  { id: 'general',   name: 'general',   type: 'public',  unread: 3 },
  { id: 'ds',        name: 'ds',        type: 'public',  unread: 12 },
  { id: 'random',    name: 'random',    type: 'public' },
  { id: 'design',    name: 'design',    type: 'private' },
  { id: 'alex',      name: 'Alex Kim',  type: 'dm',      unread: 1 },
  { id: 'sora',      name: 'Sora Park', type: 'dm' },
]

const INITIAL: Record<string, Msg[]> = {
  ds: [
    { id: 's1', who: '유용태',   time: '09:12', text: '장르 스윕 시작합니다. Inbox 먼저.' },
    { id: 's2', who: 'Claude',   time: '09:13', text: 'registry에 Tree/Menu가 안 올라가 있어 FlatLayout에서는 못 씁니다.' },
    { id: 's3', who: '유용태',   time: '09:14', text: '일단 기존 부품 조합으로 가고 갭만 기록하죠.', me: true },
    { id: 's4', who: 'Claude',   time: '09:15', text: 'MessageBubble/Composer도 없어서 이번 장르에서도 갭.' },
  ],
}

export function Chat() {
  const [active, setActive] = useState<string>('ds')
  const [stream, setStream] = useState<Record<string, Msg[]>>(INITIAL)
  const [draft, setDraft] = useState('')

  const msgs = stream[active] ?? []
  const send = () => {
    const v = draft.trim()
    if (!v) return
    setStream((s) => ({ ...s, [active]: [...(s[active] ?? []), { id: `m-${Date.now()}`, who: '나', time: now(), text: v, me: true }] }))
    setDraft('')
  }

  const data: NormalizedData = {
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      page: { id: 'page', data: { type: 'Row', flow: 'split' } },

      /* 좌: 채널 */
      side: { id: 'side', data: { type: 'Column', flow: 'list', emphasis: 'sunk', width: 240 } },
      ws: { id: 'ws', data: { type: 'Text', variant: 'h3', content: 'DS Workspace' } },
      wsMeta: { id: 'wsMeta', data: { type: 'Text', variant: 'small', content: '유용태 · 온라인' } },
      chHdr: { id: 'chHdr', data: { type: 'Text', variant: 'strong', content: '채널' } },
      ...Object.fromEntries(channels.filter((c) => c.type !== 'dm').map((c) => [
        `ch-${c.id}`, { id: `ch-${c.id}`, data: {
          type: 'Ui', component: 'ToolbarButton',
          props: { pressed: active === c.id, onClick: () => setActive(c.id), 'aria-label': c.name, 'data-icon': c.type === 'private' ? 'lock' : 'hash' },
          content: <><span>{c.name}</span>{c.unread && <Badge tone="danger">{c.unread}</Badge>}</>,
        } },
      ])),
      dmHdr: { id: 'dmHdr', data: { type: 'Text', variant: 'strong', content: 'DM' } },
      ...Object.fromEntries(channels.filter((c) => c.type === 'dm').map((c) => [
        `ch-${c.id}`, { id: `ch-${c.id}`, data: {
          type: 'Ui', component: 'ToolbarButton',
          props: { pressed: active === c.id, onClick: () => setActive(c.id), 'aria-label': c.name, 'data-icon': 'user' },
          content: <><span>{c.name}</span>{c.unread && <Badge tone="danger">{c.unread}</Badge>}</>,
        } },
      ])),

      /* 중앙: 스트림 + composer */
      main: { id: 'main', data: { type: 'Column', flow: 'list', grow: true } },
      mainHdr: { id: 'mainHdr', data: { type: 'Header', flow: 'split' } },
      mainTitle: { id: 'mainTitle', data: { type: 'Text', variant: 'h2', content: `# ${activeLabel(active)}` } },
      mainActions: { id: 'mainActions', data: { type: 'Ui', component: 'Toolbar', props: { 'aria-label': '채널 액션' } } },
      aPin:    { id: 'aPin',    data: { type: 'Ui', component: 'ToolbarButton', props: { 'data-icon': 'pin',    'aria-label': '핀' },   content: '핀' } },
      aSearch: { id: 'aSearch', data: { type: 'Ui', component: 'ToolbarButton', props: { 'data-icon': 'search', 'aria-label': '검색' }, content: '검색' } },
      aInfo:   { id: 'aInfo',   data: { type: 'Ui', component: 'ToolbarButton', props: { 'data-icon': 'info',   'aria-label': '정보' }, content: '정보' } },

      stream: { id: 'stream', data: { type: 'Column', flow: 'list', grow: true, emphasis: 'sunk' } },
      ...Object.fromEntries(msgs.flatMap((m) => [
        [`mrow-${m.id}`, { id: `mrow-${m.id}`, data: { type: 'Row', flow: 'cluster' } }],
        [`mwho-${m.id}`, { id: `mwho-${m.id}`, data: { type: 'Text', variant: 'strong', content: m.who, width: 96 } }],
        [`mtxt-${m.id}`, { id: `mtxt-${m.id}`, data: { type: 'Text', variant: 'body', content: m.text, grow: true } }],
        [`mtm-${m.id}`,  { id: `mtm-${m.id}`,  data: { type: 'Text', variant: 'small', content: m.time, width: 64, align: 'end' } }],
      ])),

      composer: { id: 'composer', data: { type: 'Row', flow: 'cluster', emphasis: 'raised' } },
      composerIn: { id: 'composerIn', data: {
        type: 'Ui', component: 'Input',
        props: {
          placeholder: `#${activeLabel(active)} 에 메시지 보내기…`,
          'aria-label': '메시지 작성',
          value: draft,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => setDraft(e.target.value),
          onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') send() },
        },
        grow: true,
      } },
      composerSend: { id: 'composerSend', data: { type: 'Ui', component: 'Button', props: { onClick: send }, content: '전송' } },

      /* 우: 멤버 */
      right: { id: 'right', data: { type: 'Column', flow: 'form', emphasis: 'raised', width: 260 } },
      rHdr: { id: 'rHdr', data: { type: 'Text', variant: 'h3', content: '멤버 (4)' } },
      m1: { id: 'm1', data: { type: 'Text', variant: 'body', content: '🟢 유용태 · 온라인' } },
      m2: { id: 'm2', data: { type: 'Text', variant: 'body', content: '🟢 Alex Kim · 온라인' } },
      m3: { id: 'm3', data: { type: 'Text', variant: 'body', content: '⚪ Sora Park · 자리비움' } },
      m4: { id: 'm4', data: { type: 'Text', variant: 'body', content: '⚫ Jun Lee · 오프라인' } },
    },
    relationships: {
      [ROOT]: ['page'],
      page: ['side', 'main', 'right'],

      side: ['ws', 'wsMeta', 'chHdr', ...channels.filter((c) => c.type !== 'dm').map((c) => `ch-${c.id}`), 'dmHdr', ...channels.filter((c) => c.type === 'dm').map((c) => `ch-${c.id}`)],

      main: ['mainHdr', 'stream', 'composer'],
      mainHdr: ['mainTitle', 'mainActions'],
      mainActions: ['aPin', 'aSearch', 'aInfo'],
      stream: msgs.map((m) => `mrow-${m.id}`),
      ...Object.fromEntries(msgs.map((m) => [`mrow-${m.id}`, [`mwho-${m.id}`, `mtxt-${m.id}`, `mtm-${m.id}`]])),

      composer: ['composerIn', 'composerSend'],

      right: ['rHdr', 'm1', 'm2', 'm3', 'm4'],
    },
  }
  return <Renderer page={definePage(data)} />
}

function activeLabel(id: string): string {
  return channels.find((c) => c.id === id)?.name ?? id
}

function now(): string {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

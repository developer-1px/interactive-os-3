import { ROOT, type Event, type NormalizedData } from '../../../ds'
import { ACTS, INITIAL, MEMBERS, activeLabel, type Msg } from './data'

export interface ChatState {
  active: string; draft: string; stream: Record<string, Msg[]>
  setActive: (id: string) => void; setDraft: (v: string) => void; send: () => void
  pubNav: { data: NormalizedData; onEvent: (e: Event) => void }
  dmNav: { data: NormalizedData; onEvent: (e: Event) => void }
}

export function buildChatPage(s: ChatState): NormalizedData {
  const msgs = s.stream[s.active] ?? INITIAL[s.active] ?? []
  const msgEnts = msgs.flatMap((m) => [
    [`mrow-${m.id}`, { id: `mrow-${m.id}`, data: { type: 'Row', flow: 'cluster' } }],
    [`mwho-${m.id}`, { id: `mwho-${m.id}`, data: { type: 'Text', variant: 'strong', content: m.who, width: 96 } }],
    [`mtxt-${m.id}`, { id: `mtxt-${m.id}`, data: { type: 'Text', variant: 'body', content: m.text, grow: true } }],
    [`mtm-${m.id}`,  { id: `mtm-${m.id}`,  data: { type: 'Text', variant: 'small', content: m.time, width: 64, align: 'end' } }],
  ] as Array<readonly [string, unknown]>)
  return {
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      page: { id: 'page', data: { type: 'Row', flow: 'list' } },
      side: { id: 'side', data: { type: 'Column', flow: 'list', emphasis: 'sunk', width: 240 } },
      ws: { id: 'ws', data: { type: 'Text', variant: 'h3', content: 'DS Workspace' } },
      wsMeta: { id: 'wsMeta', data: { type: 'Text', variant: 'small', content: '유용태 · 온라인' } },
      chHdr: { id: 'chHdr', data: { type: 'Text', variant: 'strong', content: '채널' } },
      pubList: { id: 'pubList', data: { type: 'Ui', component: 'Listbox', props: { data: s.pubNav.data, onEvent: s.pubNav.onEvent, 'aria-label': '채널' } } },
      dmHdr: { id: 'dmHdr', data: { type: 'Text', variant: 'strong', content: 'DM' } },
      dmList: { id: 'dmList', data: { type: 'Ui', component: 'Listbox', props: { data: s.dmNav.data, onEvent: s.dmNav.onEvent, 'aria-label': 'DM' } } },
      main: { id: 'main', data: { type: 'Column', flow: 'list', grow: true } },
      mainHdr: { id: 'mainHdr', data: { type: 'Header', flow: 'split' } },
      mainTitle: { id: 'mainTitle', data: { type: 'Text', variant: 'h2', content: `# ${activeLabel(s.active)}` } },
      mainActions: { id: 'mainActions', data: { type: 'Ui', component: 'Toolbar', props: { 'aria-label': '채널 액션' } } },
      ...Object.fromEntries(ACTS.map(([id, label, icon]) => [id, { id, data: { type: 'Ui', component: 'ToolbarButton', props: { 'data-icon': icon, 'aria-label': label }, content: label } }])),
      stream: { id: 'stream', data: { type: 'Column', flow: 'list', grow: true, emphasis: 'sunk' } },
      ...Object.fromEntries(msgEnts),
      composer: { id: 'composer', data: { type: 'Row', flow: 'cluster', emphasis: 'raised' } },
      composerIn: { id: 'composerIn', data: { type: 'Ui', component: 'Input', props: {
        placeholder: `#${activeLabel(s.active)} 에 메시지…`, 'aria-label': '메시지', value: s.draft,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => s.setDraft(e.target.value),
        onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') s.send() },
      }, grow: true } },
      composerSend: { id: 'composerSend', data: { type: 'Ui', component: 'Button', props: { onClick: s.send }, content: '전송' } },
      right: { id: 'right', data: { type: 'Column', flow: 'form', emphasis: 'raised', width: 260 } },
      rHdr: { id: 'rHdr', data: { type: 'Text', variant: 'h3', content: '멤버 (4)' } },
      ...Object.fromEntries(MEMBERS.map((text, i) => [`mb${i}`, { id: `mb${i}`, data: { type: 'Text', variant: 'body', content: text } }])),
    },
    relationships: {
      [ROOT]: ['page'], page: ['side', 'main', 'right'],
      side: ['ws', 'wsMeta', 'chHdr', 'pubList', 'dmHdr', 'dmList'],
      main: ['mainHdr', 'stream', 'composer'],
      mainHdr: ['mainTitle', 'mainActions'],
      mainActions: ACTS.map(([id]) => id) as string[],
      stream: msgs.map((m) => `mrow-${m.id}`),
      ...Object.fromEntries(msgs.map((m) => [`mrow-${m.id}`, [`mwho-${m.id}`, `mtxt-${m.id}`, `mtm-${m.id}`]])),
      composer: ['composerIn', 'composerSend'],
      right: ['rHdr', ...MEMBERS.map((_, i) => `mb${i}`)],
    },
  }
}

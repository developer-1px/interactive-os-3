import { ROOT, type Event, type NormalizedData } from '@p/ds'
import { INITIAL, MEMBERS, activeLabel, statusLabel, statusTone, type Msg } from './data'

export interface ChatState {
  active: string; draft: string; stream: Record<string, Msg[]>
  setActive: (id: string) => void; setDraft: (v: string) => void; send: () => void
  pubNav: { data: NormalizedData; onEvent: (e: Event) => void }
  dmNav: { data: NormalizedData; onEvent: (e: Event) => void }
  mainActions: { data: NormalizedData; onEvent: (e: Event) => void }
}

export function buildChatPage(s: ChatState): NormalizedData {
  const msgs = s.stream[s.active] ?? INITIAL[s.active] ?? []
  // 보편 채팅 스타일 — 각 메시지는 Section bubble. me는 우측+accent, other는 좌측+surface.
  // meta(이름·시간)는 small. me는 시간만, other는 이름·시간.
  const msgEnts = msgs.flatMap((m) => [
    [`mb-${m.id}`, { id: `mb-${m.id}`, data: { type: 'Section', roledescription: m.me ? 'message-me' : 'message-other', label: m.who, flow: 'list' } }],
    [`mh-${m.id}`, { id: `mh-${m.id}`, data: { type: 'Text', variant: 'small', content: m.me ? m.time : `${m.who} · ${m.time}` } }],
    [`mt-${m.id}`, { id: `mt-${m.id}`, data: { type: 'Text', variant: 'body', content: m.text } }],
  ] as Array<readonly [string, unknown]>)
  return {
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      page: { id: 'page', data: { type: 'Row', flow: 'list', roledescription: 'chat-page', label: 'Chat' } },
      menuBtn: { id: 'menuBtn', data: { type: 'Ui', component: 'Button', props: { popoverTarget: 'chat-menu', 'aria-label': '메뉴', 'data-icon': 'list', 'data-collapse-menu-btn': '' }, content: '' } },
      menuPop: { id: 'menuPop', data: { type: 'Ui', component: 'Popover', props: { id: 'chat-menu', label: 'Chat 메뉴', scrim: true }, content: (
        <>
          <section>
            <h3>채널</h3>
            <ul>{(s.pubNav.data.entities[ROOT]?.data?.children as string[] | undefined)?.map((cid) => {
              const ent = s.pubNav.data.entities[cid]; const label = ent?.data?.label ?? cid
              return <li key={cid}>{String(label)}</li>
            }) ?? null}</ul>
          </section>
          <section>
            <h3>DM</h3>
            <ul>{MEMBERS.map((m) => <li key={m.id}>{m.name} <small>({statusLabel[m.status]})</small></li>)}</ul>
          </section>
          <section>
            <h3>멤버 ({MEMBERS.length})</h3>
            <ul>{MEMBERS.map((m) => <li key={m.id}>{m.name}</li>)}</ul>
          </section>
        </>
      ) } },
      side: { id: 'side', data: { type: 'Nav', flow: 'list', width: 240, label: '채널·DM', roledescription: 'sidebar' } },
      pubList: { id: 'pubList', data: { type: 'Ui', component: 'Listbox', props: { data: s.pubNav.data, onEvent: s.pubNav.onEvent, 'aria-label': '채널' } } },
      dmList: { id: 'dmList', data: { type: 'Ui', component: 'Listbox', props: { data: s.dmNav.data, onEvent: s.dmNav.onEvent, 'aria-label': 'DM' } } },
      main: { id: 'main', data: { type: 'Main', flow: 'list', grow: true, label: '메시지' } },
      mainHdr: { id: 'mainHdr', data: { type: 'Header', flow: 'split' } },
      mainTitle: { id: 'mainTitle', data: { type: 'Text', variant: 'h2', content: `# ${activeLabel(s.active)}` } },
      mainActions: { id: 'mainActions', data: { type: 'Ui', component: 'Toolbar', props: { data: s.mainActions.data, onEvent: s.mainActions.onEvent, 'aria-label': '채널 액션' } } },
      stream: { id: 'stream', data: { type: 'Column', flow: 'list', grow: true, emphasis: 'sunk' } },
      ...Object.fromEntries(msgEnts),
      composer: { id: 'composer', data: { type: 'Row', flow: 'cluster' } },
      composerIn: { id: 'composerIn', data: { type: 'Ui', component: 'Input', props: {
        placeholder: `#${activeLabel(s.active)} 에 메시지…`, 'aria-label': '메시지', value: s.draft,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => s.setDraft(e.target.value),
        onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') s.send() },
      }, grow: true } },
      composerSend: { id: 'composerSend', data: { type: 'Ui', component: 'Button', props: { onClick: s.send }, content: '전송' } },
      right: { id: 'right', data: { type: 'Aside', flow: 'list', width: 260, label: '멤버' } },
      ...Object.fromEntries(MEMBERS.flatMap((m) => [
        [`mrow-${m.id}`, { id: `mrow-${m.id}`, data: { type: 'Row', flow: 'cluster' } }],
        [`mdot-${m.id}`, { id: `mdot-${m.id}`, data: { type: 'Ui', component: 'LegendDot', props: { tone: statusTone[m.status], 'aria-hidden': true } } }],
        [`mnm-${m.id}`,  { id: `mnm-${m.id}`,  data: { type: 'Text', variant: 'body', content: m.name, grow: true } }],
        [`mst-${m.id}`,  { id: `mst-${m.id}`,  data: { type: 'Text', variant: 'small', content: statusLabel[m.status] } }],
      ] as Array<readonly [string, unknown]>)),
    },
    relationships: {
      [ROOT]: ['page', 'menuPop'], page: ['side', 'main', 'right'],
      side: ['pubList', 'dmList'],
      main: ['mainHdr', 'stream', 'composer'],
      mainHdr: ['menuBtn', 'mainTitle', 'mainActions'],
      stream: msgs.map((m) => `mb-${m.id}`),
      ...Object.fromEntries(msgs.map((m) => [`mb-${m.id}`, [`mh-${m.id}`, `mt-${m.id}`]])),
      composer: ['composerIn', 'composerSend'],
      right: MEMBERS.map((m) => `mrow-${m.id}`),
      ...Object.fromEntries(MEMBERS.map((m) => [`mrow-${m.id}`, [`mdot-${m.id}`, `mnm-${m.id}`, `mst-${m.id}`]])),
    },
  }
}

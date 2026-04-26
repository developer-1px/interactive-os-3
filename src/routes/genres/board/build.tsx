import { ROOT, type Event, type NormalizedData } from '../../../ds'
import { POSTS, channels, activeLabel } from './data'

export interface BoardState {
  active: string; setActive: (id: string) => void
  channelNav: { data: NormalizedData; onEvent: (e: Event) => void }
}

export function buildBoardPage(s: BoardState): NormalizedData {
  const list = POSTS[s.active] ?? []
  const postEnts = list.flatMap((p, i) => {
    const prev = list[i - 1]
    const cont = !!prev && prev.who === p.who
    return [
      [`pr-${p.id}`, { id: `pr-${p.id}`, data: { type: 'Row', flow: 'cluster', roledescription: cont ? 'post-cont' : 'post' } }],
      [`pa-${p.id}`, { id: `pa-${p.id}`, data: { type: 'Text', variant: 'strong', content: <img src={p.avatar} alt="" loading="lazy" />, width: 36, aspect: 'square' } }],
      [`pc-${p.id}`, { id: `pc-${p.id}`, data: { type: 'Column', flow: 'list', grow: true } }],
      [`ph-${p.id}`, { id: `ph-${p.id}`, data: { type: 'Text', variant: 'strong', content: <>{p.who} <small>{p.time}</small></> } }],
      [`pb-${p.id}`, { id: `pb-${p.id}`, data: { type: 'Text', variant: 'body', content: p.text } }],
    ] as Array<readonly [string, unknown]>
  })

  const data = {
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      page: { id: 'page', data: { type: 'Row', flow: 'list', roledescription: 'board-page', label: 'Board' } },
      menuBtn: { id: 'menuBtn', data: { type: 'Ui', component: 'Button', props: { popoverTarget: 'board-menu', 'aria-label': '채널', 'data-icon': 'list', 'data-collapse-menu-btn': '' }, content: '' } },
      menuPop: { id: 'menuPop', data: { type: 'Ui', component: 'Popover', props: { id: 'board-menu', label: '채널', scrim: true }, content: (
        <section>
          <h3>채널</h3>
          <ul>{channels.map((c) => <li key={c.id}>{c.type === 'private' ? '🔒' : '#'} {c.name}{c.unread ? <small> · {c.unread}</small> : null}</li>)}</ul>
        </section>
      ) } },
      side: { id: 'side', data: { type: 'Nav', flow: 'list', emphasis: 'sunk', width: 240, label: '채널' } },
      sideHdr: { id: 'sideHdr', data: { type: 'Text', variant: 'h3', content: 'DS Workspace' } },
      sideMeta: { id: 'sideMeta', data: { type: 'Text', variant: 'small', content: '12 members · 6 channels' } },
      chHdr: { id: 'chHdr', data: { type: 'Text', variant: 'small', content: '채널' } },
      chList: { id: 'chList', data: { type: 'Ui', component: 'Listbox',
        props: { data: s.channelNav.data, onEvent: s.channelNav.onEvent, 'aria-label': '채널' } } },
      main: { id: 'main', data: { type: 'Main', flow: 'list', grow: true, label: '게시물' } },
      mainHdr: { id: 'mainHdr', data: { type: 'Header', flow: 'split' } },
      mainTitle: { id: 'mainTitle', data: { type: 'Text', variant: 'h2', content: `# ${activeLabel(s.active)}` } },
      mainMeta: { id: 'mainMeta', data: { type: 'Text', variant: 'small', content: `${list.length} posts` } },
      stream: { id: 'stream', data: { type: 'Column', flow: 'list', roledescription: 'board-posts' } },
      ...Object.fromEntries(postEnts),
    },
    relationships: {
      [ROOT]: ['page', 'menuPop'], page: ['side', 'main'],
      side: ['sideHdr', 'sideMeta', 'chHdr', 'chList'],
      main: ['mainHdr', 'stream'],
      mainHdr: ['menuBtn', 'mainTitle', 'mainMeta'],
      stream: list.map((p) => `pr-${p.id}`),
      ...Object.fromEntries(list.map((p) => [`pr-${p.id}`, [`pa-${p.id}`, `pc-${p.id}`]])),
      ...Object.fromEntries(list.map((p) => [`pc-${p.id}`, [`ph-${p.id}`, `pb-${p.id}`]])),
    },
  } as NormalizedData
  return data
}

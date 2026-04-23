import { useEffect, useReducer, useState } from 'react'
import {
  Button, Feed, FeedArticle, Listbox, ListboxGroup, Option, Tab, TabList, TabPanel, Toolbar, ToolbarButton,
  Tree, Separator, FOCUS, ROOT, reduce, type Event, type NormalizedData,
} from './controls'

const mk = (id: string, label = id, extra: Record<string, unknown> = {}) => ({ id, data: { label, ...extra } })

const channelsData: NormalizedData = {
  entities: Object.fromEntries([
    [ROOT, { id: ROOT }],
    [FOCUS, { id: FOCUS, data: { id: 'c-general' } }],
    ...[
      mk('channels', 'Channels'),
      mk('c-general', '# general'),
      mk('c-random', '# random'),
      mk('c-design', '# design-system'),
      mk('c-eng', '# engineering'),
      mk('c-archived', '# old-project', { disabled: true }),
      mk('dms', 'Direct Messages'),
      mk('dm-alice', 'Alice Chen'),
      mk('dm-bob', 'Bob Park'),
      mk('dm-team', 'Alice, Bob, Carol'),
      mk('apps', 'Apps'),
      mk('app-github', 'GitHub'),
      mk('app-figma', 'Figma'),
    ].map((e) => [e.id, e]),
  ]),
  relationships: {
    [ROOT]: ['channels', 'dms', 'apps'],
    channels: ['c-general', 'c-random', 'c-design', 'c-eng', 'c-archived'],
    dms: ['dm-alice', 'dm-bob', 'dm-team'],
    apps: ['app-github', 'app-figma'],
  },
}

const expandedInitial: NormalizedData = {
  ...channelsData,
  entities: {
    ...channelsData.entities,
    __expanded__: { id: '__expanded__', data: { ids: ['channels', 'dms', 'apps'] } },
  },
}

type Msg = { id: string; author: string; time: string; text: string; pinned?: boolean }

const messages: Msg[] = [
  { id: 'm1', author: 'Alice Chen', time: '09:14', text: 'Morning! Pushed the middle-alignment fix — chevrons sit on the baseline now.' },
  { id: 'm2', author: 'Bob Park', time: '09:17', text: 'Nice. Does it cover listbox options too?', pinned: true },
  { id: 'm3', author: 'Alice Chen', time: '09:18', text: 'Yep, `states.ts` handles every roving role in one rule.' },
  { id: 'm4', author: 'Carol Ito', time: '09:22', text: 'Screenshots in the PR look great 👍' },
  { id: 'm5', author: 'Bob Park', time: '09:25', text: 'Shipping to staging after lunch.' },
]

const useViewport = () => {
  const [v, set] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }))
  useEffect(() => {
    const on = () => set({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return v
}

export default function ChatApp() {
  const [channels, dispatch] = useReducer(reduce, expandedInitial)
  const [draft, setDraft] = useState('')
  const [tab, setTab] = useState<'msgs' | 'pinned' | 'files'>('msgs')
  const [pane, setPane] = useState<'sidebar' | 'chat' | 'members'>('chat')
  const focus = channels.entities[FOCUS]?.data?.id as string
  const activeLabel = channels.entities[focus]?.data?.label as string ?? '#'
  const { w } = useViewport()
  const isCompact = w < 1024   // hide members as dedicated column
  const isNarrow = w < 720     // single-pane switching

  const onKey = (e: Event) => dispatch(e)

  return (
    <main style={{ height: '100vh', display: 'flex', flexDirection: 'column', fontSize: 14 }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderBottom: '1px solid var(--ds-border)', background: 'var(--ds-bg)', flexWrap: 'wrap' }}>
        <strong style={{ flex: 'none' }}>ds</strong>
        <input type="search" placeholder="Search…" style={{ flex: 1, minWidth: 120, maxWidth: 520 }} />
        <Toolbar aria-label="Global" style={{ display: 'flex', gap: 4, marginInlineStart: 'auto', flex: 'none' }}>
          <ToolbarButton>?</ToolbarButton>
          <ToolbarButton pressed>🔔</ToolbarButton>
          <ToolbarButton>AC</ToolbarButton>
        </Toolbar>
      </header>

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {(!isNarrow || pane === 'sidebar') && (
          <aside aria-label="Sidebar" style={{
            width: isNarrow ? '100%' : 260, flex: isNarrow ? 1 : 'none',
            borderInlineEnd: isNarrow ? 'none' : '1px solid var(--ds-border)',
            display: 'flex', flexDirection: 'column', padding: 8, gap: 4, overflow: 'auto',
          }}>
            {isNarrow && (
              <Button onClick={() => setPane('chat')} aria-label="Close channels" style={{ alignSelf: 'flex-start', marginBottom: 4 }}>← Back</Button>
            )}
            <Tree aria-label="Channels" data={channels} onEvent={(e) => {
              onKey(e)
              if (isNarrow && (e.type === 'activate' || e.type === 'navigate')) {
                const id = 'id' in e ? e.id : undefined
                if (id && !channels.relationships[id]?.length) setPane('chat')
              }
            }} />
          </aside>
        )}

        {(!isNarrow || pane === 'chat') && (
        <section aria-label="Channel" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderBottom: '1px solid var(--ds-border)', flexWrap: 'wrap' }}>
            {isNarrow && <Button onClick={() => setPane('sidebar')} aria-label="Open channels">☰</Button>}
            <h2 style={{ margin: 0, fontSize: 16, flex: 'none' }}>{activeLabel}</h2>
            <TabList aria-label="Channel views" style={{ display: 'flex', gap: 4, marginInlineStart: 'auto', flexWrap: 'wrap' }}>
              <Tab selected={tab === 'msgs'} controls="chat-msgs" onClick={() => setTab('msgs')}>Messages</Tab>
              <Tab selected={tab === 'pinned'} controls="chat-pinned" onClick={() => setTab('pinned')}>Pinned</Tab>
              <Tab selected={tab === 'files'} controls="chat-files" onClick={() => setTab('files')}>Files</Tab>
            </TabList>
            {isCompact && !isNarrow && (
              <Button onClick={() => setPane(pane === 'members' ? 'chat' : 'members')} pressed={pane === 'members'} aria-label="Members">👥</Button>
            )}
            {isNarrow && (
              <Button onClick={() => setPane('members')} aria-label="Members">👥</Button>
            )}
          </div>

          <TabPanel id="chat-msgs" hidden={tab !== 'msgs'} style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <Feed aria-label="Messages" style={{ flex: 1, overflow: 'auto', padding: '12px 16px' }}>
              {messages.map((m) => (
                <FeedArticle key={m.id} aria-labelledby={`${m.id}-author`} aria-describedby={`${m.id}-body`}>
                  <div aria-hidden style={{ width: 36, height: 36, borderRadius: 6, background: 'var(--ds-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', fontSize: 13 }}>
                    {m.author.split(' ').map((s) => s[0]).join('').slice(0, 2)}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                      <strong id={`${m.id}-author`}>{m.author}</strong>
                      <time style={{ opacity: 0.5, fontSize: 12 }}>{m.time}</time>
                      {m.pinned && <span aria-label="pinned" style={{ opacity: 0.6, fontSize: 12 }}>📌</span>}
                    </div>
                    <div id={`${m.id}-body`}>{m.text}</div>
                  </div>
                </FeedArticle>
              ))}
            </Feed>

            <form
              style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 12, borderTop: '1px solid var(--ds-border)' }}
              onSubmit={(e) => { e.preventDefault(); if (draft.trim()) setDraft('') }}
            >
              <Toolbar aria-label="Formatting" style={{ display: 'flex', gap: 2 }}>
                <ToolbarButton>B</ToolbarButton>
                <ToolbarButton>I</ToolbarButton>
                <ToolbarButton>S</ToolbarButton>
                <Separator orientation="vertical" style={{ width: 1, height: 20, background: 'var(--ds-border)', margin: '0 4px' }} />
                <ToolbarButton>🔗</ToolbarButton>
                <ToolbarButton>@</ToolbarButton>
                <ToolbarButton>📎</ToolbarButton>
              </Toolbar>
              <textarea
                placeholder={`Message ${activeLabel}`}
                rows={3}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    if (draft.trim()) setDraft('')
                  }
                }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ opacity: 0.5, fontSize: 12 }}>Enter to send · Shift+Enter for newline</span>
                <Button type="submit" style={{ marginInlineStart: 'auto' }} disabled={!draft.trim()}>
                  Send
                </Button>
              </div>
            </form>
          </TabPanel>

          <TabPanel id="chat-pinned" hidden={tab !== 'pinned'} style={{ flex: 1, padding: 16, overflow: 'auto' }}>
            <Listbox aria-label="Pinned messages">
              {messages.filter((m) => m.pinned).map((m) => (
                <Option key={m.id}>📌 {m.author}: {m.text}</Option>
              ))}
            </Listbox>
          </TabPanel>

          <TabPanel id="chat-files" hidden={tab !== 'files'} style={{ flex: 1, padding: 16, overflow: 'auto' }}>
            <Listbox aria-label="Shared files">
              <ListboxGroup label="Images">
                <Option>diagram.png</Option>
                <Option>mockup.jpg</Option>
              </ListboxGroup>
              <ListboxGroup label="Documents">
                <Option>spec.pdf</Option>
                <Option disabled>archive.zip</Option>
              </ListboxGroup>
            </Listbox>
          </TabPanel>
        </section>
        )}

        {(!isCompact || pane === 'members') && (
        <aside aria-label="Members" style={{
          width: isNarrow ? '100%' : 220, flex: isNarrow ? 1 : 'none',
          borderInlineStart: isNarrow ? 'none' : '1px solid var(--ds-border)',
          padding: 8, overflow: 'auto',
        }}>
          {isNarrow && (
            <Button onClick={() => setPane('chat')} aria-label="Back" style={{ marginBottom: 8 }}>← Back</Button>
          )}
          <Listbox aria-label="Members">
            <ListboxGroup label="Online · 3">
              <Option selected>Alice Chen</Option>
              <Option>Bob Park</Option>
              <Option>Carol Ito</Option>
            </ListboxGroup>
            <ListboxGroup label="Offline · 2">
              <Option>Dan Lee</Option>
              <Option disabled>Eve (deactivated)</Option>
            </ListboxGroup>
          </Listbox>
        </aside>
        )}
      </div>
    </main>
  )
}

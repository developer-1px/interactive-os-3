/** Chat — Slack 3열 (채널 · 스트림+composer · 멤버). */
import { useState } from 'react'
import { Renderer, definePage } from '../../../ds'
import { INITIAL, now, type Msg } from './data'
import { buildChatPage } from './build'

export function Chat() {
  const [active, setActive] = useState('ds')
  const [draft, setDraft] = useState('')
  const [stream, setStream] = useState<Record<string, Msg[]>>(INITIAL)
  const send = () => {
    const v = draft.trim(); if (!v) return
    setStream((s) => ({ ...s, [active]: [...(s[active] ?? []), { id: `m-${Date.now()}`, who: '나', time: now(), text: v, me: true }] }))
    setDraft('')
  }
  return <Renderer page={definePage(buildChatPage({ active, draft, stream, setActive, setDraft, send }))} />
}

/** Settings — 섹션 내비 + 폼 + danger zone. */
import { useState } from 'react'
import { Renderer, definePage } from '../../../ds'
import type { Digest, SectionId } from './data'
import { buildSettingsPage } from './build'

export function Settings() {
  const [section, setSection] = useState<SectionId>('profile')
  const [name, setName] = useState('유용태')
  const [email, setEmail] = useState('developer.1px@gmail.com')
  const [notifEmail, setNotifEmail] = useState(true)
  const [notifPush, setNotifPush] = useState(false)
  const [notifDigest, setNotifDigest] = useState<Digest>('weekly')
  return <Renderer page={definePage(buildSettingsPage({
    section, name, email, notifEmail, notifPush, notifDigest,
    setSection, setName, setEmail, setNotifEmail, setNotifPush, setNotifDigest,
  }))} />
}

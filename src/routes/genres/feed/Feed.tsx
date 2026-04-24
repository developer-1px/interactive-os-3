/** Social Feed — 타임라인 카드 + 반응. */
import { useState } from 'react'
import { Renderer, definePage } from '../../../ds'
import { buildFeedPage } from './build'

export function Feed() {
  const [liked, setLiked] = useState<Set<string>>(new Set())
  const toggle = (id: string) => setLiked((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n })
  return <Renderer page={definePage(buildFeedPage({ liked, toggle }))} />
}

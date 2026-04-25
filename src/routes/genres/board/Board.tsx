import { useState } from 'react'
import { Renderer, definePage } from '../../../ds'
import { buildBoardPage } from './build'

export function Board() {
  const [active, setActive] = useState<string>('ds')
  return <Renderer page={definePage(buildBoardPage({ active, setActive }))} />
}

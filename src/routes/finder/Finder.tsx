import { useMemo } from 'react'
import { Renderer, definePage, ROOT, type NormalizedData } from '../../ds'
import { FinderBody } from './FinderBody'

/**
 * /finder — macOS Finder 스타일 4-pane shell.
 *
 * FlatLayout 셸 + FinderBody Ui leaf. sidebar/columns/preview 는 상태가 강결합되어
 * 한 묶음 Ui 로 둔다 (G5 — FlatLayout 은 페이지 조립층).
 */
export function Finder() {
  const page: NormalizedData = useMemo(() => definePage({
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      body: { id: 'body', data: { type: 'Ui', component: 'FinderBody' } },
    },
    relationships: { [ROOT]: ['body'] },
  }), [])
  return <Renderer page={page} localRegistry={{ FinderBody }} />
}

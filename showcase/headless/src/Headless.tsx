import { useMemo } from 'react'
import { Renderer, definePage, ROOT, type NormalizedData } from '@p/ds'
import { HeadlessLab } from './HeadlessLab'

/**
 * /headless — @p/headless 패키지의 API 카탈로그 + 라이브 데모.
 *
 * FlatLayout 셸 + HeadlessLab 본문. 헤드리스 어휘(axes/roving/gesture/state/
 * flow/feature/layout/middleware)를 카테고리별 묶음으로 보여준다.
 */
export function Headless() {
  const page: NormalizedData = useMemo(() => definePage({
    entities: {
      [ROOT]:  { id: ROOT,    data: {} },
      main:    { id: 'main',  data: { type: 'Main', flow: 'list', label: '@p/headless API' } },
      header:  { id: 'header',data: { type: 'Header', flow: 'list' } },
      title:   { id: 'title', data: { type: 'Text',  variant: 'h1', content: '@p/headless' } },
      desc:    { id: 'desc',  data: { type: 'Text',  variant: 'body',
        content: 'ARIA 행동 인프라 — axis 합성, roving tabindex, gesture/intent 변환, ' +
                 'declarative page tree(FlatLayout), Resource 단일 데이터 인터페이스, ' +
                 'effect/query feature 모듈. 모든 컴포넌트 어휘로부터 독립.' } },
      lab:     { id: 'lab',   data: { type: 'Ui',    component: 'HeadlessLab' } },
    },
    relationships: {
      [ROOT]:  ['main'],
      main:    ['header', 'lab'],
      header:  ['title', 'desc'],
    },
  }), [])
  return <Renderer page={page} localRegistry={{ HeadlessLab }} />
}

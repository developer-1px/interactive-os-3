import { useMemo } from 'react'
import { Renderer, definePage, ROOT, type NormalizedData } from '../../ds'
import { KeyboardLab } from './KeyboardLab'

/**
 * /keyboard — ds 부품의 키보드 인터랙션만 모아 보는 검증 페이지.
 *
 * FlatLayout 셸 + KeyboardLab 본문. G5 원칙대로 stateful fixture 묶음은 단일 Ui leaf.
 */
export function Keyboard() {
  const page: NormalizedData = useMemo(() => definePage({
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      main:   { id: 'main',   data: { type: 'Main',   flow: 'list', roledescription: 'keyboard-test', label: '키보드 인터랙션 검증' } },
      header: { id: 'header', data: { type: 'Header', flow: 'list' } },
      title:  { id: 'title',  data: { type: 'Text',   variant: 'h1', content: '키보드 테스트' } },
      desc:   { id: 'desc',   data: { type: 'Text',   variant: 'body',
        content: '각 ds 부품에 포커스를 주고 화살표·Enter·Space·Esc·Home/End·문자 입력(typeahead)을 시도하세요. focus-within 표시와 활성 옵션 id가 라이브로 나타납니다.' } },
      lab:    { id: 'lab',    data: { type: 'Ui',     component: 'KeyboardLab' } },
    },
    relationships: {
      [ROOT]: ['main'],
      main:   ['header', 'lab'],
      header: ['title', 'desc'],
    },
  }), [])
  return <Renderer page={page} localRegistry={{ KeyboardLab }} />
}

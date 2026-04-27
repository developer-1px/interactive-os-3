import { active, disabled, focus, highlighted, hover, selected } from '../../foundations'
import { base } from './base'
import { control, rovingItem } from './selectors'

export const states = () =>
  [
    base,
    highlighted(rovingItem),
    selected(rovingItem),
    hover(rovingItem),
    active(rovingItem),
    disabled(rovingItem),
    // control만 받던 포커스링을 rovingItem까지 확장 — row/gridcell/treeitem 등
    // 네이티브 엘리먼트 기반 roving item이 키보드 포커스 시 아무 피드백 없던 구멍을 막는다.
    focus(control),
    focus(rovingItem),
    selected(control),
    hover(control),
    active(control),
    disabled(control),
  ].join('\n')

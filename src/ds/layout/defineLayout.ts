/**
 * defineLayout — sub-tree of NormalizedData (Row/Column/Grid containers + slot
 * placeholders). 시맨틱 0. 페이지 셸을 잡고 widget 인스턴스를 받는 구멍만 남긴다.
 *
 * slot id 컨벤션: 문자열 그대로 placeholder. `merge`가 동일 id로 들어온
 * widget 노드를 치환한다.
 *
 * 경계: layout fragment 는 Nav/Aside/Ui 노드 금지(검증 enforce). Nav/Aside 는
 * widget 영역, Ui leaf 는 component 영역. Main/Header/Footer 는 page-level
 * 구조 landmark 로 허용.
 */
import type { NormalizedData } from '../core/types'
import { validateFragment } from './nodes'

export type LayoutBuilder<P = void> = (props: P) => NormalizedData

export function defineLayout<P = void>(build: LayoutBuilder<P>): LayoutBuilder<P> {
  return (props: P) => {
    const data = build(props)
    if (typeof window !== 'undefined' && import.meta && (import.meta as { env?: { DEV?: boolean } }).env?.DEV) {
      validateFragment(data, 'layout')
    }
    return data
  }
}

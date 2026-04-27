/**
 * defineWidget — sub-tree of NormalizedData, no `__root__`. Reusable part
 * (sidebar, topbar, theme-toggle) that owns its ARIA landmark/role.
 *
 * - widget은 자체 nav/aside/header landmark을 소유한다.
 * - widget은 라우트당 N개 인스턴스 가능. 합성은 `merge`로.
 * - validate: orphan/cycle/unknown — root 도달성은 검사하지 않는다.
 */
import type { NormalizedData } from '../headless/types'
import { validateFragment } from './nodes'

export type WidgetBuilder<P = void> = (props: P) => NormalizedData

export function defineWidget<P = void>(build: WidgetBuilder<P>): WidgetBuilder<P> {
  return (props: P) => {
    const data = build(props)
    if (typeof window !== 'undefined' && import.meta && (import.meta as { env?: { DEV?: boolean } }).env?.DEV) {
      validateFragment(data, 'widget')
    }
    return data
  }
}

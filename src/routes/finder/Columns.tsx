import { useMemo } from 'react'
import {
  Columns as ColumnsRole,
  defineFlow,
  expandBranchOnActivate,
  fromTree,
  pathAncestors,
  readResource,
  useFlow,
  useResource,
} from '../../ds'
import { walk } from './data'
import { pathResource, pinnedRootResource, treeResource } from './resources'
import { extToIcon } from './types'

/** Finder columns flow — URL이 진실 원천. EXPANDED 는 base seed(pathAncestors) 가 owner.
 *  pinnedRoot 가 reactive deps 에 포함되도록 컴포넌트에서 useMemo 로 flow 를 새로 구성한다.
 *  module-level flow 정의는 routeTree 순환 import 의 TDZ 도 함께 회피. */

export function Columns() {
  const [pinned = '/'] = useResource(pinnedRootResource)
  const flow = useMemo(
    () => defineFlow<string>({
      source: pathResource,
      base: (path = '/') => {
        const tree = readResource(treeResource)
        if (!tree) return { entities: {}, relationships: {} }
        const rootNode = pinned === '/' ? tree : (walk(pinned).at(-1) ?? tree)
        const c = walk(path)
        const cwd = c[c.length - 1]?.type === 'dir' ? c[c.length - 1] : c[c.length - 2] ?? tree
        return fromTree(rootNode.children ?? [], {
          getId: (n) => n.path,
          getKids: (n) => n.children,
          toData: (n) => ({
            label: n.name,
            icon: n.type === 'dir' ? 'dir' : extToIcon(n.ext),
            selected: n.path === path,
          }),
          focusId: cwd?.path ?? path,
          expandedIds: pathAncestors(path),
        })
      },
      gestures: expandBranchOnActivate,
      metaScope: ['navigate', 'typeahead'],
    }),
    [pinned],
  )
  const [data, onEvent] = useFlow(flow)
  return <ColumnsRole data={data} onEvent={onEvent} aria-label="컬럼" />
}

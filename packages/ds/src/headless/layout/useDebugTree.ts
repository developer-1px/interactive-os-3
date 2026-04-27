import { useEffect } from 'react'
import { printTree, printHeadingOutline } from '../debug'
import type { NormalizedData } from '../types'

/**
 * URL 파라미터 ?debug=tree 일 때 Renderer가 렌더한 페이지 트리와 heading outline을 console에 출력.
 * 렌더 결과에는 영향 없음 — 디버깅 관심사.
 */
export function useDebugTree(page: NormalizedData) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    if (params.get('debug') !== 'tree') return

    console.groupCollapsed('%c[FlatLayout] hierarchy', 'color:#888')
    console.log(printTree(page))
    console.log('\n=== HEADING OUTLINE ===\n' + printHeadingOutline(page))
    console.groupEnd()
  }, [page])
}

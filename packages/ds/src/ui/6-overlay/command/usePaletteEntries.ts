import { useMemo } from 'react'
import { useRouter } from '@tanstack/react-router'

export type PaletteEntry = {
  id: string
  label: string
  to: string
  params?: Record<string, string>
  /** cmd+k 카테고리. 미선언 시 RouteGrid 가 첫 path 세그먼트로 자동 분류. */
  category?: string
}

type PaletteMeta = {
  label: string
  to: string
  params?: Record<string, string>
  category?: string
}

type RouterShape = {
  routesById: Record<string, {
    id: string
    options?: { staticData?: { palette?: PaletteMeta } }
  }>
}

/** Router routesById에서 staticData.palette 메타가 있는 라우트만 PaletteEntry로 추출. */
export function usePaletteEntries(): PaletteEntry[] {
  const router = useRouter()
  return useMemo<PaletteEntry[]>(() => {
    const byId = (router as unknown as RouterShape).routesById ?? {}
    return Object.values(byId)
      .map((r) => {
        const p = r.options?.staticData?.palette
        return p ? { id: r.id, label: p.label, to: p.to, params: p.params, category: p.category } : null
      })
      .filter((x): x is PaletteEntry => x !== null)
  }, [router])
}

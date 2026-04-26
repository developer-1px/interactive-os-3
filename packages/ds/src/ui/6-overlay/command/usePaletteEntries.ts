import { useMemo } from 'react'
import { useRouter } from '@tanstack/react-router'

export type PaletteEntry = {
  id: string
  label: string
  to: string
  params?: Record<string, string>
}

type RouterShape = {
  routesById: Record<string, {
    id: string
    options?: { staticData?: { palette?: { label: string; to: string; params?: Record<string, string> } } }
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
        return p ? { id: r.id, label: p.label, to: p.to, params: p.params } : null
      })
      .filter((x): x is PaletteEntry => x !== null)
  }, [router])
}

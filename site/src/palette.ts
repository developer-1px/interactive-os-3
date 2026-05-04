/**
 * Palette SSOT — 각 route 의 `staticData.palette` 를 router 에서 수집.
 * SidebarNav · Landing · 기타 검색 UI 는 모두 이 함수를 거친다.
 */
import type { useRouter } from '@tanstack/react-router'

export interface PaletteEntry {
  id: string
  label: string
  to: string
  params?: Record<string, string>
  category?: string
  sub?: string
}

type RouterLike = ReturnType<typeof useRouter>

export function collectPalette(router: RouterLike): PaletteEntry[] {
  const out: PaletteEntry[] = []
  for (const [id, r] of Object.entries(router.routesById ?? {})) {
    const p = (r as { options?: { staticData?: { palette?: Omit<PaletteEntry, 'id'> } } })
      .options?.staticData?.palette
    if (p) out.push({ id, ...p })
  }
  return out.sort((a, b) => a.label.localeCompare(b.label))
}

/**
 * 카테고리 도출 — route 가 명시했으면 그대로, 아니면 path depth 로:
 *  /<top>           → 'Surfaces'
 *  /apps/<x> (depth 2, splat $ 무시) → 'Apps'
 *  /apps/<x>/...   (depth ≥3)        → '<X>' (앱 이름 capitalized) — 앱 내부 sub-nav
 */
export const paletteCategory = (e: PaletteEntry) => {
  if (e.category) return e.category
  const segs = e.to.split('/').filter((s) => s && s !== '$')
  if (segs[0] !== 'apps') return 'Surfaces'
  if (segs.length <= 2) return 'Apps'
  const app = segs[1]
  return app.charAt(0).toUpperCase() + app.slice(1)
}

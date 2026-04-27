/**
 * wireframe-registry — self-registry for ScreenDef + group meta.
 *
 * 새 화면 = `defineScreen({...})` 1곳, 새 그룹 = `defineGroup(...)` 1곳.
 * SCREENS Record / GROUP_DEFS 거대 리터럴 ❌. (OCP — category 자기 선언이 그룹 키)
 *
 * derived view: byApp · byFlow · byPattern · byPart (Mobbin 식 다축 역참조).
 */
import type { ScreenDef } from './wireframe-screens'

export type GroupMeta = { id: string; title: string; lede: string }
export type GroupDef = GroupMeta & { screens: ScreenDef[] }

const SCREEN_REGISTRY: Record<string, ScreenDef> = {}
const GROUP_REGISTRY: Record<string, GroupMeta> = {}

export function defineScreen<T extends ScreenDef>(def: T): T {
  // last-wins (HMR friendly — re-execution 시 같은 id 가 다시 등록되어도 덮어씀)
  SCREEN_REGISTRY[def.id] = def
  return def
}

export function defineGroup(category: string, meta: GroupMeta) {
  GROUP_REGISTRY[category] = meta
}

export const getScreens = () => SCREEN_REGISTRY

export const getGroups = (): GroupDef[] => {
  const byCat: Record<string, ScreenDef[]> = {}
  for (const s of Object.values(SCREEN_REGISTRY)) (byCat[s.category] ??= []).push(s)
  return Object.entries(byCat)
    .map(([cat, screens]) => {
      const meta = GROUP_REGISTRY[cat] ?? { id: cat, title: cat, lede: '' }
      return { ...meta, screens }
    })
    .sort((a, b) => a.id.localeCompare(b.id))
}

const groupBy = <K extends keyof ScreenDef>(key: K) => {
  const out: Record<string, ScreenDef[]> = {}
  for (const s of Object.values(SCREEN_REGISTRY)) {
    const v = s[key]
    const arr = Array.isArray(v) ? (v as readonly string[]) : [String(v)]
    for (const k of arr) (out[k] ??= []).push(s)
  }
  return out
}

export const byApp     = () => groupBy('app')
export const byFlow    = () => groupBy('flow')
export const byPattern = () => groupBy('patterns')
export const byPart    = () => groupBy('parts')

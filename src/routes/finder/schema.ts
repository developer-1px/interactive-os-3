import { z } from 'zod'
import type { IconToken } from '../../ds/foundations/iconography/icon'

/** finder 도메인 엔티티 zod 스키마 — 진실 원천.
 *  타입은 z.infer로 도출. types.ts의 동명 type/interface는 유산. */

const iconToken = z.custom<IconToken>((v) => typeof v === 'string')

export const FsNodeSchema: z.ZodType<FsNode> = z.lazy(() => z.object({
  name: z.string(),
  path: z.string(),
  type: z.enum(['dir', 'file']),
  size: z.number().optional(),
  mtime: z.number().optional(),
  ext: z.string().optional(),
  children: z.array(FsNodeSchema).optional(),
}))
export interface FsNode {
  name: string
  path: string
  type: 'dir' | 'file'
  size?: number
  mtime?: number
  ext?: string
  children?: FsNode[]
}

export const SidebarItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  path: z.string(),
  icon: iconToken,
})
export type SidebarItem = z.infer<typeof SidebarItemSchema>

export const SmartGroupIdSchema = z.enum(['today', 'yesterday', 'thisWeek', 'thisMonth', 'thisYear'])
export type SmartGroupId = z.infer<typeof SmartGroupIdSchema>

export const SmartGroupItemSchema = z.object({
  id: SmartGroupIdSchema,
  label: z.string(),
  path: z.string(),
  icon: iconToken,
})
export type SmartGroupItem = z.infer<typeof SmartGroupItemSchema>

/** Tag 가상 폴더 — frontmatter.tags 기반. id는 tag 문자열 자체.
 *  path는 `/_tag/<encoded>` (tagIndex.tagPath 참고). */
export const TagGroupItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  path: z.string(),
  icon: iconToken,
  count: z.number(),
})
export type TagGroupItem = z.infer<typeof TagGroupItemSchema>

export const ViewModeSchema = z.enum(['icons', 'list', 'columns', 'gallery'])
export type ViewMode = z.infer<typeof ViewModeSchema>

export const PreviewKindSchema = z.enum(['image', 'markdown', 'code', 'text', 'binary'])
export type PreviewKind = z.infer<typeof PreviewKindSchema>

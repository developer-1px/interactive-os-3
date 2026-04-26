import { z } from 'zod'

/** FsNode — 파일 시스템 트리 노드 entity (도메인 무관 fs source 정본).
 *  finder 외 다른 앱(markdown 등)도 공유. */
export interface FsNode {
  name: string
  path: string
  type: 'dir' | 'file'
  size?: number
  mtime?: number
  ext?: string
  children?: FsNode[]
}

export const FsNodeSchema: z.ZodType<FsNode> = z.lazy(() => z.object({
  name: z.string(),
  path: z.string(),
  type: z.enum(['dir', 'file']),
  size: z.number().optional(),
  mtime: z.number().optional(),
  ext: z.string().optional(),
  children: z.array(FsNodeSchema).optional(),
}))

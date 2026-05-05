import { z } from 'zod'

/**
 * Runtime contract for the headless data rail.
 *
 * The public TypeScript types stay intentionally small, but production
 * consumers need a real gate before declarations reach reducers/renderers.
 */
/** Entity zod schema — `{id, data?}` 런타임 gate. */
export const EntitySchema = z.object({
  id: z.string().min(1),
  data: z.record(z.string(), z.unknown()).optional(),
})

/** NormalizedData zod schema — entities + relationships 런타임 gate. */
export const NormalizedDataSchema = z.object({
  entities: z.record(z.string(), EntitySchema),
  relationships: z.record(z.string(), z.array(z.string())),
})

/**
 * navigate dir 어휘 — axis 마이그레이션이 채워가는 의도형 방향 enum.
 * PRD: docs/2026/2026-05/2026-05-05/06_prd_keymap_serializable.md
 */
export const NavigateDirSchema = z.enum([
  'next', 'prev', 'start', 'end',
  'pageNext', 'pagePrev',
  'visibleNext', 'visiblePrev', 'firstChild', 'toParent',
  'gridUp', 'gridDown', 'gridLeft', 'gridRight',
  'rowStart', 'rowEnd', 'gridStart', 'gridEnd',
])

/** UiEvent zod schema — ui ↔ headless 어휘 런타임 gate (discriminated union on `type`). */
export const UiEventSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('navigate'),
    id: z.string().min(1).optional(),
    dir: NavigateDirSchema.optional(),
  }).refine(
    (e) => (e.id != null) !== (e.dir != null),
    { message: 'navigate requires exactly one of `id` (result-form) or `dir` (intent-form)' },
  ),
  z.object({ type: z.literal('activate'), id: z.string().min(1) }),
  z.object({ type: z.literal('expand'), id: z.string().min(1), open: z.boolean() }),
  z.object({ type: z.literal('select'), id: z.string().min(1) }),
  z.object({ type: z.literal('value'), id: z.string().min(1), value: z.unknown() }),
  z.object({ type: z.literal('open'), id: z.string().min(1), open: z.boolean() }),
  z.object({ type: z.literal('typeahead'), buf: z.string(), deadline: z.number().finite() }),
  z.object({
    type: z.literal('pan'),
    id: z.string().min(1),
    dx: z.number().finite(),
    dy: z.number().finite(),
  }),
  z.object({
    type: z.literal('zoom'),
    id: z.string().min(1),
    cx: z.number().finite(),
    cy: z.number().finite(),
    k: z.number().finite().positive(),
  }),
  z.object({
    type: z.literal('insertAfter'),
    siblingId: z.string().min(1),
    value: z.unknown().optional(),
  }),
  z.object({
    type: z.literal('appendChild'),
    parentId: z.string().min(1),
    value: z.unknown().optional(),
  }),
  z.object({ type: z.literal('update'), id: z.string().min(1), value: z.unknown() }),
  z.object({ type: z.literal('remove'), id: z.string().min(1) }),
  z.object({ type: z.literal('copy'), id: z.string().min(1) }),
  z.object({ type: z.literal('cut'), id: z.string().min(1) }),
  z.object({
    type: z.literal('paste'),
    targetId: z.string().min(1),
    mode: z.enum(['auto', 'child', 'overwrite']).optional(),
    index: z.number().int().nonnegative().optional(),
  }),
  z.object({ type: z.literal('undo') }),
  z.object({ type: z.literal('redo') }),
])

/** EntitySchema 추론 타입. */
export type EntityInput = z.infer<typeof EntitySchema>
/** NormalizedDataSchema 추론 타입. */
export type NormalizedDataInput = z.infer<typeof NormalizedDataSchema>
/** UiEventSchema 추론 타입. */
export type UiEventInput = z.infer<typeof UiEventSchema>

/** unknown → NormalizedData 검증. 실패 시 ZodError throw. */
export const parseNormalizedData = (value: unknown): NormalizedDataInput =>
  NormalizedDataSchema.parse(value)

/** unknown → UiEvent 검증. 실패 시 ZodError throw. */
export const parseUiEvent = (value: unknown): UiEventInput =>
  UiEventSchema.parse(value)

import type { UiEvent } from './types'

/** navigate result-form narrowing — `{type:'navigate', id}` 만 true. */
export const isNavigateById = (
  e: UiEvent,
): e is Extract<UiEvent, { type: 'navigate'; id: string }> =>
  e.type === 'navigate' && typeof (e as { id?: unknown }).id === 'string'

/** navigate intent-form narrowing — `{type:'navigate', dir}` 만 true. */
export const isNavigateByDir = (
  e: UiEvent,
): e is Extract<UiEvent, { type: 'navigate'; dir: string }> =>
  e.type === 'navigate' && typeof (e as { dir?: unknown }).dir === 'string'

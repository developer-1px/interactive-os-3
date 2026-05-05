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

/** UiEvent zod schema — ui ↔ headless 어휘 런타임 gate (discriminated union on `type`). */
export const UiEventSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('navigate'), id: z.string().min(1) }),
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
    type: z.literal('create'),
    parentId: z.string().min(1),
    key: z.union([z.string(), z.number()]).optional(),
    value: z.unknown().optional(),
  }),
  z.object({ type: z.literal('update'), id: z.string().min(1), value: z.unknown() }),
  z.object({ type: z.literal('remove'), id: z.string().min(1) }),
  z.object({ type: z.literal('copy'), id: z.string().min(1) }),
  z.object({ type: z.literal('cut'), id: z.string().min(1) }),
  z.object({
    type: z.literal('paste'),
    id: z.string().min(1),
    mode: z.enum(['sibling', 'child', 'replace']).optional(),
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

/** zod v4 introspection — _def.type 기반 walk.
 *
 *  spec.ts 의 zod 객체를 읽어 Inspector 가 폼·표를 자동 생성한다.
 *  의존성 추가 없이 zod 내장 _def 만 사용. */

import type { ZodType, ZodObject } from 'zod'

export type FieldKind =
  | { kind: 'string' }
  | { kind: 'number' }
  | { kind: 'boolean' }
  | { kind: 'literal'; values: readonly unknown[] }
  | { kind: 'enum'; values: readonly string[] }
  | { kind: 'object'; shape: Record<string, FieldKind> }
  | { kind: 'nullable'; inner: FieldKind }
  | { kind: 'optional'; inner: FieldKind }
  | { kind: 'unknown'; type: string }

interface ZodDef {
  type: string
  innerType?: ZodType
  entries?: Record<string, string>
  values?: readonly unknown[]
}

const defOf = (s: ZodType): ZodDef => (s as unknown as { _def: ZodDef })._def

export function describe(s: ZodType): FieldKind {
  const d = defOf(s)
  switch (d.type) {
    case 'string':  return { kind: 'string' }
    case 'number':  return { kind: 'number' }
    case 'boolean': return { kind: 'boolean' }
    case 'literal': return { kind: 'literal', values: d.values ?? [] }
    case 'enum':    return { kind: 'enum', values: Object.values(d.entries ?? {}) }
    case 'object':  return { kind: 'object', shape: shapeOf(s as ZodObject) }
    case 'nullable':
      return { kind: 'nullable', inner: d.innerType ? describe(d.innerType) : { kind: 'unknown', type: 'nullable' } }
    case 'optional':
      return { kind: 'optional', inner: d.innerType ? describe(d.innerType) : { kind: 'unknown', type: 'optional' } }
    default: return { kind: 'unknown', type: d.type }
  }
}

export function shapeOf(s: ZodObject): Record<string, FieldKind> {
  const shape = s.shape as Record<string, ZodType>
  const out: Record<string, FieldKind> = {}
  for (const k of Object.keys(shape)) out[k] = describe(shape[k]!)
  return out
}

/** FieldKind → 폼 초기값 (string→'', number→0, boolean→false, enum→첫 멤버, literal→첫 값) */
export function defaultValue(k: FieldKind): unknown {
  switch (k.kind) {
    case 'string':   return ''
    case 'number':   return 0
    case 'boolean':  return false
    case 'enum':     return k.values[0] ?? ''
    case 'literal':  return k.values[0] ?? ''
    case 'nullable': return null
    case 'optional': return undefined
    case 'object':   return Object.fromEntries(Object.entries(k.shape).map(([kk, vv]) => [kk, defaultValue(vv)]))
    default:         return ''
  }
}

/** FieldKind → 사람이 읽는 짧은 라벨 ('enum: a|b|c', 'string', 'literal: "x"') */
export function labelOf(k: FieldKind): string {
  switch (k.kind) {
    case 'string':   return 'string'
    case 'number':   return 'number'
    case 'boolean':  return 'boolean'
    case 'enum':     return `enum: ${k.values.join(' | ')}`
    case 'literal':  return `literal: ${k.values.map((v) => JSON.stringify(v)).join(' | ')}`
    case 'object':   return `object { ${Object.keys(k.shape).join(', ')} }`
    case 'nullable': return `${labelOf(k.inner)} | null`
    case 'optional': return `${labelOf(k.inner)} ?`
    default:         return k.type
  }
}

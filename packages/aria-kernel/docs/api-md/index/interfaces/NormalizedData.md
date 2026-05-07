[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [index](../README.md) / NormalizedData

# Interface: NormalizedData

Defined in: [types.ts:12](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/types.ts#L12)

NormalizedData — three separated stores:
  entities      = id → user data (id is the key, value IS the data)
  relationships = id → child ids (entity-keyed only; top-level lives in meta.root)
  meta          = library-owned auxiliary state (focus/expanded/open/typeahead/...)

Invariants:
  - Object.keys(relationships) ⊆ Object.keys(entities)
  - meta is library-owned; entities are user-owned (modulo reserved per-item flags
    `selected` / `disabled` / `value` that the library reads)

## Properties

### entities

> **entities**: `Record`\<`string`, `Record`\<`string`, `unknown`\>\>

Defined in: [types.ts:13](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/types.ts#L13)

***

### meta?

> `optional` **meta?**: [`Meta`](Meta.md)

Defined in: [types.ts:15](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/types.ts#L15)

***

### relationships

> **relationships**: `Record`\<`string`, `string`[]\>

Defined in: [types.ts:14](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/types.ts#L14)

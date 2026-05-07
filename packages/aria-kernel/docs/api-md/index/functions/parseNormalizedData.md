[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [index](../README.md) / parseNormalizedData

# Function: parseNormalizedData()

> **parseNormalizedData**(`value`): `object`

Defined in: [schema.ts:53](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/schema.ts#L53)

unknown → NormalizedData 검증. 실패 시 ZodError throw.

## Parameters

### value

`unknown`

## Returns

`object`

### entities

> **entities**: `Record`\<`string`, \{ `data?`: `Record`\<`string`, `unknown`\>; `id`: `string`; \}\>

### relationships

> **relationships**: `Record`\<`string`, `string`[]\>

[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [store](../README.md) / readQuery

# Function: readQuery()

> **readQuery**\<`T`\>(`spec`): [`QueryResult`](../interfaces/QueryResult.md)\<`T`\>

Defined in: [store/feature/query.ts:46](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/store/feature/query.ts#L46)

spec 을 캐시에서 읽거나 첫 read 시 fn 실행. enabled=false 면 idle 상태 반환.

## Type Parameters

### T

`T`

## Parameters

### spec

[`QuerySpec`](../interfaces/QuerySpec.md)\<`T`\>

## Returns

[`QueryResult`](../interfaces/QueryResult.md)\<`T`\>

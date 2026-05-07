[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [store](../README.md) / writeResource

# Function: writeResource()

> **writeResource**\<`T`, `Args`\>(`resource`, `value`, ...`args`): `void`

Defined in: [store/data.ts:196](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/store/data.ts#L196)

컴포넌트 외부(이벤트 핸들러·HMR 콜백 등)에서 자원에 직접 쓰기.

## Type Parameters

### T

`T`

### Args

`Args` *extends* `unknown`[] = \[\]

## Parameters

### resource

[`Resource`](../interfaces/Resource.md)\<`T`, `Args`\>

### value

`T`

### args

...`Args`

## Returns

`void`

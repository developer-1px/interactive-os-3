[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [store](../README.md) / ResourceEvent

# Type Alias: ResourceEvent\<T\>

> **ResourceEvent**\<`T`\> = \{ `type`: `"set"`; `value`: `T`; \} \| \{ `partial`: `Partial`\<`T`\>; `type`: `"patch"`; \} \| \{ `type`: `"refetch"`; \} \| \{ `type`: `"invalidate"`; \}

Defined in: [store/data.ts:14](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/store/data.ts#L14)

Resource dispatch 가 받는 4 종 이벤트 — set(전체)/patch(부분)/refetch(다시 load)/invalidate(캐시 비움).

## Type Parameters

### T

`T`

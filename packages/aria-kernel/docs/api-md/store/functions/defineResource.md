[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [store](../README.md) / defineResource

# Function: defineResource()

> **defineResource**\<`T`, `Args`\>(`spec`): [`Resource`](../interfaces/Resource.md)\<`T`, `Args`\>

Defined in: [store/data.ts:120](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/store/data.ts#L120)

Resource spec identity — 타입 추론 + 런타임 spec 통과 helper.
라이프사이클: 첫 useResource 호출 시 load/initial 로 hydrate → subscribe 로 외부 push 채널 attach
(refCount=1 시) → dispatch 로 set/patch/refetch/invalidate → 마지막 구독자 unmount 시 unsub.
직렬화 가능성: value 는 plain object 권장 — serialize 가 호출되어 외부 저장소(URL/localStorage)와 왕복.

## Type Parameters

### T

`T`

### Args

`Args` *extends* `unknown`[] = \[\]

## Parameters

### spec

[`Resource`](../interfaces/Resource.md)\<`T`, `Args`\>

## Returns

[`Resource`](../interfaces/Resource.md)\<`T`, `Args`\>

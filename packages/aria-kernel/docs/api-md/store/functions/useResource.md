[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [store](../README.md) / useResource

# Function: useResource()

> **useResource**\<`T`, `Args`\>(`resource`, ...`args`): \[`T` \| `undefined`, [`ResourceDispatch`](../type-aliases/ResourceDispatch.md)\<`T`\>\]

Defined in: [store/data.ts:138](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/store/data.ts#L138)

Resource 를 React 에 연결 — 첫 read 시 load 트리거, 외부 채널 자동 attach/detach,
useSyncExternalStore 로 tearing-free 구독. 반환은 `[value, dispatch]` 단일 인터페이스.

## Type Parameters

### T

`T`

### Args

`Args` *extends* `unknown`[] = \[\]

## Parameters

### resource

[`Resource`](../interfaces/Resource.md)\<`T`, `Args`\>

### args

...`Args`

## Returns

\[`T` \| `undefined`, [`ResourceDispatch`](../type-aliases/ResourceDispatch.md)\<`T`\>\]

## Example

```ts
const userResource = defineResource({
  key: (id: string) => `user:${id}`,
  load: (id) => fetch(`/api/user/${id}`).then(r => r.json()),
})
const [user, dispatch] = useResource(userResource, userId)
dispatch({ type: 'patch', partial: { name: 'New' } })
```

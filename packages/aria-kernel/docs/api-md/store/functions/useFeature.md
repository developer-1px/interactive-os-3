[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [store](../README.md) / useFeature

# Function: useFeature()

> **useFeature**\<`S`, `Cmd`, `Q`, `V`\>(`spec`): \[`V`, (`cmd`) => `void`\]

Defined in: [store/feature/useFeature.ts:21](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/store/feature/useFeature.ts#L21)

Feature spec → React 연결. 라이프사이클: useReducer 로 spec.state 시드 → cmd dispatch 시
spec.on[type] 적용 → state 변화마다 spec.query 재해석 → resolveQueries → spec.view 재계산.
직렬화 가능성: state/cmd 모두 plain JSON — replay/HMR 가능.

## Type Parameters

### S

`S`

### Cmd

`Cmd` *extends* [`CommandBase`](../interfaces/CommandBase.md)

### Q

`Q` *extends* `Record`\<`string`, [`QuerySpec`](../interfaces/QuerySpec.md)\<`unknown`\>\>

### V

`V`

## Parameters

### spec

[`FeatureSpec`](../interfaces/FeatureSpec.md)\<`S`, `Cmd`, `Q`, `V`\>

## Returns

\[`V`, (`cmd`) => `void`\]

## Example

```ts
const [view, send] = useFeature(counter)
<button onClick={() => send({ type: 'inc' })}>{view.label}</button>
```

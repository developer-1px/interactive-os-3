[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [index](../README.md) / useEventBridge

# Function: useEventBridge()

> **useEventBridge**(`__namedParameters`): (`raw`) => `void`

Defined in: [state/useEventBridge.ts:34](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/state/useEventBridge.ts#L34)

UiEvent 라우팅 hook — gesture 통과 후 meta 이벤트는 control dispatch 로, intent 이벤트는 도메인 onIntent 로.
컴포넌트 소비자는 분기 없이 반환된 onEvent 한 개만 ui 에 꽂는다.

## Parameters

### \_\_namedParameters

#### data

[`NormalizedData`](../interfaces/NormalizedData.md)

#### dispatchMeta

(`e`) => `void`

#### gestures?

[`GestureHelper`](../../gesture/type-aliases/GestureHelper.md) = `noopGesture`

#### onIntent?

(`e`) => `void`

## Returns

(`raw`) => `void`

## Example

```ts
const onEvent = useEventBridge({ data, gestures: expandBranchOnActivate, dispatchMeta, onIntent })
<TreeView data={data} onEvent={onEvent} />
```

[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [index](../README.md) / useValue

# Function: useValue()

> **useValue**\<`T`\>(`controlled`, `defaultValue`, `onEvent?`, `id?`): \[`T`, (`next`) => `void`\]

Defined in: [state/useValue.ts:23](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/state/useValue.ts#L23)

useValue<T> — controlled/uncontrolled hybrid value 표준 hook. SSOT 역할: switch/checkbox/radio/slider 등
값 한 개를 들고 있는 패턴의 공통 어댑터.

 controlled 주입(value !== undefined)  → 외부 state 그대로 사용, setValue 는 onEvent 만 emit.
 controlled 미주입                     → 내부 useState 로 자체 보유, setValue 는 둘 다.

모든 setValue 호출은 `{type:'value', id, value}` event 를 onEvent 로 emit —
single dispatch interface 정합. host 가 받은 'value' 를 외부 store 와 동기화.

## Type Parameters

### T

`T`

## Parameters

### controlled

`T` \| `undefined`

외부 prop value (undefined 면 uncontrolled)

### defaultValue

`T`

uncontrolled 시작값

### onEvent?

(`e`) => `void`

dispatch 통로 ('value' event emit 대상)

### id?

`string` = `ROOT`

emit event 의 id (default: ROOT)

## Returns

\[`T`, (`next`) => `void`\]

## Example

```ts
const [checked, setChecked] = useValue(props.checked, false, props.onEvent)
 <button aria-pressed={checked} onClick={() => setChecked(!checked)} />
```

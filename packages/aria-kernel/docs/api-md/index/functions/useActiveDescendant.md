[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [index](../README.md) / useActiveDescendant

# Function: useActiveDescendant()

> **useActiveDescendant**\<`T`\>(`ref`, `activeId`): `void`

Defined in: [roving/useActiveDescendant.ts:19](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/roving/useActiveDescendant.ts#L19)

useActiveDescendant — Combobox / Grid 등 INVARIANT B11 ("포커스는 실제 DOM element 에 있다 —
`aria-activedescendant` 는 Combobox 1곳 예외") 의 코드화.

입력 element(보통 input)에 DOM focus 를 유지하면서, popup option 의 활성 상태를
id 참조(`aria-activedescendant`)로만 표현. roving tabindex 와 다른 모드.

W3C ARIA: https://www.w3.org/TR/wai-aria-1.2/#aria-activedescendant

## Type Parameters

### T

`T` *extends* `HTMLElement`

## Parameters

### ref

`RefObject`\<`T` \| `null`\>

`aria-activedescendant` 를 부착할 element ref (보통 combobox input)

### activeId

`string` \| `null` \| `undefined`

현재 활성 option 의 DOM id. null/undefined 면 속성 제거

## Returns

`void`

## Example

```ts
const inputRef = useRef<HTMLInputElement>(null)
useActiveDescendant(inputRef, focusId)
```

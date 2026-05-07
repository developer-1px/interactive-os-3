[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [gesture](../README.md) / activateProps

# Function: activateProps()

> **activateProps**(`onActivate`): `object`

Defined in: [gesture/index.ts:55](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/gesture/index.ts#L55)

activateProps — 클릭과 Enter/Space 를 단일 onActivate 콜백으로 합류.
(data, onEvent) 흐름 밖 JSX-children row/cell 등의 DOM 측 entry.

## Parameters

### onActivate

() => `void`

## Returns

`object`

### onClick

> **onClick**: (`_e`) => `void`

#### Parameters

##### \_e

`MouseEvent`

#### Returns

`void`

### onKeyDown

> **onKeyDown**: (`e`) => `void`

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`void`

## Example

```ts
<button {...activateProps(() => onSelect(id))}>...</button>
```

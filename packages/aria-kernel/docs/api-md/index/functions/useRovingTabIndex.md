[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [index](../README.md) / useRovingTabIndex

# Function: useRovingTabIndex()

> **useRovingTabIndex**(`axis`, `data`, `onEvent`, `options?`): `object`

Defined in: [roving/useRovingTabIndex.ts:48](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/roving/useRovingTabIndex.ts#L48)

useRovingTabIndex — APG canonical roving tabindex. **데이터(관계 그래프) 기반** 이동.

NormalizedData 의 `relationships` 그래프와 axis (composeAxes 결과) 를 따라 다음 focus id 를
결정한다. DOM 시각 위치와 무관 — 논리적 부모/형제/자식 관계가 곧 이동 축.

시각 좌표 기반(JSX-children 자유 배치, row-reverse, transform 등)이 필요한 곳은
[useSpatialNavigation](useSpatialNavigation.md) (W3C CSS spatnav) 을 쓴다. 둘은 1 tab stop roving 메커니즘만 공유.

내부에 `data-id` 위임을 소유하므로 소비자는 `{...delegate}` 만 container 에 꽂는다.

## Parameters

### axis

[`Axis`](../type-aliases/Axis.md)

composeAxes 로 합성된 축 (navigate/activate/expand/typeahead/...)

### data

[`NormalizedData`](../interfaces/NormalizedData.md)

NormalizedData (focus 는 `meta.focus`)

### onEvent

(`e`) => `void`

UiEvent 디스패치

### options?

#### autoFocus?

`boolean`

마운트 시 첫 focusId 에 .focus() 발동 (다이얼로그용)

#### containerId?

`string`

기본 focus 산출 시 기준 컨테이너. 기본 ROOT

## Returns

`object`

### bindFocus

> **bindFocus**: (`id`) => (`el`) => `void`

#### Parameters

##### id

`string`

#### Returns

(`el`) => `void`

### delegate

> **delegate**: `object`

#### delegate.onClick

> **onClick**: (`e`) => `void`

##### Parameters

###### e

`MouseEvent`

##### Returns

`void`

#### delegate.onKeyDown

> **onKeyDown**: (`e`) => `void`

##### Parameters

###### e

`KeyboardEvent`

##### Returns

`void`

### expanded

> **expanded**: `Set`\<`string`\>

### focusId

> **focusId**: `string` \| `null`

### onClick

> **onClick**: (`me`, `id`) => `boolean`

#### Parameters

##### me

`MouseEvent`

##### id

`string`

#### Returns

`boolean`

### onKey

> **onKey**: (`ke`, `id`) => `boolean`

#### Parameters

##### ke

`KeyboardEvent`

##### id

`string`

#### Returns

`boolean`

## Example

```ts
const axis = composeAxes(navigate('vertical'), activate(), typeahead())
const { delegate, bindFocus, focusId } = useRovingTabIndex(axis, data, onEvent)
return <ul {...delegate}>{ids.map(id => <li key={id} data-id={id} ref={bindFocus(id)} tabIndex={focusId === id ? 0 : -1}/>)}</ul>
```

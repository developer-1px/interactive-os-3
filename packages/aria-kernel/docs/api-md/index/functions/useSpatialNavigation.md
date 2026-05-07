[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [index](../README.md) / useSpatialNavigation

# Function: useSpatialNavigation()

> **useSpatialNavigation**\<`T`\>(`externalRef?`, `__namedParameters?`): `object`

Defined in: [roving/useSpatialNavigation.ts:85](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/roving/useSpatialNavigation.ts#L85)

useSpatialNavigation — W3C CSS Spatial Navigation 기반 roving tabindex.
**시각 좌표 기반** 이동 — `getBoundingClientRect()` 로 다음 element 결정.

데이터 그래프가 없는 자유 JSX 배치(Toolbar/Menubar/DataGrid/TreeGrid 등) 에서 사용.
관계 그래프가 있는 컬렉션은 [useRovingTabIndex](useRovingTabIndex.md) (APG canonical) 을 쓴다.

## Type Parameters

### T

`T` *extends* `HTMLElement` = `HTMLDivElement`

## Parameters

### externalRef?

`RefObject`\<`T` \| `null`\> \| `null`

container ref. 생략 시 내부 ref 반환

### \_\_namedParameters?

`UseSpatialNavigationOptions` = `{}`

## Returns

`object`

### onKeyDown

> **onKeyDown**: (`e`) => `void`

#### Parameters

##### e

`KeyboardEvent`\<`T`\>

#### Returns

`void`

### ref

> **ref**: `RefObject`\<`T` \| `null`\> = `effectiveRef`

## Example

```ts
const { ref, onKeyDown } = useSpatialNavigation<HTMLDivElement>(null, { orientation: 'horizontal' })
return <div ref={ref} role="toolbar" onKeyDown={onKeyDown}>...</div>
```

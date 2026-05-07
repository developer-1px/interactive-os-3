[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [patterns](../README.md) / useComboboxPattern

# Function: useComboboxPattern()

> **useComboboxPattern**(`data`, `onEvent?`, `opts?`): `object`

Defined in: [patterns/combobox.ts:74](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/combobox.ts#L74)

combobox — APG `/combobox/` recipe.
https://www.w3.org/WAI/ARIA/apg/patterns/combobox/

시그니처: 다른 컬렉션 패턴과 동일한 `(data, onEvent, opts)`.
  data — host 가 NormalizedData 한 번 만들어 useControlState 통과
  onEvent — 모든 변화 단일 dispatch interface

**패턴 내부에서 흡수하는 책임** (host 가 안 다뤄도 됨):
  - input value (query) state — uncontrolled default, value 옵션으로 controlled 도 가능
  - filter visible ids — default label.includes, filter 옵션으로 override
  - lifecycle 이벤트 (focus/blur/change) — 모두 onEvent 로 dispatch
  - activate 후속 (popup close + commit) — APG 표준 동작 자동

모든 emit:
  typing  → {type:'value', id:ROOT, value}
  focus   → {type:'open',  id:ROOT, open:true}
  blur    → {type:'open',  id:ROOT, open:false}  (closeOnBlurDelay 후)
  nav     → {type:'navigate', id}
  activate→ {type:'activate', id} + {type:'open', open:false} + (commitOnActivate) {type:'value', value:label}
  escape  → {type:'open', open:false}

INVARIANT B11: input 에 focus 유지, popup option 활성은 aria-activedescendant.

## Parameters

### data

[`NormalizedData`](../../index/interfaces/NormalizedData.md)

### onEvent?

(`e`) => `void`

### opts?

[`ComboboxOptions`](../interfaces/ComboboxOptions.md) = `{}`

## Returns

`object`

### comboboxProps

> **comboboxProps**: [`ItemProps`](../type-aliases/ItemProps.md)

### items

> **items**: [`BaseItem`](../interfaces/BaseItem.md)[]

### listboxProps

> **listboxProps**: [`RootProps`](../type-aliases/RootProps.md)

### optionProps

> **optionProps**: (`id`) => [`ItemProps`](../type-aliases/ItemProps.md)

#### Parameters

##### id

`string`

#### Returns

[`ItemProps`](../type-aliases/ItemProps.md)

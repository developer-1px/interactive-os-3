[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [patterns](../README.md) / useFeedPattern

# Function: useFeedPattern()

> **useFeedPattern**(`items`, `dispatch?`, `opts?`): `object`

Defined in: [patterns/feed.ts:45](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/feed.ts#L45)

feed — APG `/feed/` recipe.
https://www.w3.org/WAI/ARIA/apg/patterns/feed/

N 개 article 의 *bundle* — picker 가 아니므로 NormalizedData 가 아니라
`FeedItem[]` 직접 받음. PageUp/PageDown 으로 인접 article 이동.

focus 는 article element(tabIndex=-1, 프로그램 focus only) 로 이동. article 내부의
focusable 자식이 native Tab 흐름. delegate.onKeyDown 의 `e.target.closest('[data-id]')`
위임이 깊은 자식에서도 article id 추적.

Ctrl+Home/End (feed 바깥 first/last focusable) 은 host 책임.

## Parameters

### items

[`FeedItem`](../interfaces/FeedItem.md)[]

### dispatch?

(`e`) => `void`

### opts?

[`FeedOptions`](../interfaces/FeedOptions.md) = `{}`

## Returns

`object`

### articleProps

> **articleProps**: (`id`) => [`ItemProps`](../type-aliases/ItemProps.md)

#### Parameters

##### id

`string`

#### Returns

[`ItemProps`](../type-aliases/ItemProps.md)

### items

> **items**: [`FeedItem`](../interfaces/FeedItem.md) & `object`[]

### labelProps

> **labelProps**: (`id`) => `object`

#### Parameters

##### id

`string`

#### Returns

`object`

##### id

> **id**: `string`

### rootProps

> **rootProps**: [`RootProps`](../type-aliases/RootProps.md)

[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [index](../README.md) / typeahead

# Variable: typeahead

> `const` **typeahead**: [`Axis`](../type-aliases/Axis.md)

Defined in: [axes/typeahead.ts:13](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/axes/typeahead.ts#L13)

typeahead — printable key → 누적 buffer (500ms window) 로 sibling label prefix 매치.
`{type:'typeahead', buf, deadline}` 와 매치 시 `{type:'navigate', id}` emit. APG /listbox/ /menu/ /tree/ 의 type-to-search.

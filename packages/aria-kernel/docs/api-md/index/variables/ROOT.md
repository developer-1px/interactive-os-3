[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [index](../README.md) / ROOT

# Variable: ROOT

> `const` **ROOT**: `"__root__"` = `'__root__'`

Defined in: [types.ts:79](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/types.ts#L79)

ROOT — sentinel "container id" used by axes/patterns to mean "top-level".
Not a real entity. `getChildren(d, ROOT)` returns `meta.root`.
Users do NOT write this in literals; they set `meta.root` instead.

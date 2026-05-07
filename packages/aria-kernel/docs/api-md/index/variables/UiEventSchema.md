[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [index](../README.md) / UiEventSchema

# Variable: UiEventSchema

> `const` **UiEventSchema**: `ZodDiscriminatedUnion`\<\[`ZodObject`\<\{ `id`: `ZodString`; `type`: `ZodLiteral`\<`"navigate"`\>; \}, `$strip`\>, `ZodObject`\<\{ `id`: `ZodString`; `type`: `ZodLiteral`\<`"activate"`\>; \}, `$strip`\>, `ZodObject`\<\{ `id`: `ZodString`; `open`: `ZodBoolean`; `type`: `ZodLiteral`\<`"expand"`\>; \}, `$strip`\>, `ZodObject`\<\{ `id`: `ZodString`; `type`: `ZodLiteral`\<`"select"`\>; \}, `$strip`\>\], `"type"`\>

Defined in: [schema.ts:22](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/schema.ts#L22)

UiEvent zod schema — ui ↔ headless 어휘 런타임 gate (discriminated union on `type`).

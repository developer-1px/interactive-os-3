[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [index](../README.md) / NormalizedDataSchema

# Variable: NormalizedDataSchema

> `const` **NormalizedDataSchema**: `ZodObject`\<\{ `entities`: `ZodRecord`\<`ZodString`, `ZodObject`\<\{ `data`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>; `id`: `ZodString`; \}, `$strip`\>\>; `relationships`: `ZodRecord`\<`ZodString`, `ZodArray`\<`ZodString`\>\>; \}, `$strip`\>

Defined in: [schema.ts:16](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/schema.ts#L16)

NormalizedData zod schema — entities + relationships 런타임 gate.

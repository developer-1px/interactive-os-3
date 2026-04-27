/** @demo type=recipe fn=css */
export const css = (s: TemplateStringsArray, ...v: unknown[]) =>
  String.raw({ raw: s }, ...v)

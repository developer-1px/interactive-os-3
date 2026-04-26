/** virtual:ds-audit — 빌드타임 수집 타입. */

export type DemoSpec = {
  /** color | pair | semantic | selector | structural | recipe | icon | value */
  type: string
  /** fn name to call at runtime — must be one of foundations exports */
  fn: string
  /** arg expressions parsed as JSON (numbers, strings) */
  args: (string | number | boolean | null)[]
  /** raw expression for label/comment */
  raw: string
}

export type FoundationExport = {
  name: string
  file: string        // foundations/values.ts 등
  doc: string         // JSDoc 첫 줄 (없으면 빈 문자열)
  signature: string   // 선언 라인 한 줄
  demo?: DemoSpec     // @demo JSDoc 태그 — 없으면 missingDemo
}

export type CallSite = { file: string; line: number; text: string }

export type Leak = {
  file: string
  line: number
  kind: 'hex' | 'css-var' | 'raw-color'
  snippet: string
}

export type AuditData = {
  exports: FoundationExport[]
  callSites: Record<string, CallSite[]>
  leaks: Leak[]
}

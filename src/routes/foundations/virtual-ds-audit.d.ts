declare module 'virtual:ds-audit' {
  export type DemoSpec = {
    type: string
    fn: string
    args: (string | number | boolean | null)[]
    raw: string
  }
  export type FnExport = {
    name: string
    file: string
    doc: string
    signature: string
    demo?: DemoSpec
  }
  export type FoundationExport = FnExport
  export type CallSite = { file: string; line: number; text: string }
  export type Leak = {
    file: string
    line: number
    kind: 'hex' | 'css-var' | 'raw-color'
    snippet: string
  }
  export type AuditData = {
    exports: FnExport[]
    callSites: Record<string, CallSite[]>
    leaks: Leak[]
  }
  export const audit: AuditData
}

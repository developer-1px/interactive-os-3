declare module 'virtual:ds-contracts' {
  export type Kind = 'controlProps' | 'customArray' | 'childrenDriven' | 'fieldDriven' | 'stateless'
  export type ContractCheck = { id: string; label: string; pass: boolean; note?: string }
  export type Contract = {
    name: string
    file: string
    kind: Kind
    role: string | null
    propsSignature: string
    checks: ContractCheck[]
    score: number
    callSites: number
  }
  export const contracts: Contract[]
}

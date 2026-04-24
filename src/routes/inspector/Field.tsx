import type { ReactNode } from 'react'

// Inspector 공통 행: [label | control+ | unit?]
// 20+회 반복 — 추출 완료. ds 내부 승격 후보(Field role 신설)는 별도 논의.
export function Field({
  label, unit, htmlFor, children,
}: {
  label: string
  unit?: string
  htmlFor?: string
  children: ReactNode
}) {
  return (
    <div aria-roledescription="field">
      <label htmlFor={htmlFor}>{label}</label>
      <div aria-roledescription="control">{children}</div>
      {unit ? <span aria-roledescription="unit">{unit}</span> : null}
    </div>
  )
}

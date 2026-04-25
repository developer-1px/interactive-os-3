import type { ComponentPropsWithoutRef, ReactNode } from 'react'

/**
 * FnCard — ds fn/ 토큰 함수 감사 카드.
 * 비즈니스 콘텐츠: 함수명·doc·signature·call site 목록·usage 뱃지·demo 슬롯.
 * atlas 라우트가 audit 데이터(virtual:ds-audit)를 entity에 주입한다.
 */

export type FnCallSite = { file: string; line: number }

type FnCardProps = Omit<ComponentPropsWithoutRef<'article'>, 'children'> & {
  name: string
  doc?: string
  signature: string
  sites: FnCallSite[]
  /** demo 슬롯 — figure 안에 들어감 */
  demo?: ReactNode
}

export function FnCard({ name, doc, signature, sites, demo, ...rest }: FnCardProps) {
  const dead = sites.length === 0
  return (
    <article className="fn-card" aria-label={name} {...rest}>
      <header>
        <code data-role="title">{name}</code>
        <span
          aria-label={`${sites.length} call sites`}
          title={sites.length ? sites.slice(0, 10).map((s) => `${s.file}:${s.line}`).join('\n') : '호출처 없음 — 죽은 조립식 가능성'}
          data-dead={dead}
        >
          ×{sites.length}
        </span>
      </header>
      <figure>{demo}</figure>
      {doc && <p>{doc}</p>}
      <code data-role="signature">{signature}</code>
      {sites.length > 0 && (
        <details>
          <summary>호출처 {sites.length}</summary>
          <ul>
            {sites.slice(0, 40).map((s, i) => (
              <li key={i}><code>{s.file.replace('/src/ds/', '')}:{s.line}</code></li>
            ))}
          </ul>
        </details>
      )}
    </article>
  )
}

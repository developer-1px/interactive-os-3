import type { ComponentPropsWithoutRef, ReactNode } from 'react'

/**
 * ContractCard — ds 컴포넌트 계약 감사 카드.
 * 비즈니스 콘텐츠: 이름·파일경로·role·propsSignature·체크리스트·뱃지·demo.
 * catalog 라우트가 contracts 데이터(virtual:ds-contracts)를 entity에 주입한다.
 */

export type ContractCheckItem = { id: string; label: string; pass: boolean; note?: string }

type BadgeTone = 'good' | 'warn' | 'bad'

type ContractCardProps = Omit<ComponentPropsWithoutRef<'article'>, 'children' | 'onSelect'> & {
  name: string
  file: string
  role?: string | null | undefined
  propsSignature: string
  checks: ContractCheckItem[]
  callSites: number
  /** 통과 여부 뱃지 — 없으면 checks로 자동 계산 */
  badgeTone?: BadgeTone
  /** drift zone 카드면 footer 안내 표시 */
  drift?: boolean
  selected?: boolean
  onSelect?: () => void
  /** demo 슬롯 — figure 안에 들어감 */
  demo?: ReactNode
}

export function ContractCard({
  name, file, role, propsSignature, checks, callSites,
  badgeTone, drift, selected, onSelect, demo, ...rest
}: ContractCardProps) {
  const passCount = checks.filter((c) => c.pass).length
  const allPass = passCount === checks.length
  const tone: BadgeTone = badgeTone ?? (allPass ? 'good' : passCount / Math.max(checks.length, 1) >= 0.7 ? 'warn' : 'bad')
  const badge = allPass ? '✓' : `${passCount}/${checks.length}`

  return (
    <article
      className="contract-card"
      aria-current={selected ? 'true' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onClick={onSelect}
      onKeyDown={onSelect ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect() }
      } : undefined}
      {...rest}
    >
      <header>
        <h3>{name}</h3>
        <span data-badge data-tone={tone}>{badge}</span>
        {role && <code>role=&quot;{role}&quot;</code>}
        <small>{callSites} 소비처</small>
      </header>
      <small>{file.replace('/src/ds/ui/', '')}</small>
      <pre>{propsSignature}</pre>
      <figure aria-label={`${name} 예시`}>{demo ?? <small>demo TBD</small>}</figure>
      <ul>
        {checks.map((c) => (
          <li key={c.id} data-pass={c.pass ? 'true' : 'false'}>
            {c.pass ? '✓' : '✗'} {c.label}
          </li>
        ))}
      </ul>
      {drift && <footer>zone 폴더 외부 — collection/composite/control/overlay/entity/layout 중 하나로 이동</footer>}
    </article>
  )
}

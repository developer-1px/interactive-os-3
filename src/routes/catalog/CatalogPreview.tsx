import type { Contract } from 'virtual:ds-contracts'
import { demos } from './demos'

/** Catalog preview — 선택된 카드의 큰 demo + 상세를 우측 aside로 보여준다. */
export function CatalogPreview({
  contract, onClose,
}: { contract: Contract | null; onClose: () => void }) {
  if (!contract) {
    return (
      <aside aria-roledescription="preview" aria-label="컴포넌트 미리보기" aria-hidden="true">
        <p>카드를 클릭하면 자세히 보입니다.</p>
      </aside>
    )
  }
  const { name, file, role, propsSignature, checks, callSites, kind } = contract
  const Render = demos[name]
  return (
    <aside aria-roledescription="preview" aria-label={`${name} 미리보기`}>
      <header>
        <hgroup>
          <h2>{name}</h2>
          <p>
            <span data-kind={kind}>{kind}</span>
            {role && <code>role=&quot;{role}&quot;</code>}
            <small>{callSites} 소비처</small>
          </p>
        </hgroup>
        <button type="button" aria-label="닫기" onClick={onClose}>×</button>
      </header>
      <small aria-roledescription="card-path">{file.replace('/src/ds/ui/', '')}</small>
      <figure aria-roledescription="card-demo" aria-label={`${name} 예시`}>
        {Render ? <Render /> : <small>demo TBD</small>}
      </figure>
      <pre>{propsSignature}</pre>
      <ul aria-roledescription="card-checks">
        {checks.map((c) => (
          <li key={c.id} data-pass={c.pass ? 'true' : 'false'}>
            {c.pass ? '✓' : '✗'} {c.label}
          </li>
        ))}
      </ul>
    </aside>
  )
}

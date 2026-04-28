/**
 * CodeBlock — 신뢰된 코드 하이라이트 HTML 패스스루.
 *
 * shiki 같은 외부 하이라이터가 만든 sanitized HTML을 그대로 렌더해야 하는
 * 좁은 경우 1개를 위한 leaf. Prose와 동일 패턴 (HTML payload entity).
 *
 * 데이터 주도(props만): `html: string`, `lang?: string`. children/JSX 받지 않는다.
 */
export interface CodeBlockProps {
  html: string
  lang?: string
  'aria-label'?: string
  hidden?: boolean
}

export function CodeBlock({ html, lang, hidden, ...rest }: CodeBlockProps) {
  return (
    <pre
      data-flow="code-block"
      data-lang={lang}
      hidden={hidden || undefined}
      dangerouslySetInnerHTML={{ __html: html }}
      {...rest}
    />
  )
}

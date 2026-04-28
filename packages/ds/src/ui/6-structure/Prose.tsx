/**
 * Prose — HTML 문자열 패스스루.
 *
 * Markdown viewer 같이 외부에서 만들어진 sanitized HTML을 그대로 렌더해야 하는
 * 좁은 경우 1개를 위한 leaf. 신뢰 가능한 HTML만 넣어야 한다.
 *
 * 데이터 주도(props만): `html: string`. children/JSX 받지 않는다.
 */
export interface ProseProps {
  html: string
  'aria-label'?: string
  hidden?: boolean
}

export function Prose({ html, hidden, ...rest }: ProseProps) {
  return (
    <article
      data-flow="prose"
      hidden={hidden || undefined}
      dangerouslySetInnerHTML={{ __html: html }}
      {...rest}
    />
  )
}

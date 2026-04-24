import type { ComponentPropsWithoutRef, ReactNode } from 'react'

/**
 * CourseCard — 코스 카테고리 한 항목을 리스트의 카드로 표시.
 *
 * 시맨틱: article = 독립 내용 단위. figure(badge) + div(info) + div(actions).
 * tone → data-tone="info|success|warning|danger|accent"로 좌측 badge 색상.
 * 내부 구조 식별은 태그 + 위치로만.
 */
type CourseCardProps = Omit<ComponentPropsWithoutRef<'article'>, 'children'> & {
  abbr: ReactNode         // 좌측 대형 배지 텍스트 (NCA/NCP/…)
  name: ReactNode         // h3 타이틀
  desc?: ReactNode        // p 보조 설명
  tone?: 'info' | 'success' | 'warning' | 'danger' | 'accent' | 'neutral'
  actions?: ReactNode     // 우측 컨트롤(스위치·버튼 등)
  meta?: ReactNode        // 우측 count pill (<mark> 등)
  footer?: ReactNode      // 최종 수정일 같은 small 텍스트
}

export function CourseCard({
  abbr, name, desc, tone = 'info', actions, meta, footer, ...rest
}: CourseCardProps) {
  return (
    <article className="course-card" data-tone={tone} {...rest}>
      <figure aria-hidden="true">{abbr}</figure>
      <div>
        <h3>{name}</h3>
        {desc && <p>{desc}</p>}
      </div>
      <div>
        {meta}
        {actions && <div>{actions}</div>}
        {footer && <small>{footer}</small>}
      </div>
    </article>
  )
}

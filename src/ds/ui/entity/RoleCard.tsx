import type { ComponentPropsWithoutRef, ReactNode } from 'react'

/**
 * RoleCard — sortable resource list의 한 item을 card-like row로 표시.
 *
 * 시맨틱: article + button(drag handle) + span[aria-hidden](icon) + div(info) + div(side).
 * CourseCard와 비교:
 *   - 좌측이 그라디언트 figure(abbr)가 아니라 drag handle + emoji icon
 *   - 사용처: 순서 변경이 가능한 resource list (역할/태그/필터 같은 관리 목록)
 * Content widget 계약: className="role-card" 1개. 내부는 태그·위치로 식별.
 */
type RoleCardProps = Omit<ComponentPropsWithoutRef<'article'>, 'children'> & {
  icon: ReactNode         // emoji 또는 lucide 아이콘 ReactNode (장식)
  name: ReactNode         // h3 타이틀
  desc?: ReactNode        // p 보조 설명
  meta?: ReactNode        // <mark> count 등
  actions?: ReactNode     // Switch·Button들 (fragment)
  draggable?: boolean     // true면 좌측 drag handle 표시
  onDragHandlePointerDown?: (e: React.PointerEvent) => void
}

export function RoleCard({
  icon, name, desc, meta, actions, draggable = true, onDragHandlePointerDown, ...rest
}: RoleCardProps) {
  return (
    <article className="role-card" {...rest}>
      {draggable && (
        <button
          type="button"
          aria-label="드래그로 순서 변경"
          onPointerDown={onDragHandlePointerDown}
        >
          ⠿
        </button>
      )}
      <span aria-hidden="true">{icon}</span>
      <div>
        <h3>{name}</h3>
        {desc && <p>{desc}</p>}
      </div>
      <div>
        {meta}
        {actions && <div>{actions}</div>}
      </div>
    </article>
  )
}

import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type MediaObjectProps = Omit<ComponentPropsWithoutRef<'article'>, 'title' | 'children'> & {
  media: ReactNode
  title: ReactNode
  body?: ReactNode
  meta?: ReactNode
}

/**
 * MediaObject — Bootstrap Media Object / Material Two-line list / Atlassian.
 * avatar/thumbnail + (title 위 + body 아래) 2단 grid. PostCard·FeedPost·MessageBubble
 * 의 grid-template-areas 패턴이 매번 재발명하던 어휘.
 *
 * 슬롯: media (preview) · title · body · meta. align-items:start.
 */
export function MediaObject({ media, title, body, meta, ...rest }: MediaObjectProps) {
  return (
    <article data-part="media" {...rest}>
      <div data-slot="media">{media}</div>
      <div data-slot="title">{title}</div>
      {body && <div data-slot="body">{body}</div>}
      {meta && <div data-slot="meta">{meta}</div>}
    </article>
  )
}

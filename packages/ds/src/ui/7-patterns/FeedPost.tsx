import type { ComponentPropsWithoutRef } from 'react'
import { Card } from '../../parts/Card'

/**
 * FeedPost — SNS/소셜 피드 포스트 카드. Card 슬롯에 어휘 바인딩.
 *
 * 슬롯 매핑:
 *   title   → header (avatar + name/handle/time + more 버튼)
 *   body    → 본문 텍스트 + 이미지(있을 때)
 *   footer  → reaction toolbar (좋아요/댓글/공유)
 */
type FeedPostProps = Omit<ComponentPropsWithoutRef<'article'>, 'children'> & {
  author: string
  handle: string
  time: string
  body: string
  avatar: string
  image?: string
  likes: number
  comments: number
  shared: number
  liked?: boolean
  onLike?: () => void
  onComment?: () => void
  onShare?: () => void
}

export function FeedPost({
  author, handle, time, body, avatar, image,
  likes, comments, shared, liked, onLike, onComment, onShare, ...rest
}: FeedPostProps) {
  return (
    <Card
      data-card="feed-post"
      data-emphasis="raised"
      aria-label={author}
      slots={{
        title: (
          <header>
            <strong data-ds-aspect="square">
              <img src={avatar} alt="" loading="lazy" />
            </strong>
            <strong>{author} <small>{handle} · {time}</small></strong>
            <button type="button" aria-label="더보기" data-icon="more" />
          </header>
        ),
        body: (
          <>
            <p>{body}</p>
            {image && <p><img src={image} alt="" loading="lazy" /></p>}
          </>
        ),
        footer: (
          <footer role="toolbar" aria-label="반응">
            <button type="button" aria-pressed={liked} aria-label="좋아요" data-icon="heart" onClick={onLike}>
              {likes + (liked ? 1 : 0)}
            </button>
            <button type="button" aria-label="댓글" data-icon="message-circle" onClick={onComment}>
              {comments}
            </button>
            <button type="button" aria-label="공유" data-icon="share" onClick={onShare}>
              {shared}
            </button>
          </footer>
        ),
      }}
      {...rest}
    />
  )
}

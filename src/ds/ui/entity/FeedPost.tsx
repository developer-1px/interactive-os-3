import type { ComponentPropsWithoutRef, ReactNode } from 'react'

/**
 * FeedPost — SNS/소셜 피드 포스트 카드.
 *
 * 시맨틱: article. header(avatar+meta+more) + p(body) + img? + footer(reaction toolbar).
 * 카드 외형은 data-emphasis="raised" surface로 받음.
 *
 * CSS 셀렉터: [aria-roledescription="feed-post"]
 */
type FeedPostProps = Omit<ComponentPropsWithoutRef<'article'>, 'children'> & {
  author: string
  handle: string
  time: string
  body: ReactNode
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
    <article
      className="feed-post"
      aria-roledescription="feed-post"
      aria-label={author}
      data-emphasis="raised"
      {...rest}
    >
      <header>
        <strong data-ds-aspect="square">
          <img src={avatar} alt="" loading="lazy" />
        </strong>
        <strong>{author} <small>{handle} · {time}</small></strong>
        <button type="button" aria-label="더보기" data-icon="more" />
      </header>
      <p>{body}</p>
      {image && <p><img src={image} alt="" loading="lazy" /></p>}
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
    </article>
  )
}

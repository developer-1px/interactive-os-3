import type { ComponentPropsWithoutRef } from 'react'
import { Card } from '../ui/6-structure/Card'

/**
 * FeedPost — SNS/소셜 피드 포스트 카드. Card 슬롯에 어휘 바인딩.
 *
 * 슬롯 매핑:
 *   title   → header (avatar + name/handle/time + more 버튼)
 *   body    → 본문 텍스트 + 첨부(이미지·링크·파일·코드·커밋) 다채로운 컨텐츠
 *   footer  → reaction toolbar (좋아요/댓글/공유)
 */
export type FeedAttachment =
  | { kind: 'image'; src: string; alt?: string }
  | { kind: 'link'; url: string; title: string; host: string; desc?: string }
  | { kind: 'file'; name: string; size: string; ext: string }
  | { kind: 'code'; lang: string; snippet: string }
  | { kind: 'commit'; sha: string; subject: string; repo: string }

type FeedPostProps = Omit<ComponentPropsWithoutRef<'article'>, 'children'> & {
  author: string
  handle: string
  time: string
  body: string
  avatar: string
  image?: string
  attachments?: readonly FeedAttachment[]
  likes: number
  comments: number
  shared: number
  liked?: boolean
  onLike?: () => void
  onComment?: () => void
  onShare?: () => void
}

function Attachment({ a }: { a: FeedAttachment }) {
  switch (a.kind) {
    case 'image':
      return <img src={a.src} alt={a.alt ?? ''} loading="lazy" data-attach="image" />
    case 'link':
      return (
        <a href={a.url} target="_blank" rel="noreferrer" data-attach="link">
          <span data-icon="link" aria-hidden="true" />
          <strong>{a.title}</strong>
          <small>{a.host}</small>
          {a.desc && <p>{a.desc}</p>}
        </a>
      )
    case 'file':
      return (
        <span data-attach="file">
          <span data-icon="file" aria-hidden="true" />
          <strong>{a.name}</strong>
          <small>{a.size} · {a.ext.toUpperCase()}</small>
        </span>
      )
    case 'code':
      return (
        <pre data-attach="code" data-lang={a.lang}>
          <code>{a.snippet}</code>
        </pre>
      )
    case 'commit':
      return (
        <span data-attach="commit">
          <span data-icon="git-commit" aria-hidden="true" />
          <code>{a.sha}</code>
          <strong>{a.subject}</strong>
          <small>{a.repo}</small>
        </span>
      )
  }
}

export function FeedPost({
  author, handle, time, body, avatar, image, attachments,
  likes, comments, shared, liked, onLike, onComment, onShare, ...rest
}: FeedPostProps) {
  return (
    <Card
      data-card="feed-post"
      data-variant="raised"
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
            {image && <p><img src={image} alt="" loading="lazy" data-attach="image" /></p>}
            {attachments && attachments.length > 0 && (
              <div data-attachments>
                {attachments.map((a, i) => <Attachment key={i} a={a} />)}
              </div>
            )}
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

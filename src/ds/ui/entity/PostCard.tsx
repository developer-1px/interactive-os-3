import type { ComponentPropsWithoutRef, ReactNode } from 'react'

/**
 * PostCard — Slack/Discord 식 채널 게시판 한 줄.
 *
 * 시맨틱: article. 좌측 avatar(strong[data-ds-aspect=square]) + 우측 본문(div).
 * cont=true (이전 메시지가 같은 작성자) → avatar/header 시각 숨김으로 묶어 보임.
 *
 * CSS: [aria-roledescription="post"|"post-cont"]
 */
type PostCardProps = Omit<ComponentPropsWithoutRef<'article'>, 'children'> & {
  who: string
  time: string
  text: ReactNode
  avatar: string
  /** 이전 post가 같은 작성자면 true — avatar/header를 묶어 표시 */
  cont?: boolean
}

export function PostCard({ who, time, text, avatar, cont, ...rest }: PostCardProps) {
  return (
    <article
      className="post-card"
      aria-roledescription={cont ? 'post-cont' : 'post'}
      aria-label={who}
      {...rest}
    >
      <strong data-ds-aspect="square">
        <img src={avatar} alt="" loading="lazy" />
      </strong>
      <div>
        <strong>{who} <small>{time}</small></strong>
        <p>{text}</p>
      </div>
    </article>
  )
}

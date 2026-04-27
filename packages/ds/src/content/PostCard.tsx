import type { ComponentPropsWithoutRef } from 'react'
import { Card } from '../ui/parts/Card'

/**
 * PostCard — Slack/Discord 식 채널 게시판 한 줄. Card 슬롯에 어휘 바인딩.
 *
 * 슬롯 매핑:
 *   preview → avatar (정사각 36px)
 *   title   → who + time
 *   body    → 본문 텍스트
 *
 * cont=true (이전 메시지가 같은 작성자) → data-cont 마커. CSS가 avatar/header 시각 숨김.
 */
type PostCardProps = Omit<ComponentPropsWithoutRef<'article'>, 'children'> & {
  who: string
  time: string
  text: string
  avatar: string
  /** 이전 post가 같은 작성자면 true */
  cont?: boolean
}

export function PostCard({ who, time, text, avatar, cont, ...rest }: PostCardProps) {
  return (
    <Card
      data-card="post"
      data-cont={cont ? 'true' : undefined}
      aria-label={who}
      slots={{
        preview: (
          <strong data-ds-aspect="square">
            <img src={avatar} alt="" loading="lazy" />
          </strong>
        ),
        title: <strong>{who} <small>{time}</small></strong>,
        body: <p>{text}</p>,
      }}
      {...rest}
    />
  )
}

import type { ComponentPropsWithoutRef, ReactNode } from 'react'

/**
 * MessageBubble — DM 1:1 채팅 한 메시지.
 *
 * 시맨틱: article = 독립 내용 단위. small(meta) + p(text).
 * me=true → 우측 정렬 + accent 색, false → 좌측 + surface.
 * 사용자/시간 표시 정책: me는 시간만, other는 이름·시간 (Slack/Discord 수렴).
 *
 * CSS 셀렉터: [aria-roledescription="message-me|message-other"]
 */
type MessageBubbleProps = Omit<ComponentPropsWithoutRef<'article'>, 'children'> & {
  who: string
  time: string
  text: ReactNode
  me?: boolean
}

export function MessageBubble({ who, time, text, me, ...rest }: MessageBubbleProps) {
  return (
    <article
      className="message-bubble"
      aria-roledescription={me ? 'message-me' : 'message-other'}
      aria-label={who}
      {...rest}
    >
      <small>{me ? time : `${who} · ${time}`}</small>
      <p>{text}</p>
    </article>
  )
}

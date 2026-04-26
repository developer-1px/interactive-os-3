import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Card } from '../../parts/Card'

/**
 * MessageBubble — DM 1:1 채팅 한 메시지. Card 슬롯에 어휘 바인딩.
 *
 * 슬롯 매핑:
 *   meta → small (who · time, me면 시간만)
 *   body → p (메시지 텍스트)
 *
 * data-side="me|other" 마커로 좌/우 정렬 + 색상 분기.
 */
type MessageBubbleProps = Omit<ComponentPropsWithoutRef<'article'>, 'children'> & {
  who: string
  time: string
  text: ReactNode
  me?: boolean
}

export function MessageBubble({ who, time, text, me, ...rest }: MessageBubbleProps) {
  return (
    <Card
      data-card="message"
      data-side={me ? 'me' : 'other'}
      aria-label={who}
      slots={{
        meta: <small>{me ? time : `${who} · ${time}`}</small>,
        body: <p>{text}</p>,
      }}
      {...rest}
    />
  )
}

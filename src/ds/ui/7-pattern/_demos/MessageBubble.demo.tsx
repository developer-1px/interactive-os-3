import { MessageBubble } from '../MessageBubble'

export default function MessageBubbleDemo() {
  return (
    <div style={{ display: 'grid', gap: 6 }}>
      <MessageBubble who="민지" time="10:24" text="안녕! 오늘 회의 시간 되지?" />
      <MessageBubble who="나" time="10:25" text="응 3시까지 갈게" me />
    </div>
  )
}

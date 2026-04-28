import { Card } from '../Card'
import { Heading } from '../Heading'
import { Timestamp } from '../Timestamp'
export default () => (
  <Card
    slots={{
      title: <Heading level={3}>Card title</Heading>,
      meta: <Timestamp value={Date.now() - 3600_000} display="relative" />,
      body: <p>카드 본문 — 짧은 설명 텍스트.</p>,
    }}
  />
)

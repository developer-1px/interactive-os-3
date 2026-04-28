import { Avatar, Column, MessageBubble, Phone, PhoneTabBar, PhoneTopBar, Row, Skeleton } from '@p/ds'
import { Button } from '@p/ds/ui/1-command/Button'
import { defineScreen, defineGroup } from '../wireframe-registry'
import { Body, StickyAction, tabIcons } from '../wireframe-shell'
import { type } from '@p/ds/tokens/foundations'
import { composer, divider, listRow, meta } from '../wireframe-tokens'

defineGroup('A-Chat',          { id: 'A', title: 'Chat',          lede: 'MessageBubble · 1:1 대화 thread + 대화 목록 (Avatar + last-message)', defaultGuide: 'list' })

// ──────────────────────────────────────────────────────────────────────
// (A) Chat — MessageBubble
// ──────────────────────────────────────────────────────────────────────

const Chat_Thread = defineScreen({
  id: 'cat-chat-thread',
  app: 'iMessage',
  flow: 'chat',
  category: 'A-Chat',
  guide: 'thread',
  patterns: ['chat-bubble', 'sticky-composer', 'top-bar-back-action'],
  parts: ['Phone', 'PhoneTopBar', 'MessageBubble', 'Skeleton', 'Button', 'Row'],
  render: () => (
    <Phone
      label="thread"
      topBar={<PhoneTopBar back title="Alex Kim" action={<span data-icon="more" aria-label="more" />} />}
    >
      <Body>
        <MessageBubble who="Alex" time="9:14" text="오늘 PR 머지 부탁드려요. CI 그린 + 리뷰 2개 받았습니다." />
        <MessageBubble who="me" time="9:18" me text="확인하고 오후 2시쯤 머지할게요. 그 전에 staging 한 번 돌려보고요." />
        <MessageBubble who="Alex" time="9:22" text="좋습니다. staging URL 공유해 드릴게요. 혹시 hotfix 필요하면 바로 알려주세요." />
        <MessageBubble who="me" time="9:25" me text="네, 일단 통과하면 production 으로 가겠습니다." />
      </Body>
      <StickyAction>
        <Row flow="cluster" style={{ alignItems: 'center' }}>
          <Skeleton width="100%" height={composer.inputHeight} style={{ borderRadius: composer.inputRadius }} />
          <Button data-emphasis="primary" aria-label="send"><span data-icon="arrow-up" /></Button>
        </Row>
      </StickyAction>
    </Phone>
  ),
})

const Chat_List = defineScreen({
  id: 'cat-chat-list',
  app: 'iMessage',
  flow: 'chat',
  category: 'A-Chat',
  patterns: ['conversation-list-row', 'avatar-with-text', 'bottom-tab-bar', 'top-bar-action'],
  parts: ['Phone', 'PhoneTopBar', 'PhoneTabBar', 'Avatar', 'Row', 'Column'],
  render: () => (
    <Phone
      label="conversations"
      topBar={<PhoneTopBar title="Messages" action={<span data-icon="edit" aria-label="compose" />} />}
      bottomBar={<PhoneTabBar items={tabIcons(2)} active={2} />}
    >
      <Body>
        {[
          { who: '김지민', time: '14:32', text: '회의 자료 검토 부탁드립니다' },
          { who: '박서연', time: '12:18', text: '점심 같이 드실래요? 1층 한식당' },
          { who: '이준호', time: '11:04', text: '디자인 시안 공유드립니다' },
          { who: '최민지', time: '10:55', text: 'RFC: focus-ring 의견 부탁' },
          { who: '강예나', time: '09:42', text: '4월 리포트 첨부합니다' },
        ].map(c => (
          <Row key={c.who} flow="cluster" style={{ alignItems: 'center', ...listRow }}>
            <Avatar src="" alt={c.who} />
            <Column style={{ flex: 1, minInlineSize: 0 }}>
              <Row flow="split"><strong>{c.who}</strong><small style={meta.weak}>{c.time}</small></Row>
              <small style={{ ...meta.medium, ...type.truncate }}>{c.text}</small>
            </Column>
          </Row>
        ))}
      </Body>
    </Phone>
  ),
})

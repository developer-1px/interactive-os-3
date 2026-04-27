import { Avatar, Column, Phone, PhoneTabBar, PhoneTopBar, Row, TabList, fromList } from '@p/ds'
import { defineScreen, defineGroup } from '../wireframe-registry'
import { Body, tabIcons } from '../wireframe-shell'
import { type } from '@p/ds/tokens/foundations'
import { dot, listRow, meta } from '../wireframe-tokens'

defineGroup('P-Notifications', { id: 'P', title: 'Notifications', lede: 'GitHub 식 알림함 — filter Tabs · unread dot · avatar row.', defaultGuide: 'list' })

// ──────────────────────────────────────────────────────────────────────
// (P) Notifications — Inbox
// ──────────────────────────────────────────────────────────────────────

const Notif_Inbox = defineScreen({
  id: 'cat-notif-inbox',
  app: 'GitHub',
  flow: 'notifications',
  category: 'P-Notifications',
  patterns: ['filter-tabs', 'inbox-row', 'unread-dot', 'avatar-with-text', 'bottom-tab-bar', 'top-bar-action'],
  parts: ['Phone', 'PhoneTopBar', 'PhoneTabBar', 'TabList', 'Avatar', 'Row', 'Column'],
  render: () => (
    <Phone
      label="notifications"
      topBar={<PhoneTopBar title="알림" action={<span data-icon="check" aria-label="모두 읽음" />} />}
      bottomBar={<PhoneTabBar items={tabIcons(2)} active={2} />}
    >
      <Body>
        <TabList aria-label="filter" data={fromList([{ label: '전체', selected: true }, { label: '읽지 않음' }, { label: '@나' }])} onEvent={() => {}} />
        {[
          { who: '박서연', text: 'PR #482 에 리뷰를 남겼습니다 — 2 comments', time: '5분 전', unread: true },
          { who: '이준호', text: 'gist "Card subgrid" 를 즐겨찾기에 추가했습니다', time: '1시간 전', unread: true },
          { who: '김지민', text: '"Hierarchy 가 잘 보이네요" — 댓글', time: '오전 9:14', unread: false },
          { who: 'Vercel Bot', text: 'main 배포 성공 (build #2480)', time: '어제', unread: false },
          { who: '강예나', text: '4월 리포트가 공유되었습니다', time: '어제', unread: false },
        ].map((n, i) => (
          <Row key={i} flow="cluster" style={{ alignItems: 'center', ...listRow }}>
            <span aria-hidden style={dot.unread(n.unread)} />
            <Avatar src="" alt={n.who} />
            <Column style={{ flex: 1, minInlineSize: 0 }}>
              <Row flow="split"><strong>{n.who}</strong><small style={{ ...meta.weak, flexShrink: 0 }}>{n.time}</small></Row>
              <small style={{ ...meta.medium, ...type.truncate }}>{n.text}</small>
            </Column>
          </Row>
        ))}
      </Body>
    </Phone>
  ),
})

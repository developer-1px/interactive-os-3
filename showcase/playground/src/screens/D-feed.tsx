import { FeedPost, Listbox, Phone, PhoneTabBar, PhoneTopBar } from '@p/ds'
import { defineScreen, defineGroup } from '../wireframe-registry'
import { Body, tabIcons } from '../wireframe-shell'

defineGroup('D-Feed',          { id: 'D', title: 'Feed',          lede: 'FeedPost · timeline. 좋아요 · 댓글 · 공유 toolbar 자체 내장.', defaultGuide: 'feed' })

// ──────────────────────────────────────────────────────────────────────
// (D) Feed — FeedPost
// ──────────────────────────────────────────────────────────────────────

const Feed_Timeline = defineScreen({
  id: 'cat-feed-timeline',
  app: 'Threads',
  flow: 'feed',
  category: 'D-Feed',
  patterns: ['feed-post', 'like-comment-share', 'bottom-tab-bar', 'top-bar-action'],
  parts: ['Phone', 'PhoneTopBar', 'PhoneTabBar', 'FeedPost'],
  render: () => (
    <Phone
      label="feed"
      topBar={<PhoneTopBar title="Feed" action={<span data-icon="edit" aria-label="compose" />} />}
      bottomBar={<PhoneTabBar items={tabIcons(0)} active={0} />}
    >
      <Body>
        <FeedPost
          author="유용태" handle="@teo" time="2분 전"
          avatar="https://i.pravatar.cc/64?u=teo"
          body="recursive Proximity 가 잘 보이는 화면을 만들었다. shell·surface·section·atom 4단을 한 카드 안에서 다 시연 가능. PR #482 에 올렸으니 리뷰 부탁드려요."
          likes={24} comments={6} shared={3} liked
        />
        <FeedPost
          author="박서연" handle="@seoyeon" time="1시간 전"
          avatar="https://i.pravatar.cc/64?u=seoyeon"
          body="ds/devices/Phone 신설 — 393×852 실물 크기. dynamic island · home indicator 까지 토큰만으로 렌더."
          likes={47} comments={11} shared={5}
        />
        <FeedPost
          author="이준호" handle="@junho" time="오전 9:14"
          avatar="https://i.pravatar.cc/64?u=junho"
          body="Listbox composite 가 wireframe 안에서도 keyboard nav 가 살아있는 게 흥미롭다. showcase ↔ production 경계가 흐려짐."
          likes={89} comments={21} shared={12}
        />
      </Body>
    </Phone>
  ),
})

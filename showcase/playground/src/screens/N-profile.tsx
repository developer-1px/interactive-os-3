import { Avatar, Column, Heading, Phone, PhoneTopBar, Row, Skeleton, TabList, fromList } from '@p/ds'
import { Button } from '@p/ds/ui/2-action/Button'
import { defineScreen, defineGroup } from '../wireframe-registry'
import { Body } from '../wireframe-shell'
import { banner, meta } from '../wireframe-tokens'

defineGroup('N-Profile',       { id: 'N', title: 'Profile',       lede: 'Banner + Avatar overlap + stat row + follow CTA + segmented Tabs.', defaultGuide: 'hero' })

// ──────────────────────────────────────────────────────────────────────
// (N) Profile — Header + Tabs
// ──────────────────────────────────────────────────────────────────────

const Profile_Header = defineScreen({
  id: 'cat-profile-header',
  app: 'Generic Social',
  flow: 'profile',
  category: 'N-Profile',
  patterns: ['hero-banner', 'avatar-overlap', 'stat-row', 'follow-cta', 'segmented-tabs', 'top-bar-back-action'],
  parts: ['Phone', 'PhoneTopBar', 'Skeleton', 'Avatar', 'Heading', 'Row', 'Column', 'Button', 'TabList'],
  render: () => (
    <Phone label="profile" topBar={<PhoneTopBar back title="프로필" action={<span data-icon="more" aria-label="more" />} />}>
      <Body>
        <Skeleton width="100%" height={banner.height} style={{ borderRadius: banner.radius }} />
        <Row flow="cluster" style={{ alignItems: 'center', marginBlockStart: banner.avatarOverlap }}>
          <Avatar src="https://i.pravatar.cc/96?u=teo" alt="유용태" />
          <Column>
            <strong>유용태</strong>
            <small style={meta.medium}>@teo · DS engineer</small>
          </Column>
        </Row>
        <Row flow="split">
          <Column style={{ alignItems: 'center', flex: 1 }}><strong>184</strong><small style={meta.weak}>posts</small></Column>
          <Column style={{ alignItems: 'center', flex: 1 }}><strong>2.4k</strong><small style={meta.weak}>followers</small></Column>
          <Column style={{ alignItems: 'center', flex: 1 }}><strong>312</strong><small style={meta.weak}>following</small></Column>
        </Row>
        <Row flow="cluster">
          <Button data-emphasis="primary" style={{ flex: 1 }}>팔로우</Button>
          <Button style={{ flex: 1 }}>메시지</Button>
        </Row>
        <TabList aria-label="profile section" data={fromList([{ label: 'Posts', selected: true }, { label: 'Replies' }, { label: 'Likes' }])} onEvent={() => {}} />
      </Body>
    </Phone>
  ),
})

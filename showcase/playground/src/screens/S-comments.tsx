import { Avatar, Column, Link, Listbox, Phone, PhoneTopBar, Row, Skeleton, fromList } from '@p/ds'
import { Button } from '@p/ds/ui/2-action/Button'
import { defineScreen, defineGroup } from '../wireframe-registry'
import { Body, StickyAction } from '../wireframe-shell'
import { commentIndent, composer, listRow, meta } from '../wireframe-tokens'

defineGroup('S-Comments',      { id: 'S', title: 'Comments',      lede: 'Reddit 식 nested thread — voting · reply · 들여쓰기 + sticky composer.', defaultGuide: 'list' })

// ──────────────────────────────────────────────────────────────────────
// (S) Comments — nested thread
// ──────────────────────────────────────────────────────────────────────

const Comments_Thread = defineScreen({
  id: 'cat-comments-thread',
  app: 'Reddit',
  flow: 'comments',
  category: 'S-Comments',
  patterns: ['nested-comment', 'voting', 'reply-link', 'sticky-composer', 'top-bar-back'],
  parts: ['Phone', 'PhoneTopBar', 'Avatar', 'Row', 'Column', 'Link', 'Skeleton', 'Button'],
  render: () => (
    <Phone label="comments" topBar={<PhoneTopBar back title="댓글 24개" />}>
      <Body>
        {[
          { who: '박서연', time: '5분 전',  text: 'recursive Proximity 가 잘 보이는 화면이네요. wireframe 만으로 가능하다는 게 신기합니다.', votes: 12, indent: 0 },
          { who: '유용태', time: '3분 전',  text: '@박서연 사실 production 코드도 동일 부품이라 구분이 의미가 없어요.', votes: 8, indent: 1 },
          { who: '이준호', time: '오전 9:14', text: 'fromList 만으로 keyboard nav 가 살아있다는 게 핵심 같아요.', votes: 5, indent: 2 },
          { who: '김지민', time: '어제',     text: 'Listbox composite 의 design 결정이 흥미롭습니다. 다음 RFC 도 기대.', votes: 3, indent: 0 },
        ].map((c, i) => (
          <Row key={i} flow="cluster" style={{ alignItems: 'flex-start', paddingInlineStart: commentIndent(c.indent), ...listRow }}>
            <Avatar src="" alt={c.who} />
            <Column style={{ flex: 1, minInlineSize: 0 }}>
              <Row flow="cluster"><strong>{c.who}</strong><small style={meta.weak}>{c.time}</small></Row>
              <p style={{ margin: 0 }}>{c.text}</p>
              <Row flow="cluster" style={{ alignItems: 'center' }}>
                <Row flow="cluster" style={{ alignItems: 'center' }}><span data-icon="arrow-up" aria-hidden /><small>{c.votes}</small><span data-icon="arrow-down" aria-hidden style={meta.faint} /></Row>
                <Link href="#"><small>답글</small></Link>
                <Link href="#"><small>공유</small></Link>
              </Row>
            </Column>
          </Row>
        ))}
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

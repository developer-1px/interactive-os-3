import { Column, CourseCard, Heading, Phone, PhoneTabBar, PhoneTopBar, Row, Skeleton, TabList, Tag, fromList } from '@p/ds'
import { Button } from '@p/ds/ui/2-action/Button'
import { defineScreen, defineGroup } from '../wireframe-registry'
import { Body, PrimaryButton, StickyAction, tabIcons } from '../wireframe-shell'
import { hero, listRow, meta } from '../wireframe-tokens'

defineGroup('C-Learning',      { id: 'C', title: 'Learning',      lede: 'CourseCard · 레벨 picker (TabList) + 코스 catalog + 코스 상세 (커리큘럼)' })

// ──────────────────────────────────────────────────────────────────────
// (C) Learning — CourseCard
// ──────────────────────────────────────────────────────────────────────

const Learn_Catalog = defineScreen({
  id: 'cat-learn-catalog',
  app: 'Coursera',
  flow: 'learning',
  category: 'C-Learning',
  patterns: ['level-tabs', 'course-card-list', 'bottom-tab-bar', 'top-bar-search'],
  parts: ['Phone', 'PhoneTopBar', 'PhoneTabBar', 'TabList', 'CourseCard'],
  render: () => (
    <Phone
      label="course catalog"
      topBar={<PhoneTopBar title="Courses" action={<span data-icon="search" aria-label="search" />} />}
      bottomBar={<PhoneTabBar items={tabIcons(1)} active={1} />}
    >
      <Body>
        <TabList
          aria-label="level"
          data={fromList([
            { label: '초급', selected: true },
            { label: '중급' },
            { label: '고급' },
          ])}
          onEvent={() => {}}
        />
        <CourseCard abbr="TS" name="TypeScript 심화" desc="타입 추론과 generics" tone="accent" meta={<small>240 분</small>} />
        <CourseCard abbr="RX" name="RxJS 기초"     desc="Observable · Operator" tone="info" meta={<small>180 분</small>} />
        <CourseCard abbr="GO" name="Go 동시성"     desc="goroutine · channel" tone="success" meta={<small>320 분</small>} />
        <CourseCard abbr="AI" name="LLM 앱 개발"   desc="prompt · tool use · agent" tone="warning" meta={<small>420 분</small>} />
      </Body>
    </Phone>
  ),
})

const Learn_Detail = defineScreen({
  id: 'cat-learn-detail',
  app: 'Coursera',
  flow: 'learning',
  category: 'C-Learning',
  patterns: ['hero-image', 'tag-meta-row', 'curriculum-list', 'sticky-action-cta', 'top-bar-back-action'],
  parts: ['Phone', 'PhoneTopBar', 'Skeleton', 'Heading', 'Tag', 'Row', 'Column', 'Button'],
  render: () => (
    <Phone
      label="course detail"
      topBar={<PhoneTopBar back title="Course" action={<span data-icon="heart" aria-label="favorite" />} />}
    >
      <Body>
        <Column>
          <Skeleton width="100%" height={hero.height} style={{ borderRadius: hero.radius }} />
          <Heading level="h2">TypeScript 심화 — 타입 추론과 generics</Heading>
          <Row flow="cluster"><Tag label="중급" /><Tag label="240 분" /><Tag label="자막" /></Row>
          <p style={meta.medium}>강사 Sora Park · 12 챕터 · 8 실습</p>
        </Column>
        <Heading level="h3">커리큘럼</Heading>
        <Column flow="list">
          {['1. 타입 시스템 개요', '2. 타입 추론 메커니즘', '3. Generics 입문', '4. 조건부 타입', '5. 매핑 타입'].map(t => (
            <Row key={t} flow="split" style={{ ...listRow }}>
              <span>{t}</span><span data-icon="chevron-right" style={meta.faint} aria-hidden />
            </Row>
          ))}
        </Column>
      </Body>
      <StickyAction><PrimaryButton>수강 시작</PrimaryButton></StickyAction>
    </Phone>
  ),
})

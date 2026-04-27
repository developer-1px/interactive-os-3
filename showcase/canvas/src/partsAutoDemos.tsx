/**
 * autoDemos — ds/parts/ 와 ds/ui/ 부품의 휴리스틱 default render.
 *
 * `_demos/<Name>.demo.tsx` · catalog demo registry에 없는 부품에 대해
 * sensible default props로 렌더한다. 새 부품 추가 시에도 즉시 캔버스에 노출.
 */
import { useReducer, useMemo, type ReactNode } from 'react'
import {
  Avatar, Badge, Breadcrumb, Callout, Card, Code, Kbd, EmptyState,
  Heading, KeyValue, Link as PartsLink,
  Progress, Skeleton, Table, Tag, Thumbnail, Timestamp,
} from '@p/ds/ui/parts'
import { Phone, PhoneTopBar, PhoneTabBar, ROOT, reduce, type NormalizedData } from '@p/ds'
import { Prose } from '@p/ds/ui/0-primitives/Prose'
import { CodeBlock } from '@p/ds/ui/0-primitives/CodeBlock'
import { ListboxGroup } from '@p/ds/ui/4-selection/ListboxGroup'
import { MenuGroup } from '@p/ds/ui/4-selection/MenuGroup'
import { Option } from '@p/ds/ui/4-selection/Option'
import { ColumnHeader } from '@p/ds/ui/5-display/ColumnHeader'
import { RowHeader } from '@p/ds/ui/5-display/RowHeader'
import { RowGroup } from '@p/ds/ui/5-display/RowGroup'
import { GridCell } from '@p/ds/ui/5-display/GridCell'
import { MenuList } from '@p/ds/ui/4-selection/MenuList'
import { Menubar } from '@p/ds/ui/4-selection/Menubar'
import { DataGrid } from '@p/ds/ui/5-display/DataGrid'
import { TreeGrid } from '@p/ds/ui/5-display/TreeGrid'
import { TreeRow } from '@p/ds/ui/5-display/TreeRow'
import { OrderableList } from '@p/ds/ui/5-display/OrderableList'
import { MobileFrame } from '@p/ds/devices/MobileFrame'
import { ZoomPanCanvas } from '@p/ds/ui/8-layout/ZoomPanCanvas'
import { Dialog } from '@p/ds/ui/6-overlay/Dialog'
import { MenuPopover } from '@p/ds/ui/6-overlay/MenuPopover'
import { Sheet } from '@p/ds/ui/6-overlay/Sheet'
import { ContractCard } from '@p/ds/content/ContractCard'
import { FeedPost } from '@p/ds/content/FeedPost'
import { FeedArticle } from '@p/ds/ui/patterns/FeedArticle'
import { DataGridRow } from '@p/ds/ui/5-display/DataGridRow'

const overlayWrap = (label: string): ReactNode => (
  <div style={{ font: '500 11px system-ui', color: '#666', padding: 8 }}>
    {label} (open in app)
  </div>
)

const REGISTRY: Record<string, () => ReactNode> = {
  Avatar: () => <Avatar name="Jane Doe" />,
  Badge: () => <Badge count={7} />,
  Breadcrumb: () => (
    <Breadcrumb
      items={[
        { id: 'home', label: 'Home' },
        { id: 'docs', label: 'Docs' },
        { id: 'tokens', label: 'Tokens' },
      ]}
    />
  ),
  Callout: () => <Callout tone="info">정보성 안내 메시지입니다.</Callout>,
  Card: () => (
    <Card
      slots={{
        title: <Heading level={3}>Card title</Heading>,
        meta: <Timestamp value={Date.now() - 3600_000} display="relative" />,
        body: <p>카드 본문 — 짧은 설명 텍스트.</p>,
      }}
    />
  ),
  Code: () => <Code>const x = 42</Code>,
  Kbd: () => <Kbd>⌘ K</Kbd>,
  EmptyState: () => (
    <EmptyState title="비어 있음" description="아직 항목이 없습니다." />
  ),
  Heading: () => <Heading level={2}>Section heading</Heading>,
  KeyValue: () => (
    <KeyValue
      items={[
        { key: 'Status', value: 'Active' },
        { key: 'Owner', value: 'Jane' },
      ]}
    />
  ),
  Link: () => <PartsLink href="https://example.com">Open link</PartsLink>,
  Phone: () => (
    <Phone>
      <PhoneTopBar title="Phone" />
      <div style={{ flex: 1 }} />
    </Phone>
  ),
  PhoneTopBar: () => <PhoneTopBar title="Title" />,
  PhoneTabBar: () => (
    <PhoneTabBar
      active="home"
      items={[
        { id: 'home', label: 'Home' },
        { id: 'search', label: 'Search' },
      ]}
    />
  ),
  Progress: () => <Progress value={42} />,
  Skeleton: () => <Skeleton width={120} height={16} />,
  Table: () => (
    <Table
      columns={[
        { id: 'name', label: 'Name' },
        { id: 'role', label: 'Role' },
      ]}
      rows={[
        { id: 1, name: 'Jane', role: 'Eng' },
        { id: 2, name: 'John', role: 'Design' },
      ]}
    />
  ),
  Tag: () => <Tag label="label" />,
  Thumbnail: () => <Thumbnail ratio="square" />,
  Timestamp: () => <Timestamp value={Date.now() - 60_000} display="relative" />,

  // ── ui/ 휴리스틱 데모 ───────────────────────────────────────────────
  Prose: () => <Prose html="<p>This is <strong>prose</strong> content.</p>" />,
  CodeBlock: () => <CodeBlock html="<code>const x = 42</code>" lang="ts" />,
  ListboxGroup: () => (
    <ListboxGroup label="Group">
      <Option>Item one</Option>
      <Option>Item two</Option>
    </ListboxGroup>
  ),
  MenuGroup: () => (
    <MenuGroup label="Edit">
      <Option>Cut</Option>
      <Option>Copy</Option>
    </MenuGroup>
  ),
  Option: () => <ul role="listbox"><Option>Single option</Option></ul>,
  ColumnHeader: () => (
    <table role="grid">
      <thead>
        <tr>
          <ColumnHeader sort="ascending">Name</ColumnHeader>
          <ColumnHeader>Role</ColumnHeader>
        </tr>
      </thead>
    </table>
  ),
  RowHeader: () => (
    <table role="grid">
      <tbody>
        <tr>
          <RowHeader>Header cell</RowHeader>
        </tr>
      </tbody>
    </table>
  ),
  RowGroup: () => (
    <table role="grid">
      <RowGroup>
        <tr><td>row in group</td></tr>
      </RowGroup>
    </table>
  ),
  GridCell: () => (
    <table role="grid">
      <tbody>
        <tr><GridCell>cell value</GridCell></tr>
      </tbody>
    </table>
  ),
  MenuList: () => (
    <MenuList>
      <Option>One</Option>
      <Option>Two</Option>
    </MenuList>
  ),
  Menubar: () => (
    <Menubar>
      <Option>File</Option>
      <Option>Edit</Option>
      <Option>View</Option>
    </Menubar>
  ),
  DataGrid: () => (
    <DataGrid>
      <thead>
        <tr><ColumnHeader>Name</ColumnHeader><ColumnHeader>Age</ColumnHeader></tr>
      </thead>
      <tbody>
        <tr><GridCell>Jane</GridCell><GridCell>30</GridCell></tr>
        <tr><GridCell>John</GridCell><GridCell>28</GridCell></tr>
      </tbody>
    </DataGrid>
  ),
  TreeGrid: () => (
    <TreeGrid>
      <thead>
        <tr><ColumnHeader>Name</ColumnHeader></tr>
      </thead>
      <tbody>
        <TreeRow level={1}><GridCell>Root</GridCell></TreeRow>
        <TreeRow level={2}><GridCell>Child</GridCell></TreeRow>
      </tbody>
    </TreeGrid>
  ),
  TreeRow: () => (
    <table role="treegrid">
      <tbody>
        <TreeRow level={1}><GridCell>Tree row</GridCell></TreeRow>
      </tbody>
    </table>
  ),
  OrderableList: () => (
    <OrderableList
      data={{
        entities: { __root__: { id: '__root__', data: {} }, a: { id: 'a', data: { label: 'First' } }, b: { id: 'b', data: { label: 'Second' } } },
        relationships: { __root__: ['a', 'b'] },
      }}
      onReorder={() => {}}
    />
  ),
  MobileFrame: () => (
    <MobileFrame>
      <div style={{ padding: 16 }}>Mobile content</div>
    </MobileFrame>
  ),
  ZoomPanCanvas: () => <ZoomPanCanvasDemo />,
  DataGridRow: () => (
    <table role="grid">
      <tbody>
        <DataGridRow>
          <GridCell>row cell A</GridCell>
          <GridCell>row cell B</GridCell>
        </DataGridRow>
      </tbody>
    </table>
  ),
  MenuItems: () => (
    <ul role="menu">
      <Option>Item 1</Option>
      <Option>Item 2</Option>
    </ul>
  ),
  Dialog: () => {
    const empty = { entities: { __root__: { id: '__root__', data: {} } }, relationships: { __root__: [] } }
    return <Dialog data={empty} onEvent={() => {}}>{overlayWrap('Dialog')}</Dialog>
  },
  MenuPopover: () => (
    <div style={{ font: '500 11px system-ui', color: '#666', padding: 8 }}>
      MenuPopover (anchor 필요 — 앱에서 확인)
    </div>
  ),
  Sheet: () => {
    const empty = { entities: { __root__: { id: '__root__', data: {} } }, relationships: { __root__: [] } }
    return <Sheet data={empty} onEvent={() => {}}>{overlayWrap('Sheet')}</Sheet>
  },
  ContractCard: () => (
    <ContractCard
      name="Button"
      file="ui/2-action/Button.tsx"
      role="button"
      propsSignature="(pressed?, disabled?, children)"
      callSites={42}
      checks={[
        { id: 'a', label: 'aria-pressed reflects state', pass: true },
        { id: 'b', label: 'tabIndex 0', pass: true },
      ]}
    />
  ),
  FeedArticle: () => (
    <ul>
      <FeedArticle posinset={1} setsize={1} header={<strong>Article header</strong>}>
        Article body content here.
      </FeedArticle>
    </ul>
  ),
  FeedPost: () => (
    <FeedPost
      author="Jane Doe"
      handle="@jane"
      time="2h"
      avatar="J"
      body="Just shipped a new design system canvas viewer."
      likes={12}
      comments={3}
      shared={1}
    />
  ),
}

function ZoomPanCanvasDemo() {
  const initial = useMemo<NormalizedData>(() => ({
    entities: { [ROOT]: { id: ROOT, data: { x: 0, y: 0, s: 1, bounds: { minS: 0.25, maxS: 4 } } } },
    relationships: { [ROOT]: [] },
  }), [])
  const [data, dispatch] = useReducer(reduce, initial)
  return (
    <div style={{ width: 200, height: 120, border: '1px dashed #999' }}>
      <ZoomPanCanvas id={ROOT} data={data} onEvent={dispatch}>
        <div style={{ padding: 16, font: '500 12px system-ui' }}>zoom · pan · scroll</div>
      </ZoomPanCanvas>
    </div>
  )
}

export function partAutoDemo(name: string): (() => ReactNode) | null {
  return REGISTRY[name] ?? null
}

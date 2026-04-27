/**
 * Ui leaf registry — maps `node.data.component` string to a ds/ui component
 * and tags it with its tier (folder = source of truth).
 *
 * Tiers (see src/ds/core/INVARIANTS.md):
 *   1-status · 2-action · 3-input · 4-selection · 5-display ·
 *   6-overlay · 7-patterns · 8-layout
 */
import { Fragment, createElement, type ComponentType, type ReactNode } from 'react'
import { Outlet } from '@tanstack/react-router'

/**
 * Block — children passthrough (Fragment). definePage 안에 임의 ReactNode 슬롯을 끼울 때.
 * Foundations / compositions 같은 docs 라우트에서 variant gallery 등 풍부한 시각을
 * 끼우기 위한 escape hatch. 데이터 주도 패턴 위반 아님 — content prop 으로 받음.
 */
const Block = ({ children }: { children?: ReactNode }) =>
  createElement(Fragment, null, children)
import { Prose } from '../ui/0-primitives/Prose'
import { CodeBlock } from '../ui/0-primitives/CodeBlock'
import { Link } from '../ui/0-primitives/Link'
import { Button } from '../ui/2-action/Button'
import { Switch } from '../ui/2-action/Switch'
import { Progress, Meter } from '../ui/1-status/Progress'
import { ToolbarButton } from '../ui/2-action/ToolbarButton'
import { Input } from '../ui/3-input/Input'
import { SearchBox } from '../ui/3-input/SearchBox'
import { Slider } from '../ui/3-input/Slider'
import { Textarea } from '../ui/3-input/Textarea'
import { Select } from '../ui/3-input/Select'
import { Checkbox } from '../ui/3-input/Checkbox'
import { Field, FieldLabel, FieldDescription, FieldError } from '../ui/3-input/Field'
import { Listbox } from '../ui/4-selection/Listbox'
import { Tree } from '../ui/4-selection/Tree'
import { Toolbar } from '../ui/4-selection/Toolbar'
import { TabList, Tab, TabPanel } from '../ui/4-selection/Tabs'
import { OrderableList } from '../ui/5-display/OrderableList'
import { DataGrid } from '../ui/5-display/DataGrid'
import { DataGridRow } from '../ui/5-display/DataGridRow'
import { RowGroup } from '../ui/5-display/RowGroup'
import { ColumnHeader } from '../ui/5-display/ColumnHeader'
import { RowHeader } from '../ui/5-display/RowHeader'
import { GridCell } from '../ui/5-display/GridCell'
import { Disclosure } from '../ui/6-overlay/Disclosure'
import { Dialog } from '../ui/6-overlay/Dialog'
import { Sheet } from '../ui/6-overlay/Sheet'
import { Popover } from '../ui/6-overlay/Popover'
import { Badge } from '../ui/1-status/Badge'
import { LegendDot } from '../ui/1-status/LegendDot'
import { Separator } from '../ui/0-primitives/Separator'
import { Tag } from './parts/Tag'
import { StatCard } from '../ui/7-patterns/StatCard'
import { CourseCard } from '../ui/7-patterns/CourseCard'
import { RoleCard } from '../ui/7-patterns/RoleCard'
import { MessageBubble } from '../ui/7-patterns/MessageBubble'
import { PostCard } from '../ui/7-patterns/PostCard'
import { FeedPost } from '../ui/7-patterns/FeedPost'
import { ProductCard } from '../ui/7-patterns/ProductCard'
import { ContractCard } from '../ui/7-patterns/ContractCard'
import { Card } from './parts/Card'
import { Table } from './parts/Table'
import { BarChart } from '../ui/7-patterns/BarChart'
import { Top10List } from '../ui/7-patterns/Top10List'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyCmp = ComponentType<any>
export type Zone =
  | 'primitive' | 'indicator' | 'action' | 'input' | 'collection'
  | 'composite' | 'overlay' | 'pattern' | 'layout' | 'shell' | 'route'

export interface UiEntry { component: AnyCmp; zone: Zone }

export const uiRegistry = {
  // primitive
  Prose:     { component: Prose,     zone: 'primitive' },
  CodeBlock: { component: CodeBlock, zone: 'primitive' },
  Link:      { component: Link,      zone: 'primitive' },
  // shell — TanStack passthrough
  Outlet: { component: Outlet, zone: 'shell' },
  Block:  { component: Block,  zone: 'primitive' },
  // indicator
  Badge:     { component: Badge,     zone: 'indicator' },
  LegendDot: { component: LegendDot, zone: 'indicator' },
  Separator: { component: Separator, zone: 'indicator' },
  Tag:       { component: Tag,       zone: 'indicator' },
  // action
  Button:        { component: Button,        zone: 'action' },
  Switch:        { component: Switch,        zone: 'action' },
  Progress:      { component: Progress,      zone: 'action' },
  Meter:         { component: Meter,         zone: 'action' },
  ToolbarButton: { component: ToolbarButton, zone: 'action' },
  // input
  Input:            { component: Input,            zone: 'input' },
  SearchBox:        { component: SearchBox,        zone: 'input' },
  Slider:           { component: Slider,           zone: 'input' },
  Textarea:         { component: Textarea,         zone: 'input' },
  Select:           { component: Select,           zone: 'input' },
  Checkbox:         { component: Checkbox,         zone: 'input' },
  Field:            { component: Field,            zone: 'input' },
  FieldLabel:       { component: FieldLabel,       zone: 'input' },
  FieldDescription: { component: FieldDescription, zone: 'input' },
  FieldError:       { component: FieldError,       zone: 'input' },
  // collection
  Listbox: { component: Listbox, zone: 'collection' },
  Tree:    { component: Tree,    zone: 'collection' },
  Toolbar: { component: Toolbar, zone: 'collection' },
  TabList: { component: TabList, zone: 'collection' },
  Tab:     { component: Tab,     zone: 'collection' },
  TabPanel:{ component: TabPanel,zone: 'collection' },
  // composite
  OrderableList: { component: OrderableList, zone: 'composite' },
  DataGrid:      { component: DataGrid,      zone: 'composite' },
  DataGridRow:   { component: DataGridRow,   zone: 'composite' },
  RowGroup:      { component: RowGroup,      zone: 'composite' },
  ColumnHeader:  { component: ColumnHeader,  zone: 'composite' },
  RowHeader:     { component: RowHeader,     zone: 'composite' },
  GridCell:      { component: GridCell,      zone: 'composite' },
  // overlay
  Disclosure: { component: Disclosure, zone: 'overlay' },
  Dialog:     { component: Dialog,     zone: 'overlay' },
  Sheet:      { component: Sheet,      zone: 'overlay' },
  Popover:    { component: Popover,    zone: 'overlay' },
  // pattern
  StatCard:      { component: StatCard,      zone: 'pattern' },
  CourseCard:    { component: CourseCard,    zone: 'pattern' },
  RoleCard:      { component: RoleCard,      zone: 'pattern' },
  MessageBubble: { component: MessageBubble, zone: 'pattern' },
  PostCard:      { component: PostCard,      zone: 'pattern' },
  FeedPost:      { component: FeedPost,      zone: 'pattern' },
  ProductCard:   { component: ProductCard,   zone: 'pattern' },
  ContractCard:  { component: ContractCard,  zone: 'pattern' },
  Card:          { component: Card,          zone: 'pattern' },
  Table:         { component: Table,         zone: 'pattern' },
  BarChart:      { component: BarChart,      zone: 'pattern' },
  Top10List:     { component: Top10List,     zone: 'pattern' },
} as const satisfies Record<string, UiEntry>

export type UiComponentName = keyof typeof uiRegistry

/** dev: 미등록 이름이면 throw — 무음 실패 방지 (sound-settings에서 Slider 누락이 이걸로 잡힘). */
const isDev = (): boolean =>
  typeof import.meta !== 'undefined' && (import.meta as { env?: { DEV?: boolean } }).env?.DEV === true

export function resolveUi(name: string): AnyCmp | undefined {
  const entry = uiRegistry[name as UiComponentName]
  if (!entry) {
    if (isDev()) {
      throw new Error(
        `[ds.registry] component "${name}" 미등록. ` +
        `src/ds/layout/registry.ts 에 추가하거나 이름을 확인. ` +
        `등록된 이름: ${Object.keys(uiRegistry).join(', ')}`,
      )
    }
    return undefined
  }
  return entry.component
}

export type UiLeafContent = ReactNode

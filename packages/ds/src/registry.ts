/**
 * Ui leaf registry — maps `node.data.component` string to a ds/ui component
 * and tags it with its tier (folder = source of truth).
 *
 * Tiers (see packages/headless/src/INVARIANTS.md):
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
import { Prose } from './ui/6-structure/Prose'
import { CodeBlock } from './ui/6-structure/CodeBlock'
import { RouterLink } from './ui/1-command/RouterLink'
import { Button } from './ui/1-command/Button'
import { Switch } from './ui/2-input/Switch'
import { Progress, Meter } from './ui/5-live/Progress'
import { ToolbarButton } from './ui/1-command/ToolbarButton'
import { Input } from './ui/2-input/Input'
import { SearchBox } from './ui/2-input/SearchBox'
import { Slider } from './ui/2-input/Slider'
import { Textarea } from './ui/2-input/Textarea'
import { Select } from './ui/2-input/Select'
import { Checkbox } from './ui/2-input/Checkbox'
import { Field, FieldLabel, FieldDescription, FieldError } from './ui/8-field/Field'
import { Fieldset } from './ui/8-field/Fieldset'
import { CheckboxField } from './ui/8-field/CheckboxField'
import { SwitchField } from './ui/8-field/SwitchField'
import { FileInput } from './ui/8-field/FileInput'
import { Listbox } from './ui/3-composite/Listbox'
import { Combobox } from './ui/2-input/Combobox'
import { RouteGrid } from './shells/command/RouteGrid'
import { Tree } from './ui/3-composite/Tree'
import { Toolbar } from './ui/3-composite/Toolbar'
import { SegmentedControl } from './ui/3-composite/SegmentedControl'
import { TabList, Tab, TabPanel } from './ui/3-composite/Tabs'
import { OrderableList } from './ui/3-composite/OrderableList'
import { DataGrid } from './ui/3-composite/DataGrid'
import { DataGridRow } from './ui/3-composite/DataGridRow'
import { HeaderGroup } from './ui/3-composite/HeaderGroup'
import { RowGroup } from './ui/3-composite/RowGroup'
import { ColumnHeader } from './ui/3-composite/ColumnHeader'
import { RowHeader } from './ui/3-composite/RowHeader'
import { GridCell } from './ui/3-composite/GridCell'
import { Disclosure } from './ui/6-structure/Disclosure'
import { Dialog } from './ui/4-window/Dialog'
import { Sheet } from './ui/4-window/Sheet'
import { Popover } from './ui/4-window/Popover'
import { Badge } from './ui/5-live/Badge'
import { LegendDot } from './ui/5-live/LegendDot'
import { Separator } from './ui/6-structure/Separator'
import { Chip } from './ui/6-structure/Chip'
import { StatCard } from './ui/patterns/StatCard'
import { CourseCard } from './features/CourseCard'
import { RoleCard } from './features/RoleCard'
import { MessageBubble } from './ui/patterns/MessageBubble'
import { PostCard } from './features/PostCard'
import { FeedPost } from './features/FeedPost'
import { ProductCard } from './features/ProductCard'
import { ContractCard } from './features/ContractCard'
import { Card } from './ui/6-structure/Card'
import { Thumbnail } from './ui/6-structure/Thumbnail'
import { Table } from './ui/6-structure/Table'
import { BarChart } from './ui/patterns/BarChart'
import { Top10List } from './ui/patterns/Top10List'

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
  Link:      { component: RouterLink,      zone: 'primitive' },
  // shell — TanStack passthrough
  Outlet: { component: Outlet, zone: 'shell' },
  Block:  { component: Block,  zone: 'primitive' },
  // indicator
  Badge:     { component: Badge,     zone: 'indicator' },
  LegendDot: { component: LegendDot, zone: 'indicator' },
  Separator: { component: Separator, zone: 'indicator' },
  Chip:      { component: Chip,      zone: 'indicator' },
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
  Fieldset:         { component: Fieldset,         zone: 'input' },
  CheckboxField:    { component: CheckboxField,    zone: 'input' },
  SwitchField:      { component: SwitchField,      zone: 'input' },
  FileInput:        { component: FileInput,        zone: 'input' },
  // input
  Combobox: { component: Combobox, zone: 'input' },
  // collection
  Listbox: { component: Listbox, zone: 'collection' },
  RouteGrid: { component: RouteGrid, zone: 'collection' },
  Tree:    { component: Tree,    zone: 'collection' },
  Toolbar: { component: Toolbar, zone: 'collection' },
  SegmentedControl: { component: SegmentedControl, zone: 'collection' },
  TabList: { component: TabList, zone: 'collection' },
  Tab:     { component: Tab,     zone: 'collection' },
  TabPanel:{ component: TabPanel,zone: 'collection' },
  // composite
  OrderableList: { component: OrderableList, zone: 'composite' },
  DataGrid:      { component: DataGrid,      zone: 'composite' },
  DataGridRow:   { component: DataGridRow,   zone: 'composite' },
  HeaderGroup:   { component: HeaderGroup,   zone: 'composite' },
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
  Thumbnail:     { component: Thumbnail,     zone: 'pattern' },
  Table:         { component: Table,         zone: 'pattern' },
  BarChart:      { component: BarChart,      zone: 'pattern' },
  Top10List:     { component: Top10List,     zone: 'pattern' },
} as const satisfies Record<string, UiEntry>

/**
 * Inject literal component names into headless `nodes.ts` so `UiNode.component`
 * narrows to the registered key set. Headless owns the type slot; ui owns the values.
 */
declare module '@p/headless/layout/nodes' {
  interface Register {
    component: keyof typeof uiRegistry
  }
}

export type { UiComponentName } from '@p/headless/layout/nodes'

/** dev: 미등록 이름이면 throw — 무음 실패 방지 (sound-settings에서 Slider 누락이 이걸로 잡힘). */
const isDev = (): boolean =>
  typeof import.meta !== 'undefined' && (import.meta as { env?: { DEV?: boolean } }).env?.DEV === true

export function resolveUi(name: string): AnyCmp | undefined {
  const entry = uiRegistry[name as keyof typeof uiRegistry]
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

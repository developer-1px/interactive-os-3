/**
 * Ui leaf registry — maps `node.data.component` string to a ds/ui component
 * and tags it with its zone (folder = source of truth).
 *
 * Zones (see src/ds/core/INVARIANTS.md):
 *   collection · composite · control · overlay · entity · layout
 */
import type { ComponentType, ReactNode } from 'react'
import { Button } from '../ui/control/Button'
import { Input } from '../ui/control/Input'
import { Textarea } from '../ui/control/Textarea'
import { Select } from '../ui/control/Select'
import { Switch } from '../ui/control/Switch'
import { Checkbox } from '../ui/control/Checkbox'
import { Progress, Meter } from '../ui/control/Progress'
import { Field, FieldLabel, FieldDescription, FieldError } from '../ui/control/Field'
import { ToolbarButton } from '../ui/control/ToolbarButton'
import { Toolbar } from '../ui/composite/Toolbar'
import { TabList, Tab, TabPanel } from '../ui/composite/Tabs'
import { OrderableList } from '../ui/composite/OrderableList'
import { DataGrid } from '../ui/composite/DataGrid'
import { DataGridRow } from '../ui/composite/DataGridRow'
import { RowGroup } from '../ui/composite/RowGroup'
import { ColumnHeader } from '../ui/composite/ColumnHeader'
import { RowHeader } from '../ui/composite/RowHeader'
import { GridCell } from '../ui/composite/GridCell'
import { Listbox } from '../ui/collection/Listbox'
import { Disclosure } from '../ui/overlay/Disclosure'
import { Dialog } from '../ui/overlay/Dialog'
import { Sheet } from '../ui/overlay/Sheet'
import { Popover } from '../ui/overlay/Popover'
import { Badge } from '../ui/entity/Badge'
import { StatCard } from '../ui/entity/StatCard'
import { CourseCard } from '../ui/entity/CourseCard'
import { RoleCard } from '../ui/entity/RoleCard'
import { LegendDot } from '../ui/layout/LegendDot'
import { Separator } from '../ui/layout/Separator'
import { BarChart } from '../ui/layout/BarChart'
import { Top10List } from '../ui/layout/Top10List'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyCmp = ComponentType<any>
export type Zone = 'collection' | 'composite' | 'control' | 'overlay' | 'entity' | 'layout'

export interface UiEntry { component: AnyCmp; zone: Zone }

export const uiRegistry = {
  // control
  Button:           { component: Button,           zone: 'control' },
  Input:            { component: Input,            zone: 'control' },
  Textarea:         { component: Textarea,         zone: 'control' },
  Select:           { component: Select,           zone: 'control' },
  Switch:           { component: Switch,           zone: 'control' },
  Checkbox:         { component: Checkbox,         zone: 'control' },
  Progress:         { component: Progress,         zone: 'control' },
  Meter:            { component: Meter,            zone: 'control' },
  Field:            { component: Field,            zone: 'control' },
  FieldLabel:       { component: FieldLabel,       zone: 'control' },
  FieldDescription: { component: FieldDescription, zone: 'control' },
  FieldError:       { component: FieldError,       zone: 'control' },
  ToolbarButton:    { component: ToolbarButton,    zone: 'control' },
  // composite
  Toolbar:      { component: Toolbar,      zone: 'composite' },
  TabList:      { component: TabList,      zone: 'composite' },
  Tab:          { component: Tab,          zone: 'composite' },
  TabPanel:     { component: TabPanel,     zone: 'composite' },
  OrderableList:{ component: OrderableList,zone: 'composite' },
  DataGrid:     { component: DataGrid,     zone: 'composite' },
  DataGridRow:  { component: DataGridRow,  zone: 'composite' },
  RowGroup:     { component: RowGroup,     zone: 'composite' },
  ColumnHeader: { component: ColumnHeader, zone: 'composite' },
  RowHeader:    { component: RowHeader,    zone: 'composite' },
  GridCell:     { component: GridCell,     zone: 'composite' },
  // collection
  Listbox: { component: Listbox, zone: 'collection' },
  // overlay
  Disclosure: { component: Disclosure, zone: 'overlay' },
  Dialog:     { component: Dialog,     zone: 'overlay' },
  Sheet:      { component: Sheet,      zone: 'overlay' },
  Popover:    { component: Popover,    zone: 'overlay' },
  // entity
  Badge:      { component: Badge,      zone: 'entity' },
  StatCard:   { component: StatCard,   zone: 'entity' },
  CourseCard: { component: CourseCard, zone: 'entity' },
  RoleCard:   { component: RoleCard,   zone: 'entity' },
  // layout
  LegendDot: { component: LegendDot, zone: 'layout' },
  Separator: { component: Separator, zone: 'layout' },
  BarChart:  { component: BarChart,  zone: 'layout' },
  Top10List: { component: Top10List, zone: 'layout' },
} as const satisfies Record<string, UiEntry>

export type UiComponentName = keyof typeof uiRegistry

export function resolveUi(name: string): AnyCmp | undefined {
  return uiRegistry[name as UiComponentName]?.component
}

export type UiLeafContent = ReactNode

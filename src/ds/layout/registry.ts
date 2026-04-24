/**
 * Ui leaf registry — maps `node.data.component` string to a ds/ui component.
 *
 * Consumers pass plain props via `node.data.props` — the renderer spreads them.
 * Children go into `node.data.content` (ReactNode) for components that take
 * `children` (Button label, Select <option>, etc).
 *
 * ControlProps roles (Listbox/Dialog/Tabs internals) should typically be
 * composed directly by page code and passed through the registry as props.
 * For fully data-driven trees, pass `{ data, onEvent }` via props just like
 * any other prop — the registry doesn't need special-casing.
 */
import type { ComponentType, ReactNode } from 'react'
import { Button } from '../ui/form/Button'
import { Input } from '../ui/form/inputs/Input'
import { Textarea } from '../ui/form/inputs/Textarea'
import { Select } from '../ui/form/inputs/Select'
import { Switch } from '../ui/form/toggle/Switch'
import { Checkbox } from '../ui/form/toggle/Checkbox'
import { Progress, Meter } from '../ui/form/Progress'
import { Field, FieldLabel, FieldDescription, FieldError } from '../ui/form/Field'
import { Toolbar } from '../ui/bar/Toolbar'
import { ToolbarButton } from '../ui/bar/ToolbarButton'
import { Separator } from '../ui/bar/Separator'
import { TabList, Tab, TabPanel } from '../ui/list/Tabs'
import { Disclosure } from '../ui/overlay/Disclosure'
import { DataGrid } from '../ui/grid/Grid'
import { DataGridRow } from '../ui/grid/Row'
import { RowGroup } from '../ui/grid/RowGroup'
import { ColumnHeader } from '../ui/grid/ColumnHeader'
import { RowHeader } from '../ui/grid/RowHeader'
import { GridCell } from '../ui/grid/GridCell'
import { Listbox } from '../ui/list/Listbox'
import { Dialog } from '../ui/overlay/Dialog'
import { Badge } from '../ui/display/Badge'
import { LegendDot } from '../ui/display/LegendDot'
import { StatCard } from '../ui/display/StatCard'
import { BarChart } from '../ui/display/BarChart'
import { Top10List } from '../ui/display/Top10List'
import { CourseCard } from '../ui/display/CourseCard'
import { RoleCard } from '../ui/display/RoleCard'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyCmp = ComponentType<any>

export const uiRegistry: Record<string, AnyCmp> = {
  Button, Input, Textarea, Select,
  Switch, Checkbox, Progress, Meter,
  Field, FieldLabel, FieldDescription, FieldError,
  Toolbar, ToolbarButton, Separator,
  TabList, Tab, TabPanel,
  Disclosure,
  DataGrid, DataGridRow, RowGroup, ColumnHeader, RowHeader, GridCell,
  Listbox, Dialog,
  Badge, LegendDot, StatCard, BarChart, Top10List, CourseCard, RoleCard,
}

export type UiComponentName = keyof typeof uiRegistry

export function resolveUi(name: string): AnyCmp | undefined {
  return uiRegistry[name]
}

export type UiLeafContent = ReactNode

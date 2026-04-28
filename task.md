# ui/ ARIA 재구조화

기존 task.md 는 `task.archive.md` 로 보관 (필요시 수동 이동).

## 목표 구조 (ARIA 1.2 spec 그대로)

```
packages/ds/src/ui/
├─ 1-command/        widget · 행동 트리거 (no value)
├─ 2-input/          widget · 값 가지는 단일 컨트롤
├─ 3-composite/      widget · 포커스 관리 컨테이너
├─ 4-window/         widget · modal/floating
├─ 5-live/           live region
├─ 6-structure/      structure · section
├─ 7-landmark/       structure · landmark
├─ 8-field/          form composition (label+input)
└─ 9-layout/         presentational primitives
```

## 매핑표

### 1-command ✅
- [x] Button.tsx               ← 2-action
- [x] ButtonGroup.tsx          ← 2-action
- [x] ToolbarButton.tsx        ← 2-action
- [x] MenuItems.tsx            ← 4-selection
- [x] RouterLink.tsx           ← 0-primitives

### 2-input ✅
- [x] Checkbox.tsx             ← 3-input
- [x] Radio.tsx                ← 3-input
- [x] Switch.tsx               ← 2-action
- [x] ToggleButton.tsx         ← 2-action
- [x] Option.tsx               ← 4-selection
- [x] Input.tsx                ← 3-input
- [x] Textarea.tsx             ← 3-input
- [x] SearchBox.tsx            ← 3-input
- [x] NumberInput.tsx          ← 3-input
- [x] ColorInput.tsx           ← 3-input
- [x] Slider.tsx               ← 3-input
- [x] Combobox.tsx             ← 3-input
- [x] Select.tsx               ← 3-input

### 3-composite
- [ ] Listbox.tsx               ← 4-selection
- [ ] ListboxGroup.tsx          ← 4-selection
- [ ] RadioGroup.tsx            ← 4-selection
- [ ] CheckboxGroup.tsx         ← 4-selection
- [ ] ToggleGroup.tsx           ← 2-action
- [ ] SegmentedControl.tsx      ← 4-selection
- [ ] Menu.tsx                  ← 4-selection
- [ ] MenuList.tsx              ← 4-selection
- [ ] MenuGroup.tsx             ← 4-selection
- [ ] Menubar.tsx               ← 4-selection
- [ ] Tabs.tsx                  ← 4-selection
- [ ] Tree.tsx                  ← 4-selection
- [ ] TreeRow.tsx               ← 5-display
- [ ] TreeGrid.tsx              ← 5-display
- [ ] DataGrid.tsx              ← 5-display
- [ ] DataGridRow.tsx           ← 5-display
- [ ] GridCell.tsx              ← 5-display
- [ ] ColumnHeader.tsx          ← 5-display
- [ ] RowHeader.tsx             ← 5-display
- [ ] RowGroup.tsx              ← 5-display
- [ ] Toolbar.tsx               ← 4-selection
- [ ] OrderableList.tsx         ← 5-display
- [ ] Columns.tsx               ← 4-selection

### 4-window
- [ ] Dialog.tsx                ← 6-overlay
- [ ] Sheet.tsx                 ← 6-overlay
- [ ] Popover.tsx               ← 6-overlay
- [ ] MenuPopover.tsx           ← 6-overlay
- [ ] Tooltip.tsx               ← 6-overlay
- [ ] FloatingNav.tsx           ← 6-overlay

### 5-live
- [ ] Toast.tsx                 ← 6-overlay
- [ ] Progress.tsx              ← 1-status
- [ ] Spinner.tsx               ← 1-status
- [ ] Badge.tsx                 ← 1-status
- [ ] LegendDot.tsx             ← 1-status

### 6-structure
- [ ] Separator.tsx             ← 0-primitives
- [ ] Heading.tsx               ← parts
- [ ] Card.tsx                  ← parts
- [ ] Callout.tsx               ← parts
- [ ] EmptyState.tsx            ← parts
- [ ] KeyValue.tsx              ← parts
- [ ] MediaObject.tsx           ← parts
- [ ] Table.tsx                 ← parts
- [ ] Code.tsx                  ← parts
- [ ] CodeBlock.tsx             ← 0-primitives
- [ ] Prose.tsx                 ← 0-primitives
- [ ] Skeleton.tsx              ← parts
- [ ] Timestamp.tsx             ← parts
- [ ] Avatar.tsx                ← parts
- [ ] AvatarGroup.tsx           ← parts
- [ ] Thumbnail.tsx             ← parts
- [ ] Chip.tsx                  ← parts
- [ ] CountBadge.tsx            ← parts
- [ ] ProgressBar.tsx           ← parts
- [ ] Link.tsx                  ← parts
- [ ] Accordion.tsx             ← 6-overlay
- [ ] Disclosure.tsx            ← 6-overlay
- [ ] RovingItem.tsx            ← parts

### 7-landmark
- [ ] Breadcrumb.tsx            ← parts
- [ ] Pagination.tsx            ← 5-display

### 8-field
- [ ] Field.tsx                 ← 3-input
- [ ] Stepper.tsx               ← 5-display

### 9-layout
- [ ] Row.tsx                   ← 8-layout
- [ ] Column.tsx                ← 8-layout
- [ ] Grid.tsx                  ← 8-layout
- [ ] Split.tsx                 ← 8-layout
- [ ] Carousel.tsx              ← 8-layout
- [ ] ZoomPanCanvas.tsx         ← 8-layout

## 진행 순서 (작은 단위, 한 번에 하나)

각 step = 폴더 1개 만들고 → 파일 옮기고 → import 갱신 → tsc 통과 → 커밋.

1. [x] 1-command
2. [x] 2-input
3. [ ] 3-composite
4. [ ] 4-window
5. [ ] 5-live
6. [ ] 6-structure
7. [ ] 7-landmark
8. [ ] 8-field
9. [ ] 9-layout
10. [ ] 옛 폴더(0-primitives, 1-status, 2-action, 3-input, 4-selection, 5-display, 6-overlay, 8-layout, parts) 청소
11. [ ] lint:ds 최종 통과

## 메모
- `.style.ts` / `.meta.ts` 형제 파일도 함께 이동
- `_demos/` 는 각 카테고리에 동행
- import 경로는 barrel(`@p/ds`)과 직접 import 양쪽 갱신
- parts barrel(`parts/index.ts`, `parts/styles.ts`)는 마지막

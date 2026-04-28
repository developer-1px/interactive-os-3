# ui/ ARIA 스펙 적합성 감사

각 컴포넌트가 **ARIA 1.2 스펙대로 role/속성/키보드 인터랙션/스타일 attribute selector**를 구현했는지 한 개씩 점검.

## 점검 항목 (per 컴포넌트)

1. **role** — 명시 또는 native 태그로 묵시 (ARIA in HTML 권고)
2. **aria-* 속성** — required / supported 속성 빠짐없이 (state·property)
3. **키보드** — WAI-ARIA APG 키 매핑
4. **focus** — tabindex / roving / focus visible
5. **스타일 selector** — `[aria-*]`/`:focus-visible` 등 ARIA 셀렉터 (data-* 임의 namespace 금지)
6. **labelling** — aria-label / aria-labelledby / aria-describedby 경로
7. **스타일 최소** — 꼭 필요한 1-2 selector만. variant/size/intent 분기 금지
8. **토큰 시맨틱 only** — palette raw 직접 사용 ❌. foundations 의 semantic role 토큰만

## 진행 (작은 단위, 한 개씩)

### 1-command
- [x] Button             — role=button, aria-pressed, disabled+aria-disabled, variant prop (primary/destructive), `data-variant` attr selector, semantic 토큰만
- [x] ButtonGroup        — role=group 추가, data-orientation, semantic 토큰만 (변경 최소)
- [ ] ToolbarButton      — toolbar 자식, focus roving (demo 추가만; ARIA 점검 미완)
- [x] MenuItem (← MenuItems) — role=menuitem 단수형 정정
- [ ] RouterLink         — role=link, aria-current (이름 유지 — 6-structure/Link 와 동시 존재. 통합은 후속 task)
- [x] TreeItem (← TreeRow) — role=treeitem 정정 (was Row 어휘)
- [x] ProgressBar (6-structure) 폐기 — Progress(5-live)와 role=progressbar 중복

### 1-command demos
- [x] Button.demo, ButtonGroup.demo, ToolbarButton.demo
- [ ] RouterLink.demo (router context 필요해서 보류)

### 2-input
- [ ] Checkbox           — role=checkbox, aria-checked(mixed)
- [ ] Radio              — role=radio, aria-checked
- [ ] Switch             — role=switch, aria-checked
- [ ] ToggleButton       — button, aria-pressed
- [ ] Option             — role=option, aria-selected
- [ ] Input              — type=text, aria-invalid/required
- [ ] Textarea           — multiline textbox
- [ ] SearchBox          — role=searchbox
- [ ] NumberInput        — role=spinbutton, aria-valuenow/min/max
- [ ] ColorInput         — type=color
- [ ] Slider             — role=slider, aria-valuenow/min/max/orientation
- [ ] Combobox           — role=combobox, aria-expanded/controls/activedescendant
- [ ] Select             — role=combobox / listbox 패턴

### 3-composite
- [ ] Listbox            — role=listbox, aria-multiselectable, aria-activedescendant
- [ ] ListboxGroup       — role=group
- [ ] RadioGroup         — role=radiogroup
- [ ] CheckboxGroup      — role=group
- [ ] ToggleGroup        — role=group / radiogroup
- [ ] SegmentedControl   — role=radiogroup
- [ ] Menu               — role=menu, aria-orientation
- [ ] MenuList           — role=menu (listbox 변형 X)
- [ ] MenuGroup          — role=group / aria-labelledby
- [ ] Menubar            — role=menubar, orientation
- [ ] Tabs               — role=tablist, tab[aria-selected/aria-controls]
- [ ] Tree               — role=tree, aria-expanded/aria-level
- [ ] TreeRow            — role=treeitem
- [ ] TreeGrid           — role=treegrid, row/cell
- [ ] DataGrid           — role=grid, aria-rowcount/colcount
- [ ] DataGridRow        — role=row
- [ ] GridCell           — role=gridcell
- [ ] ColumnHeader       — role=columnheader, aria-sort
- [ ] RowHeader          — role=rowheader
- [ ] RowGroup           — role=rowgroup
- [ ] Toolbar            — role=toolbar, aria-orientation
- [ ] OrderableList      — listbox + reorder 셈antics
- [ ] Columns            — multi-listbox composite

### 4-window
- [ ] Dialog             — role=dialog, aria-modal, aria-labelledby/describedby, focus trap
- [ ] Sheet              — dialog 변형 (side)
- [ ] Popover            — non-modal dialog
- [ ] MenuPopover        — popover wrapping menu (no aria-modal)
- [ ] Tooltip            — role=tooltip, aria-describedby 연결
- [ ] FloatingNav        — non-modal dialog

### 5-live
- [ ] Toast              — role=status / alert (live region)
- [ ] Progress           — role=progressbar, aria-valuenow/min/max
- [ ] Spinner            — role=progressbar (indeterminate, aria-valuetext)
- [ ] Badge              — role=status (aria-label)
- [ ] LegendDot          — decorative (aria-hidden) 인지

### 6-structure
- [ ] Accordion          — group of disclosures (button[aria-expanded] + region[aria-labelledby])
- [ ] Disclosure         — button[aria-expanded] + region
- [ ] Heading            — role=heading, aria-level
- [ ] Card               — section / article / group
- [ ] Callout            — role=note / status
- [ ] Table              — role=table (presentation 금지)
- [ ] Code / CodeBlock   — code semantic
- [ ] Prose              — semantic HTML pass-through
- [ ] Separator          — role=separator
- [ ] Avatar / AvatarGroup — img + aria-label / aria-labelledby
- [ ] Chip               — button / status / option (use case별)
- [ ] CountBadge         — status + aria-label
- [ ] EmptyState         — region / status
- [ ] KeyValue           — dl semantic
- [ ] Link               — a[href]
- [ ] MediaObject        — figure / article
- [ ] ProgressBar        — non-live progress (5-live와 분리 의도)
- [ ] RovingItem         — base for roving widgets
- [ ] Skeleton           — aria-busy / aria-hidden
- [ ] Thumbnail          — img
- [ ] Timestamp          — time element

### 7-landmark
- [ ] Breadcrumb         — nav[aria-label=Breadcrumb] + ol
- [ ] Pagination         — nav[aria-label=Pagination]

### 8-field
- [ ] Field              — label + input + describedby + errormessage
- [ ] Stepper            — process semantic (ol + aria-current)

### 9-layout
- [ ] Row / Column / Grid — role=presentation / 무 role
- [ ] Split              — role=presentation (separator는 별도)
- [ ] Carousel           — role=region + aria-roledescription="carousel"
- [ ] ZoomPanCanvas      — application 또는 presentation

## per-컴포넌트 작업 형식

각 컴포넌트마다:
1. 현재 코드 읽기
2. ARIA APG / spec 조회 (확인 사항: role, required attrs, keyboard, focus)
3. 갭 표 작성 (✅ 충족 / ⚠️ 부분 / ❌ 누락)
4. 수정 — 코드 + style attribute selector
5. 다음으로

## 메모
- 스타일은 `[aria-*]`/`:focus-visible`/`:disabled` 등 표준 셀렉터만 사용. data-* namespace 금지 (`data-part` 만 허용)
- 이미 ds parts에 분리된 합성(Field/Combobox 등)은 "각 부품이 자기 ARIA를 옳게 표현하느냐"가 기준

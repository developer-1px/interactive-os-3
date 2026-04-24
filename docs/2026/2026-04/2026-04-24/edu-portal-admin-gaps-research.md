---
type: reference
mode: defacto
query: "edu-portal-admin 1패스에서 발견된 os 갭 10건의 업계 수렴 패턴"
source: docs/2026/2026-04/2026-04-24/edu-portal-admin-gaps.md
tags: [os-gap, research, radix, ariakit, rac, base-ui]
---

# edu-portal-admin Gap Research

ds의 채택 원칙: **Radix / Base UI / Ariakit / React Aria Components(RAC) 중 최소 2곳 수렴 시 채택**
(`memory/project_ds_naming_conventions.md`)
모든 role은 ControlProps(data + onEvent) 데이터 주도, JSX children 금지
(`memory/feedback_data_driven_rendering.md`)

## TL;DR (채택 권고 한 줄씩)

- **GAP-01 Checkbox / CheckboxGroup** — 4곳 전수 수렴. **즉시 채택**. 단일 = `Checkbox`, 그룹 = `CheckboxGroup` (ControlProps: `values[]`, `onEvent(activate:key)`).
- **GAP-02 Drag reorder 축** — RAC(useDragAndDrop/GridList reorder), dnd-kit(Sortable) 2곳 수렴. Ariakit SortableProvider 존재는 확인되나 문서 불완전. **조건부 채택** — role 추가 아니라 `core/axes/reorder` + Listbox/GridList 옵트인.
- **GAP-03 Tag/Chip multi-value input** — RAC `TagGroup`(표시+제거) + Ariakit는 없음. **수렴 부족 → 보류**. 제거 가능한 정적 TagGroup은 RAC 단독. 다중값 input은 어느 공식 OS도 표준화 안 됨 → 1곳 수렴 (RAC)이므로 보류.
- **GAP-04 KPI / Chart** — role 아님, layout. **재분류** (별도 문서).
- **GAP-05 File upload / Dropzone** — RAC `FileTrigger` + `DropZone` 단독. **수렴 부족 → 보류**. native `<input type=file>` + Button 조합으로 우회 가능.
- **GAP-06 DataGrid sort/filter preset** — 원자 모두 존재. role 갭 아님 → **cookbook recipe로 재분류**.
- **GAP-07 Textarea** — Radix Themes `TextArea`, RAC `TextArea`, Base UI 없음(Input만), Ariakit 없음(FormInput로 처리). 2곳 수렴 → **즉시 채택**. 이름 `Textarea`.
- **GAP-08 Badge** — Radix/Ariakit/RAC/Base 모두 role로 없음. **역할 아님 → 보류**(CSS preset만).
- **GAP-09 Date/Time input** — RAC만 (`DatePicker`/`DateField`/`TimeField`/`DateRangePicker`). Radix/Ariakit/Base 없음. **수렴 부족 → 보류**. native input으로 유지.
- **GAP-10 Field(label+hint+required+error)** — Radix `Form.Field`, Base `Field`, RAC `TextField`/`FieldError`/`Text slot="description"` 3곳 수렴. **즉시 채택**. 이름 `Field` + `FieldLabel` + `FieldDescription` + `FieldError`.

---

## GAP-01 Checkbox / CheckboxGroup

| Library | Component | children/data | API 요약 |
|---|---|---|---|
| Radix | `Checkbox.Root` + `Checkbox.Indicator` | children | `checked`: `boolean \| 'indeterminate'`, `onCheckedChange`. CheckboxGroup 없음 |
| Ariakit | `Checkbox` + `CheckboxProvider` + `CheckboxCheck` | children | `CheckboxProvider`가 `values[]` 배열 관리 — 그룹 내장 |
| RAC | `Checkbox` + `CheckboxGroup` | children(정적) 또는 `items`(data) | `isSelected`, `onChange`, `isIndeterminate`; Group은 `value[]`, `onChange` |
| Base UI | `Checkbox.Root` + `Checkbox.Indicator` + `CheckboxGroup` | children | `checked`, `onCheckedChange`, tri-state. Group 별도 |

**표준**: ARIA APG tri-state checkbox, `role="checkbox"` + `aria-checked="true\|false\|mixed"`.
**수렴 판정**: 4/4 단일, 3/4 그룹 → **강수렴 ✓**
**ds 네이밍 권고**: `Checkbox`, `CheckboxGroup`. RadioGroup 선례와 일치.
**1 role = 1 component**: ✓ (role=checkbox, role=group)
**data-driven 적합성**: 단일은 `checked: boolean, onEvent(activate)`. Group은 `data: ControlData, values: string[], onEvent(activate:key)`. RadioGroup 패턴 그대로 복사해서 다중선택 버전.
**2패스 채택 권고**: **즉시 채택 (1순위)**. RadioGroup을 거울로 복제.

---

## GAP-02 Drag reorder axis

| Library | Component | children/data | API 요약 |
|---|---|---|---|
| Radix Primitives | — | — | **없음** (dnd-kit 권장) |
| Ariakit | `SortableProvider` | — | 레퍼런스 페이지 존재하나 문서 미완 (v0.4.26 시점) |
| RAC | `GridList` / `ListBox` + `useDragAndDrop` + `useListData` | data(`items`) | `onReorder({target.dropPosition, keys})` → `list.moveBefore/moveAfter`. 키보드/스크린리더 전수 지원 |
| dnd-kit (3rd) | `<DndContext>` + `SortableContext` + `useSortable` | children | Keyboard sensor 화살표 이동, Enter/Space pickup/drop, Esc cancel |
| Base UI | — | — | 없음 |

**표준**: APG에서 `aria-grabbed` **deprecated**. 공식 반대 대안은 없고 "작성자가 UX를 직접 제공"이 현재 지침. 실무 관행 = Shift+Arrow로 이동, 스크린리더 공지.
**수렴 판정**: 공식 OS 2곳(RAC + Ariakit 존재만) — 문서 품질은 RAC 단독 수준. dnd-kit 포함 시 2곳 확고.
**ds 네이밍 권고**: role 추가 **X**. `core/axes/reorder` 축 + 기존 `Listbox`/`GridList`가 opt-in. gesture → intent 분리 원칙상 ui/는 `activate` 단발만 emit하고 변환은 `reorder` 헬퍼(`core/gesture`).
**1 role = 1 component**: role 아닌 behavior — 축만 추가.
**data-driven 적합성**: 기존 ControlData에 `onEvent(reorder: {from, to})` 추가. 소비자가 reducer에서 소비.
**2패스 채택 권고**: **조건부 채택** — axis 먼저(shift+arrow 키보드만), pointer drag는 dnd-kit 어댑터로 나중. role 추가는 금지.

---

## GAP-03 Tag/Chip multi-value input

| Library | Component | children/data | API 요약 |
|---|---|---|---|
| Radix | — | — | 없음 |
| Ariakit | — | — | TagList/TagInput 공식 컴포넌트 **없음**. Combobox로 조립 예 있음 |
| RAC | `TagGroup` + `Tag` + `TagList` | 정적 children 또는 `items` (data) | `onRemove(keys)`, `selectionMode`, `onSelectionChange`, `onAction`. **표시/제거 중심**, 자유 입력 추가는 내장 아님 — Combobox/TextField 조합 |
| Base UI | — | — | 없음 |

**표준**: APG에 "Tag" 패턴 공식 없음. `role="listbox"` + 제거 버튼 조합 혹은 `role="grid"` 관행.
**수렴 판정**: 1/4 (RAC 단독) → **수렴 부족 ✗**
**ds 네이밍 권고**: (채택 시) `TagGroup` + `Tag` — RAC 이름 단독 준수. 다만 보류.
**1 role = 1 component 적합성**: Tag 자체가 ARIA 표준 role 아님. 복합 — group + removable button.
**data-driven 적합성**: `data`(tags), `onEvent(activate:key | remove:key)`. 자유입력은 `Combobox`+`TagGroup` 구성. 가능하지만 두 role 조립.
**2패스 채택 권고**: **보류**. 단기로 `Combobox`(검색) + 외부 `<ul>`로 칩 나열 + `Button` 제거 — 1패스 우회 유지. 수렴되는 시점까지 관찰.

---

## GAP-04 Stat/KPI card + chart region

| Library | Component | 비고 |
|---|---|---|
| 전부 | — | role 없음. layout/preset 영역 |

**수렴 판정**: 해당 없음 (role 아님).
**2패스 채택 권고**: **재분류** — layout/definePage 또는 별도 `layout-adoption.md`. `<section>` + `<dl>` + `<figure aria-label>` 구조로 유지, ds role 추가 금지.

---

## GAP-05 File upload / Dropzone

| Library | Component | children/data | API 요약 |
|---|---|---|---|
| Radix | — | — | 없음 |
| Ariakit | — | — | 없음 |
| RAC | `FileTrigger` + `DropZone` | children | `FileTrigger`: `onSelect(FileList)`, `acceptedFileTypes`, `allowsMultiple`. `DropZone`: `onDrop`, `getDropOperation` |
| Base UI | — | — | 없음 |

**표준**: HTML `<input type="file">` 네이티브 지원. APG 전용 패턴 없음.
**수렴 판정**: 1/4 → **수렴 부족 ✗**
**ds 네이밍 권고**: (채택 시) `FileTrigger` + `DropZone` (RAC 단독 수렴). 보류.
**2패스 채택 권고**: **보류**. native `<input type=file>` + `<Button>` + `Progress` 조립으로 1패스 우회 유지. dropzone만 따로 실제 수요 많아지면 재검토.

---

## GAP-06 DataGrid sort/filter preset

| Library | Component | 비고 |
|---|---|---|
| Radix | — | Grid 원자 자체 없음 |
| Ariakit | — | — |
| RAC | `Table` + `Column` + `TableHeader`(`allowsSorting`, `sortDescriptor`, `onSortChange`) | data-driven |
| Base UI | — | — |

**수렴 판정**: 원자 기준 1/4, ds는 이미 `Grid`/`ColumnHeader`/`Row`/`GridCell` 보유. 필터+정렬+pagination 연계는 **recipe**.
**2패스 채택 권고**: **재분류** → `cookbook/datagrid-sort-filter.md`. role 추가 금지. `ColumnHeader`에 `aria-sort` prop만 신설(필요 시).

---

## GAP-07 Textarea

| Library | Component | children/data | API 요약 |
|---|---|---|---|
| Radix Themes | `TextArea` | children | size/variant, display: block wrapper + textarea ref |
| Radix Primitives | — | — | 별도 없음 (`Form.Control asChild`로 textarea) |
| Ariakit | — | — | `FormInput`이 textarea 요소 수용 |
| RAC | `TextArea` (TextField 하위) | children | `<TextField>`의 자식으로 `<TextArea/>` |
| Base UI | — | — | Input만. Textarea 별도 없음 |

**표준**: HTML `<textarea>` 네이티브.
**수렴 판정**: 2/4 (RAC + Radix Themes) → **수렴 ✓**
**ds 네이밍 권고**: `Textarea` (소문자 a). RAC/Radix 일치.
**1 role = 1 component 적합성**: textarea는 HTML element 직접. role 주장 없음.
**data-driven 적합성**: Input과 동일. native 속성 그대로 forward (기존 `Input.tsx` 미러).
**2패스 채택 권고**: **즉시 채택 (2순위)**. `Input.tsx` 그대로 복제하여 `<textarea>` 반환. 1-file, no role.

---

## GAP-08 Badge / Tag (read-only)

| Library | Component | 비고 |
|---|---|---|
| Radix Primitives | — | 없음 |
| Radix Themes | `Badge` | 스타일 preset (role 아님) |
| Ariakit/RAC/Base | — | 없음 |

**수렴 판정**: Primitive(behavior) 레이어 0/4. Themes(style) 레이어만.
**ds 네이밍 권고**: ds는 classless 철학. 순수 라벨 = `<span>` + 시맨틱(`<mark>`/`<output>`). role 추가 금지.
**2패스 채택 권고**: **보류**. CSS preset만 `src/ds/build.ts`에 추가할지 별도 결정. 컴포넌트 신설 ✗.

---

## GAP-09 Date/Time input

| Library | Component | children/data | API 요약 |
|---|---|---|---|
| Radix | — | — | 없음 |
| Ariakit | — | — | 없음 |
| RAC | `DatePicker`/`DateField`/`TimeField`/`DateRangePicker`/`Calendar`/`RangeCalendar` | children | `@internationalized/date`, `value`, `onChange`, `minValue`, `maxValue`, `isDateUnavailable`. ISO 8601 제출 |
| Base UI | — | — | 없음 |

**표준**: HTML `<input type="date">`/`type="time"`는 있으나 range/locale 한계.
**수렴 판정**: 1/4 → **수렴 부족 ✗**
**ds 네이밍 권고**: (채택 시) RAC 이름 전수 준수. 현재는 보류.
**2패스 채택 권고**: **보류**. native `<input type=date|time>`로 유지. RAC 수준 의존 전까지 비용 과다 (`@internationalized/date` 번들 큼).

---

## GAP-10 Field (Label + Control + Hint + Required + Error)

| Library | Component | children/data | API 요약 |
|---|---|---|---|
| Radix | `Form.Root` / `Form.Field` / `Form.Label` / `Form.Control` / `Form.Message` / `Form.Submit` / `Form.ValidityState` | children | 네이티브 constraint validation, `name`으로 자동 연결 |
| Base UI | `Field.Root` / `Field.Label` / `Field.Control` / `Field.Description` / `Field.Error` / `Field.Validity` | children | validate 함수, `onSubmit`/`onBlur`/`onChange` 모드 |
| RAC | `TextField`(컨테이너) + `Label` + `Input`/`TextArea` + `Text slot="description"` + `FieldError` | children | flex-col wrapper, aria 연결 자동 |
| Ariakit | `Form` + `FormField` + `FormLabel` + `FormError` + `FormDescription` | children | form store |

**표준**: APG의 Form Labeling — `<label for>` + `aria-describedby`(hint) + `aria-invalid` + `aria-errormessage`.
**수렴 판정**: 4/4 → **완전 수렴 ✓✓**
**ds 네이밍 권고**:
- ds 관행(별도 export, dot-notation 금지) → `Field`, `FieldLabel`, `FieldDescription`, `FieldError`
- `FieldControl` 래퍼는 **만들지 않음** (classless — `Input`/`Textarea`/`Checkbox` 등이 `Field` 자식으로 들어가면 id/aria 자동 연결은 context로)
- `required` prop은 `Field`에 두고 `FieldLabel`이 `*` 시각 표시 (CSS `[aria-required="true"]`)
**1 role = 1 component**: `Field`는 layout container (`role="group"` 권고), `FieldLabel`=`<label>`, `FieldError`=`role="alert"`.
**data-driven 적합성**: Field는 **layout composition**이라 ControlProps 원칙의 예외. 자식들은 각자 데이터 주도 유지. ds에 이미 있는 `RadioGroup`/`CheckboxGroup`이 내부 Label을 context로 받는 구조와 정합.
**2패스 채택 권고**: **즉시 채택 (3순위, 사실상 1순위와 묶음)**. Checkbox·Textarea 도입 전에 먼저 만들어두면 재작업 최소.

---

## 종합 우선순위 (채택 순서 권고)

1. **Field + FieldLabel + FieldDescription + FieldError** (GAP-10) — 4/4 수렴, 다른 갭의 쇼핑백
2. **Checkbox + CheckboxGroup** (GAP-01) — 4/4 수렴, 수요 최다
3. **Textarea** (GAP-07) — 2/4 수렴, 1파일
4. **reorder 축** (GAP-02) — 조건부, keyboard-only 먼저 (`core/axes/reorder`)

### 보류 (수렴 부족)

- **TagGroup** (GAP-03) — RAC 단독, 실수요 시 재검토
- **FileTrigger/DropZone** (GAP-05) — RAC 단독
- **DatePicker 계열** (GAP-09) — RAC 단독, 번들 비용 고려

### 재분류

- **GAP-04 Stat/KPI + Chart** → layout adoption 문서
- **GAP-06 DataGrid sort/filter** → cookbook recipe 문서
- **GAP-08 Badge** → CSS preset 결정 (build.ts), role 아님

### 놓친 갭 후보 (1패스 미발견)

- **NumberField** (RAC) vs 기존 `NumberInput` — 네이밍 점검 (`NumberInput` 유지 or `NumberField` 이관?)
- **ColorField/ColorPicker** (RAC) vs 기존 `ColorInput` — 동일 이슈
- **Toast/Notification** — 운영 페이지 피드백에 필요하나 1패스 페이지에 없어 누락 가능
- **Pagination** — DataGrid recipe와 묶여야 할 가능성

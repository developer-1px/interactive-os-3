---
type: inbox
status: open
project: ds
layer: ui
tags: [edu-portal-admin, os-gap, 1-pass]
source: /Users/user/.claude/plans/shiny-greeting-waffle.md
---

# edu-portal-admin 1-pass — os gap 수집

docs/edu-portal-admin.html 시안을 ds/ui만으로 조립하며 발견한 갭. 2패스 채택 판정 전까지 open.

## 발견된 갭

### [GAP-01] Checkbox / CheckboxGroup role 부재

- **발견 위치**: pages/VideoEdit.tsx (역할 다중선택, 코스 다중선택)
- **시안 요구**: `<input type="checkbox">` 다중 선택 그룹 (역할 4개, 코스 3개). 독립 on/off 상태 유지
- **현재 ds**: form/에 Radio·RadioGroup·Switch 존재. Checkbox.tsx 없음. Switch는 토글 의미이며 "선택"이 아님
- **1패스 우회**: raw `role="checkbox"` 금지 규칙에 따라 semantic `<fieldset><legend>` + `<label>` 구조로 배치하고 컨트롤은 임시로 Switch 사용 + GAP 주석
- **2패스 입력**: Radix (Checkbox) / Ariakit (Checkbox) / Base UI (Checkbox) 3곳 전부 존재 → 채택 안건 1순위. data-driven(ControlProps) 패턴으로 CheckboxGroup 설계

### [GAP-02] Drag reorder 축 부재

- **발견 위치**: pages/RoleCategory.tsx (카테고리 순서), pages/VideoOrder.tsx (영상 순서)
- **시안 요구**: drag handle + keyboard reorder (up/down). 순서 저장 후 반영
- **현재 ds**: core/gesture·core/axes에 navigate/activate/expand/typeahead는 있으나 reorder 축 없음. Listbox는 선택·활성화 축만 탑재
- **1패스 우회**: `<ol>` + Listbox로 선택만 렌더. drag는 생략, 이동 버튼도 생략 + GAP 주석
- **2패스 입력**: Ariakit SortableList, Radix 없음(dnd-kit 권장), RAC GridList + useListReorder. APG: aria-grabbed deprecated → 키보드 reorder는 shift+arrow 관행. reorder 축을 core/axes에 추가하고 Listbox가 선택적 consume

### [GAP-03] Tag/Chip multi-value input

- **발견 위치**: pages/VideoEdit.tsx (주요 키워드, 다루는 서비스)
- **시안 요구**: 태그 칩 + `×` 제거 + Enter로 추가되는 입력 필드
- **현재 ds**: form/Input + Combobox는 단일값. 칩 렌더·제거 이벤트 표준 없음
- **1패스 우회**: `<fieldset>` + `<ul>`로 칩 나열, `<Input>`으로 입력 + GAP 주석 (칩 제거 버튼은 `<Button>`)
- **2패스 입력**: Ariakit TagList/Tag, RAC TagGroup, Base (없음) — 2곳 수렴 → 채택 후보. Combobox + 다중값 조합이냐 TagGroup 별도 role이냐 판정

### [GAP-04] Stat/KPI card + chart region

- **발견 위치**: pages/Dashboard.tsx (5개 KPI 카드, 막대 차트, 진행률 바, Top10 리스트)
- **시안 요구**: 수치 + 부가정보 + 변화량 뱃지. 막대/선 차트
- **현재 ds**: Progress는 있음. 차트는 없음. stat card는 layout일 뿐 role 아님
- **1패스 우회**: `<section>` + `<h2>` + `<dl>`(term/description) 구조로 KPI, `<figure aria-label>`로 차트 placeholder — role 주장 없음
- **2패스 입력**: stat card는 role 불필요 (layout preset 후보). 차트는 role="img" 또는 accessible chart 라이브러리(Recharts aria, visx). 갭 자체는 **role 아님 — 레이아웃**, layout preset 후보로 넘김

### [GAP-05] File upload / Dropzone

- **발견 위치**: pages/VideoEdit.tsx (영상 업로드, 썸네일, 문서 복수 업로드, SRT)
- **시안 요구**: drag-drop zone + 파일 진행률
- **현재 ds**: 없음. `<input type="file">` 직접 사용은 raw role 위반은 아니지만 DS 미확보
- **1패스 우회**: native `<input type="file">` + `<label>` + `Progress`로 조립 + GAP 주석 (native HTML은 role 위반이 아님, but DS role 부재 표시)
- **2패스 입력**: Radix 없음, Ariakit 없음, RAC FileTrigger/DropZone — 1곳만 수렴. 채택 보류 후보

### [GAP-06] DataGrid (sort/filter toolbar) preset

- **발견 위치**: pages/VideoList.tsx (상단 필터 + 정렬 가능 컬럼 + 테이블)
- **시안 요구**: 검색 + 다중 Select 필터 + 결과 개수 + 컬럼 헤더 정렬(aria-sort)
- **현재 ds**: Grid/Row/ColumnHeader/GridCell 원자 O. Toolbar+Grid 연계 레시피 없음. 필터 상태·URL 바인딩 표준 없음
- **1패스 우회**: Toolbar + Select + Grid 수동 조립. 정렬·필터 로직은 로컬 useState
- **2패스 입력**: RAC TableHeader sort 상태 연계. Radix/Ariakit 없음(원자 수준). 레시피 문서화가 갭 해소책일 수 있음 — 새 role이 아닐 가능성 높음. **role이 아닌 preset/recipe 갭**

### [GAP-07] Textarea

- **발견 위치**: pages/VideoEdit.tsx (영상 소개)
- **시안 요구**: 다중 행 입력
- **현재 ds**: form/에 Input(single-line) 있음. Textarea 없음
- **1패스 우회**: native `<textarea>` 직접 사용 (role 위반 아님) + GAP 주석
- **2패스 입력**: Radix/Ariakit/Base/RAC 모두 존재 — 채택 안건. Input과 쌍으로 필요

### [GAP-08] Badge / Tag (read-only label)

- **발견 위치**: Dashboard (level-badge 초급/중급/고급, status-badge 게시중/임시저장, role-tag, pcl-badge)
- **시안 요구**: 단순 시각 라벨 (상태, 레벨, 역할)
- **현재 ds**: 없음
- **1패스 우회**: semantic `<span>` 혹은 `<mark>` 사용. 스타일은 inline 금지이므로 순수 텍스트 + `aria-label` 보강 + GAP 주석
- **2패스 입력**: Radix Badge 없음, Ariakit 없음, RAC 없음. 순수 표시용 — role 불필요, CSS preset 후보. **role 아님 — 2패스 후보 낮음**

### [GAP-09] Date range picker / Date input

- **발견 위치**: pages/Dashboard.tsx (기간 커스텀), pages/VideoEdit.tsx (게시 예약)
- **시안 요구**: date·time input + range 조합
- **현재 ds**: 없음 (NumberInput·ColorInput만)
- **1패스 우회**: native `<input type="date">`/`type="time"` — role 위반 아님 + GAP 주석
- **2패스 입력**: Radix 없음, Ariakit 없음, RAC DatePicker/DateRangePicker. 1곳 수렴 — 채택 보류. native로 충분한지 판정

### [GAP-10] Definition / Field layout (Label + Control + Hint + Required)

- **발견 위치**: pages/VideoEdit.tsx 전반
- **시안 요구**: `<label>` · 필수 표시 `*` · 힌트 텍스트 · 에러 메시지 슬롯
- **현재 ds**: 없음. Input 등 컨트롤은 label 외부에 분리된 상태
- **1패스 우회**: `<label>` 직접 감싸거나 `htmlFor` + `<p>`로 hint. 아무 role도 쓰지 않고 semantic만
- **2패스 입력**: Radix Form/Field, Ariakit FormField, RAC TextField/FieldLabel. 3곳 수렴 → **채택 안건 상위**. FieldLayout preset 후보

### [GAP-11] Accordion-as-list (다중 Disclosure 패턴)

- **발견 위치**: pages/CourseCategory.tsx (코스별 카드를 접기/펴기)
- **시안 요구**: 항목 나열, 각 항목이 details 성격. 단일 open 강제 아니면 `<details>` 반복으로 충분
- **현재 ds**: Disclosure(=details/summary) 단일 O. Accordion group shell 없음 (index.ts엔 Accordion 미노출)
- **1패스 우회**: `<Disclosure>` 반복으로 시도. 어색하지 않음 — **갭 아님 후보**
- **2패스 입력**: 없음. 자체 종결

## 갭 아님 (rejected candidates)

- **Accordion group shell** — Disclosure 반복으로 CourseCategory 조립이 자연스럽게 동작. 단일 open 강제가 필요하지 않은 UX. Radix Accordion은 단일/다중 제어를 위한 것인데 시안은 각자 독립 접기. 추가 role 불필요.
- **FlatLayout/definePage** — 5개 페이지 모두 state page switcher로 충분. 레이아웃 공통화는 필요하지만 definePage까지 갈 필요 없음 — EduPortalAdmin 셸이 그 역할 수행.
- **Sortable/filterable DataGrid** — GAP-06으로 기록했으나 원자(Grid + ColumnHeader sort + Toolbar)는 이미 모두 존재. **role 갭이 아니라 recipe 갭**. 2패스에선 role 추가 금지, 데모 레시피로 처리.

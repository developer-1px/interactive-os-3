# DS 장르 커버리지 갭 로그

> 보편 8장르(Inbox/Chat/Commerce/CRM/Editor/Social/Analytics/Settings)를 현재 ds로
> 구현하며 발견한 갭을 장르별로 누적한다. 해결 시 `[x]`로 닫는다.

## 원칙

- 발견 즉시 기록 (페이지 동작 여부와 무관)
- role/widget/style 어느 층에서 갭인지 태깅
- 해결안은 가능하면 기존 부품 조합 우선, 불가피할 때만 신규 role

---

## 1. Inbox (Gmail)

- [ ] **registry 누락**: `Tree`, `TreeGrid`, `TreeRow`, `Menu`, `Combobox`, `Feed`, `FeedArticle`, `Tooltip`, `Carousel`, `Slider`, `NumberInput`, `ColorInput`, `Radio`, `RadioGroup`, `CheckboxGroup`, `Listbox` 의 `Group/Option` 계열, `Columns` — `src/ds/ui/**`에는 export 있으나 `src/ds/layout/registry.ts` `uiRegistry`에 등록 안 됨. **FlatLayout에서 사용 불가.**
- [ ] **MessageListItem** role 부재 — 발신자·제목·프리뷰·별표·시각을 한 행에 담는 content widget 필요. 현재는 Listbox + Option + 수작업 layout으로만 가능.
- [ ] **Star toggle** — 누름/안누름 상태의 별표 전용 토글. 현재는 Switch/Checkbox로만 가능, semantic mismatch.
- [ ] **Label chip** — 우편함 라벨(색 + 짧은 텍스트). Badge로 대체 가능하나 색 팔레트 부족.

---

## 2. Chat

- [ ] **MessageBubble** — 아바타 + 말풍선 + 메타(시각·편집표시). 신규 content widget.
- [ ] **Composer** — rich textarea + 툴바 + 전송 버튼 콤보. 부분 조립 가능.
- [ ] **MentionChip / Emoji picker**.

---

## 3. Commerce

- [ ] **ProductCard** — 썸네일·제목·가격·별점·장바구니. RoleCard/CourseCard와 유사하나 별도.
- [ ] **PriceTag** (세일·원가·할인율).
- [ ] **FilterFacet** (카테고리 + 범위 슬라이더 + 브랜드 체크박스 묶음).
- [ ] **Rating** (별 5개 시각화) — 입력형/표시형 양쪽.

---

## 4. CRM / Admin Table

- [ ] **BulkActionBar** — 선택 N건 표시 + 액션 버튼 묶음. Toolbar 조합으로 가능하나 semantic 고유.
- [ ] **Drawer** (side panel overlay) — Dialog와 다른 제스처/위치.
- [ ] **Pagination** — 대량 테이블 필수.

---

## 5. Editor

- [ ] **PropertyPanel** — key-value grid (Figma 우 패널).
- [ ] **BlockList** (드래그 가능 아이템 리스트).
- [ ] **FloatingToolbar** (selection 기반 팝업).

---

## 6. Social Feed

- [ ] **PostCard** — 아바타 + 본문 + 액션 바.
- [ ] **ReactionBar** — 이모지 리액션 카운트.
- [ ] **CommentThread** — 들여쓰기 트리.

---

## 7. Analytics v2

- [ ] **LineChart / DonutChart / AreaChart** — BarChart만 있음.
- [ ] **DateRangePicker** — 기간 선택 overlay.
- [ ] **Drilldown** — chart 클릭 시 하위로 전개.

---

## 8. Settings

- [ ] **SettingRow** — label + description + control 3단 (가장 반복적으로 필요).
- [ ] **DangerZone** — 파괴적 작업 강조 section.
- [ ] **Fieldset group** — 큰 섹션을 아코디언으로 접는 패턴.

---

## 공통

- [ ] `data-ds-thumb` — Dashboard에서 쓰이는 attribute, 정식 ds 부품으로 승격 필요.
- [ ] `placement` (ItemPlacement)에 `height`, `minWidth/maxWidth` 부재.
- [ ] `flow='split'` 의 구체적 동작 문서화 필요.

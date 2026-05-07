---
id: repoTimelineByWeek
type: inbox
slug: repoTimelineByWeek
title: 레포 타임라인 — 주별 시간순 ASCII 트리 (강연 자료)
tags: [inbox, talk, timeline]
created: 2026-05-06
updated: 2026-05-06
---

# 레포 타임라인 — 주별 시간순 ASCII 트리 (강연 자료)

```
─────────────────────────────────────────────────
W1  2026-04-23 ~ 2026-04-29   ds 본체 시기
─────────────────────────────────────────────────

04-23  레포 시작
└─ 첫 commit

04-24  ds 본체 폭발적 빌드 (하루 30+ commit)
├─ 75줄·7파일 제약으로 모듈 재편
├─ Finder UI + TanStack Router + virtual:fs-tree
├─ style/className 완전 금지 — ds CSS 가 레이아웃까지
├─ data-icon 인디케이터 시스템 (이모지 제거 → lucide 토큰)
├─ cmd+k 커맨드 팔레트 + 라우트 자동 수집
├─ preset 선언 포맷 (테마 상위호환 + hairline)
├─ Inspector 데모 + /ds-matrix 자기 전시
├─ Listbox 데이터 주도 전환 + Columns role 신설
├─ useRoving 훅 승격 — 4 role 공통 단일화
├─ controls 폴더 소멸 — ds 본체로 흡수
├─ useReducer 전환 (CommandPalette·useControlState)
├─ palette keymap 순수 데이터화 (React event 분리)
├─ gesture/intent 분리 — ui/는 activate 단발
├─ FlatLayout + form/display/layout 위젯
├─ edu-portal-admin demo + mock 비교 도구
├─ ds 폴더 재편 — 7개 초과 폴더 분리
├─ recipe 레이어 + microLabel 파일럿
├─ pressable/content 시각 계약 + toolbar
├─ Field/Section/Aside/chip + context-tone button
├─ Atlas 대시보드 + invariant 린트 3층
└─ CollectionProps 타입 계약 + Catalog 대시보드

04-25  catalog · drift 수렴 · 모바일 셸
├─ Inbox build 분리 + slot 주석
├─ catalog 데모 11개 누락 보충
├─ RadioGroup → CollectionProps 수렴 (첫 drift 소급)
├─ contracts 분류 리네임 (controlProps→collection)
├─ catalog 분파 taxonomy — entity vs control
├─ drift 대량 소급 + CheckboxGroup 수렴
├─ Top10List·BarChart → CollectionProps (drift 0)
├─ aria-checked="false" 셀렉터 + switch 토큰화
├─ display.ts SRP 분리 (위젯 1파일 컨벤션)
├─ Trigger(key|click) + useRovingDOM 선언화
├─ inbox/chat 디자인 — 3열 page flow=list
├─ roving tabindex 자동 + global shortcut 수렴
├─ evolution 코드변경 자동 스샷 + HMR 파일트리
├─ ui zone-first 폴더 재구성 + Catalog 개편
├─ 모바일 진입 — FloatingNav FAB
├─ Popover primitive (FloatingNav 우회)
├─ popover-polyfill iOS Safari ≤16
├─ 마크다운 라우터 + prose 타이포그래피
├─ 정사각형 축 — aspect 필드 + icon-only :empty
├─ square()를 fn/structural로 승격
├─ Finder 모바일 셸 분리 (iOS Files 식 drill-down)
├─ Liquid Glass 트렌드 적용
├─ viewport 단일 출처 — useShellMode + ShellSwitch
├─ 컨트롤 공식 높이 통일 (block-size: var(--ds-control-h))
├─ FilePager snap pager → feed 스크롤
├─ swipe 를 keyboard/mouse 와 동급 Axis primitive 로 ★
├─ --ds-hairline 토큰 (DPR 기반 진짜 1 device-px)
├─ 4-layer 수렴 마이그 1~3 — viewport 단일 출처
├─ 모바일 분기 JS 제거 — viewport=CSS, JS=user state ★
├─ MessageBubble·PostCard·FeedPost·ProductCard 4종
├─ smart group → docs 폴더 위계 동일 (calendar 5단)
├─ axis → core/axes/, glass → style/widgets/overlay
├─ hierarchy printTree + ?debug=tree
├─ atlas leak 1·2차 수렴 (color/radius/typo/motion fn)
└─ definePage 최상위 page-root inset 도입

04-26  HMI 정형화 · invariant 린트 · monorepo 분리 ★ 큰 날
├─ selector cascade race 부팅 시 throw 가드
├─ raw-value 룰 → PreToolUse hook 승격 ★ 첫 훅
├─ foundations 2층 재편 + atlas → /foundations
├─ hierarchy 토큰 + neutral tone + theme creator
├─ deploy SPA 404 fallback (GH Pages)
├─ SidebarAdminFloating 전역 등록
├─ 모바일 hairline 토큰 0 — 흐린 1px border 일괄 제거
├─ border 대신 soft shadow — 카드 surface elevation
├─ Hierarchy Monotonicity Invariant 점수화 + 정적 audit ★ HMI
├─ contractCard 노이즈 제거 + Gestalt HMI 적용
├─ 1px solid → hairlineWidth() 토큰 일괄 수렴
├─ Split — 범용 N-pane resize primitive 설계 + 구현
├─ FlatLayout 에 Split 노드 통합
├─ lint 108 → 72 → 0 errors
├─ react-compiler 5 건 정리
├─ lint:ds:flat-layout — 라우트 페이지 FlatLayout 강제 ★
├─ 8개 라우트 FlatLayout 마이그
├─ ds essay — 정본의 좁은 형태 + ds 아키텍처 명세
├─ CANONICAL.md + zod schema + plugin/middleware contract ★
├─ packages/ds 스켈레톤 (Phase A.1.1) ★ monorepo 시작
├─ src/ds → packages/ds/src 이전 (A.1.2b)
├─ packages/app 스켈레톤 + vite alias (A.1.3)
├─ src/ → packages/app/src/ (A.1.4)
├─ apps/finder 스켈레톤 + @apps/* alias (B.0)
├─ 11개 앱 일괄 분리 → apps/* (B.2)
├─ packages/app/app/ → boot/ 개명
├─ m.finder → finder/mobile 흡수
├─ @p/fs 신설 — fs source layer 분리
├─ @p/devtools 분리
├─ showcase/ 분리 (DS 시연·플레이그라운드 격리)
├─ apps/finder FSD entities/features/widgets ★ FSD 시드
├─ FinderState·FinderCmd·PreviewVM zod 승격
├─ renderMarkdown 정본화 — frontmatter mis-parse 차단
├─ finder spec.ts SSOT — 자연어요구↔zod·reducer·view
├─ keyline invariant 자가 수렴 — audit-keyline.mjs ★
├─ SpacingOverlay — Figma redline 식 inspector
├─ Mobbin 식 ScreenDef + byApp/byFlow/byPattern/byPart
├─ catalog 21 화면 ScreenDef 마이그
└─ UI 인디케이터 이모지·특수기호 제거 — data-icon 정본

04-27  wireframes 모바일 + 가이드 driven spacing
├─ 모바일은 device chrome 없이 vertical snap feed
├─ feed 게슈탈트 위계 + 3-column shell
├─ /canvas SSOT 자산 viewer + ds/devices layer 분리
├─ guide-driven semantic spacing — slot.<guide> + grid overlay
├─ SCAN 배열 → convention discovery (OCP)
└─ raw color → text() semantic + tone 추출

04-28  cohesion 정형화 + L0~L5 위계 강제
├─ foundations 1-멤버 layer 해체 (cohesion)
├─ 동명이의 3건 해소 — CountBadge·ProgressBar·RouterLink
├─ palette ↔ foundations 폴더 분리 강제
├─ eslint+ds: L0~L5 위계 강제 — folder × import 정합 ★
├─ ui/recipes → ui/templates (de facto 어휘)
├─ hooks/ 분리 — roving·focus·gesture·key·data 별 폴더
├─ surfaces/ 신설 — sidebar·command shell 분리 (L5)
└─ tokens/style → tokens/internal

04-29  ARIA 9-tier 폴더 정착 + 컴포넌트 ARIA 정합
├─ ui/1-command (ARIA command role)
├─ ui/2-input (ARIA input role)
├─ ui/3-composite
├─ ui/4-window
├─ ui/5-live
├─ ui/6-structure + ui/7-landmark
├─ ui/8-field + ui/9-layout
├─ data-tone/data-emphasis → data-variant 통일
├─ Button — variant prop + data-variant (위치 분기 폐기)
├─ ButtonGroup role="group" (ARIA spec)
├─ 컴포넌트명 ARIA spec 정렬 (de facto-first, ARIA when ambiguous)
├─ MenuItem · Option · Tree(treeitem) 4-slot anatomy
├─ Checkbox/Radio/Switch — dual disabled + aria-disabled
├─ Radio div→button (ARIA + keyboard)
├─ Input/Textarea/SearchBox/NumberInput/ColorInput/Slider
│  → aria-disabled/readonly 자동 미러 일괄
└─ Combobox aria-haspopup default 'listbox'


─────────────────────────────────────────────────
W2  2026-04-30 ~ 2026-05-06   headless 분리 → ds 폐기 → 정본 박기
─────────────────────────────────────────────────

04-30  @p/aria-kernel 워크스페이스 분리 ★ 결정적 분기
├─ headless 가 registry 를 모르도록 module augmentation
├─ @p/aria-kernel 별도 워크스페이스로 분리 ★★
├─ vite alias @p/aria-kernel
├─ _demos 9건 키보드 부착 — APG roving 완성
├─ scripts/audit-kbd-conformance.mjs — APG 키보드 자동 검증 ★
├─ /headless 라우트 — @p/aria-kernel API 카탈로그
├─ nodes.ts / preset/apply.ts SRP
└─ focus/ 1-멤버 layer 해체

05-01  (commit 활동 적음 — 회복)

05-02  ds 폐기 → 단일 제품화 ★★ 가장 잔인한 결정
├─ 제품 = @p/aria-kernel 단 하나
├─ 시각 = Tailwind utility 직접
├─ docs/2026-05-02/01_headlessMultiWiring.md
└─ docs/2026-05-02/02_headlessPatternUsageApi.md

05-03  ARIA 전수 감사 + NormalizedData 정형
├─ MDN ARIA Roles 전수 감사 — 신규 4 패턴 + axe 통합
├─ NormalizedData literal cleanup — meta slot, .data wrapper 폐기
├─ apps/site 새 shape 마이그
├─ test fixtures 마이그
├─ /doubt 스킬로 옛-shape 잔재 청소 ★
└─ refactor(simplify) — review findings 적용

05-04  패턴이 자기 state 소유 + ARIA 어휘 정본 + 사이트 통합 + llms.txt
├─ 오전 / wrapper-shape API — 패턴이 자기 state 소유
├─ single-value 패턴 NormalizedData 버림
├─ accordion/toolbar/feed/navigationList → bundle shape
├─ cohesion split — store subpath, layout/flow 폐기
├─ wrapper-site — combobox/dialog/tabs/accordion wrapper
├─ menu data 평탄화 (실버그)
├─ ARIA 어휘 정합 — props=role + select axis + treegrid
├─ APG/ARIA canonical naming
├─ apps/site 단일 카탈로그 + tooling/vite-plugins 통일
├─ edu-portal-admin app 제거
├─ TSDoc 전수 + llms.txt generator ★
└─ llms-full.txt — full signatures, warnings 0

05-05  사이트 라우트 + Kanban + KeyMap 13단계 + Declarative 9 phase + Chord
├─ /data — llms.txt static
├─ /matrix — Pattern × Axis · Pattern × Key 횡단표 ★
├─ /uievents — UiEvent 카탈로그
├─ /docs/$slug — Getting Started · Overview · Core Concept
├─ /docs/faq — 레드팀 27 의문 / 블루팀 정직 답 ★
├─ /docs/comparison — 대안 라이브러리 정직 비교
├─ Overview 다시 쓰기 3회 (Golden Circle → 공식문서 → SCQA)
├─ 모바일 단일 컬럼 + 사이드바 자동 닫힘
├─ zod-crud vendor as workspace + subscribe(changes, focusNodeId)
├─ naming audit + NAMING.md SSOT ★
├─ KEYS / INTENTS SSOT 라우팅
├─ chord → handler KeyMap shape 강제 (key arrays 금지)
├─ Kanban — keyboard-only Trello-lite ★
├─ listbox editable 옵션 — tree 와 동형 어휘
├─ Kanban 인라인 편집 + ←→ 컬럼 이동 + auto-edit
│
├─ KeyMap serializable 마이그 (PR #6~#18, 13단계) ★
│  ├─ #7 activate axis → fromKeyMap
│  ├─ #8 select  /  #9 expand  /  #10 navigate+pageNavigate
│  ├─ #11 numericStep
│  ├─ #12 useKeyMap hook
│  ├─ #13 treeNavigate+treeExpand  /  #14 multiSelect
│  ├─ #15 grid axes
│  ├─ #16 typeahead 정합 + 회귀 테스트
│  ├─ #17 raw e.key audit — === → matchKey
│  └─ #18 apps 마이그
│
├─ Declarative keymap (PR #20, 9 phase) ★
│  ├─ phase 1 dialog + useFocusTrap
│  ├─ phase 2 tooltip
│  ├─ phase 3a checkbox  /  3b menuButton  /  3c menu trigger
│  ├─ phase 4a grid F2  /  4b listbox  /  4c tree  /  4d treeGrid
│  ├─ phase 4e combobox  /  4f comboboxGrid + spatialNavigation
│  └─ phase 5 static guard — keymap residue invariant ★★
│
├─ #23 selectMany default reducer
├─ #24 checkbox-group child → selectMany
│
└─ Chord 문자열화 (PR #38, phase 0~10) ★
   ├─ phase 0 chord-parser + matcher string syntax
   ├─ phase 1 INTENT_CHORDS string mirror
   ├─ phase 2 AxisData + runAxis runner
   ├─ phase 2.5a Trigger=string 단일화
   ├─ phase 3a navigate intent-form (dir)
   ├─ phase 3b gridNavigate intent-form
   ├─ phase 3c resolver layer
   ├─ phase 4 axis.chords meta
   ├─ phase 7+8 probe/dedupe → axisKeys 마이그
   └─ phase 9+10 chord registry string 화

05-06  clipboard 흡수 + zod-crud + outliner SRP + 강연 그릴
├─ zod-crud → @p/aria-kernel workspace dep
├─ axis 정본 어휘 단일화 — alias 제거 + KNOWN_AXES SSOT ★
├─ clipboard 어휘 흡수 + on 미들웨어 + zod-crud adapter (#47, #48) ★★
├─ Tab demote uses move op (clipboard 미오염) + Shift+Cmd+V chord
├─ zod-crud move op focus = 신규 노드 + child mode 부모 자동 expand
├─ tree editable Tab/Shift+Tab 항상 preventDefault
├─ Enter=rename / Shift+Enter=insert sibling 인라인 편집
├─ zod-crud move op 시 expanded 상태 보존 (path 재매핑)
├─ Outliner.tsx 책임 5개 분리 (SRP)
├─ demo scaffold 을 route 로 분리 — Outliner 순수 앱
├─ widget→L1 우회 제거 — labelField + editProps
├─ JsonInspector 무한 루프 — toJson snapshot 캐시
│
└─ 저녁 / 강연 그릴 + 라이브 사고
   ├─ /grill-me 시작 — "이 프로젝트로 어떤 인사이트?"
   ├─ "정박 / 곤조 / 하네스" 3막 도출
   ├─ Kanban 콘솔에 'Backspaceremove' duplicate key + Column TypeError
   ├─ 근원 발견 — listbox.ts:80 + 85 (chord, uiEvent) 중복 descriptor
   ├─ listbox.ts:85 제거
   ├─ scripts/guardChordRegistry.mjs ★ 첫 chord-registry 정적 검사
   ├─ pnpm guard:chords
   ├─ 첫 실행 → tree.ts:82 의 두 번째 곤조 즉시 발견 ★ 강연 라이브 데모
   ├─ tree.ts:82 제거
   └─ docs/2026-05-06/04_chordDescriptorDup.md 박제
```

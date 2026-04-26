---
type: spec
status: approved
date: 2026-04-26
topic: Split — 범용 N-pane resize primitive
---

# Split — 범용 N-pane resize primitive

## 문제

Inbox·Finder·Feed·Inspector 등 거의 모든 라우트가 3-panel 구조를 갖는다. 현재 Row/Column/Grid는 정적 분배만 지원하고, 사용자가 panel 폭을 조절할 방법이 없다. 라우트마다 즉석으로 만드는 건 분기 폭증과 결합도 상승의 원인이 된다.

## 해결

`data-ds="Split"`이라는 layout primitive 1개를 추가한다. Row/Column과 형제 layer로 위치하며, 단 한 가지 책임만 가진다 — **축 위에서 사이즈 분배 + 사용자 드래그 반영**.

## 원칙 정렬

- **data-ds는 layout primitive 전용** — Row/Column/Grid에 이어 Split이 추가됨. 다른 곳에 data-ds 사용 금지 원칙은 그대로
- **Classless** — wrapper class 없음. 자식 DOM 평탄화 유지
- **No escape hatches** — separator는 ds 내부에서만 `role="separator"` 사용, 사용자는 `<Split>`만 씀
- **Minimize choices** — 1 primitive, variant 없음. axis(row|column)만 분기
- **Single data interface** — uncontrolled + `id` 기반 영속화로 라우트 boilerplate 제로

## API

```tsx
<Split id="finder" axis="row"
       defaultSizes={[1, 2, 3]}     // fr 비율, 기본 모두 1
       minSizes={[200, 240, 320]}>  // px clamp, 기본 120
  <Sidebar />
  <List />
  <Preview />
</Split>
```

- `id`: 있으면 `localStorage["ds:split:<id>"]`에 폭 영속화 (uncontrolled). 없으면 메모리만
- `axis`: `"row"` | `"column"`. 기본 `"row"`
- `defaultSizes`: fr 비율 배열. 자식 수와 길이가 다르면 1로 채움
- `minSizes`: px 단위 clamp. 단일 number로 주면 모든 panel에 동일 적용
- panel을 조건부로 빼면 자동 재분배 (자식 수 변화 → fr 재계산)
- 항상 `min-height: 100%` (full-height 기본)

## DOM 구조

```html
<div data-ds="Split" data-axis="row"
     style="grid-template-columns: 1fr 8px 2fr 8px 3fr; min-height: 100%">
  <aside>...</aside>
  <div role="separator"
       aria-orientation="vertical"
       aria-valuenow="33"
       aria-valuemin="..."
       aria-valuemax="..."
       tabIndex="-1"
       data-ds-handle />
  <main>...</main>
  <div role="separator" .../>
  <section>...</section>
</div>
```

자식 N개 사이에 separator (N-1개)가 자동 삽입된다. 셀렉터는 `[data-ds="Split"] > [role="separator"]`.

## Interaction

- **드래그**: 마우스/터치만. `pointerdown` → `setPointerCapture` → `pointermove` 중 사이즈 갱신 → `pointerup`에 commit + persist
- **Tab 흐름**: separator는 `tabIndex=-1` (사용자 결정)
- **시각**: 평소 invisible, hover/active 시 1px hairline. hit area 8px
- **커서**: 드래그 중 `cursor: col-resize`(row axis) / `row-resize`(column axis) 전역 적용
- **clamp**: 양쪽 인접 panel의 `minSizes` 합 이상 유지. 그 외 panel은 폭 고정
- **px → fr 변환**: 드래그 중에는 px 차이로 양쪽 panel 사이즈 갱신, commit 시점에 부모 폭 기준 fr 비율로 변환하여 저장

## 키보드

**제외** (사용자 명시). 화살표·Home/End 핸들러 없음. ARIA `aria-valuenow/min/max`는 보조기기용으로 유지.

## Collapse

**Split 책임 아님.** 라우트가 panel 자체를 조건부 unmount하면 Split이 자식 수 변화에 반응하여 자동 재분배한다. `useReducedMotion` 등은 외부 layer에서 처리.

## Nested Split

자연 동작. Split 안에 Split을 두면 axis만 다르게 하여 4-pane grid도 가능. 별도 코드 없음.

## 파일

- `src/ds/ui/8-layout/Split.tsx` — 구현 (드래그 로직, separator 자동 삽입, localStorage)
- `src/ds/style/widgets/layout/split.ts` — `data-ds="Split"` + `data-axis` 스타일, separator hover
- `src/ds/ui/8-layout/Split.demo.tsx` — 카탈로그용
- `src/ds/style/widgets/layout/layout.ts` — split.ts re-export

## Out of scope

- 키보드 화살표 조작
- collapsible 옵션 (외부 책임)
- 폭 변경 이벤트 노출 (controlled API). 필요해지면 추후 추가
- 애니메이션 (드래그 중 transition 없음)
- 모바일 swipe 제스처 (CSS only 분기 원칙)

## 검증 기준

1. 3-panel `<Split>`에서 separator 드래그 시 인접 두 panel만 폭 변화, 나머지 고정
2. min-width clamp 동작 — 양쪽 minSizes 합 이하로 못 줄어듦
3. `id` 부여 시 새로고침해도 폭 유지
4. panel 1개를 `null`로 빼면 남은 panel이 100% 차지, separator 1개 줄어듦
5. nested Split (axis 다르게) 정상 동작
6. classless audit (`scripts/aria-tree.ts` 등) 통과

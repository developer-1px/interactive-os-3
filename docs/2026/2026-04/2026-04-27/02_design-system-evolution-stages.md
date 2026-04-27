---
type: inbox
status: unprocessed
date: 2026-04-27
tags: [design-system, evolution, roadmap]
---

# 최소 DS 다음의 발전 단계

30 토큰 · 8 컴포넌트의 "최소 DS"에서 출발하면, 다음 발전은 **새 컴포넌트를 늘리는 게 아니라 같은 어휘를 더 깊은 차원으로 확장**하는 방향이다. 보통 5단계로 진화한다.

## Stage 1 — 폼·컬렉션 어휘 완성
도메인 화면 80%는 "입력받고 · 보여주는" 두 가지다.
- **Form 패밀리**: Field · Label · HelpText · ErrorText · Fieldset · Form layout.
- **Collection 3패턴 분기**: Table(비교) · List/Listbox(관리) · Card Grid(시각 브라우징). *(이 프로젝트 메모리에 이미 박혀있음)*
- **Pagination · Sort · Filter** — collection 위의 부속.

> 시그널: 도메인 페이지마다 raw `<input>`, `<table>`이 등장하기 시작하면 이 단계 진입.

## Stage 2 — 오버레이·내비게이션
화면 간 이동과 일시적 표면.
- **Overlay 4종**: Dialog · Popover · Tooltip · Toast. 모두 portal · focus trap · ESC 동일 동작.
- **Navigation 3종**: Sidebar · Tabs · Breadcrumb. (+ Menu/Submenu)
- **Command palette** (cmd+k) — 화면이 30개 넘으면 필수.

> 이 단계에서 **headless layer**(Radix · Ariakit · React Aria)를 도입하지 않으면 a11y가 무너진다.

## Stage 3 — 동작·시간 (Motion · Async)
정적 토큰 → 시간 차원 토큰.
- **Motion token**: duration(fast/base/slow) · easing(standard/emphasized/decelerate).
- **Transition 패턴**: enter/exit · layout shift · skeleton→content.
- **Optimistic UI · Suspense boundary · Error boundary** — 비동기 상태 표준화.

> 시그널: 화면 전환이 "툭툭" 끊긴다, 로딩 중 layout shift가 생긴다.

## Stage 4 — 밀도·다중 모드
같은 컴포넌트가 여러 맥락을 살아남게.
- **Density**: comfortable · compact (admin tool은 compact 필수).
- **Theme**: light · dark · high-contrast — semantic 토큰만 갈아끼우면 자동.
- **Responsive 경계**: shell(desktop/mobile 별도 구현) vs content(reflow). *(이 프로젝트 invariant)*
- **i18n**: RTL · 글자 길이 변화 · 숫자 포맷.
- **Brand variant**: 같은 구조에 다른 토큰 세트(white-label).

## Stage 5 — 자율성·검증 (DS가 시스템이 되는 단계)
사람이 일일이 안 봐도 어긋남이 잡히는 자가 수렴 구조.
- **Visual regression**: Chromatic / Argos — 모든 PR에서 시각 diff.
- **A11y 자동검증**: axe-core CI 게이트.
- **Invariant runtime check**: `audit-hmi` · `keyline-loop` 같은 위계·정렬 단조 측정. *(이 프로젝트 고유 — 업계엔 거의 없음)*
- **Lint 규약**: raw `<button>` 금지, 토큰 우회 금지, `useMemo` 금지 등 정적 검출.
- **Token round-trip**: Figma Variables ↔ code 양방향 sync.
- **Doc auto-publish**: Storybook/Zeroheight가 코드에서 자동 생성, 손으로 안 씀.

## 그 너머 — 선언형·생성형으로의 도약

도구가 충분히 닫히면 다음 도약이 가능해진다:
- **Page-as-data**: JSX 조립 → `definePage` 같은 entities tree 선언. *(이 프로젝트가 이미 여기)*
- **Flow-as-data**: 비즈니스 로직도 `defineFlow`로 직렬화 — LLM이 페이지를 "쓸 수 있다".
- **DS-driven AI**: v0/Galileo 류처럼 자연어 → DS 어휘로만 화면 생성. 어휘가 닫혀있을수록 LLM 출력이 일관.
- **Cross-platform token**: 같은 토큰이 web · iOS · Android · email · PDF로 transform.

---

## 한 줄 요약

| Stage | 추가되는 차원 | 임계 시그널 |
|------|--------------|------------|
| 1 | 폼·컬렉션 | raw input/table 등장 |
| 2 | 오버레이·내비 | 화면 30개 돌파, a11y 깨짐 |
| 3 | 시간·비동기 | layout shift, 툭툭 끊김 |
| 4 | 밀도·테마·i18n | admin/공개/다국어 분기 |
| 5 | 자율 검증 | 시각 회귀 사고 발생 |
| ∞ | 선언형·생성형 | LLM이 페이지를 쓰기 시작 |

> 핵심 패턴: **컴포넌트가 늘어나는 게 아니라, 같은 컴포넌트가 더 많은 차원(상태·시간·밀도·테마·언어·플랫폼)을 살아남게 만드는 방향**으로 발전한다. 컴포넌트 수가 계속 는다면 어휘가 닫히지 않은 신호다.

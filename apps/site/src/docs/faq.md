# FAQ

> Critical Friend 레드팀이 Overview 를 읽고 던진 27가지 의문에 블루팀이 정직하게 답합니다.
> 마케팅 답변 ❌. 약점은 약점으로 인정합니다.

## 정체성·차별화

### Q1. 기존 라이브러리도 markup-less hook 이 있는데 왜 또?

부분 정답입니다. Headless UI · React Aria · Ariakit 모두 hook API 가 있습니다. 차이는 **추상화 단위**입니다.

- 그들은 **컴포넌트 단위 hook** (`useListState` → 한 listbox 전체)
- 우리는 **행동 단위 primitive + recipe 합성** (`navigate` · `activate` · `typeahead` axis 가 있고, `useListboxPattern` 은 이들의 합성 recipe)

24 패턴이 충분하면 recipe 만 쓰고, 부족하면 axis 직접 합성합니다. 한 단 아래 자리잡았기 때문에 escape hatch 가 있습니다 — 다른 라이브러리는 "이 컴포넌트가 안 맞으면 처음부터 다시" 가 됩니다.

### Q2. React Aria 와 정확히 무엇이 다른가?

가장 가까운 경쟁자입니다. 솔직히 비교하면:

| 축 | React Aria | @p/headless |
|---|---|---|
| 어휘 | 자체(`useListBox`, `Item`, `Section`) | W3C ARIA 그대로(`useListboxPattern`, `role="listbox"`) |
| 데이터 인터페이스 | Collection API (custom iterator) | NormalizedData (3-store, plain JSON) |
| 이벤트 | callback props (onAction · onSelectionChange) | 단일 `onEvent(UiEvent)` |
| 컴포넌트 | RAC (`<ListBox>`) 도 함께 | hook + props getter 만 |
| 저자 | Adobe 풀타임 팀 | 1인 OSS (정직) |
| Production 사례 | Adobe Spectrum 외 다수 | 없음 (정직) |
| 번들 | ~50kB | ~10kB (예상) |

**RAC 가 더 안전합니다.** 우리의 강점은 (a) 더 작고 (b) 더 합성 가능하고 (c) 어휘가 W3C 그대로라는 점입니다. 단점은 후술 Q17~22.

### Q3. "행동만 가져오고 싶다" 시장이 큰가?

작습니다. 정직하게 인정합니다. 대부분 팀은 시각·행동 묶인 컴포넌트(shadcn · Radix Themes)를 원합니다. 이 라이브러리는 다음 niche 를 위한 것입니다:

- **자체 디자인 시스템**을 가진 팀 — 행동만 빌리고 시각은 자체
- **LLM 친화 codebase** — W3C 어휘 통일, 단일 dispatch 어휘로 LLM 추론이 쉬움
- **다른 라이브러리에서 떼어내기 실패한** 사용자

이 셋이 아니면 shadcn/Radix 가 맞습니다 (Overview "When not to use" 에 명시).

### Q4. 더 낮은 레벨 = boilerplate 증가 아닌가?

부분 그렇습니다. 24 recipe 가 boilerplate 를 흡수합니다 — recipe 사용 시 React Aria 와 같은 줄 수입니다.

axis 직접 조립 시에만 줄 수가 늡니다. 그건 "기존 패턴이 안 맞을 때만" 가는 escape hatch — 99% 사용자는 안 가도 됩니다.

## W3C 어휘 닫힘

### Q5. `useListboxPattern` 자체가 라이브러리 어휘 아닌가?

맞습니다. **자기모순 인정**합니다.

- 정확한 주장은 "**값 어휘**(role, aria-\*, prop 키)는 W3C 그대로, **함수 식별자**는 React 컨벤션 + APG slug 미러"
- `useListbox` 가 아니라 `useListboxPattern` 인 이유는: hook 호출이 들어있으면 `use*Pattern`, pure 함수면 `*Pattern` 으로 React Rules of Hooks 와 일치시키는 규약 (CLAUDE.md "Pattern 이름 규약")

좀 더 정직하게 다시 쓰면: **"새 ARIA 어휘를 만들지 않습니다. role · aria-\* · prop 이름은 spec 그대로. 함수 식별자는 APG slug 를 따릅니다."** 

Overview 본문도 이 정확도로 손볼 가치가 있습니다. (TODO)

### Q6. `rootProps` · `optionProps` 도 ARIA 어휘 아닌데?

`rootProps` 는 라이브러리 어휘 (인정). 다만 **`optionProps`, `tabProps`, `rowProps`, `gridcellProps` 등 part-getter 이름은 ARIA role 그대로**.

규약:
- ARIA role 이 있으면 `<role>Props` (예: `optionProps` ← role="option")
- 컨테이너처럼 role 이 외부로 자유롭게 풀려있으면 `rootProps`
- 한 패턴 안에 distinct role outer 가 2개 이상일 때만 role-name (combobox 예외)

이 규약 자체가 라이브러리 어휘 추가입니다. 인정하고 INVARIANTS.md 에 명시.

### Q7. APG 35+ 패턴인데 24 = 1:1?

정확히는:
- **APG `/patterns/` 카테고리** 를 1:1 미러
- 일부 W3C role 도 (alert, switch — APG 에는 없지만 ARIA spec 에 있는 것)
- `useTreePattern` ↔ APG `treeview` slug 같은 약간의 mismatch 는 **APG slug 미러 + JS 컨벤션** 절충

"24 APG patterns" 는 정확히는 "24 ARIA recipe" 가 정직한 표현. 수정 가치 있음 (TODO).

### Q8. APG 자체가 변하면?

ARIA 1.2 → 1.3 변경 시 우리가 추적해야 합니다. **사용자 마이그레이션 비용은 라이브러리 메이저 버전으로 흡수**할 의도입니다 (semver). 단 v0.x 는 아직 그 보장 없음 (Q19 참조).

## 시각 분리

### Q9. Tailwind 디자인 부담을 사용자에게 떠넘기는 것 아닌가?

그렇습니다. **이게 본 라이브러리의 핵심 거래(trade)입니다**.

- 얻는 것: 시각 자유도 100%, 어떤 디자인시스템에도 행동 인프라가 맞춰짐
- 잃는 것: utility class 작성 부담, focus ring·dark mode·motion 직접 챙겨야 함

이 거래가 본인에게 맞으면 사용, 아니면 shadcn (이미 utility class 작성 + 행동까지 다 포함) 으로.

### Q10. Tailwind v4 마이그레이션?

v3 / v4 차이는 주로 빌드 파이프라인. utility class 어휘는 거의 그대로입니다. 사용자 코드(`className="..."`) 는 영향 거의 없음. 라이브러리는 Tailwind 에 의존하지 않으므로 (CSS 0건) v3·v4 무관.

### Q11. focus ring · dark mode · motion?

라이브러리는 다루지 않습니다 — 시각 invariant 이기 때문. 사용자가 챙겨야 합니다.

권고: Tailwind 의 `focus-visible:ring-2 ring-blue-500`, `dark:bg-stone-900`, `motion-reduce:transition-none` 으로 표현. 이걸 한곳에 묶고 싶으면 사용자가 자기 wrapper 컴포넌트를 만듦 (Q12 답변과 연결).

### Q12. 결국 자기 wrapper 만들면 컴포넌트 라이브러리로 회귀하지 않나?

부분 그렇습니다. 다만 **회귀가 아니라 의도된 분업**입니다:

- `@p/headless` = 행동 SSOT (24 패턴 행동을 한 곳에)
- 사용자 wrapper = 시각 SSOT (자기 디자인시스템에 한 번만 입힘)

shadcn 도 결국 같은 구조 (Radix 위에 Tailwind 입혀 사용자 코드에 복사). 우리 차이는 "시각 결정을 라이브러리가 안 한다"는 것뿐. wrapper layer 가 사이트 `/wrappers` 에 예시로 있습니다.

## 데이터 모델

### Q13. NormalizedData 변환 비용?

`fromList(items)` 는 한 번 O(N), `fromTree(roots)` 도 한 번 O(N). 대부분 데이터는 fetch 후 한 번만 변환. live update 시 reducer 가 in-place 업데이트하므로 재변환 ❌.

대안 비교: React Aria Collection API 도 동일한 변환 비용을 다른 형태로 부과 (iterator 어댑터). 진짜 차이는 "어떤 shape 에 닫혀 있는가" — 우리는 plain JSON, 그쪽은 custom iterator.

### Q14. TanStack Query · SWR 와 어떻게 결합?

Overview 에 누락. 답:

```ts
const { data } = useQuery({ queryKey: ['todos'], queryFn: fetchTodos })
const normalized = useMemo(() => fromList(data ?? []), [data])
return <Listbox data={normalized} ... />
```

또는 `useResource` (단일 데이터 인터페이스 — `@p/headless/store`)가 query/cache 어댑터 역할.

이 답을 Core Concept 또는 별도 `/docs/data-fetching` 에 추가하는 게 맞음 (TODO).

### Q15. UiEvent 11 variant 부족하지 않나?

다음은 의도적 제외:
- drag-and-drop · file-upload — DOM 이벤트 그대로 사용 권장 (`onDragStart` 등)
- copy/paste — 같은 이유
- undo/redo — middleware 가 책임 (PreDispatchCtx)

UiEvent 는 **컬렉션 인터랙션의 의미 어휘**에 한정됨. DOM/network 이벤트는 React 표준 채널.

확장 필요 시 **PR + 이유** — 새 variant 추가 = 24 패턴 전수 처리 검토 필요해서 보수적.

### Q16. Date · Map · Set 직렬화?

직렬화 가능 = JSON.stringify 왕복 가능 = plain object 만. Date · Map · Set 은 entities 의 user data 로 두면 됩니다 (`{id, data: { createdAt: '2026-01-01T...' }}`) — string 화 책임은 사용자.

ROOT · meta 같은 라이브러리 영역만 plain JSON 강제, 사용자 entity 내용은 자유.

## 채택·운영

### Q17. 누가 만들고 유지보수?

1인 OSS 입니다 (정직). repo: 사용자의 개인 프로젝트. backed 회사 ❌.

이 사실은 채택 결정에 결정적이므로 README 첫 줄에 명시 가치 있음 (TODO).

### Q18. Production 사례?

없습니다 (정직). 같은 repo 의 `apps/finder`, `apps/markdown`, `apps/slides` 가 살아있는 검증 — "real app on bare headless" 증명용.

production 채택은 사용자가 자기 위험으로.

### Q19. 버전·안정성?

`v0.0.2`. **명백히 unstable**. breaking change 가능. semver 보장은 1.0 이후.

지금 채택 = 얼리어답터, 변경 추적 책임 있음.

### Q20. 번들 사이즈?

`tsup` 빌드 결과 미측정. 추정: tree-shake 후 한 패턴당 1~2kB, 24 패턴 전부 import 시 ~30kB. 정확한 측정은 README 에 추가 가치 (TODO).

### Q21. 테스트?

`packages/headless/src/**/*.test.ts` — axes / patterns / state 단위 테스트. axe-core 통합 ❌ (TODO). screen-reader matrix ❌. APG spec compliance test ❌ (의도는 있으나 미구현).

이건 약점입니다.

### Q22. React 19 only?

`peer: react@^19`. 18 사용자 못 씀.

이유: hook API (useSyncExternalStore, useTransition) + 19 의 ref-as-prop. backport 의지 ❌. niche 수용.

## 어조·페르소나

### Q23. 누가 만들었는지 안 밝힘

Overview 보강 가치. 1인 OSS 사실 + 동기 명시. (TODO)

### Q24. Radix·RAC 사용자에게 도발적 어조?

레드팀 정확. "옷을 다 입혀버린다" 표현은 강함. 의도는 "wrapper 층의 trade-off 를 솔직히 말하기" 였으나 톤이 적대적.

수정 방향: "옷이 있다 ↔ 옷이 없다" 가 가치판단 X, **선택**임을 명시.

### Q25. Why 에 비전 없음?

레드팀 정확. 현 Why 는 "고통" 위주. 비전(positive) 추가 가치:

> "ARIA spec 을 그대로 코드로 옮기는 codebase. spec 을 읽으면 코드 의미가 바로 보이고, LLM 도 한 어휘로 추론한다."

(TODO 수정)

## 사이트·문서 일관성

### Q26. INVARIANTS.md / PATTERNS.md 링크 깨짐

확인. Overview 끝의 외부 링크가 placeholder (`https://github.com/anthropics/claude-code`) 로 잘못 나감. 즉시 수정 필요. (TODO — 이번 turn 후속)

### Q27. 5분 약속 vs 분량

현 Overview ~200줄. 천천히 읽으면 ~7분, 스캔하면 ~3분. Why 섹션만 2분 컷.

조정 옵션:
- (a) 약속을 "5분"에서 "5~10분" 으로 정정
- (b) Why 만 "TL;DR" 1단락으로 위에 추가

(b) 선호 — 향후 적용. 

## 종합

레드팀 27개 중:
- **자기모순 인정** (Q5, Q6, Q7, Q23, Q24, Q25, Q26): 즉시 수정 가치
- **거래 솔직 인정** (Q3, Q4, Q9, Q12, Q17, Q18, Q19, Q20, Q21, Q22): niche·early-stage 사실 그대로
- **차별점 보강** (Q2, Q14, Q15): 비교표·예제 추가 가치

이 FAQ 는 "왜 채택하지 말아야 하는지" 까지 정직하게 보여줍니다. 신뢰 = 약점도 인정.

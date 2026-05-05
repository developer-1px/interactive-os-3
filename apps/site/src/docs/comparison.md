# Comparison

`@p/headless` 가 다른 컴포넌트·헤드리스 라이브러리와 어떻게 다른지 정직하게 비교합니다. 각 라이브러리는 자기 자리가 명확하므로, **본인 상황에 어떤 도구가 맞는지** 판단하는 데 도움이 되도록 작성했습니다.

## 한눈에 보기

| 라이브러리 | 층위 | markup | style | 데이터 모델 | 이벤트 | 저자 | Production |
|----|----|----|----|----|----|----|----|
| **Material UI · Ant Design · Chakra** | 컴포넌트 + 디자인시스템 | 라이브러리 결정 | 토큰까지 제공 | controlled props | callback per part | 회사 backed | 매우 다수 |
| **shadcn/ui** | 복사 컴포넌트 (Radix + Tailwind) | 라이브러리 결정 (복사 후 수정 가능) | Tailwind utility | controlled props | callback per part | OSS (`shadcn`) | 다수 |
| **Radix UI** · **Base UI** | 무스타일 컴포넌트 | 라이브러리 결정 (compound) | 무스타일 | controlled/uncontrolled | callback per part | WorkOS · MUI | 매우 다수 |
| **Headless UI** | 무스타일 컴포넌트 | 라이브러리 결정 | 무스타일 | controlled props | callback per part | Tailwind Labs | 다수 |
| **Ariakit** | 컴포넌트 + 일부 hook | 라이브러리 결정 | 시작 스타일 제공 | store API | callback per part | OSS (Ariakit) | 다수 |
| **React Aria / RAC** | 컴포넌트(RAC) + hook(RA) | RAC 가 결정 / hook 은 자유 | 무스타일 | Collection iterator | `onAction`·`onSelectionChange` 등 | Adobe | 다수 |
| **`@p/headless`** | 행동 인프라 (hook only) | 소비자가 결정 | 0건 | NormalizedData (3-store) | 단일 `onEvent(UiEvent)` | 1인 OSS | 없음 |

이 표 한 줄로 본 라이브러리의 위치는 분명합니다. **가장 낮은 층, 가장 작은 약속, 가장 큰 자유도, 가장 약한 안정성**.

## 어떤 차원에서 다른가

비교는 단일 축이 아닙니다. 다음 5가지 축에서 각자 다른 위치를 차지합니다.

### 1. 추상화 층위

```
                                      더 많이 입혀짐 ↑
   ┌──────────────────────────────────┐
   │ Material UI · Ant Design         │  컴포넌트 + 디자인시스템 토큰
   │ Chakra UI                        │
   ├──────────────────────────────────┤
   │ shadcn/ui                        │  복사 컴포넌트 (Tailwind 입혀짐)
   ├──────────────────────────────────┤
   │ Radix UI · Base UI · Headless UI │  무스타일 컴포넌트 (markup + 행동)
   │ Ariakit                          │
   ├──────────────────────────────────┤
   │ React Aria (hook 부분)           │  컴포넌트 + hook 둘 다
   ├──────────────────────────────────┤
   │ @p/headless                      │  행동만 (hook + props getter)
   ├──────────────────────────────────┤
   │ WAI-ARIA / APG spec              │  명세
   └──────────────────────────────────┘
                                      더 적게 입혀짐 ↓
```

위로 갈수록 **즉시 화면에 띄울 수 있고**, 아래로 갈수록 **자유도가 큽니다**. 본인이 어디 정도가 편한지가 첫 질문입니다.

### 2. markup 결정권

- **라이브러리가 결정**: Material · Radix · Base UI · Headless UI · Ariakit · RAC. compound API (`<Listbox.Root>` `<Listbox.Item>`) 가 markup 구조를 강요
- **소비자가 결정**: `@p/headless`. `<ul>` 을 `<ol>` 로 바꿔도 동작. semantic HTML 선택은 소비자

markup 결정권은 디자인 변경 자유도와 직결됩니다. 컴포넌트가 정해 둔 markup 으로 디자인을 풀어 내야 하면, 디자이너의 시안을 그대로 구현하기 어려운 순간이 옵니다.

### 3. 어휘 (vocabulary)

각 라이브러리가 추가로 정의하는 어휘의 양:

- **라이브러리 자체 어휘 多**: Material (`<Button color="primary" variant="contained">`), Ant Design (`<Select mode="multiple">`)
- **자체 어휘 中**: Radix · Headless UI (`<Listbox.Root>`, `<DropdownMenu.Trigger>`)
- **자체 어휘 少 + 일부 ARIA**: Ariakit (`useListboxStore`)
- **자체 어휘 中 + ARIA 일부**: React Aria (`useListBox`, `Item`, `Section`)
- **자체 어휘 최소**: `@p/headless` — 값 어휘는 W3C ARIA 그대로 (`role="listbox"`, `aria-selected`, `optionProps`). 함수 식별자(`useListboxPattern`)만 추가

자체 어휘가 많을수록 학습 비용·통역 비용이 늘고, LLM 추론도 어휘 매핑을 한 단 거쳐야 합니다.

### 4. 데이터 인터페이스

- **controlled props per primitive**: Material · shadcn · Radix · Headless UI — `<Listbox value={...} onChange={...}>`. 작은 값이면 편하나, 다중 컬렉션·tree·grid 가 되면 props 가 늘어남
- **iterator (Collection API)**: React Aria — 자체 collection 추상화 통해 효율 좋음, 그러나 어댑터 필요
- **store API**: Ariakit — store 객체를 prop 으로
- **NormalizedData (3-store)**: `@p/headless` — entities · relationships · meta 분리, plain JSON, 직렬화 가능

3-store 분리는 트레이드오프입니다 — 단순 컬렉션은 다른 형태가 더 짧지만, 트리·그리드·다중 컬렉션이 같이 사는 화면에서는 normalize 한 번이 직관적입니다.

### 5. 이벤트 채널

- **callback per part**: 대부분 라이브러리. `onSelect` `onChange` `onOpenChange` `onAction` …
- **typed callback set**: React Aria. `onAction` · `onSelectionChange` · `onSortChange` …
- **단일 dispatch 어휘**: `@p/headless` — `onEvent(e: UiEvent)` 한 채널. 11 variant discriminated union

단일 채널은 reducer 패턴(`(data, event) → data`) 과 자연스럽게 결합되고, middleware · undo/redo · replay · LLM 추론이 쉬워집니다. 대신 callback 한 줄로 끝내고 싶을 때는 더 길어집니다.

## 누가 더 안전한가 — 솔직한 답

이 라이브러리의 가장 큰 약점은 **저자와 production 사례** 입니다.

| 라이브러리 | 저자 | Backed | Production |
|----|----|----|----|
| Material UI | MUI 팀 | 회사 backed | 거대 다수 |
| Radix UI | WorkOS | 회사 backed | 매우 다수 |
| Headless UI | Tailwind Labs | 회사 backed | 다수 |
| React Aria / RAC | Adobe | 회사 backed | Adobe Spectrum 외 다수 |
| Ariakit | Diego Haz (OSS) | 개인 + community | 다수 |
| shadcn/ui | shadcn (OSS) | 개인 (널리 채택) | 다수 |
| **`@p/headless`** | **1인 OSS** | **없음** | **없음** |

지금 시점에서 production 안정성이 가장 중요하면 본 라이브러리는 적절치 않습니다. **React Aria / Radix / shadcn 가 더 안전합니다.**

본 라이브러리가 적절한 경우는:
- 자체 디자인 시스템이 있어 시각 자유도가 1순위
- LLM 친화 codebase 가 가치 있다고 판단 (단일 어휘 · 단일 dispatch)
- 얼리 어답터로 변경 추적을 감수할 수 있음

## 시나리오별 추천

본인 상황에 어떤 도구가 맞는지:

### "당장 화면을 띄워야 한다, 디자인은 표준이면 OK"

→ **Material UI · Ant Design · Chakra UI**. 디자인 시스템 토큰까지 다 정의돼 있습니다.

### "Tailwind 로 직접 디자인하고 싶다, 컴포넌트는 복사해서 수정하는 방식이 좋다"

→ **shadcn/ui**. Radix UI + Tailwind 가 이미 입혀진 코드를 복사해서 본인 코드베이스로.

### "compound 컴포넌트 어휘 (`<Listbox.Root>`) 가 익숙하다, markup 도 라이브러리에 맡기고 싶다"

→ **Radix UI · Base UI · Headless UI · Ariakit**. 무스타일이지만 markup 구조와 동작은 라이브러리가 결정.

### "production 안정성 + ARIA 정확도 + 회사 backed 가 모두 중요"

→ **React Aria / RAC**. Adobe 풀타임 팀이 유지, Adobe Spectrum 등 거대 production 검증.

### "자체 디자인시스템 + 행동 인프라만 빌리려는 niche 시장"

→ `@p/headless`. 단, v0.x · 1인 OSS · production 없음을 감수.

## `@p/headless` 의 강점 (있는 것)

- **가장 작은 어휘 추가**: 값 어휘는 W3C ARIA 그대로, 라이브러리는 함수 식별자 + props getter 정도만
- **단일 데이터 인터페이스**: NormalizedData 한 형태로 listbox · tree · grid · combobox 모두 표현
- **단일 dispatch 어휘**: 11 variant `UiEvent` 한 채널
- **24 recipe + 합성 escape hatch**: recipe 가 부족하면 axis primitive 직접 합성
- **LLM 친화**: [/llms.txt](/llms.txt) (23kB) · [/llms-full.txt](/llms-full.txt) (47kB) — 전체 API 를 LLM 컨텍스트로 한 번에 주입 가능
- **번들 작음**: tree-shake 후 패턴당 1~2kB

## `@p/headless` 의 약점 (없는 것)

- **production 사례 0**
- **1인 OSS — 회사 backed ❌**
- **v0.0.2 — breaking change 가능, semver 보장은 1.0 이후**
- **React 19 only — 18 사용자 호환 ❌**
- **자동 테스트 미완 — axe-core · screen-reader matrix · APG compliance 자동화 ❌**
- **시각 invariant — focus ring · dark mode · motion 대응은 소비자 책임**

## 다음 단계

- [Getting Started](/docs/getting-started) — 5분 안에 첫 화면
- [Overview](/docs/overview) — SCQA 로 정체성 다시 보기
- [Core Concept](/docs/core-concept) — 어휘 · 합성 모델
- [FAQ](/docs/faq) — 27가지 의문에 정직한 답변

## 참조

- [W3C WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/)
- [Radix UI](https://www.radix-ui.com/) · [Base UI](https://base-ui.com/) · [Headless UI](https://headlessui.com/) · [Ariakit](https://ariakit.org/) · [React Aria](https://react-spectrum.adobe.com/react-aria/)
- [shadcn/ui](https://ui.shadcn.com/) · [Material UI](https://mui.com/) · [Chakra UI](https://chakra-ui.com/) · [Ant Design](https://ant.design/)

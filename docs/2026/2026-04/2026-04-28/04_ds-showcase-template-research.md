---
type: reference
status: active
tags: [design-system, showcase, storybook, catalog, research]
---

# DS showcase/catalog 라이브러리·플랫폼 — de facto 조사

## TL;DR

업계는 3축으로 갈라진다 — (1) **컴포넌트 catalog**(Storybook 단일 표준), (2) **token/문서 플랫폼**(Zeroheight·Supernova·Knapsack 3파전), (3) **자체 사이트**(M3·Polaris·Carbon이 SSOT). 우리 `/canvas` 는 어느 축에도 속하지 않는 **"수렴 패턴 audit board"** — Storybook이 컴포넌트 1개씩 보여주는 거라면, /canvas 는 *전체 시스템을 한 장에 모아 위계·정렬·어휘 일관성을 시각 검증*하는 포지션이다. 가장 가까운 비유는 Figma의 *component set* + Polaris의 *foundations grid* 합본인데, 이 조합 자체는 시장에 없다 — reinventing 아님.

## 1. 전용 라이브러리·플랫폼

| 도구 | 강한 영역 | 강점 | 약점 | "한 장 audit"에 적합? |
|------|----------|------|------|----------------------|
| **Storybook v9** (2025.06) | 컴포넌트 isolation | 사실상 표준. Test Widget·a11y·visual·coverage 통합. v9가 v8의 절반 크기. addons 생태계(themes, viewport, design-token) 압도적 | 1 story = 1 컴포넌트가 골격. 시스템 전체 cross-view 약함. CSF 작성 비용 | ❌ 시스템 audit 아님 |
| **Histoire 1.0** | Vue/Svelte catalog | Vite native, framework 친화 stories(.vue/.svelte). Storybook보다 빠름 | React 진영 ecosystem 부재. 2025 기준 성장 정체 | ❌ 단일 컴포넌트 |
| **Ladle v3** | React lightweight | cold-start 1.2s (Storybook 8s). Uber 사내 335 프로젝트. CSF 호환 | React only. addon 빈약. 문서 약함 | ❌ |
| **Zeroheight** | 디자이너 documentation | no-code editor, Figma sync 1급, adoption tracking. 비코딩팀 진입 쉬움 | code-side 약함, token 자동화 없음. catalog가 정적 페이지 | △ 문서 카드 형태로 가능하나 시각 audit 약함 |
| **Supernova** | Token pipeline 자동화 | Figma → CSS/Swift/Kotlin PR 자동 생성. 멀티플랫폼 핵심 | setup 며칠 단위. 2025 들어 "AI vibe coding" 으로 피벗 — 문서는 부차 | ❌ pipeline 도구 |
| **Knapsack** | 엔터프라이즈 통합 | code+design+docs 하나의 living system. 전사 거버넌스용 | 대형 조직 전제 — SMB 부적합. 가격 비공개 | △ |
| **Backlight** | code-side docs | mdx + 컴포넌트 같은 repo. 좋은 컨셉이었음 | **2025-06-01 셧다운 확정**. 더 이상 옵션 아님 | ❌ deprecated |
| **Specify** | token 배포 파이프라인 | Figma variables → 다플랫폼 publishing | catalog viewer 아님 | ❌ |
| **Figma + Tokens Studio** | 디자인 도구 내 token | 24 token type 지원, GitHub sync, Plus 플랜은 in-Figma 문서 | Figma 외부에서 audit 불가 | ❌ Figma 안에서만 |

요약: **Storybook 외에 컴포넌트 catalog 표준은 없다.** 나머지는 token 배포/문서 플랫폼이고, "전체 시스템 한 장 audit"이라는 표면을 가진 도구는 0개.

## 2. 자체 사이트 패턴 (대형 DS)

| 사이트 | 구조 | 특징 |
|-------|------|------|
| **Material 3** (m3.material.io) | Foundations / Styles / Components / Develop 4축. 컴포넌트마다 Spec 페이지(anatomy·states·tokens) | M3 Expressive(2025) — 35개 shape morphing 추가. ref/sys/comp 3-tier token이 표준 어휘 정의 |
| **Polaris** (polaris.shopify.com) | Foundations / Patterns / Components / Tokens 4축 | "Patterns"이 행동 가이드(Empty state·Date picking)로 정착 — 합성 컴포넌트 아님 |
| **Carbon** (carbondesignsystem.com) | Guidelines / Patterns / Components 3축 + Anatomy 페이지 | 컴포넌트당 anatomy diagram + token table 표준 |
| **Atlassian Design** (atlassian.design) | Foundations(tokens) / Components / Patterns / Content | 멀티프로덕트(Jira·Confluence·Trello) 토큰 익스플로러 |
| **Spectrum** (spectrum.adobe.com) | global / alias / component 3-tier swatch + components | swatch 페이지가 시각 catalog의 사실상 reference |
| **Primer** (primer.style) | React/CSS/Brand 멀티 패키지 + Figma tokens | GitHub UI 직접 노출 — 실 제품과 docs가 같은 어휘 |
| **Fluent 2** (fluent2.microsoft.design) | Web/iOS/Android/macOS 멀티 surface + token 통합 | 플랫폼 간 token 매핑 표가 reference |
| **Radix** (radix-ui.com) | Primitives — 컴포넌트당 demo + API + anatomy | "anatomy parts"(Root·Trigger·Content) 어휘 표준화 |
| **Linear** (linear.app/method) | 디자인 원칙 manifesto + 짧은 페이지들 | catalog 아님 — *brand statement* 형태. 미니멀 |

**수렴 패턴**: 8개 시스템 모두 *Foundations(token) → Components → Patterns* 3축이 공통. "토큰 컬럼 → semantic 컬럼 → component 컬럼"의 *한 장 grid*는 어느 시스템도 안 함 — 전부 *컴포넌트 1개당 1페이지*. 즉 "시스템 전체를 시각 grid로 한눈에 보는" 패턴은 사이트 진영에도 없다.

## 3. Open Source 템플릿·스타터

| 도구 | docs 패턴 |
|------|----------|
| **Style Dictionary v4** | DTCG 2025.10 spec 1급 지원. docs 자체는 minimal — token 표만 |
| **Open Props** | MDN 스타일 단일 페이지 reference. 카테고리 anchor list. Open Props UI(2025.01)는 copy-paste 컴포넌트 카탈로그 |
| **Tailwind docs** | utility lookup table — 검색·anchor 중심. 컴포넌트 catalog는 Tailwind UI(별도 유료)가 담당 |
| **Theme UI / Vanilla Extract** | docs site는 단순한 API reference. catalog 기능 없음 |
| **DTCG (W3C, 2025.10 stable)** | spec 텍스트만 — 어휘 SSOT, viewer 아님 |

요약: OSS 진영은 **"reference + 이름 lookup"** 패턴이 표준. visual audit board는 없음.

## 4. 우리 /canvas 의 위치

| 비교 축 | Storybook | Zeroheight | M3 site | **/canvas** |
|---------|-----------|-----------|---------|-------------|
| 단위 | 1 컴포넌트/story | 페이지/문서 | 컴포넌트당 페이지 | **lane × 부품 grid (전체 한 장)** |
| 작성 | CSF .stories.tsx | WYSIWYG editor | 손코딩 페이지 | **fs 자동 수집 (`collect.tsx` glob)** |
| 정렬 | 알파벳/사이드바 트리 | 사이드바 메뉴 | 사이드바 + 인덱스 | **L0~L5 6단 + lane bucket (Memory `project_ui_tier_label_mapping`)** |
| 검증 표면 | 1개 컴포넌트 a11y/visual | 문서 적합성 | 시각 spec | **시스템 전체 위계·정렬·어휘 단조 (HMI / keyline)** |
| 의도 | dev 워크숍 | designer-dev 공유 | brand reference | **수렴 패턴 audit (Memory `project_canvas_intent`)** |

**중복인가?** 아니다. Storybook은 컴포넌트 *isolation*에 강하고, Zeroheight/M3는 *narrative documentation*. /canvas의 "전체 시스템을 한 장에 모은 시각 grid + fs 자동 수집 + Gestalt 단조성 검사" 조합은 시장 도구 중 0개 매칭.

**대체 가능한가?** Storybook을 켜면 *컴포넌트 워크숍*은 받을 수 있지만 *시스템 audit board*는 못 받는다. 수동으로 "한 페이지에 모든 컴포넌트" story를 짜면 흉내는 나오나, 그 순간 Storybook의 격자가 글래시 — fs 변경에 자동 추종이 안 된다. /canvas는 fs SSOT 추종이 핵심이라(`bucketOf/labelOf/orderOf`), Storybook으로 대체 시 "선언으로 묶기"(CLAUDE.md 추구미 §1) 가 깨진다.

**reinventing 인가?** 부분적이다 — *컴포넌트 demo* 부분은 Storybook이 더 잘함. 하지만 *전체 시스템 audit board* 표면은 비어있어서 reinventing이 아니라 *new surface*. 다만 Storybook의 Storyshots/Test Widget으로 commit-time 시각 회귀까지는 가져와도 좋다 (orthogonal).

**권장**:
1. /canvas는 *audit board* 포지션 유지 — Storybook 흉내 ❌.
2. (선택) Storybook 도입 시는 *컴포넌트별 인터랙션 워크숍*으로만 — token/foundations 페이지 만들지 말 것 (canvas와 어휘 충돌).
3. Zeroheight/Supernova는 *디자이너 진입* 필요해질 때만 검토 — 현 상황(LLM 중심 자동 수집)에서는 fit 약함.
4. DTCG 2025.10 stable spec은 *token 어휘*만 차용 — viewer 형태 차용 X (DTCG는 viewer가 아님).

## Insight

> **/canvas의 고유성은 도구가 아니라 invariant다.** Storybook·Zeroheight 모두 "선언적 catalog"는 아니다 — 둘 다 *작성자가 페이지를 짜는* 도구. /canvas는 *fs가 곧 catalog*라는 invariant 위에 서 있고, 이건 추구미 §1("선언")·§7("Search before create")의 직접 산물이다. 시장 부재는 reinventing 신호가 아니라 *우리 invariant가 시장에 없다*는 신호.

## 출처

- [Storybook 9.0 release notes](https://storybook.js.org/releases/9.0)
- [Storybook v9 Test Widget — InfoQ](https://www.infoq.com/news/2025/07/storybook-v9-released/)
- [Histoire vs Storybook 비교](https://www.somethingsblog.com/2024/10/21/simplify-ui-component-development-histoire-vs-storybook/)
- [Ladle v3 — Uber](https://ladle.dev/blog/ladle-v3/)
- [Zeroheight Design Systems Report 2025](https://othr.zeroheight.com/hubfs/zeroheight%20-%20Design%20System%20Report%202025%20-%20release%20version.pdf)
- [Knapsack vs Zeroheight](https://www.knapsack.cloud/blog/knapsack-vs-zeroheight-choosing-a-design-system-that-supports-scale)
- [Backlight 셧다운 — 2025-06-01](https://backlight.dev/)
- [Material Design 3 — Design tokens](https://m3.material.io/foundations/design-tokens/overview)
- [M3 Expressive 2025](https://supercharge.design/blog/material-3-expressive)
- [Atlassian Design — tokens](https://atlassian.design/components/tokens/)
- [DTCG 2025.10 stable spec](https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/)
- [Style Dictionary — DTCG 지원](https://styledictionary.com/info/dtcg/)
- [Tokens Studio docs](https://docs.tokens.studio)
- [Open Props](https://open-props.style/) · [Open Props UI](https://open-props-ui.netlify.app/)
- [Radix Primitives](https://www.radix-ui.com/primitives/docs/overview/introduction)

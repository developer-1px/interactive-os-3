---
type: task
status: in-progress
project: showcase
tags: [tokens, renderer-dispatch, ocp, follow-up]
related:
  - docs/2026/2026-04/2026-04-28/05_tokensRendererDispatchPrd.md
---

# `/tokens` Renderer Dispatch — 단계별 실행

> **PRD**: [05_tokensRendererDispatchPrd.md](./05_tokensRendererDispatchPrd.md)
> **현 상태**: 외과적 in-place 패치 (Stage 0) 완료. 본체 분해 (Stage 1~) 는 한 턴씩 진행.

각 Stage = 1 턴 = 1 commit 단위. 의존 위상 정렬됨 (앞 Stage 만 의존). 검증 게이트 = `npx tsc -b --noEmit` + 관련 DS lint 체크로 신규 에러 0 + dev `/tokens` 스샷 회귀 0.

## 스코프 (재정의)

> **방침**: SSOT 만 먼저. flat router OK. **/tokens = CSS 변수 collector** 컨셉.
> 시각 메타포(visualRegistry showcase) 는 부차 — 분리·고도화 작업 모두 후순위로 미룸.

## 진행 표 (SSOT path)

| # | 단계 | 산출물 | 의존 | 상태 |
|---|------|--------|------|------|
| 0 | categorize SSoT 정렬 + ETC 전수 노출 | `tokens.tsx` in-place 패치 | — | ✅ done (commit `aefa4b9`) |
| 1 | enumerate 추출 | `tokens/enumerate.ts` 신규, 본체 import | 0 | ⬜ |
| 2 | categorize 추출 | `tokens/categorize.ts` 신규, 본체 import. PREFIX_TABLE 단일 SSoT | 0 | ⬜ |
| 8 | EtcTable parts/Table 화 | `tokens/EtcTable.tsx` 신규. 현 raw `<dl>` token-table → `parts/Table` 으로 | 1,2 | ⬜ |
| 10 | 자동 surface 검증 | `--ds-test-foo: 1` 임시 주입 → ETC 자동 등장 확인. screenshot archive | 8 | ⬜ |

## 후순위 (SSOT path 끝난 뒤 별도 라운드)

| # | 단계 | 비고 |
|---|------|------|
| 3-7 | 시각 ReactNode → `renderers/<cat>.tsx` 분리 + rendererRegistry record | collector 본질과 무관. 풍부 시각화는 부차 |
| 9 | tokens.tsx 본체 슬림화 (740 → ~80줄) | 위가 끝나야 의미. 지금은 본체에 inline JSX 잔존해도 SSOT 정합 ✓ |

## 게이트

- 각 Stage 완료 후 자체 commit 권장. 메시지 prefix `refactor(showcase/tokens):`
- 검증 실패 시 해당 Stage 에서 멈추고 원인 분석 (다음 Stage 진행 ❌)
- Stage 9 까지 끝나면 PRD §1 완전 충족. tasks 폴더로 파일 이동 (status: completed)

## Stage 별 상세

### Stage 1 — enumerate 추출
- 신규: `showcase/playground/src/tokens/enumerate.ts`
- export: `enumerateRootVars(): Array<{ name; value }>` (현 `readRootTokens` 본문 그대로 이동)
- `tokens.tsx` 의 `readRootTokens` 제거 → import 로 교체
- 검증: `/tokens` 스샷 동일

### Stage 2 — categorize 추출
- 신규: `showcase/playground/src/tokens/categorize.ts`
- export: `CategoryKey` type, `PREFIX_TABLE`, `categorize(name)`
- `tokens.tsx` 본체에서 제거 → import
- 검증: 타입 + 스샷 회귀

### Stage 3-6 — 시각 ReactNode 이동
- 각 stage = `tokens/renderers/<cat>.tsx` 신규
- 본문: 현 `tokens.tsx` 의 해당 ReactNode (`ColorSwatchGrid`/`SemanticPairs` 등) 그대로 이동
- export: `({ tokens }: { tokens: CategorizedVar[] }) => JSX.Element` 통일 시그니처. `tokens` 인자는 미사용 (정적 ReactNode) — 추후 dynamic 화 여지
- visualRegistry 의 frames body 가 import 한 컴포넌트를 호출하게 변경
- 페이지 chrome CSS (`[data-part="swatch-grid"]` 등) 는 본체 `tokenPageCss` 에 그대로 — Stage 9 에서 함께 이동

### Stage 7 — rendererRegistry
- 신규: `tokens/renderers/index.ts`
- `visualRegistry` 의 categoryKey · title · lede · frames 를 registry record 로 변환
- 본체 buildPage 는 `Object.entries(rendererRegistry)` 순회로 변경
- 검증: 기존 7 카테고리 시각 동일

### Stage 8 — EtcTable
- 신규: `tokens/EtcTable.tsx`
- `parts/Table` (`@p/ds`) 로 columns: name · value
- 색상 토큰은 별도 `parts/Tag` 또는 `data-icon` swatch 로 표현 (현 token-table-swatch CSS 재현)
- 본체 `TokenTable` 함수 → `EtcTable` import 교체
- 검증: 표 행 개수 동일, 정렬 동일

### Stage 9 — 본체 슬림화
- `tokens.tsx` 740줄 → ~80줄
- CSS 는 `tokens/page.css.ts` 로 분리 (현 `tokenPageCss` 그대로)
- buildPage 는 enumerate → categorizeAll → registry dispatch + EtcTable 만
- 검증: tsc + lint + dev 스샷 + LOC 감소 확인

### Stage 10 — 자동 surface 검증
- 임시 `--ds-test-foo: 1` 을 `:root` 에 추가 (preset 또는 dev devtool)
- `/tokens` 의 ETC 섹션에 자동 등장 확인 → OCP 검증 통과
- 임시 var 제거. 스크린샷 archive

## 중단 기준

- 검증 게이트 실패 → 해당 Stage 롤백, 원인 분석 후 재시도
- 사용자가 우선순위 변경 요청 → tasks.md 업데이트 후 재진입

## 다음 행동

> Stage 1 부터 한 턴씩. 사용자가 "다음" / "Stage N" 등으로 트리거. 자동 진행 ❌ — 한 턴 끝마다 검증 결과 보고 후 사용자 승인.

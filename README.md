# ds

ARIA/headless 패키지 검증 workspace.

이 repo의 의의는 ARIA/headless behavior, 선언형 상태/레이아웃 계약, 그리고 그 패키지를 소비자 관점에서 검증하는 것이다. 디자인 컴포넌트의 제품 방향성은 이 repo에서 빠졌고, `aria-design-system`이 맡는다.

## Workspace

| 위치 | 역할 |
|---|---|
| `packages/*` | ARIA/headless behavior와 검증 인프라 패키지. 시각 디자인 컴포넌트 제품은 여기서 키우지 않는다. |
| `apps/*` | 패키지를 실제 시나리오처럼 소비하는 큰 검증 쇼케이스. 기능을 숨겨 넣는 곳이 아니다. |
| `showcase/*` | 좁은 단위의 ARIA 패턴, 키보드, 상태 전이, 통합 검증 표면. |

## 작업 기준

1. 새 재사용 동작이나 ARIA 계약은 먼저 `packages/*`에 둔다.
2. `apps/*`와 `showcase/*`는 패키지의 public/workspace export를 소비해서 검증한다.
3. 쇼케이스에서 필요한 기능이 생기면 쇼케이스 전용 구현보다 패키지 API 확장을 먼저 검토한다.
4. 디자인 컴포넌트, visual token, brand/theme 방향성은 `aria-design-system`으로 보낸다.
5. 검증은 패키지 build/typecheck와 관련 쇼케이스 실행 결과를 함께 본다.

## Commands

```bash
pnpm dev
pnpm build
pnpm --filter @p/headless build
pnpm --filter @p/headless typecheck
```

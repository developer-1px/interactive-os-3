# ds

패키지 우선 라이브러리 workspace.

이 repo의 제품은 `packages/*`에 있는 `@p/*` 라이브러리다. `apps/*`와 `showcase/*`는 독립 제품 앱이 아니라, 그 패키지를 소비자 관점에서 검사하는 쇼케이스이자 검증 harness다.

## Workspace

| 위치 | 역할 |
|---|---|
| `packages/*` | 제공되는 라이브러리 패키지. 재사용 가능한 API, behavior, token, UI 계약은 여기에서 시작한다. |
| `apps/*` | 패키지를 실제 시나리오처럼 소비하는 큰 검증 쇼케이스. 기능을 숨겨 넣는 곳이 아니다. |
| `showcase/*` | 좁은 단위의 시각, 접근성, 키보드, 토큰 검증 표면. |

## 작업 기준

1. 새 재사용 동작이나 계약은 먼저 `packages/*`에 둔다.
2. `apps/*`와 `showcase/*`는 패키지의 public/workspace export를 소비해서 검증한다.
3. 쇼케이스에서 필요한 기능이 생기면 쇼케이스 전용 구현보다 패키지 API 확장을 먼저 검토한다.
4. 검증은 패키지 build/typecheck와 관련 쇼케이스 실행 결과를 함께 본다.

## Commands

```bash
pnpm dev
pnpm build
pnpm --filter @p/headless build
pnpm --filter @p/headless typecheck
```

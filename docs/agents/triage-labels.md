# Triage Labels

`triage` 스킬이 사용하는 5단계 state machine 라벨. 모두 GitHub repo `developer-1px/interactive-os-3`에 실재한다.

| 역할 | 라벨 문자열 | 의미 | 다음 액션 |
|---|---|---|---|
| 평가 대기 | `needs-triage` | maintainer가 아직 평가 안 함 | 읽고 분류 |
| 정보 대기 | `needs-info` | 리포터의 추가 정보 필요 | 응답 대기 |
| 에이전트 준비 | `ready-for-agent` | 완전히 명세됨, AFK 에이전트가 컨텍스트 0으로 잡을 수 있음 | 에이전트 디스패치 |
| 사람 작업 | `ready-for-human` | 사람 판단/구현 필요 | 사람이 picks up |
| 보류 | `wontfix` | 처리하지 않음 (이유 명시) | close |

## 적용 규약

- 새 이슈는 항상 `needs-triage` 부착으로 시작.
- triage 단계에서 다음 라벨로 교체 (`gh issue edit <N> --remove-label needs-triage --add-label ready-for-agent`).
- 한 이슈에 위 5개 중 1개만. 다른 라벨(`bug`/`enhancement` 등)과는 공존 OK.

## ready-for-agent의 기준

다음 모두 충족해야 `ready-for-agent` 부착:
1. 변경 범위가 명시됨 (어떤 파일/모듈/패키지)
2. 인터페이스가 명시됨 (signature·schema)
3. 검증 기준이 명시됨 (테스트 또는 수동 확인 절차)
4. 외부 의존(다른 issue/PR)이 해소됨

3 중 1이라도 빠지면 `ready-for-human` 또는 `needs-info`.

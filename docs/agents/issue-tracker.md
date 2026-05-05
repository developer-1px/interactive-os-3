# Issue Tracker — GitHub

이 repo의 이슈는 **GitHub Issues** 에서 관리한다.

- Repo: `developer-1px/interactive-os-3`
- CLI: `gh` ([GitHub CLI](https://cli.github.com))

## 규약

### 새 이슈 만들기

```bash
gh issue create --title "<title>" --body "<body>" --label needs-triage
```

새로 만들어진 이슈는 항상 `needs-triage` 라벨로 시작한다.

### 이슈 보기

```bash
gh issue list --label needs-triage
gh issue view <NUMBER>
```

### 본문 형식

PRD/스펙/버그 리포트 모두 markdown. 다음 섹션 권장:
- **Problem** — 사용자 관점의 문제
- **Solution** — 사용자 관점의 해결
- **Implementation Decisions** — 결정된 사항 (모듈/인터페이스/스키마)
- **Testing Decisions** — 무엇을 테스트할지
- **Out of Scope** — 명시적 제외 항목

큰 PRD는 `to-issues` 스킬로 vertical slice로 분해해 여러 sub-issue로.

## 라벨

라벨 어휘는 `docs/agents/triage-labels.md` 참조.

## 프로젝트 자체 컨벤션과의 관계

이 repo는 자체적으로 `docs/YYYY/YYYY-MM/YYYY-MM-DD/NN_*.md` 컨벤션으로 PRD/inbox/회의록을 누적한다. 둘은 역할 분리:

- **GitHub Issues** — 실행 단위. AFK 에이전트가 잡을 수 있는 명세된 작업.
- **`docs/날짜폴더/`** — 기획·논의·회고. 시간순 누적 지식.

큰 PRD는 `docs/날짜폴더/`에 먼저 작성하고, vertical slice issue들이 그 PRD를 reference한다.

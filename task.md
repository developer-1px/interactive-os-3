# Task: finder sidebar 재편 + evolution → screenshots

- [x] sidebar items 재편 (controls 제거, packages 추가, ds path → /packages/ds, public → docs/screenshots)
- [x] docs/evolution → docs/screenshots git mv
- [x] scripts/snap-evolution.mjs → scripts/snap-screenshots.mjs 이동 + 내부 경로/로그 prefix 치환
- [x] .claude/settings.json hook command 경로 갱신
- [x] 문서 7개 파일 내 docs/evolution 경로 표기 일괄 치환 (디렉터리 명칭만, "진화" 의미 단어는 보존)
- [x] verify: 잔여 docs/evolution·snap-evolution 참조 0 (task.md 자기 참조 제외)
- [~] verify: `pnpm lint:ds:all` — 기존 inline-style/hatch 이슈로 실패하지만 이번 변경과 무관 (sidebar/snap-screenshots/docs 경로 변경에 영향 없음)

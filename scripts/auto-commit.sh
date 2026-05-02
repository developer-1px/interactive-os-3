#!/usr/bin/env bash
# Stop hook 에서 호출 — 워킹 트리에 변경이 있으면 자동으로 snapshot 커밋.
#
# 호출 경로: .claude/settings.json 의 Stop 훅
# 트리거: Claude 가 한 응답을 끝낼 때마다.
#
# Safety:
#  - main/master 에서는 절대 자동 커밋하지 않음 (PR/리뷰 흐름 보호)
#  - merge/rebase/cherry-pick 진행 중이면 스킵
#  - 마지막 커밋이 30초 이내면 스킵 (Stop 훅 폭주 방지)
#  - 메시지는 변경 영역(top-level 디렉토리) 기반 단순 요약

set -uo pipefail

cd "$(git rev-parse --show-toplevel 2>/dev/null)" || exit 0

# 0. main/master 보호 — 자동 커밋 ❌
branch=$(git branch --show-current 2>/dev/null)
if [[ "$branch" == "main" || "$branch" == "master" ]]; then
  exit 0
fi

# 1. merge/rebase/cherry-pick/bisect 진행 중이면 손대지 않음
git_dir=$(git rev-parse --git-dir 2>/dev/null) || exit 0
for marker in MERGE_HEAD REBASE_HEAD CHERRY_PICK_HEAD BISECT_LOG; do
  [[ -e "$git_dir/$marker" ]] && exit 0
done
[[ -d "$git_dir/rebase-apply" || -d "$git_dir/rebase-merge" ]] && exit 0

# 2. 변경 없으면 종료
if [[ -z "$(git status --porcelain 2>/dev/null)" ]]; then
  exit 0
fi

# 3. 마지막 커밋이 너무 가까우면 스킵 (30s)
last_ts=$(git log -1 --format=%ct 2>/dev/null || echo 0)
now_ts=$(date +%s)
if (( now_ts - last_ts < 30 )); then
  exit 0
fi

# 4. 메시지 — 변경 영역 top-level 디렉토리 집계
files=$(git status --porcelain 2>/dev/null | awk '{print $NF}')
areas=$(echo "$files" | awk -F/ 'NF>=2 {print $1"/"$2} NF==1 {print $1}' | sort -u | head -3 | paste -sd ", " -)
[[ -z "$areas" ]] && areas="root"

count=$(echo "$files" | grep -c .)
msg="auto: snapshot ($count files · $areas)"

# 5. 커밋 — 모든 untracked + 변경 포함, 단 .claude/settings* 는 자동 커밋 대상에서 제외
#    (사용자 설정 변경은 의도적으로 따로 커밋하도록)
git add -A -- ':!.claude/settings.json' ':!.claude/settings.local.json' 2>/dev/null

# 변경이 .claude/settings.* 뿐이었으면 스테이징 후에도 비어있을 수 있음 → 다시 체크
if git diff --cached --quiet; then
  exit 0
fi

git commit -q -m "$msg

Auto-committed by Stop hook (scripts/auto-commit.sh).
Branch: $branch
" 2>&1 | tail -3 || true

exit 0

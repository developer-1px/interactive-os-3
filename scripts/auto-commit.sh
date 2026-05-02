#!/usr/bin/env bash
# Stop hook 에서 호출 — 워킹 트리에 변경이 있으면 컨텍스트 기반 메시지로 snapshot 커밋.
#
# 호출 경로: .claude/settings.json 의 Stop 훅
# 트리거: Claude 가 한 응답을 끝낼 때마다.
#
# Safety:
#  - main/master 에서는 절대 자동 커밋하지 않음 (PR/리뷰 흐름 보호)
#  - merge/rebase/cherry-pick 진행 중이면 스킵
#  - 마지막 커밋이 30초 이내면 스킵 (Stop 훅 폭주 방지)
#
# Message:
#  - <type>(<scope>): <subject>  형식 (Conventional Commits 결)
#  - type   : staged diff 통계로 추론 (test/docs/style/refactor/feat/fix/chore/remove)
#  - scope  : 변경 파일 path 의 공통 prefix (apps/<x>, packages/<x>, site/<dir>, root)
#  - subject: 변경 파일 basename 상위 2~3개

set -uo pipefail

cd "$(git rev-parse --show-toplevel 2>/dev/null)" || exit 0

# ── 0. 가드 ──────────────────────────────────────────────────────────────
branch=$(git branch --show-current 2>/dev/null)
[[ "$branch" == "main" || "$branch" == "master" ]] && exit 0

git_dir=$(git rev-parse --git-dir 2>/dev/null) || exit 0
for marker in MERGE_HEAD REBASE_HEAD CHERRY_PICK_HEAD BISECT_LOG; do
  [[ -e "$git_dir/$marker" ]] && exit 0
done
[[ -d "$git_dir/rebase-apply" || -d "$git_dir/rebase-merge" ]] && exit 0

[[ -z "$(git status --porcelain 2>/dev/null)" ]] && exit 0

last_ts=$(git log -1 --format=%ct 2>/dev/null || echo 0)
now_ts=$(date +%s)
(( now_ts - last_ts < 30 )) && exit 0

# ── 1. 스테이징 (settings.json 류는 의도적 커밋만, 자동 제외) ────────────
git add -A -- ':!.claude/settings.json' ':!.claude/settings.local.json' 2>/dev/null
if git diff --cached --quiet; then
  exit 0
fi

# ── 2. 메시지 추론 ───────────────────────────────────────────────────────
# 2a. 변경 파일 목록 (staged)
mapfile -t files < <(git diff --cached --name-only)
count=${#files[@]}

# 2b. 추가/삭제 라인 수, status 패턴
stats=$(git diff --cached --shortstat 2>/dev/null)
add_lines=$(echo "$stats" | grep -oE '[0-9]+ insert' | grep -oE '[0-9]+' || echo 0)
del_lines=$(echo "$stats" | grep -oE '[0-9]+ delet' | grep -oE '[0-9]+' || echo 0)
add_lines=${add_lines:-0}
del_lines=${del_lines:-0}

# 2c. 변경 status 카운트 (A/M/D/R)
status_codes=$(git diff --cached --name-status 2>/dev/null | awk '{print substr($1,1,1)}')
n_add=$(echo "$status_codes" | grep -c "^A" || true)
n_mod=$(echo "$status_codes" | grep -c "^M" || true)
n_del=$(echo "$status_codes" | grep -c "^D" || true)
n_ren=$(echo "$status_codes" | grep -c "^R" || true)

# 2d. type 추론 — 모든 파일이 같은 카테고리에 속하면 그 라벨, 아니면 휴리스틱
all_match() {
  local re="$1"
  for f in "${files[@]}"; do [[ "$f" =~ $re ]] || return 1; done
  return 0
}

if   all_match '\.test\.(ts|tsx|js)$|/__tests__/|\.spec\.(ts|tsx|js)$';     then type="test"
elif all_match '\.md$|^docs/|^README';                                      then type="docs"
elif all_match '^\.gitignore$|\.config\.(cjs|js|ts|mjs)$|^tsconfig|^vite-plugin|^vite\.config|^postcss|^tailwind|^pnpm-workspace|^package\.json$|^package-lock|^pnpm-lock'; then type="chore"
elif (( n_del > 0 && n_add == 0 && n_mod == 0 && n_ren == 0 ));             then type="remove"
elif (( n_ren > 0 && n_mod == 0 && n_add == 0 && n_del == 0 ));             then type="rename"
elif (( del_lines > add_lines * 3 ));                                       then type="refactor"
elif (( n_add > 0 && n_mod == 0 && n_del == 0 ));                           then type="feat"
elif (( del_lines > 0 && add_lines > 0 && add_lines + del_lines < 30 ));    then type="fix"
else                                                                             type="update"
fi

# 2e. scope 추론 — 변경 파일들의 공통 path prefix
scope=""
common_prefix() {
  # 첫 파일의 디렉토리부터 시작해 모든 파일이 그 prefix 로 시작하는 가장 깊은 공통 경로
  local first="$1"
  shift
  local prefix
  prefix=$(dirname "$first")
  while [[ -n "$prefix" && "$prefix" != "." && "$prefix" != "/" ]]; do
    local all_in=1
    for f in "$@"; do
      [[ "$f" == "$prefix"/* || "$f" == "$prefix" ]] || { all_in=0; break; }
    done
    if (( all_in )); then echo "$prefix"; return; fi
    prefix=$(dirname "$prefix")
  done
}

if (( count == 1 )); then
  scope=$(dirname "${files[0]}")
  [[ "$scope" == "." ]] && scope="root"
else
  pref=$(common_prefix "${files[@]}")
  if [[ -n "$pref" ]]; then
    scope="$pref"
  else
    # 공통 prefix 가 없으면 top-level area 들의 union
    mapfile -t areas < <(printf '%s\n' "${files[@]}" | awk -F/ 'NF>=2 {print $1} NF==1 {print "root"}' | sort -u)
    if (( ${#areas[@]} == 1 )); then scope="${areas[0]}"
    elif (( ${#areas[@]} <= 2 )); then scope=$(IFS='+'; echo "${areas[*]}")
    else scope="repo"
    fi
  fi
fi

# scope 단축 — apps/finder/src/widgets → finder, packages/headless/src/state → headless
short_scope=$(echo "$scope" \
  | sed -E 's|^apps/([^/]+).*|\1|; s|^packages/([^/]+).*|\1|; s|^site/src/([^/]+).*|site/\1|; s|^site$|site|; s|^scripts.*|scripts|; s|^docs.*|docs|')

# 2f. subject — 변경 파일 basename 상위 2~3개 (확장자 제거)
mapfile -t basenames < <(printf '%s\n' "${files[@]}" | awk -F/ '{print $NF}' | sed -E 's|\.(test|spec)?\.?(tsx?|jsx?|md|css|cjs|mjs|json|yaml|yml)$||' | sort -u | head -4)

if (( ${#basenames[@]} == 1 )); then
  subject="${basenames[0]}"
elif (( ${#basenames[@]} <= 3 )); then
  subject=$(IFS=' · '; echo "${basenames[*]}")
else
  subject="${basenames[0]} · ${basenames[1]} · ${basenames[2]} +$((count - 3))"
fi

# subject 가 비었으면 fallback
[[ -z "$subject" ]] && subject="$count files"

# 길이 제한 (subject ≤ 60)
if (( ${#subject} > 60 )); then
  subject="${subject:0:57}…"
fi

msg="${type}(${short_scope}): ${subject}"

# ── 3. 커밋 ──────────────────────────────────────────────────────────────
git commit -q -m "$msg

Auto-committed by Stop hook (scripts/auto-commit.sh).
Branch: $branch · ${count} files · +${add_lines}/-${del_lines}
" 2>&1 | tail -3 || true

exit 0

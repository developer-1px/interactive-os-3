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
#  - type   : staged diff 통계로 추론 (test/docs/chore/remove/rename/refactor/feat/fix/update)
#  - scope  : 변경 파일 path 의 공통 prefix (apps/<x> → <x>, packages/<x> → <x>, site/<dir>, scripts, docs, root)
#  - subject: 변경 파일 basename 상위 2~3개 · 확장자 제거
#
# bash 3.2 호환 (macOS 기본). mapfile/readarray 사용 ❌.

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

# ── 1. 스테이징 (settings.json 류는 의도적 커밋만) ──────────────────────
git add -A -- ':!.claude/settings.json' ':!.claude/settings.local.json' 2>/dev/null
if git diff --cached --quiet; then
  exit 0
fi

# ── 2. 메시지 추론 ───────────────────────────────────────────────────────
# 2a. 변경 파일 목록 (staged) — bash 3 호환
files=()
while IFS= read -r f; do
  [[ -n "$f" ]] && files+=("$f")
done < <(git diff --cached --name-only)
count=${#files[@]}
(( count == 0 )) && exit 0

# 2b. 추가/삭제 라인 수
stats=$(git diff --cached --shortstat 2>/dev/null)
add_lines=$(echo "$stats" | grep -oE '[0-9]+ insert' | grep -oE '[0-9]+' || true)
del_lines=$(echo "$stats" | grep -oE '[0-9]+ delet' | grep -oE '[0-9]+' || true)
add_lines=${add_lines:-0}
del_lines=${del_lines:-0}

# 2c. status code 카운트 (A/M/D/R)
status_codes=$(git diff --cached --name-status 2>/dev/null | awk '{print substr($1,1,1)}')
n_add=$(echo "$status_codes" | grep -c "^A" || true); n_add=${n_add:-0}
n_mod=$(echo "$status_codes" | grep -c "^M" || true); n_mod=${n_mod:-0}
n_del=$(echo "$status_codes" | grep -c "^D" || true); n_del=${n_del:-0}
n_ren=$(echo "$status_codes" | grep -c "^R" || true); n_ren=${n_ren:-0}

# 2d. type 추론 — 모든 파일이 같은 카테고리에 속하면 그 라벨, 아니면 휴리스틱
all_match() {
  local re="$1"
  local f
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

if (( count == 1 )); then
  scope=$(dirname "${files[0]}")
  [[ "$scope" == "." ]] && scope="root"
else
  # 가장 깊은 공통 디렉토리 — 첫 파일의 디렉토리부터 거슬러 올라가며 모든 파일이 그 prefix 인지 확인
  prefix=$(dirname "${files[0]}")
  while [[ -n "$prefix" && "$prefix" != "." && "$prefix" != "/" ]]; do
    all_in=1
    for f in "${files[@]}"; do
      case "$f" in
        "$prefix"/*|"$prefix") ;;
        *) all_in=0; break ;;
      esac
    done
    if (( all_in )); then scope="$prefix"; break; fi
    prefix=$(dirname "$prefix")
  done

  # 공통 prefix 가 없으면 top-level area 들의 union (최대 2개)
  if [[ -z "$scope" ]]; then
    areas_uniq=$(printf '%s\n' "${files[@]}" | awk -F/ 'NF>=2 {print $1} NF==1 {print "root"}' | sort -u)
    n_areas=$(echo "$areas_uniq" | grep -c .)
    if (( n_areas == 1 )); then
      scope="$areas_uniq"
    elif (( n_areas <= 2 )); then
      scope=$(echo "$areas_uniq" | paste -sd "+" -)
    else
      scope="repo"
    fi
  fi
fi

# scope 단축 — 흔한 path prefix 를 친근한 이름으로
short_scope=$(echo "$scope" \
  | sed -E 's#^apps/([^/]+).*#\1#' \
  | sed -E 's#^packages/([^/]+).*#\1#' \
  | sed -E 's#^site/src/([^/]+).*#site/\1#' \
  | sed -E 's#^site$#site#' \
  | sed -E 's#^scripts.*#scripts#' \
  | sed -E 's#^docs.*#docs#')

# 2f. subject — 변경 파일 basename 상위 2~3개 (확장자/.test 제거)
basenames=()
while IFS= read -r b; do
  [[ -n "$b" ]] && basenames+=("$b")
done < <(printf '%s\n' "${files[@]}" \
  | awk -F/ '{print $NF}' \
  | sed -E 's#\.(test|spec)\.(ts|tsx|js|jsx)$##' \
  | sed -E 's#\.(tsx?|jsx?|md|css|cjs|mjs|json|yaml|yml|sh)$##' \
  | sort -u | head -4)

n_base=${#basenames[@]}
plural() { (( $1 == 1 )) && echo "1 file" || echo "$1 files"; }

if (( n_base == 1 )); then
  subject="${basenames[0]}"
elif (( n_base == 2 )); then
  subject="${basenames[0]} · ${basenames[1]}"
elif (( n_base == 3 )); then
  subject="${basenames[0]} · ${basenames[1]} · ${basenames[2]}"
elif (( n_base >= 4 )); then
  subject="${basenames[0]} · ${basenames[1]} · ${basenames[2]} +$((count - 3))"
else
  subject="$(plural "$count")"
fi

# 길이 제한 (subject ≤ 60)
if (( ${#subject} > 60 )); then
  subject="${subject:0:57}…"
fi

msg="${type}(${short_scope}): ${subject}"

# ── 3. 커밋 ──────────────────────────────────────────────────────────────
git commit -q -m "$msg

Auto-committed by Stop hook (scripts/auto-commit.sh).
Branch: $branch · $(plural "$count") · +${add_lines}/-${del_lines}
" 2>&1 | tail -3 || true

exit 0

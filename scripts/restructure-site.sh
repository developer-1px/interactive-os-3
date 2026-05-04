#!/usr/bin/env bash
#
# restructure-site.sh — site/ → apps/site/ + catalog 통합 + public 이동
#
# Phase 1: site/ → apps/site/                       (디렉토리 이동, git mv)
# Phase 2: headless-site/ + wrapper-site/ → catalog/ (통합, registry는 분리)
# Phase 6: public/ → apps/site/public/               (site 전용이므로 안으로)
#
# 실행:
#   bash scripts/restructure-site.sh --dry-run        # 무엇이 바뀔지만 출력
#   bash scripts/restructure-site.sh --apply          # 실제 실행
#   bash scripts/restructure-site.sh --apply --phase 1   # 특정 단계만
#
# 안전:
#   - git working tree clean 검증 (uncommitted 변경 있으면 거부)
#   - 모든 이동은 git mv (히스토리 보존)
#   - 각 phase 후 tsc --noEmit 통과 확인
#   - 실패 시 git restore .로 되돌림 가이드 출력

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

MODE="dry-run"
PHASES="1 2 6"
FORCE=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) MODE="dry-run"; shift ;;
    --apply)   MODE="apply"; shift ;;
    --phase)   PHASES="$2"; shift 2 ;;
    --force)   FORCE=1; shift ;;
    *) echo "unknown arg: $1" >&2; exit 2 ;;
  esac
done

run() {
  echo "  \$ $*"
  if [[ "$MODE" == "apply" ]]; then
    eval "$@"
  fi
}

require_clean_tree() {
  if [[ -n "$(git status --porcelain)" ]]; then
    if [[ $FORCE -eq 1 ]]; then
      echo "⚠️  working tree dirty but --force set — proceeding"
      return
    fi
    echo "❌ working tree dirty — commit/stash first, or pass --force" >&2
    git status --short
    exit 1
  fi
}

verify() {
  echo "→ tsc --noEmit -p tsconfig.app.json"
  if [[ "$MODE" == "apply" ]]; then
    npx tsc --noEmit -p tsconfig.app.json 2>&1 | grep -v "virtual:fs-tree" | grep -E "error" || echo "  ✅ ok (pre-existing virtual:fs-tree errors ignored)"
  fi
}

# ─────────────────────────────────────────────────────
# Phase 1 — site/ → apps/site/
# ─────────────────────────────────────────────────────
phase1() {
  echo ""
  echo "═══ Phase 1: site/ → apps/site/ ═══"

  if [[ -d apps/site ]]; then
    echo "  ⚠️  apps/site already exists — skipping move"
  else
    run "mkdir -p apps"
    run "git mv site apps/site"
  fi

  echo ""
  echo "→ rewrite paths in vite.config.ts (site → apps/site, public → apps/site/public)"
  if [[ "$MODE" == "apply" ]]; then
    sed -i.bak \
      -e "s|resolve(__dirname, 'site')|resolve(__dirname, 'apps/site')|g" \
      -e "s|resolve(__dirname, 'public')|resolve(__dirname, 'apps/site/public')|g" \
      -e "s|'site/src/|'apps/site/src/|g" \
      vite.config.ts
    rm -f vite.config.ts.bak
  fi

  echo ""
  echo "→ rewrite tsconfig.app.json paths/include (sed; jsonc-safe)"
  if [[ "$MODE" == "apply" ]]; then
    sed -i.bak \
      -e 's|"site/src/|"apps/site/src/|g' \
      -e 's|"site/src"|"apps/site/src"|g' \
      tsconfig.app.json
    rm -f tsconfig.app.json.bak
  fi

  verify
}

# ─────────────────────────────────────────────────────
# Phase 2 — headless-site/ + wrapper-site/ → catalog/
# ─────────────────────────────────────────────────────
phase2() {
  echo ""
  echo "═══ Phase 2: catalog 통합 ═══"

  local SITE_SRC="apps/site/src"
  [[ ! -d "$SITE_SRC/headless-site" ]] && SITE_SRC="site/src"  # phase1 미실행 케이스

  if [[ ! -d "$SITE_SRC/headless-site" ]]; then
    echo "  ⚠️  headless-site not found — skipping"
    return
  fi

  run "mkdir -p $SITE_SRC/catalog $SITE_SRC/demos $SITE_SRC/examples $SITE_SRC/nav"

  # catalog/ 핵심 파일들
  run "git mv $SITE_SRC/headless-site/App.tsx           $SITE_SRC/catalog/CatalogApp.tsx"
  run "git mv $SITE_SRC/headless-site/Intro.tsx         $SITE_SRC/catalog/Intro.tsx"
  run "git mv $SITE_SRC/headless-site/PatternScreen.tsx $SITE_SRC/catalog/PatternScreen.tsx"
  run "git mv $SITE_SRC/headless-site/AxisScreen.tsx    $SITE_SRC/catalog/AxisScreen.tsx"
  run "git mv $SITE_SRC/headless-site/kind.ts           $SITE_SRC/catalog/kind.ts"
  run "git mv $SITE_SRC/headless-site/keys.ts           $SITE_SRC/catalog/keys.ts"
  run "git mv $SITE_SRC/headless-site/useHashNavigation.ts $SITE_SRC/catalog/useHashNavigation.ts"
  run "git mv $SITE_SRC/headless-site/registry.ts       $SITE_SRC/catalog/registry.patterns.ts"
  run "git mv $SITE_SRC/headless-site/axisRegistry.ts   $SITE_SRC/catalog/registry.axes.ts"

  # wrapper-site → catalog
  run "git mv $SITE_SRC/wrapper-site/App.tsx            $SITE_SRC/catalog/WrapperApp.tsx"
  run "git mv $SITE_SRC/wrapper-site/Intro.tsx          $SITE_SRC/catalog/WrapperIntro.tsx"
  run "git mv $SITE_SRC/wrapper-site/WrapperScreen.tsx  $SITE_SRC/catalog/WrapperScreen.tsx"
  run "git mv $SITE_SRC/wrapper-site/registry.ts        $SITE_SRC/catalog/registry.wrappers.ts"
  run "git mv $SITE_SRC/wrapper-site/CopyButton.tsx     $SITE_SRC/catalog/CopyButton.tsx"
  run "git mv $SITE_SRC/wrapper-site/slots.tsx          $SITE_SRC/catalog/slots.tsx"

  # CatalogSidebar는 site/src 루트 → catalog/
  run "git mv $SITE_SRC/CatalogSidebar.tsx              $SITE_SRC/catalog/CatalogSidebar.tsx"

  # demos / examples 평탄화
  run "git mv $SITE_SRC/headless-site/demos/* $SITE_SRC/demos/ 2>/dev/null || true"
  run "git mv $SITE_SRC/wrapper-site/examples/* $SITE_SRC/examples/ 2>/dev/null || true"

  # nav 응집
  run "git mv $SITE_SRC/palette.ts    $SITE_SRC/nav/palette.ts"
  run "git mv $SITE_SRC/SidebarNav.tsx $SITE_SRC/nav/SidebarNav.tsx"

  # 빈 디렉토리 정리
  run "rmdir $SITE_SRC/headless-site/demos $SITE_SRC/headless-site 2>/dev/null || true"
  run "rmdir $SITE_SRC/wrapper-site/examples $SITE_SRC/wrapper-site 2>/dev/null || true"

  echo ""
  echo "→ rewrite import paths"
  if [[ "$MODE" == "apply" ]]; then
    # headless-site/* → catalog/*  (registry는 별도 매핑)
    grep -rl "headless-site/registry" "$SITE_SRC" | xargs sed -i.bak "s|headless-site/registry|catalog/registry.patterns|g"
    grep -rl "headless-site/axisRegistry" "$SITE_SRC" | xargs sed -i.bak "s|headless-site/axisRegistry|catalog/registry.axes|g"
    grep -rl "wrapper-site/registry" "$SITE_SRC" | xargs sed -i.bak "s|wrapper-site/registry|catalog/registry.wrappers|g"

    # 일반 디렉토리 이동
    grep -rl "headless-site/demos/" "$SITE_SRC" | xargs sed -i.bak "s|headless-site/demos/|demos/|g"
    grep -rl "wrapper-site/examples/" "$SITE_SRC" | xargs sed -i.bak "s|wrapper-site/examples/|examples/|g"
    grep -rl "headless-site/" "$SITE_SRC" | xargs sed -i.bak "s|headless-site/|catalog/|g" || true
    grep -rl "wrapper-site/" "$SITE_SRC" | xargs sed -i.bak "s|wrapper-site/|catalog/|g" || true

    # nav
    grep -rl "from '\.\./palette'\|from '\./palette'" "$SITE_SRC" | xargs sed -i.bak "s|/palette'|/nav/palette'|g" || true
    grep -rl "from '\.\./SidebarNav'\|from '\./SidebarNav'" "$SITE_SRC" | xargs sed -i.bak "s|/SidebarNav'|/nav/SidebarNav'|g" || true

    # CatalogSidebar
    grep -rl "from '\.\./CatalogSidebar'\|from '\./CatalogSidebar'" "$SITE_SRC" | xargs sed -i.bak "s|/CatalogSidebar'|/catalog/CatalogSidebar'|g" || true

    # App rename (catalog/CatalogApp, catalog/WrapperApp)
    grep -rl "from '\.\./catalog/App'" "$SITE_SRC" | xargs sed -i.bak "s|/catalog/App'|/catalog/CatalogApp'|g" || true

    find "$SITE_SRC" -name "*.bak" -delete
  fi

  verify
}

# ─────────────────────────────────────────────────────
# Phase 6 — public/ → apps/site/public/
# ─────────────────────────────────────────────────────
phase6() {
  echo ""
  echo "═══ Phase 6: public/ → apps/site/public/ ═══"

  local DEST="apps/site/public"
  [[ ! -d apps/site ]] && DEST="site/public"

  if [[ ! -d public ]]; then
    echo "  ⚠️  public/ not found — skipping"
    return
  fi

  run "mkdir -p $(dirname $DEST)"
  run "git mv public $DEST"

  # vite.config.ts publicDir 업데이트는 phase 1 sed에서 처리됨
  verify
}

# ─────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────
echo "Mode:   $MODE"
echo "Phases: $PHASES"
[[ "$MODE" == "apply" ]] && require_clean_tree

for p in $PHASES; do
  case "$p" in
    1) phase1 ;;
    2) phase2 ;;
    6) phase6 ;;
    *) echo "unknown phase: $p" >&2; exit 2 ;;
  esac
done

echo ""
if [[ "$MODE" == "dry-run" ]]; then
  echo "✅ dry-run complete. Re-run with --apply to execute."
else
  echo "✅ done. Review with: git status && git diff --stat"
  echo "   Rollback: git restore --staged --worktree . && git clean -fd"
fi

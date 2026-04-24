#!/usr/bin/env bash
# scripts/pre-commit 을 .git/hooks/pre-commit 으로 심볼릭 링크.
set -e
cd "$(git rev-parse --show-toplevel)"

HOOK=.git/hooks/pre-commit
SRC=../../scripts/pre-commit

if [ -e "$HOOK" ] && [ ! -L "$HOOK" ]; then
  echo "⚠️  $HOOK 이 이미 존재하며 symlink 가 아닙니다. 백업 후 교체합니다."
  mv "$HOOK" "$HOOK.bak.$(date +%s)"
fi

rm -f "$HOOK"
ln -s "$SRC" "$HOOK"
chmod +x scripts/pre-commit

echo "✅ pre-commit hook 설치됨 → $HOOK -> $SRC"

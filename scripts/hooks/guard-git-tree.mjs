#!/usr/bin/env node
/**
 * PreToolUse guard — Bash. main working tree·HEAD·index 를 변형하는 git 명령 차단.
 *
 * 동기: 사용자는 main 에서 여러 세션을 동시에 돌린다. .git/HEAD 와 working tree 는
 * 세션 간 공유 자원이라, 한 세션의 branch 전환·tree 조작이 다른 세션을 즉시 깨뜨린다.
 * commit·push 같은 history 추가는 무해하므로 허용. tree 변형만 차단.
 *
 * 차단 (silent tree·index 교체):
 *   git checkout · switch · stash · reset --hard|--merge|--keep · restore · clean
 *   git commit -a / --all  (다른 세션 unstaged 흡수)
 *
 * 허용 (사용자 명시적 history 통합 또는 read-only):
 *   status · log · diff · show · blame · branch · tag · fetch · pull
 *   merge · rebase · cherry-pick (사용자가 명시 호출, silent 손실 없음)
 *   add <specific> · commit -m (without -a) · push · worktree
 *
 * 우회 패턴: 별도 worktree 만들어 거기서 작업
 *   git worktree add /tmp/wt-foo -b feat/foo HEAD
 */
let payload = ''
process.stdin.on('data', (c) => { payload += c })
process.stdin.on('end', () => {
  let input
  try { input = JSON.parse(payload) } catch { process.exit(0) }
  const cmd = input?.tool_input?.command ?? ''
  if (!cmd) process.exit(0)

  // git 서브커맨드 단어 경계 감지 — `git` 이 prefix 인 토큰만
  const blocked = [
    // checkout · switch 는 사용자가 명시적으로 부르는 브랜치 전환. 다른 세션을
    // 일시적으로 흔들 수 있어도 silent 데이터 손실은 없음 (uncommitted 가 있으면
    // git 자체가 거부). 차단 대상 아님.
    { re: /\bgit\s+stash\b/,    alt: 'stash 금지 — 다른 세션 unstaged 를 silent 로 들어냄. WIP commit 또는 worktree 사용.' },
    { re: /\bgit\s+reset\s+(--hard|--merge|--keep)\b/, alt: 'tree 강제 교체 금지. git reset (mixed/soft, history 만) 또는 revert 사용.' },
    { re: /\bgit\s+restore\b/,  alt: '다른 세션 unstaged 덮어쓸 위험. 정말 필요하면 사용자에게 확인 후.' },
    { re: /\bgit\s+clean\b/,    alt: '다른 세션 untracked 파일 삭제 위험. 사용자에게 확인 후.' },
    // merge·rebase 는 의도적 history 통합 — 차단 대상 아님. silent HEAD 전환
    // (checkout/switch) 과 달리 사용자가 명시적으로 부르는 명령이라, main 머지가
    // 다른 세션을 일시적으로 흔들 수는 있어도 silent 데이터 손실은 없음.
    { re: /\bgit\s+commit\b[^&|;]*\s(-a|--all)\b/, alt: 'git commit -a 금지 — 다른 세션 unstaged 흡수. git add <특정 파일> 후 git commit -m.' },
  ]

  for (const { re, alt } of blocked) {
    if (re.test(cmd)) {
      process.stderr.write(`🚫 main tree 보호: 이 명령은 다른 세션을 깨뜨릴 수 있어 차단됐다.\n명령: ${cmd}\n대안: ${alt}\n`)
      process.exit(2)
    }
  }
  process.exit(0)
})

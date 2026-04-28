/**
 * interactive states 의 selector trigger SSOT — co-located with interactive.ts.
 *
 * canvas StateShowcase 가 자동 수집해 시연 카드의 어떤 selector 가 시각 상태를
 * 켜는지 표시한다. 새 state 추가 시 fn + 이 맵에 1줄.
 */
const triggers: Record<string, string> = {
  hover:  ':hover',
  active: ':active',
  focus:  ':focus-visible',
}
export default triggers

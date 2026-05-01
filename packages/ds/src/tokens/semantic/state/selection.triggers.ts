/**
 * selection states 의 selector trigger SSOT — co-located with selection.ts.
 * (interactive.triggers.ts 와 동일 패턴)
 */
const triggers: Record<string, string> = {
  highlighted:    ':focus',
  selected:       '[aria-selected="true"]',
  selectedStrong: '[aria-current]:not([aria-current="false"])',
  disabled:       '[aria-disabled="true"]',
}
export default triggers

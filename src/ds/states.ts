import { active, controlBox, css, disabled, focus, highlighted, hover, icons, pad, selected } from './fn'

// All roving items paint directly on themselves. Container bleed is avoided
// structurally: tree uses flat aria-level layout, menu portals submenus out
// of their parent li. No wrapper elements, no CSS classes.
const rovingItem = [
  '[role="menuitem"]',
  '[role="menuitemcheckbox"]',
  '[role="menuitemradio"]',
  '[role="option"]',
  '[role="treeitem"]',
  '[role="tab"]',
  '[role="row"]',
  '[role="gridcell"]',
  '[role="toolbar"] > button',
].join(', ')

const control = [
  'button',
  '[role="button"]',
  'input',
  'select',
  'textarea',
].join(', ')

const clickable = [
  'button',
  '[role="button"]',
  rovingItem,
].join(', ')

const base = css`
  ${controlBox(`${clickable}, ${control}`)}
  :where(${clickable}) { cursor: pointer; }
  :where(input:not([type="checkbox"]):not([type="radio"])),
  :where(select),
  :where(textarea) {
    border-color: var(--ds-border);
    background: var(--ds-bg);
  }
  :where(textarea) { resize: vertical; min-height: calc(var(--ds-control-h) * 2); }
  :where(${control}):disabled { opacity: 0.4; pointer-events: none; }

  /* select: UA 화살표 제거 후 SVG chevron을 currentColor로 그린다 */
  :where(select) {
    appearance: none;
    padding-inline-end: calc(${pad(2)} + 1em);
    background-image: url("data:image/svg+xml;utf8,${encodeURIComponent(
      icons.chevronDown.replace('stroke=\'black\'', 'stroke=\'currentColor\'')
    )}");
    background-repeat: no-repeat;
    background-position: right ${pad(1.5)} center;
    background-size: 1em 1em;
  }
`

export const states = () =>
  [
    base,
    highlighted(rovingItem),
    selected(rovingItem),
    hover(rovingItem),
    active(rovingItem),
    disabled(rovingItem),
    focus(control),
    selected(control),
    hover(control),
    active(control),
    disabled(control),
  ].join('\n')

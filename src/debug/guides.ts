// 개발 전용 keyline overlay — ds 토큰으로 크기가 고정된 축만 guide 로 그린다.
// keyline 은 "container·avatar·control 의 고정 경계"이지 content-driven 경계가 아니다.
//   - width-fixed → viewport 전체 높이의 세로선 (avatar 좌우, lead slot, container 외곽·pad)
//   - height-fixed → viewport 전체 폭의 가로선 (control-h 요소의 top/bottom, avatar top/bottom)
// tolerance bucket + count 로 정렬 공유도를 굵기에 반영. preview_eval 에서 호출.

const NS = 'http://www.w3.org/2000/svg'
const OVERLAY_ID = 'ds-guides-overlay'
const TOLERANCE = 1 // px — subgrid 정렬은 정확히 같아야 의미 있다
const MIN_SIZE = 4

// height 가 --ds-control-h 또는 --ds-avatar-size 로 고정되는 요소들.
// label 같은 컨텐츠 의존 요소는 여기 없다.
const H_FIXED_SELECTOR = [
  'button', '[role="button"]',
  'input:not([type="checkbox"]):not([type="radio"])', 'select', 'textarea',
  '[role="tab"]', '[role="menuitem"]', '[role="menuitemcheckbox"]',
  '[role="menuitemradio"]', '[role="option"]', '[role="treeitem"]',
  '[role="gridcell"]',
  'article > [aria-hidden]', // feed avatar
].join(', ')

// width 가 고정된 요소 — 지금은 avatar 만 정사각형 고정.
const W_FIXED_SELECTOR = 'article > [aria-hidden]'

const DS_CONTAINER = '[role="tree"], [role="listbox"], [role="menu"], [role="feed"]'

type Hit = { at: number; count: number; tags: Set<string> }

function svgEl<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number> = {},
): SVGElementTagNameMap[K] {
  const el = document.createElementNS(NS, tag)
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v))
  return el as SVGElementTagNameMap[K]
}

function pushAt(hits: Hit[], at: number, tag: string): void {
  for (const h of hits) {
    if (Math.abs(h.at - at) < TOLERANCE) { h.count++; h.tags.add(tag); return }
  }
  hits.push({ at, count: 1, tags: new Set([tag]) })
}

function collectVertical(overlay: Element | null): Hit[] {
  const hits: Hit[] = []
  const skip = (el: Element) => overlay != null && overlay.contains(el)

  document.querySelectorAll<HTMLElement>(DS_CONTAINER).forEach((c) => {
    if (skip(c)) return
    const r = c.getBoundingClientRect()
    if (r.width < MIN_SIZE) return
    const pad = parseFloat(getComputedStyle(c).paddingLeft) || 0
    pushAt(hits, r.left, 'container')
    pushAt(hits, r.right, 'container')
    if (pad > 0) {
      pushAt(hits, r.left + pad, 'pad')
      pushAt(hits, r.right - pad, 'pad')
    }
    const firstItem = c.querySelector<HTMLElement>(
      ':scope > article, :scope > li:not([role="presentation"])',
    )
    const lead = firstItem?.firstElementChild as HTMLElement | null
    if (lead) {
      const lr = lead.getBoundingClientRect()
      if (lr.width >= MIN_SIZE) pushAt(hits, lr.right, 'lead')
    }
  })

  document.querySelectorAll<HTMLElement>(W_FIXED_SELECTOR).forEach((el) => {
    if (skip(el)) return
    const r = el.getBoundingClientRect()
    if (r.width < MIN_SIZE) return
    const tag = el.getAttribute('role') ?? el.tagName.toLowerCase()
    pushAt(hits, r.left, tag)
    pushAt(hits, r.right, tag)
  })

  return hits
}

function collectHorizontal(overlay: Element | null): Hit[] {
  const hits: Hit[] = []
  const skip = (el: Element) => overlay != null && overlay.contains(el)

  document.querySelectorAll<HTMLElement>(H_FIXED_SELECTOR).forEach((el) => {
    if (skip(el)) return
    const r = el.getBoundingClientRect()
    if (r.height < MIN_SIZE || r.width < MIN_SIZE) return
    const tag = el.getAttribute('role') ?? el.tagName.toLowerCase()
    pushAt(hits, r.top, tag)
    pushAt(hits, r.bottom, tag)
  })

  return hits
}

function weightFor(count: number): { w: number; op: number } {
  if (count >= 8) return { w: 2.5, op: 1 }
  if (count >= 5) return { w: 1.8, op: 0.9 }
  if (count >= 3) return { w: 1.2, op: 0.7 }
  if (count >= 2) return { w: 0.8, op: 0.5 }
  return { w: 0.5, op: 0.3 }
}

function makeLabel(text: string, x: number, y: number): HTMLDivElement {
  const d = document.createElement('div')
  d.textContent = text
  Object.assign(d.style, {
    position: 'absolute',
    left: `${x}px`,
    top: `${y}px`,
    background: '#e24a2c',
    color: '#fff',
    padding: '1px 4px',
    fontSize: '10px',
    fontFamily: 'ui-monospace, monospace',
    lineHeight: '1.2',
    whiteSpace: 'nowrap',
    borderRadius: '2px',
    opacity: '0.95',
    transform: 'translateY(-50%)',
  })
  return d
}

export function showGuides(): void {
  hideGuides()

  const overlay = document.createElement('div')
  overlay.id = OVERLAY_ID
  Object.assign(overlay.style, {
    position: 'fixed',
    inset: '0',
    pointerEvents: 'none',
    zIndex: '99999',
  })

  const W = window.innerWidth
  const H = window.innerHeight
  const svg = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}` })
  Object.assign(svg.style, { position: 'absolute', inset: '0' })
  overlay.append(svg)
  document.body.append(overlay)

  // overlay 가 body 에 붙은 뒤 측정해야 layout trigger 1 회로 끝난다.
  const vHits = collectVertical(overlay)
  const hHits = collectHorizontal(overlay)

  vHits.forEach((h) => {
    const { w, op } = weightFor(h.count)
    svg.append(svgEl('line', {
      x1: h.at, y1: 0, x2: h.at, y2: H,
      stroke: '#e24a2c', 'stroke-width': w, opacity: op,
    }))
    if (h.count >= 3) {
      const label = makeLabel(`${Math.round(h.at)}·${h.count}`, h.at + 2, H - 10)
      label.style.transform = 'none'
      overlay.append(label)
    }
  })

  hHits.forEach((h) => {
    const { w, op } = weightFor(h.count)
    svg.append(svgEl('line', {
      x1: 0, y1: h.at, x2: W, y2: h.at,
      stroke: '#e24a2c', 'stroke-width': w, opacity: op,
    }))
    if (h.count >= 3) {
      overlay.append(makeLabel(`${Math.round(h.at)}·${h.count}`, W - 60, h.at))
    }
  })
}

export function hideGuides(): void {
  document.getElementById(OVERLAY_ID)?.remove()
}

export function toggleGuides(): boolean {
  if (document.getElementById(OVERLAY_ID)) {
    hideGuides()
    return false
  }
  showGuides()
  return true
}

if (typeof window !== 'undefined') {
  Object.assign(window, { showGuides, hideGuides, toggleGuides })
  window.addEventListener('resize', () => {
    if (document.getElementById(OVERLAY_ID)) showGuides()
  })
}

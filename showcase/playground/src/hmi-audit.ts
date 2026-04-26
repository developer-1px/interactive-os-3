/**
 * HMI Audit — 런타임 위계 감사기.
 *
 * Gestalt 재귀 Proximity 단조 invariant: *자손은 조상보다 약하게 분리되어야 한다*.
 * 자손이 조상보다 큰 padding/gap 을 갖는 건 위계 역전 → 시각 위계가 무너진다.
 *
 * 추가 감지:
 *   - **redundant padding chain**: parent.padding > 0 && child.padding > 0 && parent의 자식이 1개뿐
 *     → 두 padding 합산 = 한쪽으로 모아도 되는 시각적 호흡 낭비.
 *   - **gap stair**: 형제 elements 가 다른 gap 으로 stack 됐을 때 (한 부모 안에 시각 리듬 깨짐).
 *
 * 동작:
 *   audit(rootEl) → Finding[] (selector path · severity · 권고)
 *   highlight(rootEl, findings) → 각 위반 element 에 outline + tooltip 부착
 *   clear(rootEl)
 */

export type Finding = {
  el: Element
  type: 'monotonic-violation' | 'redundant-padding' | 'gap-stair'
  message: string
  parentSep?: number
  childSep?: number
}

const sumPad = (cs: CSSStyleDeclaration): number =>
  parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) +
  parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight)

const blockPad = (cs: CSSStyleDeclaration): number =>
  parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom)

const gap = (cs: CSSStyleDeclaration): number => {
  const g = parseFloat(cs.rowGap || cs.gap || '0')
  return Number.isFinite(g) ? g : 0
}

/** separation strength = 자식들 사이의 *시각적 분리* 합 (gap + 본인 padding-block). */
const separation = (el: Element): number => {
  if (!(el instanceof HTMLElement)) return 0
  const cs = getComputedStyle(el)
  return blockPad(cs) + gap(cs)
}

const path = (el: Element): string => {
  const segs: string[] = []
  let cur: Element | null = el
  while (cur && cur.tagName !== 'BODY' && segs.length < 6) {
    const tag = cur.tagName.toLowerCase()
    const part = cur.getAttribute('data-part')
    const role = cur.getAttribute('role')
    segs.unshift(`${tag}${part ? `[${part}]` : ''}${role ? `{${role}}` : ''}`)
    cur = cur.parentElement
  }
  return segs.join(' > ')
}

export function audit(root: Element): Finding[] {
  const out: Finding[] = []

  const walk = (el: Element) => {
    if (!(el instanceof HTMLElement)) return
    const cs = getComputedStyle(el)
    const mySep = separation(el)
    const myPad = sumPad(cs)
    const children = Array.from(el.children) as HTMLElement[]

    // 1) 단조 위반 — 자식 padding 이 부모 분리 강도보다 강함
    for (const child of children) {
      const childPad = blockPad(getComputedStyle(child))
      if (mySep > 0 && childPad > 0 && childPad > mySep + 0.5) {
        out.push({
          el: child,
          type: 'monotonic-violation',
          message: `자식 padding ${childPad.toFixed(0)}px > 부모 분리 ${mySep.toFixed(0)}px — 위계 역전`,
          parentSep: mySep, childSep: childPad,
        })
      }
    }

    // 2) redundant padding chain — 자식이 1개고 둘 다 padding > 0
    if (children.length === 1 && myPad > 0) {
      const childPad = sumPad(getComputedStyle(children[0]))
      if (childPad > 0) {
        out.push({
          el,
          type: 'redundant-padding',
          message: `padding chain — 자기 ${myPad.toFixed(0)}px + 단일 자식 ${childPad.toFixed(0)}px = ${(myPad + childPad).toFixed(0)}px 호흡 낭비`,
        })
      }
    }

    // 3) gap stair — 형제 padding 이 서로 다름 (>2px 차이)
    if (children.length >= 3) {
      const pads = children.map((c) => blockPad(getComputedStyle(c)))
      const min = Math.min(...pads), max = Math.max(...pads)
      if (max - min > 2 && min > 0) {
        out.push({
          el,
          type: 'gap-stair',
          message: `형제 padding 불균형 — min ${min.toFixed(0)}px / max ${max.toFixed(0)}px (시각 리듬 깨짐)`,
        })
      }
    }

    children.forEach(walk)
  }

  walk(root)
  return out
}

const COLORS: Record<Finding['type'], string> = {
  'monotonic-violation': 'rgba(220, 50, 60, 0.85)',
  'redundant-padding':   'rgba(240, 160, 30, 0.85)',
  'gap-stair':           'rgba(80, 140, 220, 0.85)',
}

export function highlight(root: Element, findings: Finding[]): void {
  // 기존 흔적 제거
  root.querySelectorAll('[data-hmi-mark]').forEach((el) => el.removeAttribute('data-hmi-mark'))
  root.querySelectorAll('[data-hmi-tooltip]').forEach((el) => el.remove())

  for (const f of findings) {
    if (!(f.el instanceof HTMLElement)) continue
    f.el.setAttribute('data-hmi-mark', f.type)
    f.el.style.setProperty('outline', `2px solid ${COLORS[f.type]}`, 'important')
    f.el.style.setProperty('outline-offset', '-2px', 'important')
    f.el.title = `[${f.type}] ${f.message}\n@ ${path(f.el)}`
  }
}

export function clear(root: Element): void {
  root.querySelectorAll('[data-hmi-mark]').forEach((el) => {
    if (el instanceof HTMLElement) {
      el.style.removeProperty('outline')
      el.style.removeProperty('outline-offset')
      el.removeAttribute('title')
      el.removeAttribute('data-hmi-mark')
    }
  })
}

/** iframe 안 audit + highlight 한 번에. */
export function auditIframe(iframe: HTMLIFrameElement): Finding[] {
  const doc = iframe.contentDocument
  if (!doc?.body) return []
  const findings = audit(doc.body)
  highlight(doc.body, findings)
  return findings
}

/** 페이지의 모든 wireframe iframe 감사 + 결과 카운트 반환. */
export function auditAll(): { total: number; byType: Record<Finding['type'], number> } {
  const iframes = Array.from(document.querySelectorAll('[data-part="phone-screen"] iframe')) as HTMLIFrameElement[]
  const all: Finding[] = []
  for (const f of iframes) all.push(...auditIframe(f))
  const byType = { 'monotonic-violation': 0, 'redundant-padding': 0, 'gap-stair': 0 } as Record<Finding['type'], number>
  for (const f of all) byType[f.type]++
  return { total: all.length, byType }
}

export function clearAll(): void {
  const iframes = Array.from(document.querySelectorAll('[data-part="phone-screen"] iframe')) as HTMLIFrameElement[]
  for (const f of iframes) {
    if (f.contentDocument?.body) clear(f.contentDocument.body)
  }
}

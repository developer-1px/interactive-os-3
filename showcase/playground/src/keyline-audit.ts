/**
 * keyline-audit — /wireframes 카탈로그의 visual keyline 자동 측정.
 *
 * 동기: 모바일은 정해진 grid keyline (outer 16px · 4col gutter 16px · list 56px row ·
 * feed full-bleed · content 24px) 을 따른다. screens/*.tsx 21 chapter 가 이 keyline 을
 * 일관되게 지키는지 정적 grep 으론 잡을 수 없다 — 디자인 얹은 뒤 실제 픽셀 거리로
 * 검증해야 한다. 이 모듈이 그 측정 책임을 진다.
 *
 * SSoT: `mobileGrid` (packages/ds/src/tokens/foundations/spacing/keyline.ts) — overlay
 * CSS 와 동일한 값을 읽으므로 "보이는 가이드" = "통과 기준". 별도 수치 선언 0.
 *
 * 측정 대상 (V1):
 *  1. phone-body 의 effective outer padding (computed style) vs grid.outerMarginPx
 *  2. screen 의 첫 children 의 좌·우 edge 가 phone-body 안쪽 outer line 에 정렬되는지
 *  3. ScreenDef.auditAnchors 로 추가 지정된 selector 의 좌·우 edge
 *
 * 같은 document 와 iframe (desktop · same-origin) 모두 지원.
 */
import { mobileGrid, type MobileGuideName } from '@p/ds/tokens/foundations/spacing/keyline'

export type ViolationLevel = 'ok' | 'warn' | 'fail'
export type ViolationAxis =
  | 'padLeft' | 'padRight'
  | 'anchorLeft' | 'anchorRight'

export type Violation = {
  screenId: string
  guide: MobileGuideName
  axis: ViolationAxis
  selector?: string
  expectedPx: number
  actualPx: number
  deltaPx: number
}

export type AuditResult = {
  screenId: string
  guide: MobileGuideName | null
  level: ViolationLevel
  violations: Violation[]
  /** phone-body 를 못 찾았거나 guide 미지정 — 측정 자체가 불가능 */
  unmeasured?: string
}

const TOLERANCE_OK_PX = 0.5
const TOLERANCE_WARN_PX = 2

function levelOf(deltaPx: number): ViolationLevel {
  const abs = Math.abs(deltaPx)
  if (abs <= TOLERANCE_OK_PX) return 'ok'
  if (abs <= TOLERANCE_WARN_PX) return 'warn'
  return 'fail'
}

function findPhoneBody(screenEl: HTMLElement): HTMLElement | null {
  // (1) mobile bare — same document
  const direct = screenEl.querySelector<HTMLElement>('[data-part="phone-body"]')
  if (direct) return direct
  // (2) desktop — iframe (same-origin 으로 contentDocument 접근 가능)
  const iframe = screenEl.querySelector<HTMLIFrameElement>('[data-part="phone"] iframe')
  if (iframe) {
    try {
      return iframe.contentDocument?.querySelector<HTMLElement>('[data-part="phone-body"]') ?? null
    } catch { /* cross-origin */ }
  }
  return null
}

function px(v: string): number { return parseFloat(v) || 0 }

/**
 * --ds-space 의 컴퓨티드 px 값을 추출 (iframe 별로 다를 수 있음 — viewer zoom).
 * `getPropertyValue` 가 `calc(4px * 1.5)` 같은 expression 을 그대로 반환하므로,
 * dummy element 에 `width: var(--ds-space)` 를 주고 getBoundingClientRect 로 환산.
 */
function readDsSpace(view: Window, doc: Document): number {
  const probe = doc.createElement('div')
  probe.style.cssText = 'position:absolute;visibility:hidden;width:var(--ds-space);height:0;'
  doc.body.appendChild(probe)
  const w = probe.getBoundingClientRect().width
  probe.remove()
  return w || 4
}

export function auditScreen(screenEl: HTMLElement, auditAnchors?: readonly string[]): AuditResult {
  const screenId = screenEl.dataset.screen ?? '(unknown)'
  const guideRaw = screenEl.dataset.screenGuide as MobileGuideName | undefined
  const guide = guideRaw && (guideRaw in mobileGrid) ? guideRaw : null

  if (!guide) {
    return { screenId, guide: null, level: 'ok', violations: [], unmeasured: 'no data-screen-guide' }
  }

  const body = findPhoneBody(screenEl)
  if (!body) {
    return { screenId, guide, level: 'ok', violations: [], unmeasured: 'phone-body not found' }
  }

  const view = body.ownerDocument.defaultView
  if (!view) {
    return { screenId, guide, level: 'ok', violations: [], unmeasured: 'no defaultView' }
  }

  const spec = mobileGrid[guide]
  const dsSpacePx = readDsSpace(view, body.ownerDocument)
  const expected = spec.outerMarginSteps * dsSpacePx
  const cs = view.getComputedStyle(body)
  const violations: Violation[] = []

  // (1) phone-body 의 effective outer padding
  const padL = px(cs.paddingLeft)
  const padR = px(cs.paddingRight)
  if (Math.abs(padL - expected) > TOLERANCE_OK_PX) {
    violations.push({ screenId, guide, axis: 'padLeft', expectedPx: expected, actualPx: padL, deltaPx: padL - expected })
  }
  if (Math.abs(padR - expected) > TOLERANCE_OK_PX) {
    violations.push({ screenId, guide, axis: 'padRight', expectedPx: expected, actualPx: padR, deltaPx: padR - expected })
  }

  // (2) auditAnchors — 추가 지정 selector 의 좌·우 edge 가 phone-body 안쪽 outer line 과 정렬
  if (auditAnchors && auditAnchors.length > 0) {
    const bodyRect = body.getBoundingClientRect()
    const innerLeft = bodyRect.left + expected
    const innerRight = bodyRect.right - expected
    for (const sel of auditAnchors) {
      const el = body.querySelector<HTMLElement>(sel)
      if (!el) continue
      const r = el.getBoundingClientRect()
      const dl = r.left - innerLeft
      const dr = r.right - innerRight
      if (Math.abs(dl) > TOLERANCE_OK_PX) {
        violations.push({ screenId, guide, axis: 'anchorLeft', selector: sel, expectedPx: innerLeft, actualPx: r.left, deltaPx: dl })
      }
      if (Math.abs(dr) > TOLERANCE_OK_PX) {
        violations.push({ screenId, guide, axis: 'anchorRight', selector: sel, expectedPx: innerRight, actualPx: r.right, deltaPx: dr })
      }
    }
  }

  const worst = violations.reduce<ViolationLevel>(
    (acc, v) => {
      const l = levelOf(v.deltaPx)
      if (l === 'fail') return 'fail'
      if (l === 'warn' && acc === 'ok') return 'warn'
      return acc
    },
    'ok',
  )

  return { screenId, guide, level: worst, violations }
}

export function auditAllScreens(
  root: ParentNode,
  anchorsById?: Record<string, readonly string[] | undefined>,
): AuditResult[] {
  const results: AuditResult[] = []
  root.querySelectorAll<HTMLElement>('[data-screen][data-screen-guide]').forEach((el) => {
    const id = el.dataset.screen!
    results.push(auditScreen(el, anchorsById?.[id]))
  })
  return results
}

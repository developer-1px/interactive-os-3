/**
 * audit-keyline — Sibling Keyline Invariant 런타임 검사기.
 *
 * 같은 부모 안 visible block sibling 의 left/right edge 가 일관한지 본다.
 * cascade resolve 결과를 봐야 하므로 정적 selector 분석으로는 잡지 못한 결함
 * (광범위 selector cross-layer override · flex item content sizing 차이) 을
 * 런타임 BoundingClientRect 비교로 잡는다.
 *
 * 두 모드:
 *   (a) 브라우저 inject — preview_eval 또는 dev console 에서 호출
 *         auditKeyline(document.body)
 *   (b) node CLI — puppeteer-core 로 dev server 페이지 띄워 자동 측정
 *         node scripts/audit-keyline.mjs http://localhost:5173/finder/$
 *
 * 핵심 invariant:
 *   ∀ parent P, ∀ visible block siblings A, B ∈ children(P):
 *     |A.left  - B.left|  ≤ tolerance  AND
 *     |A.right - B.right| ≤ tolerance
 *
 * skip 어트리뷰트:
 *   data-keyline-skip 가 있는 element 는 sibling pair 검사 제외
 *   (예: floating overlay, sticky toolbar 등 의도적 어긋남)
 */

export function auditKeyline(root, opts = {}) {
  const tolerance = opts.tolerance ?? 1
  const minSize = opts.minSize ?? 60
  const violations = []

  const visit = (node) => {
    const visibleKids = [...node.children].filter((c) => {
      if (c.hasAttribute('data-keyline-skip')) return false
      const cs = getComputedStyle(c)
      if (cs.display === 'none' || cs.visibility === 'hidden') return false
      if (cs.display.startsWith('inline')) return false
      if (cs.position === 'absolute' || cs.position === 'fixed') return false
      const b = c.getBoundingClientRect()
      if (b.width < minSize || b.height < minSize) return false
      return true
    })
    if (visibleKids.length >= 2) {
      const rects = visibleKids.map((c) => c.getBoundingClientRect())
      // vertical stack 만 검사 — row layout (table-cell, flex-row 등) 은 keyline invariant 무관
      const tops = rects.map((r) => r.top)
      const isVerticalStack = tops.every((t, i) => i === 0 || t > tops[i - 1] + 1)
      if (!isVerticalStack) {
        for (const child of node.children) visit(child)
        return
      }
      const lefts = rects.map((r) => r.left)
      const rights = rects.map((r) => r.right)
      const leftDelta = Math.max(...lefts) - Math.min(...lefts)
      const rightDelta = Math.max(...rights) - Math.min(...rights)
      if (leftDelta > tolerance || rightDelta > tolerance) {
        violations.push({
          parent: describe(node),
          leftDelta: +leftDelta.toFixed(1),
          rightDelta: +rightDelta.toFixed(1),
          maxDelta: +Math.max(leftDelta, rightDelta).toFixed(1),
          siblings: visibleKids.map((c, i) => ({
            sel: describe(c),
            left: +rects[i].left.toFixed(0),
            right: +rects[i].right.toFixed(0),
            w: +rects[i].width.toFixed(0),
          })),
        })
      }
    }
    for (const child of node.children) visit(child)
  }

  visit(root)
  return violations.sort((a, b) => b.maxDelta - a.maxDelta)
}

function describe(el) {
  const tag = el.tagName.toLowerCase()
  const a = []
  for (const name of ['data-part', 'data-flow', 'role', 'aria-label']) {
    const v = el.getAttribute(name)
    if (v) a.push(`[${name}="${v.slice(0, 30)}"]`)
  }
  if (el.id) a.push(`#${el.id}`)
  return tag + a.join('')
}

export function formatReport(violations, max = 10) {
  if (violations.length === 0) return '✅ Keyline 위반 없음.\n'
  const lines = [`🔴 Keyline 위반 ${violations.length}건 (top ${Math.min(max, violations.length)}):\n`]
  for (const v of violations.slice(0, max)) {
    lines.push(
      `  Δ ${v.maxDelta}px (left ${v.leftDelta} / right ${v.rightDelta}) — parent ${v.parent}`,
    )
    for (const s of v.siblings) {
      lines.push(`    └─ ${s.sel.padEnd(50)}  L=${s.left}  R=${s.right}  W=${s.w}`)
    }
  }
  if (violations.length > max) lines.push(`  ... 외 ${violations.length - max}건`)
  return lines.join('\n') + '\n'
}

// ── node CLI 모드 ──────────────────────────────────────────────────────
if (import.meta.url === `file://${process.argv[1]}`) {
  const url = process.argv[2] || 'http://localhost:5173/'
  const { default: puppeteer } = await import('puppeteer-core')
  const chromePath = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  const browser = await puppeteer.launch({ executablePath: chromePath, headless: 'new' })
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 1400 })
  await page.goto(url, { waitUntil: 'networkidle2' })
  const violations = await page.evaluate((src) => {
    // re-define inside page context
    const fn = new Function('opts', src + '\nreturn auditKeyline(document.body, opts)')
    return fn({ tolerance: 1, minSize: 60 })
  }, await import('node:fs').then((fs) => fs.readFileSync(new URL(import.meta.url), 'utf8')))
  console.log(formatReport(violations))
  await browser.close()
  process.exit(violations.length > 0 ? 1 : 0)
}

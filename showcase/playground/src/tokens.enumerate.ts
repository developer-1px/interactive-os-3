/**
 * tokens.enumerate — `:root` 의 모든 `--ds-*` CSS variable 을 enumerate.
 *
 * SSOT 수집 경로 2가지:
 *   1) `document.documentElement.style` — :root 에 inline 으로 발행된 custom property
 *   2) 모든 stylesheet 의 `:root` / `html` rule — preset(`<style id="ds-preset">`) 가
 *      가장 흔한 경로
 *
 * 수동 매핑 ❌, getComputedStyle SSOT ⭕. /tokens 페이지의 collector 본질.
 */

export type TokenEntry = { name: string; value: string }

export function enumerateRootVars(): TokenEntry[] {
  if (typeof window === 'undefined') return []
  const seen = new Set<string>()
  const out: TokenEntry[] = []
  const cs = getComputedStyle(document.documentElement)

  const collect = (name: string) => {
    if (!name.startsWith('--ds-') || seen.has(name)) return
    seen.add(name)
    out.push({ name, value: cs.getPropertyValue(name).trim() })
  }

  // 1) :root 에 inline 으로 발행된 custom property
  const rootStyle = document.documentElement.style
  for (let i = 0; i < rootStyle.length; i++) collect(rootStyle.item(i))

  // 2) 모든 stylesheet 의 :root / html rule
  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList | null = null
    try { rules = sheet.cssRules } catch { continue }
    const walk = (rs: CSSRuleList) => {
      for (const r of Array.from(rs)) {
        if (r instanceof CSSStyleRule && (r.selectorText === ':root' || r.selectorText === 'html')) {
          for (let i = 0; i < r.style.length; i++) collect(r.style.item(i))
        } else if ('cssRules' in r && (r as CSSGroupingRule).cssRules) {
          walk((r as CSSGroupingRule).cssRules)
        }
      }
    }
    if (rules) walk(rules)
  }

  return out.sort((a, b) => a.name.localeCompare(b.name))
}

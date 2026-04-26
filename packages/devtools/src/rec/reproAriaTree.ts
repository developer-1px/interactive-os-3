/**
 * ARIA tree serialization + diff for reproduction recordings.
 * Playwright YAML-like format for LLM readability.
 */

const CONTAINER_ROLES = new Set([
  'listbox', 'tree', 'treegrid', 'grid', 'table', 'tablist', 'menu',
  'menubar', 'toolbar', 'radiogroup', 'group', 'dialog', 'alertdialog',
  'navigation', 'main', 'region', 'application',
])

const ARIA_STATE_ATTRS = [
  'aria-selected', 'aria-expanded', 'aria-checked', 'aria-disabled',
  'aria-pressed', 'aria-level', 'aria-activedescendant', 'aria-current',
  'aria-invalid', 'aria-required', 'aria-valuemin', 'aria-valuemax',
  'aria-valuenow', 'aria-valuetext',
] as const

const IMPLICIT_ROLES: Record<string, string> = {
  button: 'button', a: 'link', input: 'textbox', select: 'combobox',
  textarea: 'textbox', nav: 'navigation', main: 'main', header: 'banner',
  footer: 'contentinfo', aside: 'complementary', ul: 'list', ol: 'list',
  li: 'listitem', table: 'table', tr: 'row', td: 'cell', th: 'columnheader',
  h1: 'heading', h2: 'heading', h3: 'heading', h4: 'heading',
  h5: 'heading', h6: 'heading', dialog: 'dialog',
}

function implicitRole(el: Element): string | null {
  return IMPLICIT_ROLES[el.tagName.toLowerCase()] ?? null
}

function serializeAriaNode(el: Element, depth: number, activeEl: Element | null): string {
  const indent = '  '.repeat(depth)
  const role = el.getAttribute('role') || implicitRole(el)
  if (!role) return ''

  const name = el.getAttribute('aria-label')
    || el.getAttribute('aria-labelledby')
    || (el.children.length === 0 ? el.textContent?.trim().slice(0, 50) : null)
    || ''

  const attrs: string[] = []
  for (const attr of ARIA_STATE_ATTRS) {
    const val = el.getAttribute(attr)
    if (val !== null) {
      const shortName = attr.replace('aria-', '')
      attrs.push(val === 'true' ? shortName : `${shortName}=${val}`)
    }
  }

  const isActive = el === activeEl
  if (isActive) attrs.push('◀ focus')

  const attrStr = attrs.length > 0 ? ` [${attrs.join(', ')}]` : ''
  const nameStr = name ? ` "${name}"` : ''
  const line = `${indent}- ${role}${nameStr}${attrStr}`

  const childLines: string[] = []
  for (const child of el.children) {
    const childRole = child.getAttribute('role') || implicitRole(child)
    if (childRole) {
      const serialized = serializeAriaNode(child, depth + 1, activeEl)
      if (serialized) childLines.push(serialized)
    } else {
      for (const grandchild of child.children) {
        const serialized = serializeAriaNode(grandchild, depth + 1, activeEl)
        if (serialized) childLines.push(serialized)
      }
    }
  }

  return childLines.length > 0 ? `${line}\n${childLines.join('\n')}` : line
}

/** Find the nearest ancestor with a meaningful ARIA role container. */
export function findRoleContainer(el: Element | null): Element | null {
  let current = el
  while (current && current !== document.body) {
    const role = current.getAttribute('role')
    if (role && CONTAINER_ROLES.has(role)) return current
    current = current.parentElement
  }
  return null
}

/** Serialize an ARIA subtree rooted at `container` into YAML-like text. */
export function serializeAriaTree(container: Element, activeEl: Element | null): string {
  return serializeAriaNode(container, 0, activeEl)
}

/** Diff two serialized ARIA trees, returning added/removed lines. */
export function diffAriaTree(prev: string, current: string): string {
  if (prev === current) return '(no changes)'

  const prevLines = prev.split('\n')
  const currentLines = current.split('\n')
  const prevSet = new Set(prevLines)
  const currentSet = new Set(currentLines)

  const removed = prevLines.filter(l => !currentSet.has(l))
  const added = currentLines.filter(l => !prevSet.has(l))

  if (removed.length === 0 && added.length === 0) return '(no changes)'

  const parts: string[] = []
  for (const line of removed) parts.push(`- ${line.trimStart()}`)
  for (const line of added) parts.push(`+ ${line.trimStart()}`)
  parts.push(`(${added.length} added, ${removed.length} removed, ${currentLines.length - added.length} unchanged)`)
  return parts.join('\n')
}

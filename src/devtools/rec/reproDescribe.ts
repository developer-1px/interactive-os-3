/** Reproduction Recorder — DOM/React 요소 인식 helper. */
import type { ComponentInfo } from './reproTypes'

export function getComponentInfo(el: Element | null): ComponentInfo {
  if (!el || !(el instanceof HTMLElement)) return { stack: [], source: null }

  let source: string | null = null
  let current: HTMLElement | null = el
  while (current && current !== document.body) {
    const attr = current.getAttribute('data-inspector-line')
    if (attr) {
      source = attr
      break
    }
    current = current.parentElement
  }

  const stack: string[] = []
  let fiberKey: string | undefined
  for (const k in el) {
    if (k.startsWith('__reactFiber$')) {
      fiberKey = k
      break
    }
  }
  if (fiberKey) {
    // @ts-expect-error accessing internal React fiber
    let fiber = el[fiberKey]
    while (fiber) {
      const type = fiber.type
      let name = ''
      if (typeof type === 'function') {
        name = type.displayName || type.name || ''
      } else if (type && typeof type === 'object' && type.$$typeof) {
        const wrappedType = type.type || type.render
        if (wrappedType) name = wrappedType.displayName || wrappedType.name || ''
      }
      if (name && name !== 'Anonymous' && !stack.includes(name)) {
        stack.unshift(name)
      }
      fiber = fiber.return
    }
  }

  return { stack, source }
}

export function describeTarget(el: Element | null): string {
  if (!el) return 'null'
  const tag = el.tagName.toLowerCase()
  const id = el.id ? `#${el.id}` : ''
  const roleAttr = el.getAttribute('role')
  const role = roleAttr ? `[role="${roleAttr}"]` : ''
  const nodeId = el.closest('[data-node-id]')?.getAttribute('data-node-id')
  const nodeIdStr = nodeId ? `[node="${nodeId}"]` : ''
  const text = el.textContent?.trim().slice(0, 30)
  const textStr = text ? ` "${text}"` : ''
  return `${tag}${id}${role}${nodeIdStr}${textStr}`.slice(0, 150)
}

export function describeFocus(el: Element | null): string {
  if (!el || el === document.body) return 'body'
  return describeTarget(el)
}

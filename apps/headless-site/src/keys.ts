/**
 * SSoT keyboard-key derivation.
 *
 * Each axis (navigate / activate / expand / typeahead / numericStep /
 * treeNavigate / treeExpand) is probed with synthetic key triggers — the keys
 * it responds to (returns non-empty event list) become its key set.
 *
 * Pattern → axes mapping mirrors the actual `composeAxes(...)` call in each
 * pattern source. If a pattern adds a new axis, update its entry here.
 */
import {
  ROOT,
  activate,
  expand,
  navigate,
  numericStep,
  treeExpand,
  treeNavigate,
  type Axis,
  type NormalizedData,
} from '@p/headless'

const PROBE_KEYS = [
  'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
  'Home', 'End', 'PageUp', 'PageDown',
  'Enter', ' ', 'Escape',
]

const dummy: NormalizedData = {
  entities: {
    [ROOT]: { id: ROOT },
    a: { id: 'a', data: { label: 'a', value: 50, min: 0, max: 100, step: 5 } },
    b: { id: 'b', data: { label: 'b' } },
    c: { id: 'c', data: { label: 'c', children: ['d'] } },
    d: { id: 'd', data: { label: 'd' } },
  },
  relationships: { [ROOT]: ['a', 'b', 'c'], c: ['d'] },
}

function probe(axis: Axis): string[] {
  const out: string[] = []
  for (const key of PROBE_KEYS) {
    try {
      const r = axis(dummy, 'a', { kind: 'key', key })
      if (Array.isArray(r) && r.length > 0) out.push(key)
    } catch {
      /* axis threw — treat as no-response */
    }
  }
  return out
}

const KEY_GLYPH: Record<string, string> = {
  ' ': 'Space',
  ArrowUp: '↑',
  ArrowDown: '↓',
  ArrowLeft: '←',
  ArrowRight: '→',
  Escape: 'Esc',
}

export const fmtKey = (k: string) => KEY_GLYPH[k] ?? k

const dedupe = (xs: string[]) => Array.from(new Set(xs))

/**
 * Pattern title → keys it responds to.
 * Mirrors `composeAxes(...)` calls in each pattern source.
 */
export const PATTERN_KEYS: Record<string, () => string[]> = {
  // Collection — axis-driven
  Tabs: () => dedupe([...probe(navigate('horizontal')), ...probe(activate), 'A–Z']),
  Listbox: () => dedupe([...probe(navigate('vertical')), ...probe(activate), 'A–Z']),
  Tree: () => dedupe([...probe(treeNavigate), ...probe(treeExpand), ...probe(activate), 'A–Z']),
  'Radio Group': () => dedupe([
    ...probe(navigate('vertical')),
    ...probe(navigate('horizontal')),
    ...probe(activate),
  ]),
  Toolbar: () => dedupe(probe(navigate('horizontal'))),
  Menu: () => dedupe([...probe(navigate('vertical')), ...probe(activate), 'A–Z']),
  Menubar: () => dedupe(probe(navigate('horizontal'))),
  Combobox: () => dedupe([...probe(navigate('vertical')), ...probe(activate), 'Escape']),
  'Tree Grid': () => dedupe([...probe(treeNavigate), ...probe(treeExpand), ...probe(activate)]),
  Accordion: () => dedupe([...probe(navigate('vertical')), ...probe(expand), ...probe(activate)]),
  Slider: () => dedupe(probe(numericStep('horizontal'))),
  Splitter: () => dedupe(probe(numericStep('vertical'))),
  'Navigation List': () => [],

  // Pure / Ref — keys live in the pattern body, not a composable axis
  Disclosure: () => ['Enter', ' '],
  Switch: () => ['Enter', ' '],
  Tooltip: () => ['Escape'],
  Dialog: () => ['Escape'],
  'Alert Dialog': () => ['Escape'],
  Alert: () => [],
}

export function keysFor(title: string): string[] {
  const fn = PATTERN_KEYS[title]
  return fn ? fn() : []
}

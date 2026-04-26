/**
 * Text formatter for reproduction recordings.
 * Produces LLM-readable output from a timeline of events.
 */

interface ReproMeta {
  url: string
  startedAt: string
  duration: number
  eventCount: number
}

interface InputEntry {
  seq: number
  time: string
  ch: 'input'
  type: 'keydown' | 'click' | 'focus'
  key?: string
  target: string
  source: string | null
  focus: string
  prevented: boolean
  ariaTree: string
}

interface RouteEntry {
  seq: number
  time: string
  ch: 'route'
  from: string
  to: string
  method: 'pushState' | 'replaceState' | 'popstate'
}

interface ConsoleEntry {
  seq: number
  time: string
  ch: 'console'
  level: 'error' | 'warn'
  message: string
}

type ReproEvent = InputEntry | RouteEntry | ConsoleEntry

const INPUT_ICONS: Record<string, string> = {
  keydown: '⌨', click: '🖱', focus: '⏎',
}

export function formatTimelineAsText(meta: ReproMeta, timeline: ReproEvent[]): string {
  const lines: string[] = []
  lines.push(`# Reproduction — ${meta.url}`)
  lines.push(`# ${meta.startedAt} · ${(meta.duration / 1000).toFixed(1)}s · ${meta.eventCount} events`)
  lines.push('')

  let lastSource = ''

  let i = 0
  while (i < timeline.length) {
    const ev = timeline[i]

    if (ev.ch === 'input') {
      const icon = INPUT_ICONS[ev.type] ?? '?'
      const keyStr = ev.key ? ` ${ev.key}` : ''
      const srcChanged = ev.source !== null && ev.source !== lastSource
      const srcStr = srcChanged ? `  ← ${ev.source}` : ''
      if (ev.source) lastSource = ev.source

      let j = i + 1
      const trailingLines: string[] = []
      while (j < timeline.length && timeline[j].ch !== 'input') {
        const trailing = timeline[j]
        if (trailing.ch === 'route') {
          trailingLines.push(`  📁 ${trailing.method}: ${trailing.from} → ${trailing.to}`)
        } else if (trailing.ch === 'console') {
          const prefix = trailing.level === 'error' ? '✗' : '⚠'
          trailingLines.push(`  ${prefix} ${trailing.message}`)
        }
        j++
      }

      const noChanges = ev.ariaTree === '(no changes)' && trailingLines.length === 0
      if (noChanges) {
        lines.push(`[${ev.seq}] ${ev.time} ${icon}${keyStr} → ${ev.target} (no changes)`)
      } else {
        lines.push(`[${ev.seq}] ${ev.time} ${icon}${keyStr} → ${ev.target}${srcStr}`)
        const focusDiffers = ev.focus !== ev.target
        const focusStr = focusDiffers ? `focus: ${ev.focus}` : ''
        const preventedStr = ev.prevented ? 'prevented' : ''
        const metaLine = [focusStr, preventedStr].filter(Boolean).join(' | ')
        if (metaLine) lines.push(metaLine)
        for (const treeLine of ev.ariaTree.split('\n')) {
          lines.push(`  ${treeLine}`)
        }
        for (const tl of trailingLines) lines.push(tl)
      }

      lines.push('')
      i = j
    } else {
      if (ev.ch === 'route') {
        lines.push(`[${ev.seq}] ${ev.time} 📁 ${ev.method}: ${ev.from} → ${ev.to}`)
      } else if (ev.ch === 'console') {
        const prefix = ev.level === 'error' ? '✗' : '⚠'
        lines.push(`[${ev.seq}] ${ev.time} ${prefix} ${ev.message}`)
      }
      lines.push('')
      i++
    }
  }

  return lines.join('\n')
}

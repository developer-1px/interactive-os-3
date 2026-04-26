/* eslint-disable no-restricted-syntax -- devtools overlay: in-page DEV-only spacing inspector */
import { useEffect, useRef, useState } from 'react'

/**
 * SpacingOverlay — Figma redline 식 in-page spacing inspector.
 *
 * 사용:
 *   1. 우측 상단 ▣ 버튼 클릭 또는 Alt+S 단축키로 활성
 *   2. crosshair 모드 — 화면의 어떤 element 든 click 으로 선택
 *   3. 선택된 element 의 padding · margin · size · 직계 자식 gap 을
 *      빨간/초록 박스 + 라벨로 시각화
 *   4. ESC 또는 토글 재클릭으로 종료
 *
 * 측정:
 *   element.getBoundingClientRect() + getComputedStyle()
 *   부모-자식, 형제 사이의 실제 gap 은 두 rect 의 좌표 차이로 산출
 *
 * 의도:
 *   keyline-loop / hmi-loop 측정기의 시각 보조 — 사용자가 "여기 어긋남"
 *   이라 표시한 결함을 즉시 측정값과 함께 in-page 에서 재확인.
 */

interface MeasureResult {
  rect: DOMRect
  padding: { top: number; right: number; bottom: number; left: number }
  margin: { top: number; right: number; bottom: number; left: number }
  childGaps: Array<{ axis: 'block' | 'inline'; size: number; from: DOMRect; to: DOMRect }>
  size: { w: number; h: number }
}

function measure(el: HTMLElement): MeasureResult {
  const rect = el.getBoundingClientRect()
  const cs = getComputedStyle(el)
  const px = (v: string) => parseFloat(v) || 0
  const padding = {
    top: px(cs.paddingTop), right: px(cs.paddingRight),
    bottom: px(cs.paddingBottom), left: px(cs.paddingLeft),
  }
  const margin = {
    top: px(cs.marginTop), right: px(cs.marginRight),
    bottom: px(cs.marginBottom), left: px(cs.marginLeft),
  }
  // 직계 자식 사이 gap — 인접 child 의 rect 좌표 차이로 측정
  const kids = [...el.children].filter((c): c is HTMLElement => {
    if (!(c instanceof HTMLElement)) return false
    const r = c.getBoundingClientRect()
    return r.width > 0 && r.height > 0
  })
  const childGaps: MeasureResult['childGaps'] = []
  for (let i = 1; i < kids.length; i++) {
    const a = kids[i - 1].getBoundingClientRect()
    const b = kids[i].getBoundingClientRect()
    if (b.top >= a.bottom - 1) {
      childGaps.push({ axis: 'block', size: b.top - a.bottom, from: a, to: b })
    } else if (b.left >= a.right - 1) {
      childGaps.push({ axis: 'inline', size: b.left - a.right, from: a, to: b })
    }
  }
  return { rect, padding, margin, childGaps, size: { w: rect.width, h: rect.height } }
}

const styles = {
  toggle: {
    position: 'fixed' as const,
    top: 8, right: 56, zIndex: 99999,
    display: 'flex', alignItems: 'center' as const, gap: 4,
    padding: '4px 12px',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 6,
    fontSize: 11, fontWeight: 600,
    fontFamily: 'var(--font-sans, system-ui, sans-serif)',
    cursor: 'pointer',
    background: 'rgba(30,30,30,0.85)',
    color: 'rgba(255,255,255,0.7)',
    backdropFilter: 'blur(8px)',
  },
  toggleActive: {
    background: '#10b981', color: '#fff', borderColor: '#10b981',
  },
  overlay: {
    position: 'fixed' as const,
    inset: 0, zIndex: 99998,
    pointerEvents: 'none' as const,
  },
  crosshairCursor: {
    position: 'fixed' as const,
    inset: 0, zIndex: 99997,
    cursor: 'crosshair',
    pointerEvents: 'auto' as const,
  },
} as const

const COLOR = {
  padding: 'rgba(239, 68, 68, 0.22)',     // red-500 @22%
  paddingLine: '#ef4444',
  margin: 'rgba(251, 146, 60, 0.18)',     // orange-400 @18%
  size: 'rgba(16, 185, 129, 0.18)',       // emerald-500 @18%
  sizeLine: '#10b981',
  gap: 'rgba(239, 68, 68, 0.30)',
  label: '#dc2626',
  labelGap: '#16a34a',
}

export function SpacingOverlay() {
  const [active, setActive] = useState(false)
  const [picking, setPicking] = useState(false)
  const [target, setTarget] = useState<HTMLElement | null>(null)
  const [, force] = useState(0)
  const measureRef = useRef<MeasureResult | null>(null)

  // window resize / scroll 시 재측정
  useEffect(() => {
    if (!target) return
    const update = () => { measureRef.current = measure(target); force((n) => n + 1) }
    update()
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [target])

  // 단축키 — Alt+S 토글, ESC 종료
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 's') { setActive((a) => !a); e.preventDefault() }
      if (e.key === 'Escape') { setActive(false); setPicking(false); setTarget(null) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // pick 모드 활성화 시 click 으로 target 선택
  useEffect(() => {
    if (!picking) return
    const onClick = (e: MouseEvent) => {
      e.preventDefault(); e.stopPropagation()
      // 자기 자신(crosshair layer)은 hit 하지 않도록 elementsFromPoint
      const els = document.elementsFromPoint(e.clientX, e.clientY)
      const el = els.find((x) => x instanceof HTMLElement && !x.closest('[data-spacing-overlay]')) as HTMLElement | undefined
      if (el) {
        setTarget(el)
        setPicking(false)
      }
    }
    window.addEventListener('click', onClick, true)
    return () => window.removeEventListener('click', onClick, true)
  }, [picking])

  if (!active) {
    return (
      <button type="button" data-spacing-overlay style={styles.toggle} onClick={() => { setActive(true); setPicking(true); setTarget(null) }} aria-label="Spacing inspector 토글">
        ▣ Spacing
      </button>
    )
  }

  const m = measureRef.current
  return (
    <>
      <button type="button" data-spacing-overlay style={{ ...styles.toggle, ...styles.toggleActive }} onClick={() => { setActive(false); setPicking(false); setTarget(null) }}>
        ▣ Spacing · {target ? '재선택' : 'click element'}
      </button>
      {!target && (
        <div data-spacing-overlay style={styles.crosshairCursor} onClick={() => setPicking(true)} />
      )}
      {m && target && (
        <svg data-spacing-overlay style={styles.overlay} width="100%" height="100%">
          {/* size box (초록) */}
          <rect x={m.rect.left} y={m.rect.top} width={m.rect.width} height={m.rect.height} fill={COLOR.size} stroke={COLOR.sizeLine} strokeWidth={1} strokeDasharray="2 2" />
          <Label text={`${Math.round(m.size.w)} × ${Math.round(m.size.h)}`} x={m.rect.right + 6} y={m.rect.top + 12} color={COLOR.sizeLine} />

          {/* padding box (빨간 4면) */}
          {m.padding.top > 0 && <rect x={m.rect.left} y={m.rect.top} width={m.rect.width} height={m.padding.top} fill={COLOR.padding} />}
          {m.padding.bottom > 0 && <rect x={m.rect.left} y={m.rect.bottom - m.padding.bottom} width={m.rect.width} height={m.padding.bottom} fill={COLOR.padding} />}
          {m.padding.left > 0 && <rect x={m.rect.left} y={m.rect.top} width={m.padding.left} height={m.rect.height} fill={COLOR.padding} />}
          {m.padding.right > 0 && <rect x={m.rect.right - m.padding.right} y={m.rect.top} width={m.padding.right} height={m.rect.height} fill={COLOR.padding} />}

          {/* padding 라벨 */}
          {m.padding.top > 0 && <Label text={`${Math.round(m.padding.top)}`} x={m.rect.left + m.rect.width / 2} y={m.rect.top - 4} color={COLOR.label} anchor="middle" />}
          {m.padding.bottom > 0 && <Label text={`${Math.round(m.padding.bottom)}`} x={m.rect.left + m.rect.width / 2} y={m.rect.bottom + 14} color={COLOR.label} anchor="middle" />}
          {m.padding.left > 0 && <Label text={`${Math.round(m.padding.left)}`} x={m.rect.left - 4} y={m.rect.top + m.rect.height / 2} color={COLOR.label} anchor="end" />}
          {m.padding.right > 0 && <Label text={`${Math.round(m.padding.right)}`} x={m.rect.right + 4} y={m.rect.top + m.rect.height / 2} color={COLOR.label} />}

          {/* 직계 자식 gap (block axis 만 우선) */}
          {m.childGaps.filter((g) => g.axis === 'block').map((g, i) => (
            <g key={i}>
              <rect x={m.rect.left + 8} y={g.from.bottom} width={m.rect.width - 16} height={g.size} fill={COLOR.gap} />
              <Label text={`${Math.round(g.size)}`} x={m.rect.right - 12} y={g.from.bottom + g.size / 2 + 4} color={COLOR.labelGap} anchor="end" />
            </g>
          ))}
        </svg>
      )}
    </>
  )
}

function Label({ text, x, y, color, anchor = 'start' }: { text: string; x: number; y: number; color: string; anchor?: 'start' | 'middle' | 'end' }) {
  // text 뒤에 white outline 으로 가독성 확보
  return (
    <g>
      <text x={x} y={y} fill="white" stroke="white" strokeWidth={3} textAnchor={anchor} fontSize={11} fontFamily="ui-monospace, Menlo, monospace" fontWeight={600}>{text}</text>
      <text x={x} y={y} fill={color} textAnchor={anchor} fontSize={11} fontFamily="ui-monospace, Menlo, monospace" fontWeight={600}>{text}</text>
    </g>
  )
}

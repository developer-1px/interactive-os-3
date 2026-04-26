import type { Selection } from './types'

export function Canvas({ sel }: { sel: Selection }) {
  return (
    <section data-part="canvas" aria-label="Canvas">
      <svg viewBox="0 0 800 600" aria-label="Preview">
        <rect
          x={sel.x}
          y={sel.y}
          width={sel.w}
          height={sel.h}
          rx={sel.radius}
          fill={sel.fill}
          stroke={sel.strokeColor}
          strokeWidth={sel.strokeWidth}
          strokeDasharray={
            sel.strokeStyle === 'dashed' ? '8 6'
              : sel.strokeStyle === 'dotted' ? '2 4'
              : undefined
          }
          opacity={sel.opacity / 100}
          transform={`rotate(${sel.rotation} ${sel.x + sel.w / 2} ${sel.y + sel.h / 2})`}
        />
      </svg>
    </section>
  )
}

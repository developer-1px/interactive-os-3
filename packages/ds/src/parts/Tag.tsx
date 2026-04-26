import type { ComponentPropsWithoutRef } from 'react'

type TagProps = Omit<ComponentPropsWithoutRef<'span'>, 'children'> & {
  label: string
  /** 있으면 × 버튼이 함께 렌더된다. */
  onRemove?: () => void
  /** remove 버튼의 aria-label. 없으면 'Remove {label}' fallback. */
  removeLabel?: string
}

/**
 * Tag — 라벨(+ optional remove). chip이 아니라 Tag로 통일.
 */
export function Tag({ label, onRemove, removeLabel, ...rest }: TagProps) {
  return (
    <span data-part="tag" {...rest}>
      {label}
      {onRemove && (
        <button
          type="button"
          aria-label={removeLabel ?? `Remove ${label}`}
          onClick={onRemove}
        >
          ×
        </button>
      )}
    </span>
  )
}

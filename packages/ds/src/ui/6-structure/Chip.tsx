import type { ComponentPropsWithoutRef } from 'react'

type ChipProps = Omit<ComponentPropsWithoutRef<'span'>, 'children'> & {
  label: string
  /** 있으면 × 버튼이 함께 렌더된다. */
  onRemove?: () => void
  /** remove 버튼의 aria-label. 없으면 'Remove {label}' fallback. */
  removeLabel?: string
}

/**
 * Chip — 라벨(+ optional remove). Material/Mantine 의 Input/Filter Chip 시맨틱.
 *
 * 정렬/아이콘 표준:
 * - control 티어 — block-size: control('h') 로 input/button 과 가로 키라인 일치.
 * - remove × 는 `×` 문자가 아니라 `data-icon="x"` 토큰 (No emoji/special-char 규약).
 */
export function Chip({ label, onRemove, removeLabel, ...rest }: ChipProps) {
  return (
    <span data-part="chip" {...rest}>
      <span>{label}</span>
      {onRemove && (
        <button
          type="button"
          aria-label={removeLabel ?? `Remove ${label}`}
          onClick={onRemove}
          data-icon="x"
        />
      )}
    </span>
  )
}

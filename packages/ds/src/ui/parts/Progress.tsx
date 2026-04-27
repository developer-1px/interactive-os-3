import type { ComponentPropsWithoutRef } from 'react'

type ProgressProps = Omit<ComponentPropsWithoutRef<'progress'>, 'value' | 'max'> & {
  value: number
  max?: number
  /** aria-label 텍스트. 시각적 라벨이 없을 때 필수. */
  label: string
}

/**
 * Progress — linear, determinate. <progress >.
 * indeterminate가 필요하면 value를 생략하지 않고 별도 부품으로 분리하는 게 맞음(이번 페이즈 보류).
 */
export function Progress({ value, max = 100, label, ...rest }: ProgressProps) {
  return (
    <progress
      
      value={value}
      max={max}
      aria-label={label}
      {...rest}
    />
  )
}

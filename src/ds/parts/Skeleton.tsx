import type { ComponentPropsWithoutRef, CSSProperties } from 'react'

type SkeletonProps = Omit<ComponentPropsWithoutRef<'span'>, 'children'> & {
  width?: CSSProperties['inlineSize']
  height?: CSSProperties['blockSize']
}

/**
 * Skeleton — 로딩 placeholder. 단색 box. 호출부가 width/height 결정.
 */
export function Skeleton({ width, height, style, ...rest }: SkeletonProps) {
  return (
    <span
      data-part="skeleton"
      aria-hidden="true"
      // eslint-disable-next-line no-restricted-syntax -- 호출자 주도 runtime 크기 (caller dimension)
      style={{ inlineSize: width, blockSize: height, ...style }}
      {...rest}
    />
  )
}

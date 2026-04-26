import type { ComponentPropsWithoutRef } from 'react'

type ThumbnailProps = ComponentPropsWithoutRef<'img'> & {
  src: string
  alt: string
  /** aspect ratio — data-ratio attribute로 스타일에 전달. */
  ratio?: '1/1' | '16/9' | '4/3' | '3/4'
}

/**
 * Thumbnail — aspect-ratio 보존 미리보기 미디어.
 */
export function Thumbnail({ src, alt, ratio, ...rest }: ThumbnailProps) {
  return (
    <img
      data-part="thumbnail"
      src={src}
      alt={alt}
      data-ratio={ratio}
      {...rest}
    />
  )
}

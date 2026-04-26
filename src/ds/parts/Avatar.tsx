import type { ComponentPropsWithoutRef } from 'react'

/**
 * Avatar — 사람·엔티티 식별. src 있으면 <img>, 없으면 fallback initial <span>.
 * size variant 없음 — 호출부 style 또는 부모 token으로 결정.
 */
type AvatarImgProps = ComponentPropsWithoutRef<'img'> & {
  src: string
  alt: string
  initial?: never
}
type AvatarFallbackProps = ComponentPropsWithoutRef<'span'> & {
  src?: undefined
  alt: string
  initial: string
}
export type AvatarProps = AvatarImgProps | AvatarFallbackProps

export function Avatar(props: AvatarProps) {
  if (props.src) {
    const { src, alt, ...rest } = props
    return <img data-part="avatar" src={src} alt={alt} {...rest} />
  }
  const { alt, initial, ...rest } = props
  return (
    <span data-part="avatar" aria-label={alt} {...rest}>
      {initial}
    </span>
  )
}

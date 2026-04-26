import type { ComponentPropsWithoutRef, ReactNode } from 'react'

// @slot children — Carousel/Slide 모두 wrapper content (Slide 컴포저블)
type CarouselProps = Omit<ComponentPropsWithoutRef<'section'>, 'data-part'> & {
  label: string
  children: ReactNode
}

export function Carousel({ label, children, ...rest }: CarouselProps) {
  return (
    <section data-part="carousel" aria-label={label} {...rest}>
      {children}
    </section>
  )
}

type SlideProps = Omit<ComponentPropsWithoutRef<'div'>, 'role' | 'data-part'> & {
  label: string
  posinset: number
  setsize: number
  children: ReactNode
}

export function Slide({ label, posinset, setsize, children, ...rest }: SlideProps) {
  return (
    <div
      role="group"
      data-part="slide"
      aria-label={`${label} (${posinset} of ${setsize})`}
      {...rest}
    >
      {children}
    </div>
  )
}

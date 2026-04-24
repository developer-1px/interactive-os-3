import type { ComponentPropsWithoutRef, ReactNode } from 'react'

// @slot children — Carousel/Slide 모두 wrapper content (Slide 컴포저블)
type CarouselProps = Omit<ComponentPropsWithoutRef<'section'>, 'aria-roledescription'> & {
  label: string
  children: ReactNode
}

export function Carousel({ label, children, ...rest }: CarouselProps) {
  return (
    <section aria-roledescription="carousel" aria-label={label} {...rest}>
      {children}
    </section>
  )
}

type SlideProps = Omit<ComponentPropsWithoutRef<'div'>, 'role' | 'aria-roledescription'> & {
  label: string
  posinset: number
  setsize: number
  children: ReactNode
}

export function Slide({ label, posinset, setsize, children, ...rest }: SlideProps) {
  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={`${label} (${posinset} of ${setsize})`}
      {...rest}
    >
      {children}
    </div>
  )
}

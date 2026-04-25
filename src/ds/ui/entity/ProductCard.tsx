import type { ComponentPropsWithoutRef, ReactNode } from 'react'

/**
 * ProductCard — 커머스 상품 카드.
 *
 * 시맨틱: article. img + h3 + 가격행(price+orig+discount badge) + meta(brand+rating) + tags + cart 버튼.
 * Shopify/Ant Commerce/Material Commerce 수렴 — 이미지 위, 정보 아래, CTA 마지막.
 *
 * CSS 셀렉터: [aria-roledescription="product-card"]
 */
type ProductCardProps = Omit<ComponentPropsWithoutRef<'article'>, 'children'> & {
  image: string
  title: ReactNode
  brand: ReactNode
  price: number
  orig?: number
  rating: number
  reviews: number
  tags?: string[]
  currency?: string
  onAddToCart?: () => void
}

export function ProductCard({
  image, title, brand, price, orig, rating, reviews, tags, currency = '$',
  onAddToCart, ...rest
}: ProductCardProps) {
  const discount = orig ? Math.round((1 - price / orig) * 100) : null
  return (
    <article
      className="product-card"
      aria-roledescription="product-card"
      data-emphasis="raised"
      {...rest}
    >
      <p><img src={image} alt={typeof title === 'string' ? title : ''} loading="lazy" /></p>
      <strong>{title}</strong>
      <p>
        <strong>{currency}{price}</strong>
        {orig && <small><s>{currency}{orig}</s></small>}
        {discount != null && <mark>-{discount}%</mark>}
      </p>
      <small>{brand} · ★ {rating} · {reviews.toLocaleString()}</small>
      {tags && tags.length > 0 && (
        <p role="list" aria-label="태그">
          {tags.map((t) => <span key={t} role="listitem">{t}</span>)}
        </p>
      )}
      <button type="button" aria-label={`${typeof title === 'string' ? title : '상품'} 담기`} onClick={onAddToCart}>
        장바구니 담기
      </button>
    </article>
  )
}

import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Card } from '../parts/Card'

/**
 * ProductCard — 커머스 상품 카드. Card 슬롯에 어휘 바인딩.
 *
 * 슬롯 매핑:
 *   preview → img (1:1 정사각)
 *   title   → 상품명
 *   body    → 가격행 (price + orig + discount mark)
 *   meta    → brand · rating · reviews
 *   checks  → tags (있을 때) — checks는 "리스트 묶음" 의미로 재사용
 *   footer  → 장바구니 버튼
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
    <Card
      data-card="product"
      data-emphasis="raised"
      slots={{
        preview: <img src={image} alt={typeof title === 'string' ? title : ''} loading="lazy" />,
        title: <strong>{title}</strong>,
        body: (
          <p>
            <strong>{currency}{price}</strong>
            {orig && <small><s>{currency}{orig}</s></small>}
            {discount != null && <mark>-{discount}%</mark>}
          </p>
        ),
        meta: <small>{brand} · ★ {rating} · {reviews.toLocaleString()}</small>,
        checks: tags && tags.length > 0 ? (
          <p role="list" aria-label="태그">
            {tags.map((t) => <span key={t} role="listitem">{t}</span>)}
          </p>
        ) : null,
        footer: (
          <button type="button" aria-label={`${typeof title === 'string' ? title : '상품'} 담기`} onClick={onAddToCart}>
            장바구니 담기
          </button>
        ),
      }}
      {...rest}
    />
  )
}

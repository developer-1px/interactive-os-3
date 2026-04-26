import { ProductCard } from './ProductCard'

export default function ProductCardDemo() {
  return (
    <ProductCard
      image="https://placehold.co/200x200?text=Item"
      title="에어팟 프로 2"
      brand="Apple"
      price={329000}
      orig={359000}
      rating={4.8}
      reviews={1284}
      tags={['무선', '노이즈캔슬']}
      currency="₩"
    />
  )
}

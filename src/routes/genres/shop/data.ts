export interface Product {
  id: string; title: string; brand: string; price: number; orig?: number
  rating: number; reviews: number; image: string; tags: string[]
}

export const products: Product[] = [
  { id: 'p1', title: 'Merino Wool Sweater',  brand: 'Everlane',  price: 98,   orig: 128, rating: 4.6, reviews: 312,  image: '🧥', tags: ['니트','울'] },
  { id: 'p2', title: 'Linen Oxford Shirt',    brand: 'UNIQLO',    price: 39,              rating: 4.4, reviews: 980,  image: '👔', tags: ['린넨','셔츠'] },
  { id: 'p3', title: 'Relaxed Denim Jeans',   brand: "Levi's",    price: 78,              rating: 4.7, reviews: 2140, image: '👖', tags: ['데님'] },
  { id: 'p4', title: 'Cashmere Beanie',       brand: 'Acne',      price: 120,             rating: 4.8, reviews: 84,   image: '🧢', tags: ['캐시미어'] },
  { id: 'p5', title: 'Leather Chelsea Boots', brand: "Church's",  price: 520,             rating: 4.9, reviews: 42,   image: '🥾', tags: ['가죽','부츠'] },
  { id: 'p6', title: 'Cotton Tee',            brand: 'Muji',      price: 22,              rating: 4.2, reviews: 560,  image: '👕', tags: ['코튼','티'] },
  { id: 'p7', title: 'Trench Coat',           brand: 'Burberry',  price: 1890,            rating: 4.9, reviews: 28,   image: '🧥', tags: ['트렌치','울'] },
  { id: 'p8', title: 'Canvas Sneakers',       brand: 'Converse',  price: 65,              rating: 4.5, reviews: 1820, image: '👟', tags: ['스니커즈'] },
]

export const ALL_BRANDS = Array.from(new Set(products.map((p) => p.brand)))

export const SORT_OPTS: Array<[string, string]> = [
  ['popular', '인기순'], ['price-asc', '가격 낮은순'], ['price-desc', '가격 높은순'], ['rating', '별점순'],
]

export const CARD_KEYS = ['pi','pb','pt','pr','pprow','ptags','pcart'] as const

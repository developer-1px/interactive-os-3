import { faker } from '@faker-js/faker'

export interface Product {
  id: string; title: string; brand: string; price: number; orig?: number
  rating: number; reviews: number; image: string; tags: string[]
}

faker.seed(2026_04_25)

const BRANDS = ['Everlane', 'UNIQLO', "Levi's", 'Acne', "Church's", 'Muji', 'Burberry', 'Converse', 'Patagonia', 'COS', 'A.P.C.', 'Margiela']
const CATEGORIES: Array<[string, string[]]> = [
  ['Sweater',  ['니트', '울', '캐시미어']],
  ['Shirt',    ['린넨', '셔츠', '코튼']],
  ['Jeans',    ['데님', '워싱']],
  ['Beanie',   ['캐시미어', '겨울']],
  ['Boots',    ['가죽', '부츠']],
  ['Tee',      ['코튼', '티']],
  ['Coat',     ['울', '트렌치']],
  ['Sneakers', ['스니커즈', '캔버스']],
  ['Jacket',   ['아우터', '봄']],
  ['Scarf',    ['울', '겨울']],
]

const seedImage = (seed: string) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/480/480`

export const products: Product[] = Array.from({ length: 12 }, (_, i) => {
  const [cat, tagPool] = faker.helpers.arrayElement(CATEGORIES)
  const brand = faker.helpers.arrayElement(BRANDS)
  const price = faker.number.int({ min: 22, max: 1890 })
  const onSale = i % 3 === 0
  const orig = onSale ? Math.round(price * faker.number.float({ min: 1.2, max: 1.8 })) : undefined
  return {
    id: `p${i + 1}`,
    title: `${faker.commerce.productAdjective()} ${cat}`,
    brand,
    price,
    orig,
    rating: faker.number.float({ min: 3.8, max: 4.9, fractionDigits: 1 }),
    reviews: faker.number.int({ min: 12, max: 2400 }),
    image: seedImage(`shop-${i}-${cat}`),
    tags: faker.helpers.arrayElements(tagPool, { min: 1, max: 2 }),
  }
})

export const ALL_BRANDS = Array.from(new Set(products.map((p) => p.brand)))

export const SORT_OPTS: Array<[string, string]> = [
  ['popular', '인기순'], ['price-asc', '가격 낮은순'], ['price-desc', '가격 높은순'], ['rating', '별점순'],
]

export const CARD_KEYS = ['pi','pt','pprow','pmeta','ptags','pcart'] as const

export const RATING_OPTS: Array<[number, string]> = [
  [0, '전체'], [4.0, '★ 4.0+'], [4.5, '★ 4.5+'], [4.8, '★ 4.8+'],
]

export interface FilterState {
  priceMax: number; brands: Set<string>; onSaleOnly: boolean; minRating: number
}

export const applyFilters = (f: FilterState): Product[] => products.filter((p) =>
  p.price <= f.priceMax
  && (f.brands.size === 0 || f.brands.has(p.brand))
  && (!f.onSaleOnly || p.orig != null)
  && p.rating >= f.minRating
)

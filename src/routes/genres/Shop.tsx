/**
 * Commerce PLP — 필터 사이드바 + 카드 그리드.
 *
 * 갭: ProductCard/PriceTag/Rating role 부재. 현재는 RoleCard/CourseCard 재사용하거나
 *     Section + Text로 대체. CheckboxGroup도 registry 누락.
 */
import { useState } from 'react'
import { Renderer, definePage, ROOT, type NormalizedData } from '../../ds'

interface Product {
  id: string; title: string; brand: string; price: number; orig?: number; rating: number; reviews: number
  image: string; tags: string[]
}
const products: Product[] = [
  { id: 'p1', title: 'Merino Wool Sweater',   brand: 'Everlane', price: 98,  orig: 128, rating: 4.6, reviews: 312, image: '🧥', tags: ['니트','울'] },
  { id: 'p2', title: 'Linen Oxford Shirt',     brand: 'UNIQLO',   price: 39,  rating: 4.4,             reviews: 980, image: '👔', tags: ['린넨','셔츠'] },
  { id: 'p3', title: 'Relaxed Denim Jeans',    brand: 'Levi\'s',  price: 78,  rating: 4.7,             reviews: 2140,image: '👖', tags: ['데님'] },
  { id: 'p4', title: 'Cashmere Beanie',        brand: 'Acne',     price: 120, rating: 4.8,             reviews:  84, image: '🧢', tags: ['캐시미어'] },
  { id: 'p5', title: 'Leather Chelsea Boots',  brand: 'Church\'s',price: 520, rating: 4.9,             reviews:  42, image: '🥾', tags: ['가죽','부츠'] },
  { id: 'p6', title: 'Cotton Tee',             brand: 'Muji',     price: 22,  rating: 4.2,             reviews: 560, image: '👕', tags: ['코튼','티'] },
  { id: 'p7', title: 'Trench Coat',            brand: 'Burberry', price: 1890,rating: 4.9,             reviews:  28, image: '🧥', tags: ['트렌치','울'] },
  { id: 'p8', title: 'Canvas Sneakers',        brand: 'Converse', price: 65,  rating: 4.5,             reviews: 1820,image: '👟', tags: ['스니커즈'] },
]

export function Shop() {
  const [priceMax, setPriceMax] = useState(2000)
  const [brands, setBrands] = useState<Set<string>>(new Set())
  const allBrands = Array.from(new Set(products.map((p) => p.brand)))

  const visible = products.filter((p) => p.price <= priceMax && (brands.size === 0 || brands.has(p.brand)))

  const toggleBrand = (b: string) => {
    setBrands((prev) => {
      const n = new Set(prev)
      if (n.has(b)) n.delete(b); else n.add(b)
      return n
    })
  }

  const data: NormalizedData = {
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      page: { id: 'page', data: { type: 'Row', flow: 'split' } },

      /* 좌 필터 */
      filters: { id: 'filters', data: { type: 'Column', flow: 'form', emphasis: 'raised', width: 260 } },
      fHdr: { id: 'fHdr', data: { type: 'Text', variant: 'h3', content: '필터' } },

      priceLbl: { id: 'priceLbl', data: { type: 'Text', variant: 'strong', content: `최대 가격: $${priceMax}` } },
      priceInput: { id: 'priceInput', data: {
        type: 'Ui', component: 'Input',
        props: { type: 'range', min: 20, max: 2000, step: 10, value: priceMax, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPriceMax(Number(e.target.value)), 'aria-label': '최대 가격' },
      } },

      brandLbl: { id: 'brandLbl', data: { type: 'Text', variant: 'strong', content: '브랜드' } },
      ...Object.fromEntries(allBrands.map((b) => [
        `brand-${b}`, { id: `brand-${b}`, data: {
          type: 'Ui', component: 'Checkbox',
          props: { checked: brands.has(b), onChange: () => toggleBrand(b), 'aria-label': b, children: b },
        } },
      ])),

      resetBtn: { id: 'resetBtn', data: {
        type: 'Ui', component: 'Button',
        props: { onClick: () => { setBrands(new Set()); setPriceMax(2000) } },
        content: '초기화',
      } },

      /* 우 그리드 */
      main: { id: 'main', data: { type: 'Column', flow: 'form', grow: true } },
      mainHdr: { id: 'mainHdr', data: { type: 'Header', flow: 'split' } },
      mainTitle: { id: 'mainTitle', data: { type: 'Text', variant: 'h1', content: `Shop (${visible.length})` } },
      mainSort: { id: 'mainSort', data: {
        type: 'Ui', component: 'Select',
        props: { 'aria-label': '정렬', defaultValue: 'popular' },
        content: <>
          <option value="popular">인기순</option>
          <option value="price-asc">가격 낮은순</option>
          <option value="price-desc">가격 높은순</option>
          <option value="rating">별점순</option>
        </>,
      } },

      pgrid: { id: 'pgrid', data: { type: 'Grid', cols: 4, flow: 'form' } },
      ...Object.fromEntries(visible.flatMap((p) => [
        [`pc-${p.id}`, { id: `pc-${p.id}`, data: { type: 'Section', emphasis: 'raised' as const, flow: 'list' as const } }],
        [`pi-${p.id}`, { id: `pi-${p.id}`, data: { type: 'Text', variant: 'h1', content: p.image } }],
        [`pb-${p.id}`, { id: `pb-${p.id}`, data: { type: 'Text', variant: 'small', content: p.brand } }],
        [`pt-${p.id}`, { id: `pt-${p.id}`, data: { type: 'Text', variant: 'strong', content: p.title } }],
        [`pr-${p.id}`, { id: `pr-${p.id}`, data: { type: 'Text', variant: 'small', content: `★ ${p.rating} · ${p.reviews} reviews` } }],
        [`pprow-${p.id}`, { id: `pprow-${p.id}`, data: { type: 'Row', flow: 'cluster' } }],
        [`pprice-${p.id}`, { id: `pprice-${p.id}`, data: { type: 'Text', variant: 'h3', content: `$${p.price}` } }],
        [`porig-${p.id}`, { id: `porig-${p.id}`, data: {
          type: 'Text', variant: 'small',
          content: p.orig ? <s>{`$${p.orig}`}</s> : '',
          hidden: !p.orig,
        } }],
        [`pdisc-${p.id}`, { id: `pdisc-${p.id}`, data: {
          type: 'Ui', component: 'Badge',
          props: { tone: 'danger', children: p.orig ? `-${Math.round((1 - p.price / p.orig) * 100)}%` : '' },
          hidden: !p.orig,
        } }],
        [`ptags-${p.id}`, { id: `ptags-${p.id}`, data: { type: 'Row', flow: 'cluster' } }],
        ...p.tags.map((t, i) => [`ptag-${p.id}-${i}`, { id: `ptag-${p.id}-${i}`, data: {
          type: 'Ui', component: 'Badge', props: { tone: 'neutral', children: t },
        } }] as const),
        [`pcart-${p.id}`, { id: `pcart-${p.id}`, data: {
          type: 'Ui', component: 'Button',
          props: { onClick: () => alert(`add ${p.title}`), 'aria-label': `${p.title} 장바구니에 담기` },
          content: '장바구니 담기',
        } }],
      ])),
    },
    relationships: {
      [ROOT]: ['page'],
      page: ['filters', 'main'],

      filters: ['fHdr', 'priceLbl', 'priceInput', 'brandLbl', ...allBrands.map((b) => `brand-${b}`), 'resetBtn'],

      main: ['mainHdr', 'pgrid'],
      mainHdr: ['mainTitle', 'mainSort'],
      pgrid: visible.map((p) => `pc-${p.id}`),
      ...Object.fromEntries(visible.map((p) => [`pc-${p.id}`, [
        `pi-${p.id}`, `pb-${p.id}`, `pt-${p.id}`, `pr-${p.id}`, `pprow-${p.id}`, `ptags-${p.id}`, `pcart-${p.id}`,
      ]])),
      ...Object.fromEntries(visible.map((p) => [`pprow-${p.id}`, [`pprice-${p.id}`, `porig-${p.id}`, `pdisc-${p.id}`]])),
      ...Object.fromEntries(visible.map((p) => [`ptags-${p.id}`, p.tags.map((_, i) => `ptag-${p.id}-${i}`)])),
    },
  }
  return <Renderer page={definePage(data)} />
}

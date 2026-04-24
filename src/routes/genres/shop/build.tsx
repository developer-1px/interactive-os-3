import { ROOT, type NormalizedData } from '../../../ds'
import { ALL_BRANDS, CARD_KEYS, SORT_OPTS, products, type Product } from './data'

export interface ShopState {
  priceMax: number; brands: Set<string>
  setPriceMax: (v: number) => void; toggleBrand: (b: string) => void; reset: () => void
}

const card = (p: Product) => [
  [`pc-${p.id}`,    { id: `pc-${p.id}`,    data: { type: 'Section', emphasis: 'raised', flow: 'list' } }],
  [`pi-${p.id}`,    { id: `pi-${p.id}`,    data: { type: 'Text', variant: 'h1', content: p.image } }],
  [`pb-${p.id}`,    { id: `pb-${p.id}`,    data: { type: 'Text', variant: 'small', content: p.brand } }],
  [`pt-${p.id}`,    { id: `pt-${p.id}`,    data: { type: 'Text', variant: 'strong', content: p.title } }],
  [`pr-${p.id}`,    { id: `pr-${p.id}`,    data: { type: 'Text', variant: 'small', content: `★ ${p.rating} · ${p.reviews} reviews` } }],
  [`pprow-${p.id}`, { id: `pprow-${p.id}`, data: { type: 'Row', flow: 'cluster' } }],
  [`pprice-${p.id}`,{ id: `pprice-${p.id}`,data: { type: 'Text', variant: 'h3', content: `$${p.price}` } }],
  [`porig-${p.id}`, { id: `porig-${p.id}`, data: { type: 'Text', variant: 'small', content: p.orig ? <s>{`$${p.orig}`}</s> : '', hidden: !p.orig } }],
  [`pdisc-${p.id}`, { id: `pdisc-${p.id}`, data: { type: 'Ui', component: 'Badge', props: { tone: 'danger', children: p.orig ? `-${Math.round((1 - p.price / p.orig) * 100)}%` : '' }, hidden: !p.orig } }],
  [`ptags-${p.id}`, { id: `ptags-${p.id}`, data: { type: 'Row', flow: 'cluster' } }],
  ...p.tags.map((t, i) => [`ptag-${p.id}-${i}`, { id: `ptag-${p.id}-${i}`, data: { type: 'Ui', component: 'Badge', props: { tone: 'neutral', children: t } } }]),
  [`pcart-${p.id}`, { id: `pcart-${p.id}`, data: { type: 'Ui', component: 'Button', props: { onClick: () => alert(`add ${p.title}`), 'aria-label': `${p.title} 담기` }, content: '장바구니 담기' } }],
] as Array<readonly [string, unknown]>

export function buildShopPage(s: ShopState): NormalizedData {
  const vis = products.filter((p) => p.price <= s.priceMax && (s.brands.size === 0 || s.brands.has(p.brand)))
  return {
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      page: { id: 'page', data: { type: 'Row', flow: 'split' } },
      filters: { id: 'filters', data: { type: 'Column', flow: 'form', emphasis: 'raised', width: 260 } },
      fHdr: { id: 'fHdr', data: { type: 'Text', variant: 'h3', content: '필터' } },
      priceLbl: { id: 'priceLbl', data: { type: 'Text', variant: 'strong', content: `최대 가격: $${s.priceMax}` } },
      priceInput: { id: 'priceInput', data: { type: 'Ui', component: 'Input', props: { type: 'range', min: 20, max: 2000, step: 10, value: s.priceMax, onChange: (e: React.ChangeEvent<HTMLInputElement>) => s.setPriceMax(Number(e.target.value)), 'aria-label': '최대 가격' } } },
      brandLbl: { id: 'brandLbl', data: { type: 'Text', variant: 'strong', content: '브랜드' } },
      ...Object.fromEntries(ALL_BRANDS.map((b) => [`brand-${b}`, { id: `brand-${b}`, data: {
        type: 'Ui', component: 'Checkbox',
        props: { checked: s.brands.has(b), onChange: () => s.toggleBrand(b), 'aria-label': b, children: b },
      } }])),
      resetBtn: { id: 'resetBtn', data: { type: 'Ui', component: 'Button', props: { onClick: s.reset }, content: '초기화' } },
      main: { id: 'main', data: { type: 'Column', flow: 'form', grow: true } },
      mainHdr: { id: 'mainHdr', data: { type: 'Header', flow: 'split' } },
      mainTitle: { id: 'mainTitle', data: { type: 'Text', variant: 'h1', content: `Shop (${vis.length})` } },
      mainSort: { id: 'mainSort', data: { type: 'Ui', component: 'Select', props: { 'aria-label': '정렬', defaultValue: 'popular' },
        content: <>{SORT_OPTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</>,
      } },
      pgrid: { id: 'pgrid', data: { type: 'Grid', cols: 4, flow: 'form' } },
      ...Object.fromEntries(vis.flatMap(card)),
    },
    relationships: {
      [ROOT]: ['page'], page: ['filters', 'main'],
      filters: ['fHdr', 'priceLbl', 'priceInput', 'brandLbl', ...ALL_BRANDS.map((b) => `brand-${b}`), 'resetBtn'],
      main: ['mainHdr', 'pgrid'],
      mainHdr: ['mainTitle', 'mainSort'],
      pgrid: vis.map((p) => `pc-${p.id}`),
      ...Object.fromEntries(vis.map((p) => [`pc-${p.id}`, CARD_KEYS.map((k) => `${k}-${p.id}`)])),
      ...Object.fromEntries(vis.map((p) => [`pprow-${p.id}`, [`pprice-${p.id}`, `porig-${p.id}`, `pdisc-${p.id}`]])),
      ...Object.fromEntries(vis.map((p) => [`ptags-${p.id}`, p.tags.map((_, i) => `ptag-${p.id}-${i}`)])),
    },
  }
}

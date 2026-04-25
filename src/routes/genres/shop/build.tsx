import { ROOT, type NormalizedData } from '../../../ds'
import { ALL_BRANDS, CARD_KEYS, RATING_OPTS, SORT_OPTS, applyFilters, type FilterState } from './data'
import { card } from './card'

export interface ShopState extends FilterState {
  setPriceMax: (v: number) => void; toggleBrand: (b: string) => void
  setOnSaleOnly: (v: boolean) => void; setMinRating: (v: number) => void
  reset: () => void
}

// @FIXME(srp): filter 사이드바 entities가 buildShopPage 안에 고정 목록으로 남아있음 —
// 필터 항목이 6개 이상으로 늘거나 다른 페이지에서 재사용이 생기면 `filters.tsx`로 분리한다.

export function buildShopPage(s: ShopState): NormalizedData {
  const vis = applyFilters(s)
  return {
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      page: { id: 'page', data: { type: 'Row', flow: 'list', roledescription: 'shop-page', label: 'Shop' } },
      menuBtn: { id: 'menuBtn', data: { type: 'Ui', component: 'Button', props: { popovertarget: 'shop-menu', 'aria-label': '필터', 'data-icon': 'filter', 'data-collapse-menu-btn': '' }, content: '' } },
      menuPop: { id: 'menuPop', data: { type: 'Ui', component: 'Popover', props: { id: 'shop-menu', label: '필터', scrim: true } } },
      filters: { id: 'filters', data: { type: 'Column', flow: 'form', emphasis: 'raised', width: 260 } },
      fHdr: { id: 'fHdr', data: { type: 'Text', variant: 'h3', content: '필터' } },
      priceLbl: { id: 'priceLbl', data: { type: 'Text', variant: 'strong', content: `최대 가격: $${s.priceMax}` } },
      priceInput: { id: 'priceInput', data: { type: 'Ui', component: 'Input', props: { type: 'range', min: 20, max: 2000, step: 10, value: s.priceMax, onChange: (e: React.ChangeEvent<HTMLInputElement>) => s.setPriceMax(Number(e.target.value)), 'aria-label': '최대 가격' } } },
      saleOnly: { id: 'saleOnly', data: { type: 'Ui', component: 'Checkbox', props: { checked: s.onSaleOnly, onChange: () => s.setOnSaleOnly(!s.onSaleOnly), 'aria-label': '세일 상품만', children: '세일 상품만' } } },
      ratingLbl: { id: 'ratingLbl', data: { type: 'Text', variant: 'strong', content: '최소 별점' } },
      ratingSel: { id: 'ratingSel', data: { type: 'Ui', component: 'Select',
        props: { 'aria-label': '최소 별점', value: String(s.minRating), onChange: (e: React.ChangeEvent<HTMLSelectElement>) => s.setMinRating(Number(e.target.value)) },
        content: <>{RATING_OPTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</>,
      } },
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
      [ROOT]: ['page', 'menuPop'], page: ['filters', 'main'],
      filters: ['fHdr', 'priceLbl', 'priceInput', 'saleOnly', 'ratingLbl', 'ratingSel', 'brandLbl', ...ALL_BRANDS.map((b) => `brand-${b}`), 'resetBtn'],
      main: ['mainHdr', 'pgrid'],
      mainHdr: ['menuBtn', 'mainTitle', 'mainSort'],
      pgrid: vis.map((p) => `pc-${p.id}`),
      ...Object.fromEntries(vis.map((p) => [`pc-${p.id}`, CARD_KEYS.map((k) => `${k}-${p.id}`)])),
      ...Object.fromEntries(vis.map((p) => [`pprow-${p.id}`, [`pprice-${p.id}`, `porig-${p.id}`, `pdisc-${p.id}`]])),
      ...Object.fromEntries(vis.map((p) => [`pmeta-${p.id}`, [`pbrand-${p.id}`, `prating-${p.id}`]])),
      ...Object.fromEntries(vis.map((p) => [`ptags-${p.id}`, p.tags.map((_, i) => `ptag-${p.id}-${i}`)])),
    },
  }
}

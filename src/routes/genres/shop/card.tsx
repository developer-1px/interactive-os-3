/** 상품 카드 1장의 entity composition — pgrid의 재사용 단위. */
import type { Product } from './data'

export const card = (p: Product) => [
  [`pc-${p.id}`,     { id: `pc-${p.id}`,     data: { type: 'Section', emphasis: 'raised', flow: 'list' } }],
  [`pi-${p.id}`,     { id: `pi-${p.id}`,     data: { type: 'Text', variant: 'h1', content: p.image } }],
  [`pt-${p.id}`,     { id: `pt-${p.id}`,     data: { type: 'Text', variant: 'strong', content: p.title } }],
  [`pprow-${p.id}`,  { id: `pprow-${p.id}`,  data: { type: 'Row', flow: 'cluster' } }],
  [`pprice-${p.id}`, { id: `pprice-${p.id}`, data: { type: 'Text', variant: 'h3', content: `$${p.price}` } }],
  [`porig-${p.id}`,  { id: `porig-${p.id}`,  data: { type: 'Text', variant: 'small', content: p.orig ? <s>{`$${p.orig}`}</s> : '', hidden: !p.orig } }],
  [`pdisc-${p.id}`,  { id: `pdisc-${p.id}`,  data: { type: 'Ui', component: 'Badge', props: { tone: 'danger', children: p.orig ? `-${Math.round((1 - p.price / p.orig) * 100)}%` : '' }, hidden: !p.orig } }],
  [`pmeta-${p.id}`,  { id: `pmeta-${p.id}`,  data: { type: 'Row', flow: 'split' } }],
  [`pbrand-${p.id}`, { id: `pbrand-${p.id}`, data: { type: 'Text', variant: 'small', content: p.brand } }],
  [`prating-${p.id}`,{ id: `prating-${p.id}`,data: { type: 'Text', variant: 'small', content: `★ ${p.rating} · ${p.reviews.toLocaleString()}` } }],
  [`ptags-${p.id}`,  { id: `ptags-${p.id}`,  data: { type: 'Row', flow: 'cluster' } }],
  ...p.tags.map((t, i) => [`ptag-${p.id}-${i}`, { id: `ptag-${p.id}-${i}`, data: { type: 'Ui', component: 'Badge', props: { tone: 'neutral', children: t } } }]),
  [`pcart-${p.id}`,  { id: `pcart-${p.id}`,  data: { type: 'Ui', component: 'Button', props: { onClick: () => alert(`add ${p.title}`), 'aria-label': `${p.title} 담기` }, content: '장바구니 담기' } }],
] as Array<readonly [string, unknown]>

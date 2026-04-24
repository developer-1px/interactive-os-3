/** Shop — Commerce PLP: 필터 사이드바 + 카드 그리드. */
import { useState } from 'react'
import { Renderer, definePage } from '../../../ds'
import { buildShopPage } from './build'

export function Shop() {
  const [priceMax, setPriceMax] = useState(2000)
  const [brands, setBrands] = useState<Set<string>>(new Set())
  const toggleBrand = (b: string) => setBrands((p) => { const n = new Set(p); if (n.has(b)) n.delete(b); else n.add(b); return n })
  const reset = () => { setBrands(new Set()); setPriceMax(2000) }
  return <Renderer page={definePage(buildShopPage({ priceMax, brands, setPriceMax, toggleBrand, reset }))} />
}

/**
 * elevation shadow scalar — d=0..3. grouping()은 background+border까지 박는 풀 사양.
 * @demo type=value fn=elev args=[2]
 */
export const elev = (d: 0 | 1 | 2 | 3) => `var(--ds-elev-${d})`

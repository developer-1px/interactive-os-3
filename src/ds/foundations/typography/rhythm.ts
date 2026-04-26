/**
 * Em-based size ratio — body 대비 비율. inline-code/pre/small/figcaption 등.
 *
 * code=0.875em, codeSm=0.8125em, samp=0.9em, micro=0.85em (h6 / small label)
 *
 * @demo type=value fn=emRatio args=["code"]
 */
export const emRatio = (t: 'code' | 'codeSm' | 'samp' | 'micro' | 'table') => {
  const map = {
    code: '0.875em',
    codeSm: '0.8125em',
    samp: '0.9em',
    micro: '0.85em',
    table: '0.875em',
  }
  return map[t]
}

/**
 * Progress/meter intrinsic inline-size — prose 내 progress 폭.
 * 12em — body 12배. control 도메인 native progress 표준 폭.
 * @demo type=value fn=progressInline args=[]
 */
export const progressInline = () => '12em'
